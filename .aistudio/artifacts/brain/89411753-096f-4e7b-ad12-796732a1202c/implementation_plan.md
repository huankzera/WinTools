# WinTools Pro - Ferramentas do Windows (Desktop Python & PowerShell Suite)

Uma plataforma visual e interativa para gerenciamento, diagnóstico, manutenção e automação do Windows através de comandos CMD e PowerShell organizados em 12 categorias especializadas, com console embutido, simulador interativo, gerador de scripts (.BAT / .PS1), sistema de favoritos e código-fonte desktop completo para download imediato em CustomTkinter (Python) e PowerShell puro (WPF).

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas com base nas respostas do usuário:**
> - **Ambiente Híbrido**: Interface Web interativa para exploração, simulação de execução de comandos em console realista do Windows, montador dinâmico de scripts e central de download dos executáveis.
> - **Abrangência Completa**: 12 categorias completas com comandos reais e precisos de CMD e PowerShell para manutenção, rede, tela/brilho, reparos do sistema, segurança, processos e utilitários.
> - **Desktop Executável**: Entrega do código-fonte completo e autônomo em Python com CustomTkinter moderno (`wintools_pro.py`), `requirements.txt`, guia passo a passo do PyInstaller para gerar `.exe`, e versão equivalente em PowerShell puro (`WinToolsPro.ps1`) com interface nativa.

- **Confirmação de Segurança**: Comandos críticos (ex: `netsh winsock reset`, `sfc /scannow`, `chkdsk`, `dism`, exclusão de temporários) possuem modal de confirmação com aviso de privilégios de Administrador.
- **Gerador de Scripts Personalizados**: O usuário pode selecionar quaisquer comandos da lista ou das 12 categorias e exportar instantaneamente um `.bat` ou `.ps1` pronto para execução, além de gerar menus interativos BAT pré-configurados.

---

### 1. Overview & Core Concept

- **O que faz**: Transforma centenas de comandos do Windows complexos ou dispersos em uma central visual, ergonômica e intuitiva. Usuários e administradores podem pesquisar comandos instantaneamente, copiar para o clipboard, simular execução em terminal embutido com visual Windows Terminal/PowerShell, salvar favoritos, ajustar brilho de tela via WMI, e baixar o executável desktop em Python (CustomTkinter) ou script PowerShell puro.
- **Público-alvo**: Técnicos de suporte de TI, entusiastas do Windows, administradores de sistemas e usuários comuns que desejam otimizar, limpar, diagnosticar rede e consertar problemas do Windows sem precisar memorizar sintaxes do prompt.
- **Valor Principal**: Eliminação de erros de digitação em comandos críticos, aumento de produtividade em tarefas de manutenção do Windows e empacotamento desktop pronto para levar no pendrive.

---

### 2. User Experience & Visual Design

- **Aesthetic Direction**: Interface moderna inspirada no **Windows 11 Fluent Design / Windows Terminal**, combinando superfícies escuras refinadas (`#0F172A` / `#090D16`), acentos sutis em azul do Windows (`#0078D4` / `#38BDF8`), tipografia limpa e tipografia monospace para códigos e saída do console.
- **Paleta de Cores & Tema**:
  - Fundo principal: Escuro profundo (`#0B0F19` ou modo claro `#F8FAFC`)
  - Painéis laterais e cards: Superfície elevada (`#131C2E` / `#1E293B` em escuro; `#FFFFFF` com bordas sutis em claro)
  - Cores semânticas:
    - Azul Windows / PowerShell: `#0078D4` / `#0284C7` (Ações primárias, links)
    - Âmbar / Alerta Admin: `#D97706` / `#F59E0B` (Requer Administrador)
    - Vermelho Perigo: `#DC2626` / `#EF4444` (Ação crítica / destrutiva)
    - Esmeralda / Sucesso: `#10B981` (Copiar com sucesso, status OK)
