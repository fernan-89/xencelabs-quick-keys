#!/usr/bin/env bash
# Installs or updates the Quick Keys agent on a Linux server. Run as root from this directory:
#   sudo ./install.sh
# Idempotent: re-running updates the agent and keeps an existing /etc/quick-keys-agent/config.yml.
set -euo pipefail

INSTALL_DIR=/opt/quick-keys-agent
CONFIG_DIR=/etc/quick-keys-agent
SERVICE_USER=quickkeys
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $EUID -eq 0 ]] || { echo "Run as root: sudo $0" >&2; exit 1; }

NODE="$(command -v node || true)"
[[ -n "$NODE" ]] || { echo "Node.js 20 or later is required (e.g. apt install nodejs)." >&2; exit 1; }
NODE_MAJOR="$("$NODE" -p 'process.versions.node.split(".")[0]')"
(( NODE_MAJOR >= 20 )) || { echo "Node.js 20 or later is required; found $("$NODE" -v)." >&2; exit 1; }
command -v npm >/dev/null || { echo "npm is required (e.g. apt install npm)." >&2; exit 1; }

if ! ldconfig -p | grep -q 'libusb-1.0.so.0'; then
  if command -v apt-get >/dev/null; then
    echo "==> Installing libusb-1.0"
    apt-get update
    apt-get install -y libusb-1.0-0
  else
    echo "libusb-1.0 is required; install it with your distribution's package manager." >&2
    exit 1
  fi
fi

if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  echo "==> Creating system user $SERVICE_USER"
  useradd --system --home-dir /var/lib/quick-keys-agent --shell /usr/sbin/nologin "$SERVICE_USER"
fi

echo "==> Installing the agent in $INSTALL_DIR"
install -d -m 755 "$INSTALL_DIR"
rm -rf "$INSTALL_DIR/src"
cp -r "$SOURCE_DIR/src" "$INSTALL_DIR/src"
install -m 644 "$SOURCE_DIR/package.json" "$SOURCE_DIR/package-lock.json" "$INSTALL_DIR/"
(cd "$INSTALL_DIR" && npm ci --omit=dev --no-audit --no-fund)
chown -R root:root "$INSTALL_DIR"

echo "==> Installing the udev rule"
install -D -m 644 "$SOURCE_DIR/50-xencelabs-quick-keys.rules" /etc/udev/rules.d/50-xencelabs-quick-keys.rules
udevadm control --reload-rules
udevadm trigger --attr-match=idVendor=28bd || true

install -d -m 755 "$CONFIG_DIR"
if [[ ! -f "$CONFIG_DIR/config.yml" ]]; then
  echo "==> Installing the example configuration in $CONFIG_DIR/config.yml (edit it for your server)"
  install -m 644 -o root -g root "$SOURCE_DIR/config.example.yml" "$CONFIG_DIR/config.yml"
fi
"$NODE" "$INSTALL_DIR/src/agent.js" --check --config "$CONFIG_DIR/config.yml"

echo "==> Installing the systemd service"
sed "s|@NODE@|$NODE|" "$SOURCE_DIR/quick-keys-agent.service" > /etc/systemd/system/quick-keys-agent.service
chmod 644 /etc/systemd/system/quick-keys-agent.service
systemctl daemon-reload
systemctl enable quick-keys-agent.service
systemctl restart quick-keys-agent.service

echo "Done. Logs: journalctl -u quick-keys-agent -f"
