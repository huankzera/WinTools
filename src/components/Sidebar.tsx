import React from 'react';
import {
  Power,
  Wifi,
  Sun,
  Wrench,
  Trash2,
  Cpu,
  ShieldAlert,
  HardDrive,
  Layers,
  Info,
  Sliders,
  Terminal,
  Star,
  Code2,
  FileCode2,
  CheckSquare
} from 'lucide-react';
import { CategoryId, CategoryInfo, ActiveTab } from '../types';
import { COMMANDS } from '../data/commandsData';

interface SidebarProps {
  categories: CategoryInfo[];
  selectedCategory: CategoryId | 'todas';
  setSelectedCategory: (cat: CategoryId | 'todas') => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  favoritesCount: number;
  onOpenScriptBuilder: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Power,
  Wifi,
  Sun,
  Wrench,
  Trash2,
  Cpu,
  ShieldAlert,
  HardDrive,
  Layers,
  Info,
  Sliders,
  Terminal
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenScriptBuilder
}) => {
  return (
    <aside className="w-64 shrink-0 flex flex-col border-r bg-slate-900/95 border-slate-800 text-slate-300 select-none">
      {/* Topo do Menu: Atalhos rápidos */}
      <div className="p-3 border-b border-slate-800 space-y-1">
        <button
          onClick={() => {
            setActiveTab('commands');
            setSelectedCategory('todas');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'commands' && selectedCategory === 'todas'
              ? 'bg-sky-600 text-white font-semibold'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-4 h-4 text-sky-400" />
            <span>Todos os Comandos</span>
          </div>
          <span className="text-[11px] font-mono opacity-80">{COMMANDS.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>Favoritos</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
            {favoritesCount}
          </span>
        </button>

        <button
          onClick={onOpenScriptBuilder}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-800/80 text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>Gerador de Scripts (.BAT/.PS1)</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('desktop-code')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'desktop-code'
              ? 'bg-sky-600 text-white font-semibold'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Código Desktop (Python & PS1)</span>
          </div>
        </button>
      </div>

      {/* Título de Seções */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
          12 Categorias do Windows
        </span>
      </div>

      {/* Lista de Categorias com Rolagem Suave */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Terminal;
          const count = COMMANDS.filter((c) => c.category === cat.id).length;
          const isSelected = activeTab === 'commands' && selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab('commands');
                setSelectedCategory(cat.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isSelected
                  ? 'bg-sky-600/90 text-white shadow-sm'
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
              title={cat.description}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{cat.shortName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 ml-2 shrink-0">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rodapé da Barra Lateral */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Versão: v2.4 Pro</span>
          <span className="text-emerald-400 font-mono">Pronto</span>
        </div>
      </div>
    </aside>
  );
};
