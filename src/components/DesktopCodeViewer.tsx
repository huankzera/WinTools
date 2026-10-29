import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, FileCode, Package, Layers } from 'lucide-react';
import {
  PYTHON_DESKTOP_SCRIPT,
  REQUIREMENTS_TXT,
  PYINSTALLER_GUIDE,
  STANDALONE_POWERSHELL_SCRIPT
} from '../data/desktopSourceCode';

type FileTab = 'python' | 'requirements' | 'pyinstaller' | 'powershell';

export const DesktopCodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<FileTab>('python');
  const [copied, setCopied] = useState(false);

  const getFileDetails = () => {
    switch (activeFile) {
      case 'python':
        return {
          filename: 'wintools_pro.py',
          title: 'Código Desktop Python (CustomTkinter)',
          desc: 'Aplicativo desktop completo com interface moderna, abas de categorias, favoritos persistentes, slider WMI e terminal embutido.',
          code: PYTHON_DESKTOP_SCRIPT,
          mime: 'text/x-python;charset=utf-8'
        };
      case 'requirements':
        return {
          filename: 'requirements.txt',
          title: 'Dependências Python (requirements.txt)',
          desc: 'Bibliotecas necessárias para executar a versão desktop com CustomTkinter.',
          code: REQUIREMENTS_TXT,
          mime: 'text/plain;charset=utf-8'
        };
      case 'pyinstaller':
        return {
          filename: 'compilar_exe.bat',
          title: 'Guia e Script de Compilação PyInstaller (.exe)',
          desc: 'Instruções e comando pronto para compilar o executável portátil autônomo sem dependências.',
          code: PYINSTALLER_GUIDE,
          mime: 'text/plain;charset=utf-8'
        };
      case 'powershell':
        return {
          filename: 'WinToolsPro.ps1',
          title: 'Versão em PowerShell Puro (GUI WPF / XAML)',
          desc: 'Aplicativo autônomo nativo em PowerShell com interface gráfica que roda sem precisar instalar Python.',
          code: STANDALONE_POWERSHELL_SCRIPT,
          mime: 'text/plain;charset=utf-8'
        };
    }
  };

  const file = getFileDetails();

  const handleCopy = () => {
    navigator.clipboard.writeText(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([file.code], { type: file.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-900/60">
      {/* Cabeçalho da Central de Código Desktop */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-sky-400" />
            <span>Central de Código &amp; Download Desktop</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Baixe o script Python com CustomTkinter ou a versão nativa em PowerShell puro para usar no seu Windows
          </p>
        </div>

        {/* Botões de Ação do Arquivo Atual */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950/30 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar {file.filename}</span>
          </button>
        </div>
      </div>

      {/* Abas dos Arquivos Disponíveis */}
      <div className="flex items-center gap-1 border-b border-slate-800 mb-3 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveFile('python')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeFile === 'python'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>wintools_pro.py (CustomTkinter)</span>
        </button>

        <button
          onClick={() => setActiveFile('powershell')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeFile === 'powershell'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>WinToolsPro.ps1 (PowerShell Puro WPF)</span>
        </button>

        <button
          onClick={() => setActiveFile('requirements')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeFile === 'requirements'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-amber-400" />
          <span>requirements.txt</span>
        </button>

        <button
          onClick={() => setActiveFile('pyinstaller')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeFile === 'pyinstaller'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Guia PyInstaller (.EXE)</span>
        </button>
      </div>

      {/* Descrição contextual */}
      <div className="mb-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span>{file.desc}</span>
        <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
          Tamanho: {(file.code.length / 1024).toFixed(1)} KB
        </span>
      </div>

      {/* Bloco de Código com Rolagem Suave */}
      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col min-h-0 shadow-inner">
        <pre className="flex-1 p-4 font-mono text-xs text-sky-300/90 overflow-y-auto leading-relaxed custom-scrollbar selection:bg-sky-900 selection:text-white">
          {file.code}
        </pre>
      </div>
    </div>
  );
};
