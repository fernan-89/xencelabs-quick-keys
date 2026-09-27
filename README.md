# Xencelabs Quick Keys Profiles

[![validate](https://github.com/fernan-89/xencelabs-quick-keys/actions/workflows/validate.yml/badge.svg)](https://github.com/fernan-89/xencelabs-quick-keys/actions/workflows/validate.yml)
[![License: PolyForm Strict 1.0.0](https://img.shields.io/badge/license-PolyForm%20Strict%201.0.0-blue)](LICENSE)

🇺🇸 **EN:** Configuration profiles (`.pcfg`) for the Xencelabs Quick Keys macro pad: Java backend development in IntelliJ, general development and work, and gaming on Windows. Also includes an agent that turns the pad into a command pad for a Linux server.

🇧🇷 **PT:** Perfis de configuração (`.pcfg`) para o macro pad Xencelabs Quick Keys: desenvolvimento backend Java no IntelliJ, desenvolvimento e trabalho em geral, e jogos no Windows. Inclui também um agente que transforma o pad num pad de comandos para um servidor Linux.

## 📑 Index / Índice

| Section / Seção                                                  | Covers / Cobre                                                        |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [Contents / Conteúdo](#contents)                                 | Files and the device at a glance / Arquivos e o dispositivo em resumo |
| [Profiles at a Glance / Perfis em Resumo](#glance)               | Every profile and set / Todos os perfis e sets                        |
| [Requirements / Requisitos](#requirements)                       | What you need / O que é necessário                                    |
| [How to Import / Como Importar](#import)                         | Loading a profile / Carregar um perfil                                |
| [Backup and Customization / Backup e Personalização](#customize) | Changing keys safely / Mudar teclas com segurança                     |
| [Backend Java Profile](#backend)                                 | IntelliJ: navigation, refactoring, debug, run, Git                    |
| [Dev & Work Profile](#dev)                                       | IntelliJ, DataGrip, terminal, PowerPoint, Discord                     |
| [Gaming Profile](#gaming)                                        | Overlays, NVIDIA, voice chat, in-game                                 |
| [Dial and Radial Menu / Dial e Menu Radial](#dial)               | Not customized / Não personalizados                                   |
| [Notes / Observações](#notes)                                    | Layout, drivers, conflicts / Layout, drivers, conflitos               |
| [Linux Server / Servidor Linux](#linux)                          | Command pad agent / Agente de pad de comandos                         |
| [Validation / Validação](#validation)                            | What CI checks / O que a CI verifica                                  |
| [License / Licença](#license)                                    | PolyForm Strict 1.0.0                                                 |

---

<a id="contents"></a>

## 📦 Contents / Conteúdo

| File / Arquivo                  | Purpose / Finalidade                                                                                                                                                                    |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Xencelabs-BackendProfile.pcfg` | Java backend in IntelliJ. / Backend Java no IntelliJ.                                                                                                                                   |
| `Xencelabs-DevProfile.pcfg`     | Development and work. / Desenvolvimento e trabalho.                                                                                                                                     |
| `Xencelabs-GamingProfile.pcfg`  | Gaming. / Jogos.                                                                                                                                                                        |
| `linux/`                        | Linux agent: the Quick Keys as a command pad for a server, without the Xencelabs driver. / Agente Linux: o Quick Keys como pad de comandos para um servidor, sem o driver da Xencelabs. |
| `validate-profiles.py`          | Checks that every profile is valid and that this README documents it exactly. / Verifica se cada perfil é válido e se este README o documenta exatamente.                               |
| `LICENSE`                       | PolyForm Strict License 1.0.0.                                                                                                                                                          |

🇺🇸 **EN:** The Quick Keys has **8 programmable keys (K1–K8)**, a **dial** and **5 key sets** you cycle through, so each profile defines up to **40 shortcuts**. The `Label` column in the tables is what the device's display shows; the custom labels in these profiles use at most 6 characters.

🇧🇷 **PT:** O Quick Keys tem **8 teclas programáveis (K1–K8)**, um **dial** e **5 conjuntos (sets)** de teclas que você alterna, então cada perfil define até **40 atalhos**. A coluna `Label` das tabelas é o que o visor do dispositivo mostra; os rótulos personalizados destes perfis usam no máximo 6 caracteres.

<a id="glance"></a>

## 🗂️ Profiles at a Glance / Perfis em Resumo

| Profile / Perfil            | Set 1  | Set 2  | Set 3 | Set 4  | Set 5 |
| :-------------------------- | :----- | :----- | :---- | :----- | :---- |
| [☕ Backend Java](#backend) | Code   | Rfctr  | Debug | Run    | Git   |
| [💻 Dev & Work](#dev)       | IDE    | DB     | Term  | PPT    | Work  |
| [🎮 Gaming](#gaming)        | System | NVIDIA | Comms | InGame | Empty |

---

<a id="requirements"></a>

## ✅ Requirements / Requisitos

🇺🇸 **EN:**

- Windows 10 or 11.
- Xencelabs Quick Keys connected by USB or through its wireless dongle.
- The official **Xencelabs** driver/app installed, which provides the import and export options. The profiles were exported with driver 1.3.5.
- The target applications with their **default keymaps**: IntelliJ IDEA (Windows keymap), DataGrip, Windows Terminal/PowerShell, PowerPoint, Discord, Steam, Ubisoft Connect and NVIDIA GeForce Experience. A shortcut remapped in an application must be remapped in the profile too.

🇧🇷 **PT:**

- Windows 10 ou 11.
- Xencelabs Quick Keys conectado por USB ou pelo dongle sem fio.
- O aplicativo/driver oficial **Xencelabs** instalado, que oferece as opções de importar e exportar. Os perfis foram exportados com o driver 1.3.5.
- Os aplicativos de destino com os **mapas de teclas padrão**: IntelliJ IDEA (keymap Windows), DataGrip, Windows Terminal/PowerShell, PowerPoint, Discord, Steam, Ubisoft Connect e NVIDIA GeForce Experience. Um atalho alterado no aplicativo precisa ser alterado também no perfil.

<a id="import"></a>

## ⚙️ How to Import / Como Importar

🇺🇸 **EN:**

1. **Back up first:** export your current configuration (see below), because importing replaces it.
2. Open the **Xencelabs** application.
3. Select the **Quick Keys** device.
4. Click the gear icon (Settings) in the top right corner.
5. Select **Import** and choose the desired `.pcfg` file.
6. Use the device's set-switching button to cycle through Sets 1–5 and confirm the labels on the display.

🇧🇷 **PT:**

1. **Faça backup antes:** exporte sua configuração atual (veja abaixo), porque importar a substitui.
2. Abra o aplicativo **Xencelabs**.
3. Selecione o dispositivo **Quick Keys**.
4. Clique no ícone de engrenagem (Configurações) no canto superior direito.
5. Selecione **Importar** e escolha o arquivo `.pcfg` desejado.
6. Use o botão de troca de set do dispositivo para alternar entre os Sets 1–5 e confira os rótulos na tela.

<a id="customize"></a>

## 💾 Backup and Customization / Backup e Personalização

🇺🇸 **EN:**

- **Backup:** use **Export** in the same Settings menu to save your current configuration as a `.pcfg` file.
- **Changing a key:** edit it in the Xencelabs app and export the profile again over the file in this repository. Then update the tables below and run `python3 validate-profiles.py` (Python 3.9+), which fails if the README and the profiles disagree.
- **Hand-editing the XML** is not recommended: each shortcut stores both its display text and the Windows virtual-key codes the device sends, and the two must match.

🇧🇷 **PT:**

- **Backup:** use **Exportar** no mesmo menu de Configurações para salvar sua configuração atual como arquivo `.pcfg`.
- **Mudar uma tecla:** edite-a no aplicativo Xencelabs e exporte o perfil de novo por cima do arquivo deste repositório. Em seguida, atualize as tabelas abaixo e rode `python3 validate-profiles.py` (Python 3.9+), que falha se o README e os perfis divergirem.
- **Editar o XML à mão** não é recomendado: cada atalho guarda o texto exibido e os códigos de tecla virtual do Windows que o dispositivo envia, e os dois precisam corresponder.

---

<a id="backend"></a>

## ☕ Backend Java Profile (`Xencelabs-BackendProfile.pcfg`)

🇺🇸 **EN:** For day-to-day work on Java/Micronaut services in IntelliJ IDEA (default Windows keymap). Each set is one activity, so the pad follows the loop navigate → refactor → debug → run/test → commit. Pair it with the Dev & Work profile, which keeps DataGrip, the terminal, PowerPoint and Discord.

🇧🇷 **PT:** Para o dia a dia em serviços Java/Micronaut no IntelliJ IDEA (keymap padrão do Windows). Cada set é uma atividade, então o pad acompanha o ciclo navegar → refatorar → depurar → executar/testar → commitar. Use junto com o perfil Dev & Work, que mantém DataGrip, terminal, PowerPoint e Discord.

### Set 1 · Code — Navigation / Navegação

| Key / Tecla | Label    | Shortcut / Atalho   | Action / Ação                                    |
| :---------- | :------- | :------------------ | :----------------------------------------------- |
| **K1**      | `Decl`   | `Ctrl + B`          | Go to Declaration / Ir para a Declaração         |
| **K2**      | `Impl`   | `Ctrl + Alt + B`    | Go to Implementation(s) / Ir para Implementações |
| **K3**      | `Usages` | `Alt + F7`          | Find Usages / Buscar Usos                        |
| **K4**      | `Test`   | `Ctrl + Shift + T`  | Go to Test / Ir para o Teste                     |
| **K5**      | `Fix`    | `Alt + Enter`       | Show Context Actions / Ações de Contexto         |
| **K6**      | `File`   | `Ctrl + Shift + N`  | Go to File / Ir para Arquivo                     |
| **K7**      | `Class`  | `Ctrl + N`          | Go to Class / Ir para Classe                     |
| **K8**      | `Back`   | `Ctrl + Alt + Left` | Navigate Back / Voltar                           |

### Set 2 · Rfctr — Refactoring / Refatoração

| Key / Tecla | Label    | Shortcut / Atalho        | Action / Ação                                                   |
| :---------- | :------- | :----------------------- | :-------------------------------------------------------------- |
| **K1**      | `Rename` | `Shift + F6`             | Rename / Renomear                                               |
| **K2**      | `ExtMtd` | `Ctrl + Alt + M`         | Extract Method / Extrair Método                                 |
| **K3**      | `ExtVar` | `Ctrl + Alt + V`         | Introduce Variable / Extrair Variável                           |
| **K4**      | `Inline` | `Ctrl + Alt + N`         | Inline / Incorporar                                             |
| **K5**      | `Format` | `Ctrl + Alt + L`         | Reformat Code / Formatar Código                                 |
| **K6**      | `Import` | `Ctrl + Alt + O`         | Optimize Imports / Organizar Imports                            |
| **K7**      | `Gen`    | `Alt + Insert`           | Generate (constructor, getters…) / Gerar (construtor, getters…) |
| **K8**      | `Rfctr`  | `Ctrl + Alt + Shift + T` | Refactor This / Menu de Refatoração                             |

### Set 3 · Debug — Debugging / Depuração

| Key / Tecla | Label    | Shortcut / Atalho | Action / Ação                           |
| :---------- | :------- | :---------------- | :-------------------------------------- |
| **K1**      | `Debug`  | `Shift + F9`      | Debug / Depurar                         |
| **K2**      | `BrkPt`  | `Ctrl + F8`       | Toggle Breakpoint / Alternar Breakpoint |
| **K3**      | `StepOv` | `F8`              | Step Over / Pular Linha                 |
| **K4**      | `StepIn` | `F7`              | Step Into / Entrar no Método            |
| **K5**      | `StepOt` | `Shift + F8`      | Step Out / Sair do Método               |
| **K6**      | `Resume` | `F9`              | Resume Program / Continuar Execução     |
| **K7**      | `Eval`   | `Alt + F8`        | Evaluate Expression / Avaliar Expressão |
| **K8**      | `Stop`   | `Ctrl + F2`       | Stop / Parar                            |

### Set 4 · Run — Run & Test / Execução e Testes

| Key / Tecla | Label    | Shortcut / Atalho    | Action / Ação                               |
| :---------- | :------- | :------------------- | :------------------------------------------ |
| **K1**      | `Run`    | `Shift + F10`        | Run / Executar                              |
| **K2**      | `RunCtx` | `Ctrl + Shift + F10` | Run Test at Cursor / Executar o Teste Atual |
| **K3**      | `Build`  | `Ctrl + F9`          | Build Project / Compilar Projeto            |
| **K4**      | `Rerun`  | `Ctrl + F5`          | Rerun / Executar de Novo                    |
| **K5**      | `Srvcs`  | `Alt + 8`            | Services Tool Window / Janela Services      |
| **K6**      | `Term`   | `Alt + F12`          | Terminal Tool Window / Janela Terminal      |
| **K7**      | `Probs`  | `Alt + 6`            | Problems Tool Window / Janela Problems      |
| **K8**      | `RunWin` | `Alt + 4`            | Run Tool Window / Janela Run                |

### Set 5 · Git — Version Control / Controle de Versão

| Key / Tecla | Label    | Shortcut / Atalho           | Action / Ação                                      |
| :---------- | :------- | :-------------------------- | :------------------------------------------------- |
| **K1**      | `Commit` | `Ctrl + K`                  | Commit / Criar Commit                              |
| **K2**      | `Push`   | `Ctrl + Shift + K`          | Push / Enviar Alterações                           |
| **K3**      | `Update` | `Ctrl + T`                  | Update Project (pull) / Atualizar Projeto (pull)   |
| **K4**      | `GitWin` | `Alt + 9`                   | Git Tool Window / Janela Git                       |
| **K5**      | `Rollbk` | `Ctrl + Alt + Z`            | Rollback Changes / Desfazer Alterações             |
| **K6**      | `Diff`   | `Ctrl + D`                  | Show Diff / Mostrar Diff                           |
| **K7**      | `CmtWin` | `Alt + 0`                   | Commit Tool Window / Janela Commit                 |
| **K8**      | `NxtChg` | `Ctrl + Alt + Shift + Down` | Next Change in File / Próxima Alteração no Arquivo |

---

<a id="dev"></a>

## 💻 Dev & Work Profile (`Xencelabs-DevProfile.pcfg`)

🇺🇸 **EN:** General development and work: the IntelliJ essentials, DataGrip, Windows Terminal and PowerShell, PowerPoint and Discord.

🇧🇷 **PT:** Desenvolvimento e trabalho em geral: o essencial do IntelliJ, DataGrip, Windows Terminal e PowerShell, PowerPoint e Discord.

### Set 1 · IDE — IntelliJ Ultimate

| Key / Tecla | Label    | Shortcut / Atalho  | Action / Ação                      |
| :---------- | :------- | :----------------- | :--------------------------------- |
| **K1**      | `Find`   | `Ctrl + Shift + A` | Find Action / Buscar Ação          |
| **K2**      | `Recent` | `Ctrl + E`         | Recent Files / Arquivos Recentes   |
| **K3**      | `Rename` | `Shift + F6`       | Rename/Refactor / Renomear         |
| **K4**      | `Format` | `Ctrl + Alt + L`   | Reformat Code / Formatar Código    |
| **K5**      | `Cmmnt`  | `Ctrl + /`         | Line Comment / Comentar Linha      |
| **K6**      | `StepOv` | `F8`               | Debug: Step Over / Pular Etapa     |
| **K7**      | `Resume` | `F9`               | Debug: Resume / Continuar Execução |
| **K8**      | `Build`  | `Ctrl + F9`        | Build Project / Compilar Projeto   |

### Set 2 · DB — DataGrip

| Key / Tecla | Label    | Shortcut / Atalho  | Action / Ação                    |
| :---------- | :------- | :----------------- | :------------------------------- |
| **K1**      | `Run`    | `Ctrl + Enter`     | Run Query / Executar Query       |
| **K2**      | `Format` | `Ctrl + Alt + L`   | Reformat SQL / Formatar SQL      |
| **K3**      | `NewCon` | `Ctrl + Shift + Q` | New Console / Novo Console       |
| **K4**      | `Find`   | `Ctrl + F`         | Find in Data / Buscar nos Dados  |
| **K5**      | `Table`  | `Ctrl + N`         | Go to Table / Ir para Tabela     |
| **K6**      | `Refrsh` | `Ctrl + F5`        | Refresh Schema / Atualizar Banco |
| **K7**      | `Close`  | `Ctrl + F4`        | Close Tab / Fechar Aba           |
| **K8**      | `Commit` | `Ctrl + Alt + K`   | Commit DB / Efetivar Mudanças    |

### Set 3 · Term — Windows Terminal & PowerShell

🇺🇸 **EN:** K1–K3 are PowerShell (PSReadLine) shortcuts and K4–K8 are Windows Terminal defaults. Git lives in the Backend Java profile, where its IntelliJ shortcuts work.

🇧🇷 **PT:** K1–K3 são atalhos do PowerShell (PSReadLine) e K4–K8 são padrões do Windows Terminal. O Git fica no perfil Backend Java, onde seus atalhos do IntelliJ funcionam.

| Key / Tecla | Label    | Shortcut / Atalho  | Action / Ação                              |
| :---------- | :------- | :----------------- | :----------------------------------------- |
| **K1**      | `Clear`  | `Ctrl + L`         | Clear Screen / Limpar Tela                 |
| **K2**      | `Cancel` | `Ctrl + C`         | Cancel Command / Cancelar Comando          |
| **K3**      | `Histry` | `Ctrl + R`         | Search History / Buscar Histórico          |
| **K4**      | `NewTab` | `Ctrl + Shift + T` | New Tab / Nova Aba                         |
| **K5**      | `Split`  | `Alt + Shift + D`  | Split Pane / Dividir Painel                |
| **K6**      | `PaneR`  | `Alt + Right`      | Focus Right Pane / Ir ao Painel da Direita |
| **K7**      | `Find`   | `Ctrl + Shift + F` | Find in Output / Buscar na Saída           |
| **K8**      | `Close`  | `Ctrl + Shift + W` | Close Pane or Tab / Fechar Painel ou Aba   |

### Set 4 · PPT — PowerPoint

| Key / Tecla | Label    | Shortcut / Atalho | Action / Ação                     |
| :---------- | :------- | :---------------- | :-------------------------------- |
| **K1**      | `Start`  | `F5`              | Start Show / Iniciar Apresentação |
| **K2**      | `CurSld` | `Shift + F5`      | Current Slide / Slide Atual       |
| **K3**      | `Next`   | `Right`           | Next Slide / Próximo Slide        |
| **K4**      | `Prev`   | `Left`            | Previous Slide / Slide Anterior   |
| **K5**      | `Laser`  | `Ctrl + L`        | Laser Pointer / Apontador Laser   |
| **K6**      | `Pen`    | `Ctrl + P`        | Pen Tool / Ferramenta Caneta      |
| **K7**      | `Black`  | `B`               | Black Screen / Tela Preta         |
| **K8**      | `End`    | `Esc`             | End Show / Encerrar Apresentação  |

### Set 5 · Work — Discord & Windows

| Key / Tecla | Label    | Shortcut / Atalho  | Action / Ação                           |
| :---------- | :------- | :----------------- | :-------------------------------------- |
| **K1**      | `Mute`   | `Ctrl + Shift + M` | Discord: Mute / Mutar Mic               |
| **K2**      | `Deafen` | `Ctrl + Shift + D` | Discord: Deafen / Mutar Áudio           |
| **K3**      | `Answer` | `Ctrl + Enter`     | Discord: Answer / Atender Call          |
| **K4**      | `Search` | `Ctrl + F`         | Search Chat / Buscar no Chat            |
| **K5**      | `Read`   | `Esc`              | Mark as Read / Marcar como Lido         |
| **K6**      | `Tasks`  | `Win + Tab`        | Task View / Visão de Tarefas            |
| **K7**      | `Dsktop` | `Win + D`          | Show Desktop / Mostrar Área de Trabalho |
| **K8**      | `Esc`    | `Esc`              | Escape / Fechar                         |

---

<a id="gaming"></a>

## 🎮 Gaming Profile (`Xencelabs-GamingProfile.pcfg`)

🇺🇸 **EN:** Overlay control (Steam, Uplay), screen capture (GeForce Experience) and real-time communication.

🇧🇷 **PT:** Controle de overlays (Steam, Uplay), captura de tela (GeForce Experience) e comunicação em tempo real.

### Set 1 · System — Overlays & OS / Overlays e Sistema

| Key / Tecla | Label    | Shortcut / Atalho    | Action / Ação                         |
| :---------- | :------- | :------------------- | :------------------------------------ |
| **K1**      | `Steam`  | `Shift + Tab`        | Steam Overlay                         |
| **K2**      | `Uplay`  | `Shift + F2`         | Uplay Overlay                         |
| **K3**      | `GameBr` | `Win + G`            | Xbox Game Bar                         |
| **K4**      | `TaskMg` | `Ctrl + Shift + Esc` | Task Manager / Gerenciador de Tarefas |
| **K5**      | `WinTab` | `Win + Tab`          | Task View / Visão de Tarefas          |
| **K6**      | `Dsktop` | `Win + D`            | Show Desktop / Área de Trabalho       |
| **K7**      | `FScrn`  | `Alt + Enter`        | Fullscreen Toggle / Tela Cheia        |
| **K8**      | `AltF4`  | `Alt + F4`           | Force Close / Fechar Forçado          |

### Set 2 · NVIDIA — GeForce Experience

| Key / Tecla | Label    | Shortcut / Atalho | Action / Ação                         |
| :---------- | :------- | :---------------- | :------------------------------------ |
| **K1**      | `NviOvr` | `Alt + Z`         | GeForce Overlay                       |
| **K2**      | `Replay` | `Alt + F10`       | Instant Replay / Salvar Clipe         |
| **K3**      | `Record` | `Alt + F9`        | Toggle Record / Gravar                |
| **K4**      | `Screen` | `Alt + F1`        | Screenshot / Captura de Tela          |
| **K5**      | `MicTgl` | `Alt + M`         | Toggle Mic / Ligar/Desligar Mic       |
| **K6**      | `FPS`    | `Alt + R`         | FPS Counter / Contador de FPS         |
| **K7**      | `Filter` | `Alt + F3`        | Game Filters / Filtros de Jogo        |
| **K8**      | `CamTgl` | `Alt + F6`        | Toggle Camera / Ligar/Desligar Câmera |

### Set 3 · Comms — Discord & Chat

| Key / Tecla | Label    | Shortcut / Atalho  | Action / Ação                    |
| :---------- | :------- | :----------------- | :------------------------------- |
| **K1**      | `Mute`   | `Ctrl + Shift + M` | Mute Mic / Mutar Microfone       |
| **K2**      | `Deafen` | `Ctrl + Shift + D` | Deafen Audio / Mutar Áudio       |
| **K3**      | `Answer` | `Ctrl + Enter`     | Answer Call / Atender Chamada    |
| **K4**      | `Reject` | `Esc`              | Reject Call / Rejeitar Chamada   |
| **K5**      | `PTT`    | `V`                | Push-to-Talk                     |
| **K6**      | `Chat`   | `Enter`            | Open Text Chat / Abrir Chat      |
| **K7**      | `DscOvr` | `` Shift + ` ``    | Discord Overlay                  |
| **K8**      | `AltTab` | `Alt + Tab`        | Quick Alt-Tab / Trocar de Janela |

### Set 4 · InGame — Generic Actions / Ações Genéricas

| Key / Tecla | Label    | Shortcut / Atalho | Action / Ação                    |
| :---------- | :------- | :---------------- | :------------------------------- |
| **K1**      | `Map`    | `M`               | Map / Mapa                       |
| **K2**      | `Invtry` | `I`               | Inventory / Inventário           |
| **K3**      | `Journl` | `J`               | Journal / Missões                |
| **K4**      | `QSave`  | `F5`              | Quick Save / Salvamento Rápido   |
| **K5**      | `QLoad`  | `F9`              | Quick Load / Carregamento Rápido |
| **K6**      | `Heal`   | `H`               | Use Medkit / Usar Cura           |
| **K7**      | `Prone`  | `Z`               | Prone / Deitar                   |
| **K8**      | `Crouch` | `C`               | Crouch / Agachar                 |

### Set 5 · Empty — Xencelabs Defaults / Padrões da Xencelabs

🇺🇸 **EN:** Not customized: this set keeps the Xencelabs factory keys (editing and modifier keys). It is a free slot for your own shortcuts.

🇧🇷 **PT:** Não personalizado: este set mantém as teclas de fábrica da Xencelabs (edição e modificadores). É um espaço livre para seus próprios atalhos.

| Key / Tecla | Label     | Shortcut / Atalho | Action / Ação              |
| :---------- | :-------- | :---------------- | :------------------------- |
| **K1**      | `Undo`    | `Ctrl + Z`        | Undo / Desfazer            |
| **K2**      | `Redo`    | `Ctrl + Y`        | Redo / Refazer             |
| **K3**      | `Copy`    | `Ctrl + C`        | Copy / Copiar              |
| **K4**      | `Paste`   | `Ctrl + V`        | Paste / Colar              |
| **K5**      | `Shift`   | `Shift`           | Hold Shift / Segurar Shift |
| **K6**      | `Control` | `Ctrl`            | Hold Ctrl / Segurar Ctrl   |
| **K7**      | `Alt`     | `Alt`             | Hold Alt / Segurar Alt     |
| **K8**      | `Space`   | `Space`           | Space / Espaço             |

---

<a id="dial"></a>

## 🎛️ Dial and Radial Menu / Dial e Menu Radial

🇺🇸 **EN:** No profile customizes the dial or the pen tablet's on-screen radial menu; all keep the Xencelabs defaults. The dial's fourth function is **Brush Size** (`[` / `]`). The radial menu offers Undo, Redo, Copy, Paste, Save, Deselect, Enter and Esc.

🇧🇷 **PT:** Nenhum perfil personaliza o dial nem o menu radial de tela da mesa digitalizadora; todos mantêm os padrões da Xencelabs. A quarta função do dial é **Tamanho do Pincel** (`[` / `]`). O menu radial oferece Desfazer, Refazer, Copiar, Colar, Salvar, Desmarcar, Enter e Esc.

<a id="notes"></a>

## ⚠️ Notes / Observações

🇺🇸 **EN:**

- **Keyboard layout:** the device sends Windows virtual-key codes, not characters. Letter, number, function and modifier keys behave the same on every layout. Punctuation keys (`Ctrl + /` on Dev Set 1 K5 and `` Shift + ` `` on Gaming Set 3 K7) were recorded on a US layout, and on other layouts, such as the Brazilian ABNT2, they may produce a different character. If they don't work, re-record them in the Xencelabs app.
- **Graphics-driver hotkeys:** on some PCs the Intel graphics utility captures `Ctrl + Alt + arrow` to rotate the screen, which would steal `Back` (Backend Set 1 K8) and `NxtChg` (Backend Set 5 K8). Disable those hotkeys in the graphics utility if the screen rotates.
- **Conflicts:** the same shortcut can mean different things in different applications. For example, `Ctrl + L` clears the terminal and turns on the laser pointer in PowerPoint. The action depends on the window in focus.
- **Set 1 and "Default":** the device's default group is a copy of Set 1. That is how the Xencelabs app exports it, not a duplicate to clean up.

🇧🇷 **PT:**

- **Layout do teclado:** o dispositivo envia códigos de tecla virtual do Windows, não caracteres. Letras, números, teclas de função e modificadores funcionam igual em qualquer layout. As teclas de pontuação (`Ctrl + /` no Set 1 K5 do Dev e `` Shift + ` `` no Set 3 K7 do Gaming) foram gravadas num layout americano, e em outros layouts, como o ABNT2 brasileiro, podem gerar outro caractere. Se não funcionarem, grave-as de novo no aplicativo Xencelabs.
- **Atalhos do driver de vídeo:** em alguns PCs, o utilitário gráfico da Intel captura `Ctrl + Alt + seta` para girar a tela, o que roubaria `Back` (Set 1 K8 do Backend) e `NxtChg` (Set 5 K8 do Backend). Desative esses atalhos no utilitário gráfico se a tela girar.
- **Conflitos:** o mesmo atalho pode ter significados diferentes em cada aplicativo. Por exemplo, `Ctrl + L` limpa o terminal e liga o apontador laser no PowerPoint. A ação depende da janela em foco.
- **Set 1 e grupo "Default":** o grupo padrão do dispositivo é uma cópia do Set 1. É assim que o aplicativo Xencelabs exporta, não é uma duplicata a ser removida.

---

<a id="linux"></a>

## 🐧 Linux Server / Servidor Linux

🇺🇸 **EN:** The `.pcfg` profiles need the Xencelabs app, which runs on Windows and macOS. For a Linux server, [`linux/`](linux/README.md) has an agent that turns the Quick Keys into a **command pad**:

- each key runs a configured program, such as a Docker Compose stack or a network diagnostic;
- the display shows the labels, and the dial switches sets;
- it runs as a systemd service, installed with `sudo ./install.sh`.

🇧🇷 **PT:** Os perfis `.pcfg` precisam do app da Xencelabs, que roda no Windows e no macOS. Para um servidor Linux, a pasta [`linux/`](linux/README.md) tem um agente que transforma o Quick Keys num **pad de comandos**:

- cada tecla executa um programa configurado, como uma stack Docker Compose ou um diagnóstico de rede;
- o visor mostra os rótulos, e o dial troca os sets;
- ele roda como serviço systemd, instalado com `sudo ./install.sh`.

<a id="validation"></a>

## 🔍 Validation / Validação

🇺🇸 **EN:** The CI workflow runs on every push and pull request:

- `python3 validate-profiles.py` checks that every profile is valid XML, that every key sends exactly the keys its label shows, and that every key of all 5 sets is documented in this README with the same label and shortcut;
- Prettier checks the Markdown formatting of the README files;
- the Linux agent's tests, configuration check and shellcheck run in their own job.

🇧🇷 **PT:** O workflow de CI roda a cada push e pull request:

- `python3 validate-profiles.py` verifica se cada perfil é XML válido, se cada tecla envia exatamente as teclas que seu rótulo mostra e se cada tecla dos 5 sets está documentada neste README com o mesmo rótulo e atalho;
- o Prettier verifica a formatação Markdown dos READMEs;
- os testes, a validação da configuração e o shellcheck do agente Linux rodam num job próprio.

---

<a id="license"></a>

## 📄 License / Licença

🇺🇸 **EN:** Licensed under the [PolyForm Strict License 1.0.0](LICENSE): you may read and use this software for noncommercial purposes only. Modifying it, creating derivative works, redistributing it and any commercial use are not permitted without a separate written license. This software is not open source.

🇧🇷 **PT:** Licenciado sob a [PolyForm Strict License 1.0.0](LICENSE): você pode consultar e usar estes arquivos apenas para fins não comerciais. Modificar, criar obras derivadas, redistribuir e qualquer uso comercial não são permitidos sem uma licença específica por escrito. Este software não é de código aberto.
