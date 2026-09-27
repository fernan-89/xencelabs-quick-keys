#!/usr/bin/env node
// Quick Keys agent: turns a Xencelabs Quick Keys, wired or through its wireless dongle, into a
// command pad for a Linux server. Usage:
//   quick-keys-agent [--config PATH]           run the agent (default config: /etc/quick-keys-agent/config.yml)
//   quick-keys-agent --check [--config PATH]   validate the configuration and exit
//   quick-keys-agent --probe                   print every key, button and wheel event (no actions run)
import { parseArgs } from 'node:util';
import { ConfigError, loadConfig } from './config.js';
import { Controller } from './controller.js';
import { runAction } from './runner.js';

const DEFAULT_CONFIG = '/etc/quick-keys-agent/config.yml';
const RESCAN_MS = 5000;

const { values } = parseArgs({
  options: {
    config: { type: 'string', default: DEFAULT_CONFIG },
    check: { type: 'boolean', default: false },
    probe: { type: 'boolean', default: false },
  },
});

function describe(config) {
  return config.sets.map((set) => `${set.name}: ${set.keys.map((k) => k?.label ?? '-').join(' | ')}`).join('\n');
}

async function main() {
  let config = null;
  if (!values.probe) {
    try {
      config = loadConfig(values.config);
    } catch (error) {
      console.error(error instanceof ConfigError ? `Invalid configuration: ${error.message}` : error);
      process.exit(2);
    }
    if (values.check) {
      console.log(`Configuration OK: ${values.config}\n${describe(config)}`);
      return;
    }
  }

  // Loaded only when a device is needed, so --check works without the native USB modules.
  const { default: quickKeys } = await import('@xencelabs-quick-keys/node');
  const manager = quickKeys.XencelabsQuickKeysManagerInstance;
  const controller = config && new Controller(config, { run: runAction });

  manager.on('connect', async (device) => {
    console.log(`[device] connected ${device.deviceId ?? ''}`.trim());
    device.on('error', (error) => console.error(`[device] ${error?.message ?? error}`));
    try {
      await device.startData();
    } catch (error) {
      console.error(`[device] could not start: ${error?.message ?? error}`);
      return;
    }
    if (values.probe) {
      device.on('down', (key) => console.log(`key ${key} down`));
      device.on('up', (key) => console.log(`key ${key} up`));
      device.on('wheel', (direction) => console.log(`wheel ${direction}`));
      await device.showOverlayText(5, 'Probe: press keys').catch(() => {});
      return;
    }
    device.on('down', (key) => controller.handleKeyDown(key).catch((e) => console.error(e)));
    device.on('wheel', (direction) => controller.handleWheel(direction).catch((e) => console.error(e)));
    await controller.attach(device);
  });
  manager.on('disconnect', (device) => {
    console.log('[device] disconnected');
    controller?.detach(device);
  });
  manager.on('error', (error) => console.error(`[manager] ${error?.message ?? error}`));

  // Hotplug: a rescan only opens devices that are not open yet.
  const scan = () => manager.scanDevices().catch((error) => console.error(`[manager] scan failed: ${error?.message ?? error}`));
  await scan();
  const timer = setInterval(scan, RESCAN_MS);

  const stop = async (signal) => {
    console.log(`[agent] ${signal}, stopping`);
    clearInterval(timer);
    await manager.closeAll().catch(() => {});
    process.exit(0);
  };
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('SIGINT', () => stop('SIGINT'));
  console.log(values.probe ? '[agent] probe mode: press keys, turn the wheel; Ctrl+C to stop' : `[agent] running with ${values.config}\n${describe(config)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
