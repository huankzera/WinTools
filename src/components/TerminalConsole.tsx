import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Trash2, Maximize2, Minimize2, Send, Check } from 'lucide-react';
import { TerminalLog } from '../types';

interface TerminalConsoleProps {
  logs: TerminalLog[];
  onClearLogs: () => void;
  onExecuteManual: (command: string) => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  onClearLogs,
  onExecuteManual
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecuteManual(inputVal.trim());
    setInputVal('');
  };

  const handleCopyHistory = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] ${l.shellType}> ${l.command}\n${l.output}\n`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col border rounded-xl overflow-hidden transition-all duration-200 bg-slate-950 border-slate-800 shadow-xl ${
        isExpanded ? 'fixed inset-4 z-50' : 'h-64'
      }`}
    >
      {/* Barra de Título do Terminal estilo Windows Terminal */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          {/* Abas simuladas */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-t-md bg-slate-950 text-sky-400 border-t border-x border-slate-800 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>PowerShell 7.x / CMD Console</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            WinTools Pro Console Engine
          </span>
        </div>

        {/* Controles de Ação do Terminal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyHistory}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copiar histórico completo do console"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Limpar tela do terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Restaurar tamanho' : 'Maximizar terminal'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Janela de Saída com Rolagem */}
      <div
        ref={scrollRef}
        className="flex-1 p-3.5 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar text-slate-200"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 py-6 text-center select-none">
            <p>Windows PowerShell</p>
            <p>Copyright (C) Microsoft Corporation. Todos os direitos reservados.</p>
            <p className="mt-2 text-slate-600">
              Nenhum comando executado ainda. Clique em "Executar" em qualquer card ou digite abaixo.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="text-slate-600">[{log.timestamp}]</span>
                <span className="text-sky-400 font-semibold">{log.shellType} &gt;</span>
                <span className="text-white font-bold select-all">{log.command}</span>
                {log.status === 'running' && (
                  <span className="text-amber-400 animate-pulse text-[10px]">Executando...</span>
                )}
              </div>
              <pre className="pl-4 border-l-2 border-slate-800 whitespace-pre-wrap font-mono text-slate-300 text-[11px] leading-relaxed selection:bg-sky-900 selection:text-white">
                {log.output}
              </pre>
            </div>
          ))
        )}
      </div>

      {/* Campo de Entrada de Comando Interativo */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-slate-900/90 border-t border-slate-800">
        <span className="text-xs font-mono text-sky-400 pl-2 select-none">PS C:\Windows\system32&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Digite um comando CMD ou PowerShell (ex: ipconfig, ping 8.8.8.8, sfc /scannow)..."
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-3 py-1 text-xs rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition"
        >
          <Send className="w-3 h-3" />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};