- **Tipografia**:
  - Títulos e interface: `Plus Jakarta Sans`, `Manrope` ou fonte do sistema sem serifa (`Segoe UI`, `Inter` fallback)
  - Códigos, comandos e saídas de terminal: `JetBrains Mono` / `Consolas` com suporte a `tabular-nums`
- **Layout & Ritmo de Seções**:
  1. **Barra Superior**: Logotipo "WinTools Pro", status de privilégios (Simulado Admin), campo de busca rápida global, contador de favoritos e alternador de tema (Escuro/Claro).
  2. **Barra Lateral com 12 Categorias**:
     - ⚡ Desligar / Reiniciar / Energia (`shutdown`, `powercfg`)
     - 🌐 Rede, IP e DNS (`ipconfig`, `netsh`, `ping`, `nslookup`, `flushdns`)
     - 💡 Brilho e Tela (Slider WMI `WmiMonitorBrightnessMethods`, atalhos de exibição)
     - 🛠️ Diagnóstico e Reparo (`sfc /scannow`, `DISM`, `chkdsk`, `mdsched`)
     - 🧹 Limpeza e Armazenamento (`cleanmgr`, temporários, `vssadmin`)
     - 📊 Processos e Desempenho (`tasklist`, `taskkill`, `Get-Process`, `resmon`)
     - 🛡️ Firewall e Segurança (`netsh advfirewall`, `MpComputerStatus`, defender)
     - 💾 Discos e Partições (`diskpart`, `defrag`, `Get-Volume`, `diskmgmt.msc`)
     - ⚙️ Serviços e Inicialização (`services.msc`, `sc query`, `Get-Service`, `msconfig`)
     - ℹ️ Informações do Sistema (`systeminfo`, `dxdiag`, `Get-ComputerInfo`, `winver`)
     - 🧰 Utilitários do Windows (Atalhos rápidos para God Mode, Regedit, Eventvwr, etc.)
     - 📜 Automação & Gerador de Scripts (Gerador de menu BAT e montador de .PS1)
  3. **Visualizador de Código Desktop (Python CustomTkinter & PowerShell Puro)**:
     - Aba dedicada com preview de sintaxe colorida dos arquivos prontos para salvar: `wintools_pro.py`, `requirements.txt`, `WinToolsPro.ps1` e guia do PyInstaller com botões "Copiar Código" e "Baixar Arquivo (.py/.ps1/.txt)".
  4. **Área Central de Cards de Comandos**:
     - Cards organizados com cabeçalho, indicador discreto de privilégios (`Admin` ou `Padrão`), tag de tipo (`CMD` ou `PowerShell`), comando com realce, descrição clara em português e botões de ação ("Copiar", "Favoritar", "Executar no Console", "Adicionar ao Script").
  5. **Console Interativo Embutido (Inferior ou Split)**:
     - Terminal estilo Windows Terminal com abas (PowerShell / CMD), histórico de saídas, suporte a digitação manual de comandos com autocompletar e simulação precisa das respostas do Windows para comandos executados.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Fornecer o Aplicativo Web Completo E os Arquivos Desktop Baixáveis**:
  - *Abordagem*: O app no navegador funciona como uma central completa 100% utilizável (pesquisa, cópia de comandos, simulação de execução, gerador de arquivos .bat/.ps1 com download direto no navegador). Ao mesmo tempo, fornece o código-fonte integral e funcional do app desktop em Python (`CustomTkinter`) e o script em PowerShell puro (`WPF`).
  - *Motivo*: Atende perfeitamente ao pedido do usuário de ter o código em Python CustomTkinter e PowerShell para Windows, permitindo testar tudo de imediato no ambiente web do AI Studio.
- **Decisão 2: Proteção de Comandos Críticos com Diálogo de Confirmação**:
  - *Abordagem*: Comandos que alteram a rede (`netsh winsock reset`), limpam caches ou reiniciam a máquina pedem confirmação visual explícita com detalhes do impacto antes de disparar a ação no console.
  - *Motivo*: Evita cliques acidentais e ensina boas práticas de administração.
