import { CategoryInfo, CommandItem } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'energia',
    name: 'Desligar / Reiniciar / Energia',
    shortName: 'Energia',
    iconName: 'Power',
    description: 'Comandos para controle de energia, reinicialização rápida, hibernação e relatórios de bateria.'
  },
  {
    id: 'rede',
    name: 'Rede, IP e DNS',
    shortName: 'Rede e IP',
    iconName: 'Wifi',
    description: 'Diagnóstico de conexões, liberação/renovação de IP, limpeza de cache DNS e redefinição de sockets Winsock.'
  },
  {
    id: 'brilho',
    name: 'Brilho e Tela',
    shortName: 'Brilho & Tela',
    iconName: 'Sun',
    description: 'Controle de brilho do monitor via WMI PowerShell e atalhos diretos de configuração de monitores.'
  },
  {
    id: 'diagnostico',
    name: 'Diagnóstico e Reparo',
    shortName: 'Diagnóstico',
    iconName: 'Wrench',
    description: 'Verificação e restauração de integridade do sistema Windows com SFC, DISM e CHKDSK.'
  },
  {
    id: 'limpeza',
    name: 'Limpeza e Armazenamento',
    shortName: 'Limpeza',
    iconName: 'Trash2',
    description: 'Liberação de espaço em disco, limpeza de temporários, otimização WinSxS e lixeira.'
  },
  {
    id: 'processos',
    name: 'Processos e Desempenho',
    shortName: 'Desempenho',
    iconName: 'Cpu',
    description: 'Monitoramento e finalização de processos travados, gerenciador de tarefas e uso de CPU/RAM.'
  },
  {
    id: 'seguranca',
    name: 'Firewall e Segurança',
    shortName: 'Segurança',
    iconName: 'ShieldAlert',
    description: 'Status do Windows Defender, regras de firewall, varredura antivírus e integridade de segurança.'
  },
  {
    id: 'discos',
    name: 'Discos e Partições',
    shortName: 'Discos',
    iconName: 'HardDrive',
    description: 'Desfragmentação/TRIM de SSDs, volumes do sistema, verificação de integridade e Diskpart.'
  },
  {
    id: 'servicos',
    name: 'Serviços e Inicialização',
    shortName: 'Serviços',
    iconName: 'Layers',
    description: 'Gerenciamento de serviços em segundo plano, programas de inicialização e parada de serviços travados.'
  },
  {
    id: 'sistema',
    name: 'Informações do Sistema',
    shortName: 'Info Sistema',
    iconName: 'Info',
    description: 'Especificações de hardware, versão do Windows, BIOS, placa-mãe e detalhes da build.'
  },
  {
    id: 'utilitarios',
    name: 'Utilitários e Atalhos MSC',
    shortName: 'Utilitários',
    iconName: 'Sliders',
    description: 'Abertura rápida das principais ferramentas administrativas do Windows (God Mode, Regedit, etc).'
  },
  {
    id: 'automacao',
    name: 'Automação (BAT e PowerShell)',
    shortName: 'Automação',
    iconName: 'Terminal',
    description: 'Scripts prontos para manutenção preventiva periódica, menus interativos e exportação de relatórios.'
  }
];

