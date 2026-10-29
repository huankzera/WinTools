import React from 'react';
import { Search, Star, Moon, Sun, Terminal, Code2, Download, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenScriptBuilder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenScriptBuilder
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3.5 border-b transition-colors bg-slate-900 border-slate-800 text-white">
      {/* Zona 1: Marca e Subtítulo simples */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('commands')}
          className="flex items-center gap-2.5 text-left group transition"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
              WinTools Pro
            </span>
            <span className="text-xs text-slate-400 block -mt-0.5">
              Ferramentas do Windows
            </span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Privilégios: Admin Pronto</span>
        </div>
      </div>

      {/* Zona 2: Barra de Busca Central */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar comandos CMD, PowerShell, serviços, rede, diagnósticos..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-700"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Zona 3: Ações e Alternadores */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Favoritos */}
        <button
          onClick={() => setActiveTab(activeTab === 'favorites' ? 'commands' : 'favorites')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Ver comandos favoritados"
        >
          <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span className="hidden sm:inline">Favoritos</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded bg-slate-900 text-[11px] font-mono tabular-nums">
            {favoritesCount}
          </span>
        </button>

        {/* Gerador de Script */}
        <button
          onClick={onOpenScriptBuilder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors whitespace-nowrap"
          title="Gerar script .BAT ou .PS1 com comandos selecionados"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Gerar .BAT / .PS1</span>
        </button>

        {/* Código Desktop Python & PS1 */}
        <button
          onClick={() => setActiveTab(activeTab === 'desktop-code' ? 'commands' : 'desktop-code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
            activeTab === 'desktop-code'
              ? 'bg-sky-500 text-white border-sky-400'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Ver e baixar código desktop em CustomTkinter e PowerShell puro"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Código Desktop</span>
        </button>

        {/* Alternador de Tema */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title={isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          aria-label="Alternar tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
