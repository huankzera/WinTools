import React from 'react';
import {
  Activity,
  Monitor,
  HardDrive,
  Settings,
  Disc,
  Sliders,
  Sparkles,
  Wifi,
  FileSpreadsheet
} from 'lucide-react';
import { QUICK_SHORTCUTS } from '../data/commandsData';

interface QuickLauncherProps {
  onExecuteShortcut: (command: string, name: string) => void;
  onRunNetworkDiagnostic: () => void;
  onRunSystemReport: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Activity,
  Monitor,
  HardDrive,
  Settings,
  Disc,
  Sliders
};

export const QuickLauncher: React.FC<QuickLauncherProps> = ({
  onExecuteShortcut,
  onRunNetworkDiagnostic,
  onRunSystemReport
}) => {
  return (
    <div className="space-y-3">
      {/* Cards de Ação Unificada em 1 Clique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Diagnóstico de Rede */}
        <div className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Diagnóstico de Rede em 1 Clique</h4>
              <p className="text-[11px] text-slate-400">
                Executa ipconfig, ping, nslookup e teste de gateway em lote
              </p>
            </div>
          </div>
          <button
            onClick={onRunNetworkDiagnostic}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shrink-0 transition"
          >
            Iniciar Teste
          </button>
        </div>

        {/* Relatório de Sistema */}
        <div className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Relatório Completo do Sistema</h4>
              <p className="text-[11px] text-slate-400">
                Gera dados de hardware, volumes de disco e processos ativos
              </p>
            </div>
          </div>
          <button
            onClick={onRunSystemReport}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shrink-0 transition"
          >
            Gerar Dados
          </button>
        </div>
      </div>

      {/* Faixa de Atalhos Rápidos para Ferramentas Nativas (.msc / executáveis) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs select-none custom-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Atalhos MSC:
        </span>
        {QUICK_SHORTCUTS.map((sc) => {
          const Icon = ICON_MAP[sc.icon] || Settings;
          return (
            <button
              key={sc.command}
              onClick={() => onExecuteShortcut(sc.command, sc.name)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
              title={`Executar: ${sc.command}`}
            >
              <Icon className="w-3.5 h-3.5 text-sky-400" />
              <span>{sc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