export const COMMANDS: CommandItem[] = [
  // 1. Energia
  {
    id: 'pwr-shutdown-now',
    name: 'Desligar Imediatamente',
    category: 'energia',
    command: 'shutdown /s /t 0',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: true,
    warningMessage: 'Isso desligará o computador imediatamente sem aguardar o fechamento de programas.',
    description: 'Desliga o computador instantaneamente sem contagem regressiva.',
    simulatedOutput: 'C:\\Windows\\system32> shutdown /s /t 0\n[Aviso] O sistema operacional está encerrando todas as operações...'
  },
  {
    id: 'pwr-restart-now',
    name: 'Reiniciar Imediatamente',
    category: 'energia',
    command: 'shutdown /r /t 0',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: true,
    warningMessage: 'Isso reiniciará o computador imediatamente. Salve seus trabalhos abertos.',
    description: 'Reinicia o Windows imediatamente com tempo zero de espera.',
    simulatedOutput: 'C:\\Windows\\system32> shutdown /r /t 0\n[Aviso] Reinicialização do sistema iniciada...'
  },
  {
    id: 'pwr-restart-uefi',
    name: 'Reiniciar na BIOS / UEFI',
    category: 'energia',
    command: 'shutdown /r /fw /t 1',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'O computador será reiniciado diretamente na tela de configuração da BIOS/UEFI.',
    description: 'Reinicia o PC e entra diretamente nas configurações de firmware da placa-mãe.',
    simulatedOutput: 'C:\\Windows\\system32> shutdown /r /fw /t 1\n[Aviso] O computador será reiniciado nas opções de firmware da UEFI...'
  },
  {
    id: 'pwr-abort',
    name: 'Cancelar Desligamento Agendado',
    category: 'energia',
    command: 'shutdown /a',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Aborta qualquer desligamento ou reinício programado previamente.',
    simulatedOutput: 'C:\\Windows\\system32> shutdown /a\nO desligamento programado foi cancelado com êxito.'
  },
  {
    id: 'pwr-battery-report',
    name: 'Gerar Relatório de Bateria',
    category: 'energia',
    command: 'powercfg /batteryreport /output "%USERPROFILE%\\battery_report.html"',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Gera um relatório HTML detalhado sobre capacidade, ciclos e saúde da bateria.',
    simulatedOutput: 'O relatório sobre a vida útil da bateria foi salvo em: C:\\Users\\Usuario\\battery_report.html.'
  },
  {
    id: 'pwr-hibernate-off',
    name: 'Desativar Hibernação (Economiza GBs)',
    category: 'energia',
    command: 'powercfg /hibernate off',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Remove o arquivo hiberfil.sys, liberando vários gigabytes no disco C:.',
    simulatedOutput: 'C:\\Windows\\system32> powercfg /hibernate off\nOperação concluída com êxito. O arquivo hiberfil.sys foi excluído.'
  },

  // 2. Rede
  {
    id: 'net-ipconfig-all',
    name: 'Exibir Configuração Completa de Rede',
    category: 'rede',
    command: 'ipconfig /all',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Exibe endereço IPv4, IPv6, Gateway, Servidores DNS e endereço MAC de todos os adaptadores.',
    simulatedOutput: 'Configuração de IP do Windows\n\nNome do host . . . . . . . . . . . . : WINTOOLS-PC\nSufixo DNS primário . . . . . . . . . :\nTipo de nó . . . . . . . . . . . . . : Híbrido\nRoteamento de IP ativado . . . . . . : Não\n\nAdaptador Ethernet Ethernet:\n   Endereço IPv4. . . . . . . . . . . . . . : 192.168.1.105(Preferencial)\n   Máscara de Sub-rede . . . . . . . . . . . : 255.255.255.0\n   Gateway Padrão. . . . . . . . . . . . . . : 192.168.1.1\n   Servidores DNS. . . . . . . . . . . . . . : 1.1.1.1, 8.8.8.8'
  },
  {
    id: 'net-flushdns',
    name: 'Limpar Cache de Resolução DNS',
    category: 'rede',
    command: 'ipconfig /flushdns',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Limpa o cache do resolvedor DNS do Windows para corrigir problemas de sites inacessíveis.',
    simulatedOutput: 'Configuração de IP do Windows\n\nLiberação do Cache do DNS Resolver bem-sucedida.'
  },
  {
    id: 'net-release-renew',
    name: 'Renovar Endereço IP (DHCP)',
    category: 'rede',
    command: 'ipconfig /release && ipconfig /renew',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Libera o endereço IP atual do adaptador e solicita um novo lease ao roteador.',
    simulatedOutput: 'Configuração de IP do Windows\nLiberando concessões IP...\nRenovando endereço via DHCP...\nAdaptador Wi-Fi: IPv4 192.168.1.112 atribuído com sucesso.'
  },
  {
    id: 'net-winsock-reset',
    name: 'Redefinir Catálogo Winsock e TCP/IP',
    category: 'rede',
    command: 'netsh winsock reset && netsh int ip reset',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Isso redefinirá todas as configurações de sockets de rede do Windows. Será necessário reiniciar o PC.',
    description: 'Restaura a pilha TCP/IP e o catálogo Winsock às configurações padrão de fábrica.',
    simulatedOutput: 'Catálogo do Winsock redefinido com êxito.\nVocê deve reiniciar o computador para concluir a redefinição.\nReinicializando interface global... OK!\nReinicializando sub-rede... OK!'
  },
  {
    id: 'net-ping-google',
    name: 'Testar Conexão com a Internet (Ping)',
    category: 'rede',
    command: 'ping 8.8.8.8 -n 4',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Envia 4 pacotes ICMP para o DNS do Google para verificar latência e perda de pacotes.',
    simulatedOutput: 'Disparando 8.8.8.8 com 32 bytes de dados:\nResposta de 8.8.8.8: bytes=32 tempo=14ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=15ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=14ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=13ms TTL=117\n\nEstatísticas do Ping para 8.8.8.8:\n    Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda),\nAproximação de tempo em milissegundos:\n    Mínimo = 13ms, Máximo = 15ms, Média = 14ms'
  },
  {
    id: 'net-trace-cloudflare',
    name: 'Rastrear Rota de Conexão (Tracert)',
    category: 'rede',
    command: 'tracert -d -h 10 1.1.1.1',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Mapeia os saltos de rede entre o computador e o servidor de destino.',
    simulatedOutput: 'Rastreando a rota para 1.1.1.1 com no máximo 10 saltos:\n  1     2 ms     1 ms     1 ms  192.168.1.1\n  2     8 ms     7 ms     7 ms  100.64.0.1\n  3    12 ms    11 ms    11 ms  1.1.1.1\n\nRastreamento concluído.'
  },
  {
    id: 'net-active-connections',
    name: 'Ver Portas e Conexões Ativas',
    category: 'rede',
    command: 'netstat -ano | findstr ESTABLISHED',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Lista todas as conexões TCP ativas com os respectivos números de portas e PIDs dos processos.',
    simulatedOutput: '  TCP    192.168.1.105:53210   142.250.190.46:443   ESTABLISHED     12480\n  TCP    192.168.1.105:53211   52.96.166.130:443    ESTABLISHED      8944\n  TCP    192.168.1.105:53212   104.26.12.18:443     ESTABLISHED      4512'
  },

  // 3. Brilho e Tela
  {
    id: 'screen-set-brightness',
    name: 'Ajustar Brilho para 70% (WMI)',
    category: 'brilho',
    command: '(Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, 70)',
    shellType: 'PowerShell',
    requiresAdmin: true,
    isCritical: false,
    description: 'Altera o nível de brilho da tela integrada (laptops e monitores com suporte a DDC/CI) para 70%.',
    simulatedOutput: 'PS C:\\> (Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, 70)\n\n__GENUS          : 2\n__CLASS          : __PARAMETERS\nReturnValue      : 0 (Sucesso)'
  },
  {
    id: 'screen-get-brightness',
    name: 'Consultar Nível Atual de Brilho',
    category: 'brilho',
    command: 'Get-CimInstance -Namespace root/wmi -ClassName WmiMonitorBrightness | Select-Object CurrentBrightness',
    shellType: 'PowerShell',
    requiresAdmin: false,
    isCritical: false,
    description: 'Lê o percentual atual de brilho da tela relatado pelo driver WMI.',
    simulatedOutput: 'CurrentBrightness\n-----------------\n               75'
  },
  {
    id: 'screen-open-settings',
    name: 'Abrir Configurações de Vídeo do Windows',
    category: 'brilho',
    command: 'start ms-settings:display',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Abre diretamente o painel de configurações de resolução, taxa de Hz, HDR e escala de tela.',
    simulatedOutput: 'Iniciando URI ms-settings:display...\nJanela de Configurações de Vídeo aberta com sucesso.'
  },
  {
    id: 'screen-switch-mode',
    name: 'Menu de Projeção de Tela (Multi-Monitor)',
    category: 'brilho',
    command: 'displayswitch.exe',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Abre a barra lateral do Windows para alternar entre Duplicar, Estender ou Segunda tela somente.',
    simulatedOutput: 'Iniciando painel lateral de Projeção DisplaySwitch...'
  },

  // 4. Diagnóstico e Reparo
  {
    id: 'diag-sfc-scannow',
    name: 'Verificar e Reparar Arquivos do Sistema (SFC)',
    category: 'diagnostico',
    command: 'sfc /scannow',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'A verificação pode demorar de 5 a 20 minutos. Não desligue o PC durante o processo.',
    description: 'Varre todos os arquivos protegidos do Windows e substitui versões corrompidas pelas corretas da Microsoft.',
    simulatedOutput: 'Iniciando verificação de arquivos do sistema. O processo levará algum tempo.\nIniciando fase de verificação de verificação do sistema.\nVerificação 100% concluída.\nA Proteção de Recursos do Windows encontrou arquivos corrompidos e os reparou com êxito.'
  },
  {
    id: 'diag-dism-restore',
    name: 'Reparar Imagem do Windows (DISM RestoreHealth)',
    category: 'diagnostico',
    command: 'DISM /Online /Cleanup-Image /RestoreHealth',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'O DISM faz download de componentes originais via Windows Update para consertar a imagem.',
    description: 'Corrige a loja de componentes corrompidos do Windows usando o repositório oficial da Microsoft.',
    simulatedOutput: 'Ferramenta de Gerenciamento e Manutenção de Imagens de Implantação\nVersão: 10.0.22621.1\n\nVersão da Imagem: 10.0.22631.3007\n\n[==========================100.0%==========================]\nA operação de restauração foi concluída com êxito.\nA operação foi concluída com êxito.'
  },
  {
    id: 'diag-chkdsk-scan',
    name: 'Verificar Erros no Disco C: (Sem Travar)',
    category: 'diagnostico',
    command: 'chkdsk C: /scan /perf',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Executa uma varredura online de erros de sistema de arquivos NTFS sem exigir reinício.',
    simulatedOutput: 'O tipo do sistema de arquivos é NTFS.\nEstágio 1: examinando estrutura básica do sistema de arquivos...\nEstágio 2: examinando a vinculação de nomes de arquivos...\nEstágio 3: examinando os descritores de segurança...\nO Windows examinou o sistema de arquivos e não encontrou problemas.'
  },
  {
    id: 'diag-memory-check',
    name: 'Diagnóstico de Memória RAM (MDSCHED)',
    category: 'diagnostico',
    command: 'mdsched.exe',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Abre a ferramenta de diagnóstico de memória para agendar um teste na próxima inicialização.',
    description: 'Abre a ferramenta oficial da Microsoft para testar integridade dos módulos de memória RAM.',
    simulatedOutput: 'Janela do Diagnóstico de Memória do Windows aberta.'
  },

  // 5. Limpeza e Armazenamento
  {
    id: 'clean-temp-files',
    name: 'Limpar Pastas Temporárias (Temp e %temp%)',
    category: 'limpeza',
    command: 'del /q /f /s "%TEMP%\\*" & del /q /f /s "C:\\Windows\\Temp\\*"',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Arquivos temporários atualmente em uso por aplicativos abertos serão ignorados com segurança.',
    description: 'Exclui caches, relatórios de erro e arquivos temporários desnecessários.',
    simulatedOutput: 'Excluindo arquivos temporários de: C:\\Users\\Usuario\\AppData\\Local\\Temp\\*\nExcluindo arquivos temporários de: C:\\Windows\\Temp\\*\nLiberados aproximadamente 3.42 GB de espaço em disco.'
  },
  {
    id: 'clean-cleanmgr-sagerun',
    name: 'Limpeza de Disco Avançada do Windows',
    category: 'limpeza',
    command: 'cleanmgr /lowdisk',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Inicia o utilitário nativo de limpeza de disco em modo de emergência para recuperar espaço.',
    simulatedOutput: 'Iniciando Utilitário de Limpeza de Disco (cleanmgr.exe)...'
  },
  {
    id: 'clean-dism-componentcleanup',
    name: 'Limpar e Reduzir Pasta WinSxS',
    category: 'limpeza',
    command: 'DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Remove backups de atualizações antigas do Windows. Não será possível desinstalar atualizações anteriores.',
    description: 'Otimiza e enxuga o repositório de componentes do Windows (WinSxS), liberando muito espaço.',
    simulatedOutput: 'Ferramenta de Gerenciamento e Manutenção de Imagens de Implantação\n[==========================100.0%==========================]\nLimpeza de componentes concluída com êxito.'
  },
  {
    id: 'clean-empty-recyclebin',
    name: 'Esvaziar Lixeira Silenciosamente',
    category: 'limpeza',
    command: 'Clear-RecycleBin -Force -ErrorAction SilentlyContinue',
    shellType: 'PowerShell',
    requiresAdmin: false,
    isCritical: true,
    warningMessage: 'Todos os arquivos na Lixeira de todos os discos rígidos serão excluídos permanentemente.',
    description: 'Esvazia a Lixeira do Windows de todas as unidades sem pedir confirmação gráfica.',
    simulatedOutput: 'PS C:\\> Clear-RecycleBin -Force\nLixeira esvaziada em todas as unidades ativas.'
  },

  // 6. Processos e Desempenho
  {
    id: 'proc-restart-explorer',
    name: 'Reiniciar Windows Explorer',
    category: 'processos',
    command: 'taskkill /f /im explorer.exe & start explorer.exe',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Reinicia a barra de tarefas e a área de trabalho se estiverem travadas ou lentas.',
    simulatedOutput: 'SUCESSO: o processo "explorer.exe" com PID 4820 foi finalizado.\nIniciando nova instância do Windows Explorer...'
  },
  {
    id: 'proc-top-cpu',
    name: 'Listar Top 10 Processos por Uso de CPU',
    category: 'processos',
    command: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 ProcessName, Id, CPU, WorkingSet',
    shellType: 'PowerShell',
    requiresAdmin: false,
    isCritical: false,
    description: 'Identifica quais programas ou serviços estão consumindo mais ciclos de processador.',
    simulatedOutput: 'ProcessName        Id       CPU       WorkingSet\n-----------        --       ---       ----------\nchrome           9412    142.31        420831232\nCode             5124     89.15        314572800\nmsedge           3218     45.20        219152384\nsystem              4     28.40          1048576\nexplorer         4820     14.12        112450000'
  },
  {
    id: 'proc-kill-notresponding',
    name: 'Encerrar Todos os Processos Não Respondendo',
    category: 'processos',
    command: 'taskkill /F /FI "STATUS eq NOT RESPONDING"',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Encerra imediatamente qualquer janela congelada ou programa que parou de responder.',
    description: 'Encerra de forma forçada processos com status de travamento (Not Responding).',
    simulatedOutput: 'Filtrando tarefas...\nSUCESSO: O processo "app_congelado.exe" com PID 11280 foi finalizado.'
  },
  {
    id: 'proc-open-resmon',
    name: 'Abrir Monitor de Recursos (Resmon)',
    category: 'processos',
    command: 'resmon.exe',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Abre a ferramenta nativa avançada para análise de Disco, Rede, Memória e Threads de CPU.',
    simulatedOutput: 'Monitor de Recursos do Windows iniciado com sucesso.'
  },

  // 7. Firewall e Segurança
  {
    id: 'sec-defender-status',
    name: 'Verificar Status do Windows Defender',
    category: 'seguranca',
    command: 'Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated',
    shellType: 'PowerShell',
    requiresAdmin: true,
    isCritical: false,
    description: 'Checa se a proteção em tempo real e as assinaturas de vírus estão ativas e atualizadas.',
    simulatedOutput: 'AntivirusEnabled RealTimeProtectionEnabled AntivirusSignatureLastUpdated\n---------------- ------------------------- ----------------------------\n            True                      True          2026-10-28 14:22:10'
  },
  {
    id: 'sec-quick-scan',
    name: 'Iniciar Varredura Rápida do Defender',
    category: 'seguranca',
    command: 'Start-MpScan -ScanType QuickScan',
    shellType: 'PowerShell',
    requiresAdmin: true,
    isCritical: false,
    description: 'Dispara um escaneamento antivírus rápido em segundo plano.',
    simulatedOutput: 'PS C:\\> Start-MpScan -ScanType QuickScan\nVarredura rápida do Microsoft Defender Antivirus iniciada.\nNenhuma ameaça detectada até o momento.'
  },
  {
    id: 'sec-firewall-status',
    name: 'Consultar Status do Firewall',
    category: 'seguranca',
    command: 'netsh advfirewall show allprofiles state',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Exibe se o firewall está ativado nos perfis Domínio, Privado e Público.',
    simulatedOutput: 'Estado do Perfil de Domínio: LIGADO\nEstado do Perfil Privado: LIGADO\nEstado do Perfil Público: LIGADO\nOk.'
  },
  {
    id: 'sec-firewall-reset',
    name: 'Restaurar Regras do Firewall Padrão',
    category: 'seguranca',
    command: 'netsh advfirewall reset',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Isso apagará todas as regras personalizadas de portas e aplicativos criadas no Firewall.',
    description: 'Restaura a política e todas as regras do Windows Defender Firewall para os padrões de fábrica.',
    simulatedOutput: 'Ok.\nAs regras e configurações padrão do firewall foram restauradas com êxito.'
  },

  // 8. Discos e Partições
  {
    id: 'disk-get-volumes',
    name: 'Listar Volumes, Letras e Espaço Livre',
    category: 'discos',
    command: 'Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystem, SizeRemaining, Size',
    shellType: 'PowerShell',
    requiresAdmin: false,
    isCritical: false,
    description: 'Mostra todas as partições do computador, sistema de arquivos (NTFS/FAT32) e espaço disponível.',
    simulatedOutput: 'DriveLetter FileSystemLabel FileSystem SizeRemaining          Size\n----------- --------------- ---------- -------------          ----\nC           Windows         NTFS        182451912704  511255871488\nD           Dados           NTFS        450239182848 1000204886016'
  },
  {
    id: 'disk-trim-optimize',
    name: 'Otimizar Unidade SSD (Comando TRIM)',
    category: 'discos',
    command: 'Optimize-Volume -DriveLetter C -ReTrim -Verbose',
    shellType: 'PowerShell',
    requiresAdmin: true,
    isCritical: false,
    description: 'Envia o comando TRIM para as células do SSD para manter o desempenho e a vida útil.',
    simulatedOutput: 'VERBOSE: Chamando o comando TRIM para otimizar o volume C:...\nVERBOSE: Otimização da unidade SSD concluída com êxito.'
  },
  {
    id: 'disk-open-diskmgmt',
    name: 'Abrir Gerenciamento de Disco (MSC)',
    category: 'discos',
    command: 'diskmgmt.msc',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Abre a interface gráfica para redimensionar, formatar e criar partições.',
    simulatedOutput: 'Gerenciador de Discos (diskmgmt.msc) aberto.'
  },

  // 9. Serviços e Inicialização
  {
    id: 'srv-list-running',
    name: 'Listar Serviços do Windows em Execução',
    category: 'servicos',
    command: 'Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object -First 15 Name, DisplayName',
    shellType: 'PowerShell',
    requiresAdmin: false,
    isCritical: false,
    description: 'Mostra os principais serviços ativos consumindo recursos no momento.',
    simulatedOutput: 'Name            DisplayName\n----            -----------\nAudioSrv        Áudio do Windows\nDhcp            Cliente DHCP\nDnscache        Cliente DNS\nLanmanWorkst... Estação de Trabalho\nwuauserv        Windows Update'
  },
  {
    id: 'srv-open-services',
    name: 'Abrir Console de Serviços (services.msc)',
    category: 'servicos',
    command: 'services.msc',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Abre a lista completa de serviços para iniciar, pausar ou alterar tipo de inicialização.',
    simulatedOutput: 'Console de Serviços (services.msc) iniciado.'
  },
  {
    id: 'srv-restart-spooler',
    name: 'Reiniciar Spooler de Impressão (Destravar Impressora)',
    category: 'servicos',
    command: 'net stop spooler && del /q /f /s "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Cancela todos os trabalhos de impressão pendentes e reinicia o serviço de fila da impressora.',
    description: 'Resolve falhas de impressões presas na fila e recarrega o serviço de impressão.',
    simulatedOutput: 'O serviço de Spooler de Impressão está sendo finalizado.\nO serviço foi finalizado com êxito.\nFila temporária limpa.\nO serviço de Spooler de Impressão foi iniciado com êxito.'
  },
  {
    id: 'srv-open-msconfig',
    name: 'Abrir Configuração do Sistema (MSConfig)',
    category: 'servicos',
    command: 'msconfig',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Configurações de boot, inicialização limpa (modo de segurança) e serviços de terceiros.',
    simulatedOutput: 'Janela do MSConfig aberta com sucesso.'
  },

  // 10. Informações do Sistema
  {
    id: 'sys-systeminfo',
    name: 'Resumo Geral do Computador (systeminfo)',
    category: 'sistema',
    command: 'systeminfo | findstr /B /C:"Nome do host" /C:"Nome do sistema" /C:"Fabricante" /C:"Modelo" /C:"Tipo" /C:"Processador(es)" /C:"Memória física total"',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Coleta informações de modelo da máquina, processador, RAM total e versão do Windows.',
    simulatedOutput: 'Nome do host:                             WINTOOLS-PRO\nNome do sistema operacional:               Microsoft Windows 11 Pro\nFabricante do sistema:                     Dell Inc.\nModelo do sistema:                         XPS 15\nTipo de sistema:                           x64-based PC\nProcessador(es):                           1 Processador(es) Instalado(s).\n                                           [01]: Intel64 Family 6 Model 158 ~2.60GHz\nMemória física total:                      16.240 MB'
  },
  {
    id: 'sys-bios-serial',
    name: 'Obter Número de Série e BIOS',
    category: 'sistema',
    command: 'wmic bios get serialnumber, smbiosbiosversion',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Útil para acionar garantia ou inventário de hardware do computador.',
    simulatedOutput: 'SMBIOSBIOSVersion  SerialNumber\n1.14.0             9K2XLP3'
  },
  {
    id: 'sys-winver',
    name: 'Exibir Versão Oficial do Windows (WinVer)',
    category: 'sistema',
    command: 'winver',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Abre a caixa de diálogo com o número exato da compilação (Build) e canal de atualização.',
    simulatedOutput: 'Caixa de diálogo "Sobre o Windows" exibida.'
  },
  {
    id: 'sys-dxdiag',
    name: 'Diagnóstico do DirectX e Placa de Vídeo',
    category: 'sistema',
    command: 'dxdiag /dontskip',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Verifica acelerador gráfico, drivers de áudio e versões de suporte a DirectX.',
    simulatedOutput: 'Ferramenta de Diagnóstico do DirectX executada.'
  },

  // 11. Utilitários
  {
    id: 'util-god-mode',
    name: 'Criar Pasta "God Mode" na Área de Trabalho',
    category: 'utilitarios',
    command: 'mkdir "%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"',
    shellType: 'CMD',
    requiresAdmin: false,
    isCritical: false,
    description: 'Cria uma pasta com mais de 200 ferramentas e atalhos ocultos do Painel de Controle.',
    simulatedOutput: 'Pasta "GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}" criada na sua Área de Trabalho.'
  },
  {
    id: 'util-open-regedit',
    name: 'Abrir Editor do Registro (Regedit)',
    category: 'utilitarios',
    command: 'regedit.exe',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Abre o editor de chaves HKEY_LOCAL_MACHINE e HKEY_CURRENT_USER.',
    simulatedOutput: 'Editor do Registro do Windows aberto.'
  },
  {
    id: 'util-open-devmgmt',
    name: 'Abrir Gerenciador de Dispositivos',
    category: 'utilitarios',
    command: 'devmgmt.msc',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Verifica drivers em falta, pontos de exclamação e dispositivos de hardware.',
    simulatedOutput: 'Gerenciador de Dispositivos (devmgmt.msc) aberto.'
  },
  {
    id: 'util-open-eventvwr',
    name: 'Visualizador de Eventos (Logs do Windows)',
    category: 'utilitarios',
    command: 'eventvwr.msc',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Inspeciona logs de erros críticos, travamentos e avisos do sistema operacional.',
    simulatedOutput: 'Visualizador de Eventos aberto.'
  },

  // 12. Automação
  {
    id: 'auto-maintenance-pack',
    name: 'Rotina de Manutenção Rápida (SFC + DNS + Temp)',
    category: 'automacao',
    command: 'ipconfig /flushdns & sfc /scannow & cleanmgr /lowdisk',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Executa em sequência a limpeza de cache DNS, verificação de integridade e limpeza rápida.',
    description: 'Pacote combinado de comandos para manutenção preventiva rápida em máquinas de clientes.',
    simulatedOutput: '[1/3] Limpando cache DNS... OK!\n[2/3] Iniciando verificação SFC... OK!\n[3/3] Iniciando limpeza de arquivos temporários... OK!'
  },
  {
    id: 'auto-network-reset-full',
    name: 'Restauração Completa de Rede (Script)',
    category: 'automacao',
    command: 'netsh winsock reset & netsh int ip reset & ipconfig /release & ipconfig /renew & ipconfig /flushdns',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: true,
    warningMessage: 'Reinicia toda a pilha de rede, DNS e conexões de sockets. Requer reinicialização do Windows.',
    description: 'Script clássico de técnicos de suporte para solucionar 99% das quedas de internet e erros de DNS.',
    simulatedOutput: 'Redefinindo Winsock... Concluído.\nRedefinindo TCP/IP... Concluído.\nRenovando concessão DHCP... Concluído.\nCache DNS limpo. Por favor, reinicie seu computador.'
  },
  {
    id: 'auto-battery-power-health',
    name: 'Diagnóstico de Energia e Desempenho',
    category: 'automacao',
    command: 'powercfg /energy /output "%USERPROFILE%\\Desktop\\relatorio_energia.html"',
    shellType: 'CMD',
    requiresAdmin: true,
    isCritical: false,
    description: 'Monitora o sistema por 60 segundos e gera relatório com erros de eficiência energética.',
    simulatedOutput: 'Habilitando rastreamento de energia por 60 segundos...\nAnálise concluída.\nArquivo salvo em: C:\\Users\\Usuario\\Desktop\\relatorio_energia.html'
  }
];

export const QUICK_SHORTCUTS = [
  { name: 'Gerenciador de Tarefas', command: 'taskmgr', icon: 'Activity' },
  { name: 'Configurações de Tela', command: 'start ms-settings:display', icon: 'Monitor' },
  { name: 'Gerenciador de Dispositivos', command: 'devmgmt.msc', icon: 'HardDrive' },
  { name: 'Serviços do Windows', command: 'services.msc', icon: 'Settings' },
  { name: 'Gerenciamento de Disco', command: 'diskmgmt.msc', icon: 'Disc' },
  { name: 'Painel de Controle Clássico', command: 'control.exe', icon: 'Grid' },
  { name: 'Editor de Registro (Regedit)', command: 'regedit.exe', icon: 'Edit3' }
];
