import React from 'react';
import { AlertTriangle, ShieldAlert, X, Play } from 'lucide-react';
import { CommandItem } from '../types';

interface ConfirmationModalProps {
  command: CommandItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  command,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !command) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden text-slate-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirmação de Segurança</h3>
              <p className="text-xs text-rose-300">Comando com impacto crítico no sistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Ferramenta Selecionada
            </span>
            <h4 className="text-sm font-bold text-white">{command.name}</h4>
            <p className="text-xs text-slate-300 mt-1">{command.description}</p>
          </div>

          {command.warningMessage && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{command.warningMessage}</div>
            </div>
          )}

          {/* Sintaxe Exata */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1.5">
              Comando a ser executado:
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-sky-400 break-all select-all">
              {command.command}
            </div>
          </div>
        </div>

        {/* Rodapé com Botões */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Confirmar e Executar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