- **Decisão 3: Ajuste de Brilho Dinâmico e Atalhos de Ferramentas Nativas**:
  - *Abordagem*: Slider interativo de brilho que gera e copia/simula em tempo real o comando PowerShell WMI (`(Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, $valor)`), acompanhado de botões rápidos para disparar URIs do Windows (`ms-settings:display`, `taskmgr`, `services.msc`, `diskmgmt.msc`, `control`).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          WinTools Pro Suite                            │
├────────────────────────────────┬───────────────────────────────────────┤
│ Top Bar: Search / Favorites    │ Controls: Dark/Light Mode / Export    │
├────────────────────────────────┴───────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │   Category Sidebar    │  │       Main Command Workspace           │ │
│  │  - 12 Categorias      │  │  ┌───────────────────────────────────┐ │ │
│  │  - Favoritos (★)      │  │  │ Quick Tools / Brightness WMI Bar  │ │ │
│  │  - Gerador Script     │  │  └───────────────────────────────────┘ │ │
│  │  - Código Python      │  │  ┌───────────────────────────────────┐ │ │
│  │  - Código PowerShell  │  │  │ Cards Grid (Copiar / Exec / Fav)  │ │ │
│  │  - Terminal Console   │  │  └───────────────────────────────────┘ │ │
│  └───────────────────────┘  │  ┌───────────────────────────────────┐ │ │
│                             │  │ Interactive Windows Terminal Box  │ │ │
│                             │  └───────────────────────────────────┘ │ │
│                             └────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Componentes Principais
1. `src/data/commandsData.ts`:
   - Banco de dados completo contendo mais de 70 comandos essenciais do Windows classificados nas 12 categorias.
   - Metadados: `id`, `category`, `name`, `command`, `shellType` (`CMD` | `PowerShell`), `requiresAdmin` (boolean), `isCritical` (boolean), `description`, `simulatedOutput`.
2. `src/data/desktopSourceCode.ts`:
   - Código completo de `wintools_pro.py` (usando `customtkinter`), com janelas estilizadas, abas de categorias, execução via `subprocess.Popen`, slider de brilho, terminal embutido com suporte a threads e temas.
   - Arquivo `requirements.txt` com `customtkinter` e instruções do PyInstaller.
   - Código de `WinToolsPro.ps1` com interface gráfica nativa em WPF/XAML.
3. `src/components/CommandCard.tsx`: Card de comando com realce de sintaxe, status de admin, botões de cópia rápida, favoritar e modal de confirmação.
4. `src/components/TerminalConsole.tsx`: Console estilizado como Windows Terminal com streaming simulado de saída, prompt interativo, botão de limpar e cópia de logs.
5. `src/components/ScriptBuilderModal.tsx`: Montador dinâmico de scripts `.bat` ou `.ps1` com seleção em lote e download em arquivo físico.
6. `src/components/DesktopCodeViewer.tsx`: Aba para visualizar, inspecionar e baixar os arquivos `.py`, `.ps1` e instruções do PyInstaller.
7. `src/components/BrightnessController.tsx`: Controlador visual de brilho com o comando WMI PowerShell interativo.
8. `src/components/QuickLauncher.tsx`: Atalhos de 1 clique para diagnósticos unificados (Ping + DNS + Rota) e relatório de sistema completo.

---

### Verificação e Validação
- Validar layout responsivo e fluido sem rolagem indesejada ou quebras de linha nas ações.
- Conferir cópia no clipboard em todos os cards e terminais com feedback visual.
- Testar geração e download de arquivos `.bat`, `.ps1`, `.py` e `.txt` diretamente no navegador.
- Compilar o projeto com `compile_applet` para assegurar ausência de erros de TypeScript e build limpo.
