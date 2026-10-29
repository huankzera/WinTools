import React, { useState } from 'react';
import { Sun, Copy, Check, Play, Monitor } from 'lucide-react';

interface BrightnessControllerProps {
  onExecuteWmi: (command: string, level: number) => void;
}

export const BrightnessController: React.FC<BrightnessControllerProps> = ({ onExecuteWmi }) => {
  const [level, setLevel] = useState<number>(75);
  const [copied, setCopied] = useState(false);

  const currentWmiCommand = `(Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, ${level})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentWmiCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onExecuteWmi(currentWmiCommand, level);
  };

  return (
    <div className="rounded-xl border p-4 bg-slate-900/90 border-slate-800 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Controle de Brilho via WMI PowerShell</h4>
            <p className="text-xs text-slate-400">
              Altera o brilho do monitor interno via WMI sem precisar abrir o menu do monitor
            </p>
          </div>
        </div>

        {/* Presets Rápidos */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => setLevel(preset)}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                level === preset
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Slider Interativo */}
      <div className="flex items-center gap-4 py-2">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <span className="w-12 text-center text-sm font-bold font-mono text-amber-400 tabular-nums">
          {level}%
        </span>
      </div>

      {/* Comando WMI Dinâmico e Botões */}
      <div className="mt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
        <code className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800/80 truncate flex-1">
          {currentWmiCommand}
        </code>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Aplicar no Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
