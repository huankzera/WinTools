import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Plus, Trash2, Shield, Settings2 } from 'lucide-react';
import { CommandItem } from '../types';
import { COMMANDS } from '../data/commandsData';

interface ScriptBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommandIds: string[];
  onToggleCommand: (id: string) => void;
  onClearSelection: () => void;
}

type ScriptFormat = 'bat' | 'ps1' | 'interactive-bat';

export const ScriptBuilderModal: React.FC<ScriptBuilderModalProps> = ({
  isOpen,
  onClose,
  selectedCommandIds,
  onToggleCommand,
  onClearSelection
}) => {
  const [format, setFormat] = useState<ScriptFormat>('bat');
  const [requireAdminHeader, setRequireAdminHeader] = useState(true);
  const [includePause, setIncludePause] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Comandos selecionados pelo usuário
  const selectedCommands = COMMANDS.filter((c) => selectedCommandIds.includes(c.id));

  // Geração do Script
  const generateScriptContent = (): string => {
    if (selectedCommands.length === 0) {
      return format === 'ps1'
        ? '# Selecione ao menos um comando para gerar o script PowerShell.\nWrite-Host "Nenhum comando selecionado." -ForegroundColor Yellow\n'
        : ':: Selecione ao menos um comando para gerar o script .BAT\n@echo off\necho Nenhum comando selecionado.\npause\n';
    }

    if (format === 'interactive-bat') {
      let content = `@echo off\n:: ====================================================================\n:: WinTools Pro - Menu Interativo de Manutenção Windows\n:: Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n:: ====================================================================\n\nchcp 65001 >nul\ntitle WinTools Pro - Menu Interativo\ncolor 0B\n\n`;

      if (requireAdminHeader) {
        content += `:: Verificação de privilégios de Administrador\nnet session >nul 2>&1\nif %errorlevel% neq 0 (\n    echo [AVISO] Execute este arquivo como Administrador para evitar falhas!\n    echo.\n    pause\n)\n\n`;
      }

      content += `:MENU\ncls\necho ====================================================================\necho                     WINTOOLS PRO - MENU PRINCIPAL\necho ====================================================================\n`;

      selectedCommands.forEach((cmd, idx) => {
        content += `echo  [${idx + 1}] ${cmd.name}\n`;
      });
      content += `echo  [T] Executar TODOS os comandos em sequência\necho  [S] Sair\necho ====================================================================\n`;
      content += `set /p opcao="Escolha uma opcao: "\n\n`;

      selectedCommands.forEach((cmd, idx) => {
        content += `if "%opcao%"=="${idx + 1}" goto OPCAO_${idx + 1}\n`;
      });
      content += `if /i "%opcao%"=="T" goto OPCAO_TODOS\nif /i "%opcao%"=="S" exit\ngoto MENU\n\n`;

      selectedCommands.forEach((cmd, idx) => {
        content += `:OPCAO_${idx + 1}\ncls\necho Executando: ${cmd.name}...\necho Comando: ${cmd.command}\necho --------------------------------------------------------------------\n${cmd.command}\necho --------------------------------------------------------------------\npause\ngoto MENU\n\n`;
      });

      content += `:OPCAO_TODOS\ncls\necho Executando TODOS os comandos selecionados em lote...\n`;
      selectedCommands.forEach((cmd) => {
        content += `echo Executando: ${cmd.name}...\n${cmd.command}\n`;
      });
      content += `echo.\necho Todos os comandos foram concluidos com sucesso!\npause\ngoto MENU\n`;

      return content;
    }

    if (format === 'bat') {
      let content = `@echo off\n:: ====================================================================\n:: WinTools Pro - Script de Automação Batch (.BAT)\n:: Comandos: ${selectedCommands.length}\n:: ====================================================================\n\nchcp 65001 >nul\ntitle WinTools Pro - Automação\ncolor 0A\n\n`;

      if (requireAdminHeader) {
        content += `:: Teste de privilégios de Administrador\nnet session >nul 2>&1\nif %errorlevel% neq 0 (\n    echo [ERRO] Este script requer privilégios de Administrador.\n    echo Clique com o botão direito e selecione "Executar como Administrador".\n    pause\n    exit /b 1\n)\n\n`;
      }

      content += `echo ====================================================================\necho  Iniciando Rotina de Manutenção - WinTools Pro\necho ====================================================================\necho.\n\n`;

      selectedCommands.forEach((cmd, idx) => {
        content += `echo [${idx + 1}/${selectedCommands.length}] Executando: ${cmd.name}...\n`;
        content += `${cmd.command}\necho.\n`;
      });

      content += `echo ====================================================================\necho  Processo finalizado com sucesso!\necho ====================================================================\n`;
      if (includePause) {
        content += `pause\n`;
      }
      return content;
    }

    // Formato PowerShell .ps1
    let content = `# ====================================================================\n# WinTools Pro - Script de Automação PowerShell (.ps1)\n# Comandos: ${selectedCommands.length}\n# ====================================================================\n\n`;

    if (requireAdminHeader) {
      content += `# Verificação de privilégios de Administrador no PowerShell\n$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)\nif (-not $isAdmin) {\n    Write-Warning "Este script necessita ser executado como Administrador!"\n    Start-Sleep -Seconds 3\n}\n\n`;
    }

    content += `Write-Host "=================================================" -ForegroundColor Cyan\nWrite-Host "       WINTOOLS PRO - ROTINA POWERSHELL           " -ForegroundColor Cyan\nWrite-Host "=================================================" -ForegroundColor Cyan\n\n`;

    selectedCommands.forEach((cmd, idx) => {
      content += `Write-Host "[$(${idx + 1})/${selectedCommands.length}] Executando: ${cmd.name}..." -ForegroundColor Yellow\n`;
      content += `try {\n    ${cmd.command}\n} catch {\n    Write-Error "Falha ao executar: $_"\n}\nWrite-Host ""\n`;
    });

    content += `Write-Host "Rotina concluída com sucesso!" -ForegroundColor Green\n`;
    if (includePause) {
      content += `Read-Host "Pressione Enter para fechar"\n`;
    }
    return content;
  };

  const scriptOutput = generateScriptContent();

  const handleDownload = () => {
    const ext = format === 'ps1' ? 'ps1' : 'bat';
    const filename = `wintools_automacao_${Date.now()}.${ext}`;
    const blob = new Blob([scriptOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden text-slate-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Gerador de Scripts (.BAT &amp; PowerShell)
              </h3>
              <p className="text-xs text-slate-400">
                Monte arquivos prontos para execução em lote ou crie um menu interativo com os comandos selecionados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo: Duas Colunas */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Coluna Esquerda: Configurações e Comandos Selecionados (4 colunas) */}
          <div className="md:col-span-5 p-4 border-r border-slate-800 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/50">
            {/* Formato do Script */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Formato do Arquivo
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setFormat('bat')}
                  className={`py-1.5 text-xs font-medium rounded transition ${
                    format === 'bat' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  .BAT Direto
                </button>
                <button
                  onClick={() => setFormat('interactive-bat')}
                  className={`py-1.5 text-xs font-medium rounded transition ${
                    format === 'interactive-bat' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Menu BAT
                </button>
                <button
                  onClick={() => setFormat('ps1')}
                  className={`py-1.5 text-xs font-medium rounded transition ${
                    format === 'ps1' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  .PS1 Script
                </button>
              </div>
            </div>

            {/* Opções de Execução */}
            <div className="space-y-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">Opções do Cabeçalho:</span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={requireAdminHeader}
                  onChange={(e) => setRequireAdminHeader(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>Exigir elevação para Administrador</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includePause}
                  onChange={(e) => setIncludePause(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>Pausar tela ao término (para ler o resultado)</span>
              </label>
            </div>

            {/* Lista de Comandos Selecionados */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Comandos no Script ({selectedCommands.length})
                </label>
                {selectedCommands.length > 0 && (
                  <button
                    onClick={onClearSelection}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpar Todos
                  </button>
                )}
              </div>

              {selectedCommands.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Nenhum comando adicionado ainda.
                  <br />
                  Clique no ícone "+" nos cards da tela principal ou selecione comandos abaixo.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                  {selectedCommands.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-200 truncate">{cmd.name}</p>
                        <p className="font-mono text-[10px] text-slate-500 truncate">{cmd.command}</p>
                      </div>
                      <button
                        onClick={() => onToggleCommand(cmd.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition"
                        title="Remover do script"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sugestões Rápidas de Adição */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                Adicionar rapidamente:
              </span>
              <div className="flex flex-wrap gap-1">
                {COMMANDS.slice(0, 6).map((c) => {
                  const isAdded = selectedCommandIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => onToggleCommand(c.id)}
                      className={`px-2 py-1 rounded text-[11px] transition ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAdded ? '✓ ' : '+ '} {c.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Preview do Script Gerado (7 colunas) */}
          <div className="md:col-span-7 flex flex-col bg-slate-950 min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
              <span className="text-xs font-mono text-slate-400">
                Preview ({format === 'ps1' ? 'script.ps1' : 'script.bat'})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs text-sky-300 overflow-y-auto whitespace-pre leading-relaxed custom-scrollbar selection:bg-sky-900">
              {scriptOutput}
            </pre>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400">
            Pronto para baixar e executar no Windows 10 e 11
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Fechar
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo ({format === 'ps1' ? '.PS1' : '.BAT'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
