import React, { useState } from 'react';
import { Copy, Check, Play, Star, ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';
import { CommandItem } from '../types';

interface CommandCardProps {
  command: CommandItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onExecute: (command: CommandItem) => void;
  isInScript: boolean;
  onToggleScriptItem: (id: string) => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  isFavorite,
  onToggleFavorite,
  onExecute,
  isInScript,
  onToggleScriptItem
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl border p-4 transition-all duration-200 bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-sky-950/20">
      {/* Linha Superior: Nome, Badges e Ações de Cabeçalho */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
              {command.name}
            </h3>

            {/* Tag de Administrador */}
            {command.requiresAdmin && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <ShieldAlert className="w-3 h-3" />
                Admin
              </span>
            )}

            {/* Tag ShellType */}
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
              {command.shellType}
            </span>

            {/* Tag Crítico / Perigoso */}
            {command.isCritical && (
              <span className="text-[10px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                Crítico
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {command.description}
          </p>
        </div>

        {/* Botão Favoritar e Adicionar ao Script */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleScriptItem(command.id)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isInScript
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isInScript ? 'Remover do montador de script' : 'Adicionar ao montador de script (.BAT/.PS1)'}
          >
            {isInScript ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleFavorite(command.id)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Caixa de Código do Comando */}
      <div className="relative my-3 rounded-lg overflow-hidden bg-slate-950/90 border border-slate-800/90 group/box">
        <div className="flex items-center justify-between px-3 py-2 text-[12px] font-mono text-sky-300 break-all select-all">
          <span className="select-none text-slate-600 mr-2 shrink-0">
            {command.shellType === 'PowerShell' ? 'PS>' : 'C:>'}
          </span>
          <span className="flex-1 font-mono tracking-tight">{command.command}</span>
        </div>
      </div>

      {/* Barra Inferior com Botões de Ação */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>

        <button
          onClick={() => onExecute(command)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all ${
            command.isCritical
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/30'
              : 'bg-sky-600 hover:bg-sky-500 shadow-sky-950/30'
          }`}
          title={command.isCritical ? 'Atenção: Ação crítica, requer confirmação' : 'Simular execução no console'}
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Executar</span>
        </button>
      </div>
    </div>
  );
};
