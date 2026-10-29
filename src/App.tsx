import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  COMMANDS
} from './data/commandsData';
import {
  CategoryId,
  CommandItem,
  ActiveTab,
  TerminalLog
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandCard } from './components/CommandCard';
import { TerminalConsole } from './components/TerminalConsole';
import { BrightnessController } from './components/BrightnessController';
import { QuickLauncher } from './components/QuickLauncher';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ScriptBuilderModal } from './components/ScriptBuilderModal';
import { DesktopCodeViewer } from './components/DesktopCodeViewer';
import { Sparkles, Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('commands');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Favoritos armazenados localmente
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('wintools_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set(['net-flushdns', 'diag-sfc-scannow', 'clean-temp-files']);
    } catch {
      return new Set(['net-flushdns', 'diag-sfc-scannow']);
    }
  });

  // Itens selecionados para o montador de script (.BAT / .PS1)
  const [selectedScriptItems, setSelectedScriptItems] = useState<string[]>([
    'net-flushdns',
    'diag-sfc-scannow',
    'clean-temp-files'
  ]);
  const [isScriptBuilderOpen, setIsScriptBuilderOpen] = useState(false);

  // Modal de confirmação para comandos críticos
  const [criticalCommandToRun, setCriticalCommandToRun] = useState<CommandItem | null>(null);

  // Logs do Terminal
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      command: 'Write-Host "WinTools Pro Console Pronto"',
      shellType: 'PowerShell',
      status: 'success',
      output: 'WinTools Pro v2.4 iniciado com sucesso.\nAmbiente pronto. Digite comandos ou clique em Executar.'
    }
  ]);

  // Sincronizar favoritos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wintools_favorites', JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e);
    }
  }, [favorites]);

  // Alternar favorito
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Alternar seleção no script
  const handleToggleScriptItem = (id: string) => {
    setSelectedScriptItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearScriptSelection = () => {
    setSelectedScriptItems([]);
  };

  // Execução de Comandos
  const handleRequestExecute = (cmd: CommandItem) => {
    if (cmd.isCritical) {
      setCriticalCommandToRun(cmd);
    } else {
      executeCommand(cmd);
    }
  };

  const handleConfirmCriticalExecute = () => {
    if (criticalCommandToRun) {
      executeCommand(criticalCommandToRun);
      setCriticalCommandToRun(null);
    }
  };

  const executeCommand = (cmd: CommandItem) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const logId = `log-${Date.now()}`;

    // Adiciona log inicial
    const newLog: TerminalLog = {
      id: logId,
      timestamp,
      command: cmd.command,
      shellType: cmd.shellType,
      status: 'success',
      output: cmd.simulatedOutput || `Comando finalizado com êxito (Código de saída: 0).\nOperação: ${cmd.name}`
    };

    setTerminalLogs((prev) => [...prev, newLog]);
  };

  // Execução manual no input do console
  const handleManualExecute = (input: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === 'cls' || trimmed.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      return;
    }

    // Procura se corresponde a algum comando da base
    const matched = COMMANDS.find(
      (c) => c.command.toLowerCase() === trimmed.toLowerCase() || c.name.toLowerCase() === trimmed.toLowerCase()
    );

    let output = '';
    if (matched) {
      output = matched.simulatedOutput || 'Comando executado com êxito (Código: 0).';
    } else if (trimmed.startsWith('ping')) {
      output = `Disparando pacotes...\nResposta de 8.8.8.8: bytes=32 tempo=12ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=13ms TTL=117\nPacotes: Enviados = 2, Recebidos = 2, Perdidos = 0 (0% de perda).`;
    } else if (trimmed.startsWith('ipconfig')) {
      output = `Configuração de IP do Windows\nAdaptador Ethernet:\n   Endereço IPv4. . . . . . . . . : 192.168.1.105\n   Máscara de Sub-rede. . . . . . : 255.255.255.0\n   Gateway Padrão. . . . . . . . : 192.168.1.1`;
    } else {
      output = `C:\\Windows\\system32> ${trimmed}\nComando simulado e processado com êxito pelo WinTools Pro Engine.`;
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        timestamp,
        command: trimmed,
        shellType: trimmed.includes('-') || trimmed.includes('$') ? 'PowerShell' : 'CMD',
        status: 'success',
        output
      }
    ]);
  };

  // Ajuste de Brilho WMI
  const handleExecuteWmiBrightness = (cmd: string, level: number) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `wmi-${Date.now()}`,
        timestamp,
        command: cmd,
        shellType: 'PowerShell',
        status: 'success',
        output: `Brilho do monitor ajustado via WMI para ${level}%.\nReturnValue: 0 (Sucesso)`
      }
    ]);
  };

  // Diagnóstico de Rede em 1 Clique
  const handleRunNetworkDiagnostic = () => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const output = `[1/4] ipconfig /flushdns -> Cache DNS liberado com êxito.\n[2/4] ping 8.8.8.8 -> 4 pacotes recebidos, 0% perda, latência média 14ms.\n[3/4] nslookup google.com -> Resolvido para 142.250.190.46 via 1.1.1.1.\n[4/4] Gateway Padrão 192.168.1.1 -> Resposta em 1ms.\nStatus Geral da Conexão: EXCELENTE.`;

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `net-diag-${Date.now()}`,
        timestamp,
        command: 'wintools-diagnostic --network',
        shellType: 'PowerShell',
        status: 'success',
        output
      }
    ]);
  };

  // Relatório do Sistema em 1 Clique
  const handleRunSystemReport = () => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const output = `[Informações do Sistema WinTools Pro]\nSistema Operacional: Microsoft Windows 11 Pro (64-bit)\nProcessador: Intel(R) Core(TM) i7 / AMD Ryzen (8 Cores)\nMemória RAM: 16.0 GB Instalada (Uso: 38%)\nUnidade C: 512 GB SSD NVMe (182 GB livres, Trim: OK)\nServiços Ativos: 84 | Processos em Execução: 142\nStatus de Integridade: Íntegro (SFC: OK, Defender: Ativo)`;

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `sys-report-${Date.now()}`,
        timestamp,
        command: 'Get-ComputerInfo | Select-Object CsName, WindowsVersion, TotalPhysicalMemory',
        shellType: 'PowerShell',
        status: 'success',
        output
      }
    ]);
  };

  // Execução de Atalhos MSC / ferramentas nativas
  const handleExecuteShortcut = (cmd: string, name: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `sc-${Date.now()}`,
        timestamp,
        command: cmd,
        shellType: 'CMD',
        status: 'success',
        output: `Iniciando utilitário: ${name} (${cmd})...\nJanela carregada com sucesso.`
      }
    ]);
  };

  // Filtragem dos comandos
  const filteredCommands = COMMANDS.filter((cmd) => {
    // Filtro de Favoritos
    if (activeTab === 'favorites') {
      if (!favorites.has(cmd.id)) return false;
    }

    // Filtro de Categoria
    if (activeTab === 'commands' && selectedCategory !== 'todas') {
      if (cmd.category !== selectedCategory) return false;
    }

    // Filtro de Busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inName = cmd.name.toLowerCase().includes(q);
      const inCommand = cmd.command.toLowerCase().includes(q);
      const inDesc = cmd.description.toLowerCase().includes(q);
      if (!inName && !inCommand && !inDesc) return false;
    }

    return true;
  });

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Navbar Superior */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.size}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenScriptBuilder={() => setIsScriptBuilderOpen(true)}
      />

      {/* Área Central: Sidebar + Painel de Conteúdo */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar com as 12 Categorias */}
        <Sidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          favoritesCount={favorites.size}
          onOpenScriptBuilder={() => setIsScriptBuilderOpen(true)}
        />

        {/* Viewport Principal */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          {activeTab === 'desktop-code' ? (
            <DesktopCodeViewer />
          ) : (
            <div className="flex-1 p-6 space-y-5">
              {/* Faixa de Atalhos e Diagnósticos em 1 Clique */}
              <QuickLauncher
                onExecuteShortcut={handleExecuteShortcut}
                onRunNetworkDiagnostic={handleRunNetworkDiagnostic}
                onRunSystemReport={handleRunSystemReport}
              />

              {/* Controlador de Brilho WMI (Exibido se selecionado Brilho ou Todas) */}
              {(selectedCategory === 'todas' || selectedCategory === 'brilho') && (
                <BrightnessController onExecuteWmi={handleExecuteWmiBrightness} />
              )}

              {/* Título da Seção Atual e Quantidade */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>
                      {activeTab === 'favorites'
                        ? 'Comandos Favoritados'
                        : selectedCategory === 'todas'
                        ? 'Todos os Comandos Disponíveis'
                        : currentCategoryInfo?.name || 'Comandos'}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                      {filteredCommands.length} {filteredCommands.length === 1 ? 'item' : 'itens'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeTab === 'favorites'
                      ? 'Seus atalhos e ferramentas salvas para acesso rápido.'
                      : selectedCategory === 'todas'
                      ? 'Exploração geral de todos os comandos CMD e PowerShell do guia.'
                      : currentCategoryInfo?.description}
                  </p>
                </div>
              </div>

              {/* Grid de Cards de Comandos */}
              {filteredCommands.length === 0 ? (
                <div className="py-16 text-center border rounded-2xl border-dashed border-slate-800 bg-slate-900/40">
                  <TerminalIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    Nenhum comando encontrado com os filtros atuais.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tente buscar por outro termo ou selecione "Todos os Comandos" na barra lateral.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {filteredCommands.map((command) => (
                    <CommandCard
                      key={command.id}
                      command={command}
                      isFavorite={favorites.has(command.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onExecute={handleRequestExecute}
                      isInScript={selectedScriptItems.includes(command.id)}
                      onToggleScriptItem={handleToggleScriptItem}
                    />
                  ))}
                </div>
              )}

              {/* Terminal Embutido (Sempre acessível na parte inferior) */}
              <div className="pt-3">
                <TerminalConsole
                  logs={terminalLogs}
                  onClearLogs={() => setTerminalLogs([])}
                  onExecuteManual={handleManualExecute}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação para Comandos Críticos */}
      <ConfirmationModal
        command={criticalCommandToRun}
        isOpen={Boolean(criticalCommandToRun)}
        onClose={() => setCriticalCommandToRun(null)}
        onConfirm={handleConfirmCriticalExecute}
      />

      {/* Modal Gerador de Scripts (.BAT & .PS1) */}
      <ScriptBuilderModal
        isOpen={isScriptBuilderOpen}
        onClose={() => setIsScriptBuilderOpen(false)}
        selectedCommandIds={selectedScriptItems}
        onToggleCommand={handleToggleScriptItem}
        onClearSelection={handleClearScriptSelection}
      />
    </div>
  );
}
