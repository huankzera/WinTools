export type ShellType = 'CMD' | 'PowerShell';

export type CategoryId =
  | 'energia'
  | 'rede'
  | 'brilho'
  | 'diagnostico'
  | 'limpeza'
  | 'processos'
  | 'seguranca'
  | 'discos'
  | 'servicos'
  | 'sistema'
  | 'utilitarios'
  | 'automacao';

export interface CommandItem {
  id: string;
  name: string;
  category: CategoryId;
  command: string;
  shellType: ShellType;
  requiresAdmin: boolean;
  isCritical: boolean;
  warningMessage?: string;
  description: string;
  tags?: string[];
  simulatedOutput?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  command: string;
  shellType: ShellType;
  status: 'running' | 'success' | 'warning' | 'error';
  output: string;
}

export type ActiveTab = 'commands' | 'favorites' | 'builder' | 'desktop-code' | 'terminal';
