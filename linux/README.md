# Quick Keys Linux Agent

🇺🇸 **English:** Turns a Xencelabs Quick Keys into a **command pad for a Linux server**. Each key runs a configured program, for example starting a Docker Compose stack or running a diagnostics script. The key's display shows its label, and the dial switches between sets. No Xencelabs driver is needed: the agent talks to the device directly through the open-source [`@xencelabs-quick-keys/node`](https://github.com/julusian/node-xencelabs-quick-keys) library (MIT).<br>
🇧🇷 **Português:** Transforma o Xencelabs Quick Keys num **pad de comandos para um servidor Linux**. Cada tecla executa um programa configurado, por exemplo subir uma stack Docker Compose ou rodar um script de diagnóstico. O visor da tecla mostra o rótulo, e o dial troca entre os sets. Não precisa do driver da Xencelabs: o agente fala direto com o dispositivo pela biblioteca open source [`@xencelabs-quick-keys/node`](https://github.com/julusian/node-xencelabs-quick-keys) (MIT).

---

## 🧭 How It Works / Como Funciona

🇺🇸 **EN:**
- **Keys K1–K8:** run the action configured for that key in the current set. The display shows each key's label (up to 8 characters).
- **Dial:** turning it switches to the next or previous set, the ring takes the set's color, and the set name appears on the display.
- **The two buttons without a display:** configurable as next set, previous set or nothing.
- **Feedback:** while an action runs, the display shows `Running: <label>`, then `OK`, `FAILED (exit code)` or `TIMEOUT`. The program's output goes to the journal.
- **Safety:**
  - Only one action runs at a time.
  - Actions marked `confirm: true` need a second press within 3 seconds.
  - Programs run directly, without a shell, from absolute paths, with a timeout and a minimal environment.
  - The agent refuses a configuration file that other users can modify.
- **Hotplug:** the device can be plugged in, unplugged or paired with its wireless dongle at any time; the agent rescans every 5 seconds.

🇧🇷 **PT:**
- **Teclas K1–K8:** executam a ação configurada para a tecla no set atual. O visor mostra o rótulo de cada tecla (até 8 caracteres).
- **Dial:** girar troca para o próximo set ou para o anterior, o anel assume a cor do set e o nome do set aparece no visor.
- **Os dois botões sem visor:** configuráveis como próximo set, set anterior ou nada.
- **Retorno:** enquanto uma ação roda, o visor mostra `Running: <rótulo>`, e depois `OK`, `FAILED (código de saída)` ou `TIMEOUT`. A saída do programa vai para o journal.
- **Segurança:**
  - Uma ação por vez.
  - Ações marcadas com `confirm: true` exigem um segundo toque em até 3 segundos.
  - Os programas rodam diretamente, sem shell, a partir de caminhos absolutos, com timeout e ambiente mínimo.
  - O agente recusa um arquivo de configuração que outros usuários possam alterar.
- **Conexão a quente:** o dispositivo pode ser conectado, desconectado ou pareado com o dongle sem fio a qualquer momento; o agente procura de novo a cada 5 segundos.

---

## ✅ Requirements / Requisitos

🇺🇸 **EN:**
- Linux on x64 or ARM (a Raspberry Pi works); systemd; Node.js 20 or later with npm.
- `libusb-1.0` (the installer adds it on apt-based systems).
- The Quick Keys, or its wireless dongle, plugged into **this** machine. If the server is a virtual machine, pass the USB device through to it (for example in Proxmox: *Hardware → Add → USB Device*, vendor `28bd`).
- The Xencelabs Windows app can't run at the same time on the same device. On Linux there is no official app to conflict with.

🇧🇷 **PT:**
- Linux em x64 ou ARM (Raspberry Pi funciona); systemd; Node.js 20 ou mais recente com npm.
- `libusb-1.0` (o instalador adiciona em sistemas baseados em apt).
- O Quick Keys, ou o dongle sem fio, conectado **nesta** máquina. Se o servidor for uma máquina virtual, repasse o dispositivo USB para ela (por exemplo no Proxmox: *Hardware → Add → USB Device*, vendor `28bd`).
- O app Windows da Xencelabs não pode rodar ao mesmo tempo no mesmo dispositivo. No Linux não há app oficial para conflitar.

---

## 📦 Installation / Instalação

```bash
git clone https://github.com/fernan-89/xencelabs-quick-keys.git
cd xencelabs-quick-keys/linux
sudo ./install.sh
```

🇺🇸 **EN:** The installer is idempotent. Run it again to update. It:
- creates the `quickkeys` system user;
- installs the agent in `/opt/quick-keys-agent`;
- adds the udev rule that gives only the `quickkeys` group access to the device;
- installs `/etc/quick-keys-agent/config.yml` from the example, if there is none yet, and validates it;
- enables and starts the `quick-keys-agent` systemd service.

After installing, unplug and plug the device back in so the udev rule applies.

🇧🇷 **PT:** O instalador é idempotente. Rode de novo para atualizar. Ele:
- cria o usuário de sistema `quickkeys`;
- instala o agente em `/opt/quick-keys-agent`;
- adiciona a regra udev que dá acesso ao dispositivo apenas ao grupo `quickkeys`;
- instala `/etc/quick-keys-agent/config.yml` a partir do exemplo, se ainda não existir, e o valida;
- habilita e inicia o serviço systemd `quick-keys-agent`.

Depois de instalar, desconecte e conecte o dispositivo de novo para a regra udev valer.

| File / Arquivo | Purpose / Finalidade |
| :--- | :--- |
| `src/agent.js` | Entry point: `--check`, `--probe` and the service. / Ponto de entrada: `--check`, `--probe` e o serviço. |
| `src/config.js` | Loads and validates the configuration. / Carrega e valida a configuração. |
| `src/controller.js` | Sets, keys, confirmation and the display. / Sets, teclas, confirmação e visor. |
| `src/runner.js` | Runs a program without a shell, with timeout and minimal environment. / Executa um programa sem shell, com timeout e ambiente mínimo. |
| `config.example.yml` | Example for a home-lab server. / Exemplo para um servidor de home-lab. |
| `install.sh` | Installer. / Instalador. |
| `quick-keys-agent.service` | systemd unit. / Unit do systemd. |
| `50-xencelabs-quick-keys.rules` | udev rule for the wired device (`28bd:5202`) and the dongle (`28bd:5203`). / Regra udev para o dispositivo com fio (`28bd:5202`) e o dongle (`28bd:5203`). |

---

## ⚙️ Configuration / Configuração

🇺🇸 Edit `/etc/quick-keys-agent/config.yml`. [`config.example.yml`](config.example.yml) documents every setting and ships three sets for a home-lab server: the ThinkLab stack (`docker compose up/ps/logs/restart/down`), network diagnostics (the [home-lab-scripts](https://github.com/fernan-89/home-lab-scripts) network scripts), and host actions. After editing, validate and restart:<br>
🇧🇷 Edite `/etc/quick-keys-agent/config.yml`. O [`config.example.yml`](config.example.yml) documenta cada configuração e traz três sets para um servidor de home-lab: a stack ThinkLab (`docker compose up/ps/logs/restart/down`), diagnóstico de rede (os scripts de rede do [home-lab-scripts](https://github.com/fernan-89/home-lab-scripts)) e ações do host. Depois de editar, valide e reinicie:

```bash
sudo /opt/quick-keys-agent/src/agent.js --check --config /etc/quick-keys-agent/config.yml
sudo systemctl restart quick-keys-agent
```

| Setting / Configuração | Values / Valores | Default / Padrão |
| :--- | :--- | :--- |
| `device.brightness` | `off`, `low`, `medium`, `full` | `medium` |
| `device.orientation` | `0`, `90`, `180`, `270` | `0` |
| `device.sleepMinutes` | 1–255 | `30` |
| `controls.wheel` | `sets`, `none` | `sets` |
| `controls.button8`, `controls.button9` | `next-set`, `previous-set`, `none` | `next-set`, `none` |
| `sets[].name` | up to 32 characters, unique / até 32 caracteres, único | — |
| `sets[].color` | `"#rrggbb"`, the dial ring's color / a cor do anel do dial | `"#ffffff"` |
| `sets[].keys[]` | up to 8 keys, K1–K8 in order; `null` leaves a key empty / até 8 teclas, K1–K8 em ordem; `null` deixa a tecla vazia | — |
| `…keys[].label` | up to 8 characters / até 8 caracteres | — |
| `…keys[].command` | `[/absolute/program, arg, …]` | — |
| `…keys[].cwd` | absolute path / caminho absoluto | the service's directory / o diretório do serviço |
| `…keys[].env` | `{ NAME: value }` | — |
| `…keys[].timeoutSeconds` | 1–3600 | `60` |
| `…keys[].confirm` | `true`, `false` | `false` |

🇺🇸 **Which physical button is 8 and which is 9?** Stop the service and run the probe, then press each button and turn the dial:<br>
🇧🇷 **Qual botão físico é o 8 e qual é o 9?** Pare o serviço e rode o modo de sondagem, depois aperte cada botão e gire o dial:

```bash
sudo systemctl stop quick-keys-agent
sudo -u quickkeys /opt/quick-keys-agent/src/agent.js --probe
sudo systemctl start quick-keys-agent
```

---

## 🔐 Permissions / Permissões

🇺🇸 **EN:** The service runs as the unprivileged `quickkeys` user. Grant it only what your actions need:
- **Docker:** `sudo usermod -aG docker quickkeys`. Membership of the `docker` group is equivalent to root on that host, so add it only if you use Docker actions.
- **Privileged commands:** use a sudo rule limited to the exact commands, in `/etc/sudoers.d/quick-keys-agent`. Edit it with `sudo visudo -f /etc/sudoers.d/quick-keys-agent`:

  ```text
  quickkeys ALL=(root) NOPASSWD: /usr/bin/systemctl restart ssh, /usr/bin/systemctl reboot
  ```

  In the configuration, call them with `--non-interactive`, as the example does, so a missing rule fails immediately instead of waiting for a password.
- **Scripts and output:** the scripts an action runs must be executable by `quickkeys`. Reports can be written to `/var/lib/quick-keys-agent`, the service's own directory.

🇧🇷 **PT:** O serviço roda como o usuário sem privilégios `quickkeys`. Dê a ele apenas o que as suas ações precisam:
- **Docker:** `sudo usermod -aG docker quickkeys`. Pertencer ao grupo `docker` equivale a ser root naquele host, então adicione só se usar ações de Docker.
- **Comandos privilegiados:** use uma regra de sudo limitada aos comandos exatos, em `/etc/sudoers.d/quick-keys-agent`. Edite com `sudo visudo -f /etc/sudoers.d/quick-keys-agent`:

  ```text
  quickkeys ALL=(root) NOPASSWD: /usr/bin/systemctl restart ssh, /usr/bin/systemctl reboot
  ```

  Na configuração, chame-os com `--non-interactive`, como no exemplo, para que uma regra ausente falhe na hora em vez de esperar senha.
- **Scripts e saídas:** os scripts que uma ação executa precisam ser executáveis por `quickkeys`. Relatórios podem ser gravados em `/var/lib/quick-keys-agent`, o diretório do próprio serviço.

---

## 🩺 Troubleshooting / Solução de Problemas

| Symptom / Sintoma | Check / Verifique |
| :--- | :--- |
| Nothing happens, no `connected` in the log / Nada acontece, sem `connected` no log | `journalctl -u quick-keys-agent -f`; `lsusb \| grep 28bd`. Unplug and plug the device back in after installing the udev rule. / Desconecte e conecte o dispositivo de novo depois de instalar a regra udev. |
| `scan failed: libusb-1.0.so.0` | Install `libusb-1.0-0` (apt) or your distribution's libusb 1.0 package. / Instale `libusb-1.0-0` (apt) ou o pacote libusb 1.0 da sua distribuição. |
| `Invalid configuration` | The message names the setting; run `--check`. `writable by group or others` → `sudo chmod 644 /etc/quick-keys-agent/config.yml`. / A mensagem aponta a configuração; rode `--check`. |
| `FAILED (126)` / `FAILED (127)` or `ENOENT` | The program path is wrong or `quickkeys` can't execute it. / O caminho do programa está errado ou `quickkeys` não consegue executá-lo. |
| `FAILED (1)` on sudo actions / nas ações com sudo | The sudo rule is missing or doesn't match the exact command. / A regra de sudo está ausente ou não bate com o comando exato. |
| Wireless: keys don't respond / Sem fio: as teclas não respondem | Wake the device by pressing a key; check the dongle's pairing. / Acorde o dispositivo apertando uma tecla; confira o pareamento do dongle. |

---

## 🧪 Development / Desenvolvimento

```bash
npm ci
npm test          # 32 tests: configuration, controller (fake device), runner (real processes)
npm run check     # validates config.example.yml
npm run probe     # prints device events (needs the device and the udev rule)
```

🇺🇸 The controller does not depend on the USB library, so its tests use a fake device. The CI runs the tests and the configuration check on every push and pull request.<br>
🇧🇷 O controlador não depende da biblioteca USB, então seus testes usam um dispositivo simulado. A CI roda os testes e a validação da configuração a cada push e pull request.

## License / Licença

🇺🇸 Part of this repository, under the [PolyForm Strict License 1.0.0](../LICENSE). The `@xencelabs-quick-keys/node` dependency is MIT-licensed.<br>
🇧🇷 Parte deste repositório, sob a [PolyForm Strict License 1.0.0](../LICENSE). A dependência `@xencelabs-quick-keys/node` tem licença MIT.
