export const PYTHON_DESKTOP_SCRIPT = `"""
=============================================================================
WinTools Pro - Ferramentas do Windows (Desktop Edition)
Autor: Desenvolvido com CustomTkinter para Windows 10/11
Licença: MIT
=============================================================================
Instruções:
1. Instale as dependências:
   pip install -r requirements.txt
2. Execute o app:
   python wintools_pro.py
3. Para gerar o .exe:
   pyinstaller --onefile --noconsole --name "WinToolsPro" wintools_pro.py
=============================================================================
"""

import os
import sys
import json
import subprocess
import threading
import ctypes
import webbrowser
import tkinter as tk
from tkinter import messagebox
import customtkinter as ctk

# Configurações globais de aparência
ctk.set_appearance_mode("Dark")  # Opções: "System", "Dark", "Light"
ctk.set_default_color_theme("blue")  # Opções: "blue", "green", "dark-blue"

FAVORITES_FILE = os.path.join(os.path.expanduser("~"), ".wintools_pro_favorites.json")

# Lista completa de ferramentas e comandos organizados por categoria
COMMAND_DATABASE = [
    # 1. Energia
    {"id": "pwr-1", "cat": "Desligar / Reiniciar", "name": "Desligar Imediatamente", "cmd": "shutdown /s /t 0", "admin": False, "crit": True, "desc": "Desliga o computador imediatamente."},
    {"id": "pwr-2", "cat": "Desligar / Reiniciar", "name": "Reiniciar Imediatamente", "cmd": "shutdown /r /t 0", "admin": False, "crit": True, "desc": "Reinicia o sistema imediatamente."},
    {"id": "pwr-3", "cat": "Desligar / Reiniciar", "name": "Reiniciar na BIOS / UEFI", "cmd": "shutdown /r /fw /t 1", "admin": True, "crit": True, "desc": "Reinicia direto na tela de configuração da BIOS."},
    {"id": "pwr-4", "cat": "Desligar / Reiniciar", "name": "Cancelar Desligamento", "cmd": "shutdown /a", "admin": False, "crit": False, "desc": "Cancela desligamentos agendados."},
    {"id": "pwr-5", "cat": "Desligar / Reiniciar", "name": "Relatório de Bateria (HTML)", "cmd": 'powercfg /batteryreport /output "%USERPROFILE%\\\\battery_report.html"', "admin": True, "crit": False, "desc": "Gera histórico detalhado da bateria em HTML."},
    {"id": "pwr-6", "cat": "Desligar / Reiniciar", "name": "Desativar Hibernação (Liberar GBs)", "cmd": "powercfg /hibernate off", "admin": True, "crit": False, "desc": "Exclui o arquivo hiberfil.sys liberando espaço no C:."},

    # 2. Rede
    {"id": "net-1", "cat": "Rede, IP e DNS", "name": "IPConfig Completo", "cmd": "ipconfig /all", "admin": False, "crit": False, "desc": "Lista IPs, DNS, MAC e gateways de todos os adaptadores."},
    {"id": "net-2", "cat": "Rede, IP e DNS", "name": "Limpar Cache DNS", "cmd": "ipconfig /flushdns", "admin": True, "crit": False, "desc": "Esvazia o cache DNS resolvendo sites inacessíveis."},
    {"id": "net-3", "cat": "Rede, IP e DNS", "name": "Renovar IP (Release/Renew)", "cmd": "ipconfig /release && ipconfig /renew", "admin": True, "crit": False, "desc": "Pede um novo IP local ao roteador via DHCP."},
    {"id": "net-4", "cat": "Rede, IP e DNS", "name": "Redefinir Winsock e TCP/IP", "cmd": "netsh winsock reset && netsh int ip reset", "admin": True, "crit": True, "desc": "Restaura os sockets de rede aos padrões originais."},
    {"id": "net-5", "cat": "Rede, IP e DNS", "name": "Testar Ping (Google)", "cmd": "ping 8.8.8.8 -n 4", "admin": False, "crit": False, "desc": "Testa latência e perda de pacotes da internet."},
    {"id": "net-6", "cat": "Rede, IP e DNS", "name": "Rastrear Rota (Tracert Cloudflare)", "cmd": "tracert -d -h 10 1.1.1.1", "admin": False, "crit": False, "desc": "Verifica os saltos de rota até o servidor DNS."},

    # 3. Brilho e Tela
    {"id": "scr-1", "cat": "Brilho e Tela", "name": "Configurações de Tela", "cmd": "start ms-settings:display", "admin": False, "crit": False, "desc": "Abre o menu nativo de resolução e taxa de Hz."},
    {"id": "scr-2", "cat": "Brilho e Tela", "name": "Modo de Projeção (Multi-Monitor)", "cmd": "displayswitch.exe", "admin": False, "crit": False, "desc": "Alterna entre telas duplicadas ou estendidas."},
    {"id": "scr-3", "cat": "Brilho e Tela", "name": "Brilho 100% (WMI PowerShell)", "cmd": "powershell -Command \\"(Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, 100)\\"", "admin": True, "crit": False, "desc": "Define brilho máximo em laptops."},

    # 4. Diagnóstico e Reparo
    {"id": "diag-1", "cat": "Diagnóstico e Reparo", "name": "Verificar Arquivos do Sistema (SFC)", "cmd": "sfc /scannow", "admin": True, "crit": True, "desc": "Repara arquivos corrompidos do Windows."},
    {"id": "diag-2", "cat": "Diagnóstico e Reparo", "name": "Reparar Imagem do Windows (DISM)", "cmd": "DISM /Online /Cleanup-Image /RestoreHealth", "admin": True, "crit": True, "desc": "Restaura a loja de componentes oficial via Windows Update."},
    {"id": "diag-3", "cat": "Diagnóstico e Reparo", "name": "Verificar Disco C: (CHKDSK Online)", "cmd": "chkdsk C: /scan /perf", "admin": True, "crit": False, "desc": "Varre erros no sistema de arquivos NTFS."},
    {"id": "diag-4", "cat": "Diagnóstico e Reparo", "name": "Diagnóstico de Memória RAM", "cmd": "mdsched.exe", "admin": True, "crit": True, "desc": "Agenda teste de hardware de memória para o próximo boot."},

    # 5. Limpeza e Armazenamento
    {"id": "cln-1", "cat": "Limpeza e Armazenamento", "name": "Limpar Arquivos Temporários", "cmd": 'del /q /f /s "%TEMP%\\\\*" & del /q /f /s "C:\\\\Windows\\\\Temp\\\\*"', "admin": True, "crit": True, "desc": "Exclui arquivos das pastas Temp e %temp%."},
    {"id": "cln-2", "cat": "Limpeza e Armazenamento", "name": "Limpeza de Disco (Cleanmgr)", "cmd": "cleanmgr /lowdisk", "admin": True, "crit": False, "desc": "Inicia a limpeza nativa de arquivos antigos."},
    {"id": "cln-3", "cat": "Limpeza e Armazenamento", "name": "Limpar Pasta WinSxS (DISM)", "cmd": "DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase", "admin": True, "crit": True, "desc": "Remove atualizações antigas arquivadas no sistema."},
    {"id": "cln-4", "cat": "Limpeza e Armazenamento", "name": "Esvaziar Lixeira Silenciosamente", "cmd": "powershell -Command \\"Clear-RecycleBin -Force -ErrorAction SilentlyContinue\\"", "admin": False, "crit": True, "desc": "Esvazia lixeira de todas as unidades sem avisos."},

    # 6. Processos e Desempenho
    {"id": "prc-1", "cat": "Processos e Desempenho", "name": "Reiniciar Windows Explorer", "cmd": "taskkill /f /im explorer.exe & start explorer.exe", "admin": False, "crit": False, "desc": "Destrava a barra de tarefas e área de trabalho."},
    {"id": "prc-2", "cat": "Processos e Desempenho", "name": "Top Processos por Consumo de CPU", "cmd": "powershell -Command \\"Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 ProcessName, Id, CPU\\"", "admin": False, "crit": False, "desc": "Identifica processos consumindo alto processamento."},
    {"id": "prc-3", "cat": "Processos e Desempenho", "name": "Encerrar Programas Travados", "cmd": 'taskkill /F /FI "STATUS eq NOT RESPONDING"', "admin": True, "crit": True, "desc": "Mata qualquer janela em estado 'Não Respondendo'."},
    {"id": "prc-4", "cat": "Processos e Desempenho", "name": "Abrir Monitor de Recursos (Resmon)", "cmd": "resmon.exe", "admin": False, "crit": False, "desc": "Monitor em tempo real de CPU, Disco, Rede e RAM."},

    # 7. Segurança
    {"id": "sec-1", "cat": "Firewall e Segurança", "name": "Status do Windows Defender", "cmd": "powershell -Command \\"Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled\\"", "admin": True, "crit": False, "desc": "Exibe status da proteção em tempo real do Defender."},
    {"id": "sec-2", "cat": "Firewall e Segurança", "name": "Varredura Rápida do Antivírus", "cmd": "powershell -Command \\"Start-MpScan -ScanType QuickScan\\"", "admin": True, "crit": False, "desc": "Inicia varredura rápida de ameaças."},
    {"id": "sec-3", "cat": "Firewall e Segurança", "name": "Restaurar Firewall para o Padrão", "cmd": "netsh advfirewall reset", "admin": True, "crit": True, "desc": "Restaura regras originais do Firewall do Windows."},

    # 8. Discos
    {"id": "dsk-1", "cat": "Discos e Partições", "name": "Listar Volumes e Espaço Livre", "cmd": "powershell -Command \\"Get-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining, Size\\"", "admin": False, "crit": False, "desc": "Exibe espaço disponível em todas as unidades."},
    {"id": "dsk-2", "cat": "Discos e Partições", "name": "Otimizar SSD (Comando TRIM)", "cmd": "powershell -Command \\"Optimize-Volume -DriveLetter C -ReTrim -Verbose\\"", "admin": True, "crit": False, "desc": "Envia comando TRIM para preservar velocidade do SSD."},
    {"id": "dsk-3", "cat": "Discos e Partições", "name": "Abrir Gerenciamento de Disco", "cmd": "diskmgmt.msc", "admin": True, "crit": False, "desc": "Abre utilitário gráfico de particionamento."},

    # 9. Serviços
    {"id": "srv-1", "cat": "Serviços e Inicialização", "name": "Console de Serviços", "cmd": "services.msc", "admin": True, "crit": False, "desc": "Abre a lista completa de serviços do Windows."},
    {"id": "srv-2", "cat": "Serviços e Inicialização", "name": "Reiniciar Spooler de Impressão", "cmd": 'net stop spooler & del /q /f /s "%systemroot%\\\\System32\\\\Spool\\\\Printers\\\\*.*" & net start spooler', "admin": True, "crit": True, "desc": "Cancela documentos presos e reinicia a impressora."},
    {"id": "srv-3", "cat": "Serviços e Inicialização", "name": "Configuração do Sistema (MSConfig)", "cmd": "msconfig", "admin": True, "crit": False, "desc": "Configurações de inicialização limpa e boot."},

    # 10. Sistema
    {"id": "sys-1", "cat": "Informações do Sistema", "name": "Resumo de Hardware (SystemInfo)", "cmd": "systeminfo", "admin": False, "crit": False, "desc": "Coleta modelo da máquina, processador, RAM e SO."},
    {"id": "sys-2", "cat": "Informações do Sistema", "name": "Número de Série da BIOS", "cmd": "wmic bios get serialnumber", "admin": False, "crit": False, "desc": "Exibe a Service Tag ou serial para suporte."},
    {"id": "sys-3", "cat": "Informações do Sistema", "name": "Versão do Windows (WinVer)", "cmd": "winver", "admin": False, "crit": False, "desc": "Abre a caixa de diálogo com a Build do Windows."},

    # 11. Utilitários
    {"id": "utl-1", "cat": "Utilitários", "name": "Criar Pasta God Mode no Desktop", "cmd": 'mkdir "%USERPROFILE%\\\\Desktop\\\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"', "admin": False, "crit": False, "desc": "Cria atalho com mais de 200 ferramentas de controle."},
    {"id": "utl-2", "cat": "Utilitários", "name": "Editor do Registro (Regedit)", "cmd": "regedit.exe", "admin": True, "crit": False, "desc": "Abre o editor de registro do Windows."},
    {"id": "utl-3", "cat": "Utilitários", "name": "Gerenciador de Dispositivos", "cmd": "devmgmt.msc", "admin": True, "crit": False, "desc": "Exibe drivers de vídeo, áudio, rede e placas."},

    # 12. Automação
    {"id": "aut-1", "cat": "Automação", "name": "Manutenção Expressa (DNS + SFC + Clean)", "cmd": "ipconfig /flushdns & sfc /scannow & cleanmgr /lowdisk", "admin": True, "crit": True, "desc": "Rotina completa de manutenção em lote com 1 clique."},
    {"id": "aut-2", "cat": "Automação", "name": "Reset Completo de Conexão", "cmd": "netsh winsock reset & netsh int ip reset & ipconfig /flushdns", "admin": True, "crit": True, "desc": "Soluciona falhas de internet e DNS com redefinição global."}
]


class WinToolsProApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("WinTools Pro - Ferramentas do Windows")
        self.geometry("1100x750")
        self.minsize(950, 650)

        # Carregar favoritos
        self.favorites = self.load_favorites()
        self.selected_category = "Todas as Categorias"
        self.search_query = ""

        # Verificar se roda como Administrador no Windows
        self.is_admin = self.check_is_admin()

        # Layout principal em Grid
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Barra Lateral
        self.build_sidebar()

        # Conteúdo Principal
        self.build_main_area()

    def check_is_admin(self):
        try:
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        except:
            return False

    def load_favorites(self):
        if os.path.exists(FAVORITES_FILE):
            try:
                with open(FAVORITES_FILE, "r", encoding="utf-8") as f:
                    return set(json.load(f))
            except:
                return set()
        return set()

    def save_favorites(self):
        try:
            with open(FAVORITES_FILE, "w", encoding="utf-8") as f:
                json.dump(list(self.favorites), f)
        except Exception as e:
            print("Erro ao salvar favoritos:", e)

    def toggle_favorite(self, cmd_id):
        if cmd_id in self.favorites:
            self.favorites.remove(cmd_id)
        else:
            self.favorites.add(cmd_id)
        self.save_favorites()
        self.refresh_cards()

    def build_sidebar(self):
        sidebar = ctk.CTkFrame(self, width=260, corner_radius=0)
        sidebar.grid(row=0, column=0, sticky="nsew")
        sidebar.grid_rowconfigure(14, weight=1)

        # Cabeçalho do App
        logo_label = ctk.CTkLabel(
            sidebar, 
            text="WinTools Pro", 
            font=ctk.CTkFont(size=20, weight="bold")
        )
        logo_label.pack(padx=20, pady=(20, 5), anchor="w")

        status_text = "Privilégio: Administrador" if self.is_admin else "Privilégio: Usuário Padrão"
        status_color = "#10B981" if self.is_admin else "#F59E0B"
        admin_badge = ctk.CTkLabel(
            sidebar, 
            text=status_text, 
            text_color=status_color, 
            font=ctk.CTkFont(size=11)
        )
        admin_badge.pack(padx=20, pady=(0, 15), anchor="w")

        # Categorias
        cat_title = ctk.CTkLabel(sidebar, text="CATEGORIAS", font=ctk.CTkFont(size=11, weight="bold"), text_color="gray")
        cat_title.pack(padx=20, pady=(5, 5), anchor="w")

        self.cat_buttons = {}
        all_categories = ["Todas as Categorias", "Favoritos (★)"] + sorted(list(set(c["cat"] for c in COMMAND_DATABASE)))

        scroll_cats = ctk.CTkScrollableFrame(sidebar, fg_color="transparent")
        scroll_cats.pack(fill="both", expand=True, padx=10, pady=5)

        for cat in all_categories:
            btn = ctk.CTkButton(
                scroll_cats,
                text=cat,
                anchor="w",
                fg_color="transparent" if cat != self.selected_category else ("#0078D4", "#0284C7"),
                hover_color=("#E2E8F0", "#334155"),
                text_color=("black", "white"),
                height=32,
                command=lambda c=cat: self.select_category(c)
            )
            btn.pack(fill="x", pady=2)
            self.cat_buttons[cat] = btn

        # Rodapé da Barra Lateral: Alternador de Tema
        theme_frame = ctk.CTkFrame(sidebar, fg_color="transparent")
        theme_frame.pack(side="bottom", fill="x", padx=15, pady=15)

        theme_label = ctk.CTkLabel(theme_frame, text="Tema:", font=ctk.CTkFont(size=12))
        theme_label.pack(side="left")

        theme_switch = ctk.CTkOptionMenu(
            theme_frame,
            values=["Dark", "Light", "System"],
            command=ctk.set_appearance_mode,
            width=100
        )
        theme_switch.set("Dark")
        theme_switch.pack(side="right")

    def select_category(self, cat):
        self.selected_category = cat
        for c_name, btn in self.cat_buttons.items():
            if c_name == cat:
                btn.configure(fg_color=("#0078D4", "#0284C7"))
            else:
                btn.configure(fg_color="transparent")
        self.refresh_cards()

    def build_main_area(self):
        main_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_frame.grid(row=0, column=1, sticky="nsew", padx=15, pady=15)
        main_frame.grid_rowconfigure(2, weight=1)
        main_frame.grid_columnconfigure(0, weight=1)

        # Top Bar: Busca e Ações Rápidas
        top_bar = ctk.CTkFrame(main_frame, fg_color="transparent")
        top_bar.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        top_bar.grid_columnconfigure(0, weight=1)

        self.search_entry = ctk.CTkEntry(
            top_bar,
            placeholder_text="Pesquisar comandos, nomes ou ferramentas...",
            height=38,
            font=ctk.CTkFont(size=13)
        )
        self.search_entry.grid(row=0, column=0, sticky="ew", padx=(0, 10))
        self.search_entry.bind("<KeyRelease>", self.on_search)

        btn_batch = ctk.CTkButton(
            top_bar,
            text="Exportar .BAT",
            width=120,
            height=38,
            fg_color="#059669",
            hover_color="#047857",
            command=self.export_batch_script
        )
        btn_batch.grid(row=0, column=1, padx=5)

        btn_ps1 = ctk.CTkButton(
            top_bar,
            text="Exportar .PS1",
            width=120,
            height=38,
            fg_color="#0284C7",
            hover_color="#0369A1",
            command=self.export_ps1_script
        )
        btn_ps1.grid(row=0, column=2, padx=5)

        # Faixa de Ajuste de Brilho WMI
        brightness_frame = ctk.CTkFrame(main_frame)
        brightness_frame.grid(row=1, column=0, sticky="ew", pady=(0, 10), padx=2)

        b_label = ctk.CTkLabel(brightness_frame, text="Ajuste de Brilho (WMI):", font=ctk.CTkFont(weight="bold"))
        b_label.pack(side="left", padx=15, pady=8)

        self.bright_slider = ctk.CTkSlider(brightness_frame, from_=10, to=100, number_of_steps=18, command=self.on_brightness_change)
        self.bright_slider.set(70)
        self.bright_slider.pack(side="left", fill="x", expand=True, padx=10, pady=8)

        self.bright_val_label = ctk.CTkLabel(brightness_frame, text="70%", width=45)
        self.bright_val_label.pack(side="left", padx=(0, 10))

        btn_apply_bright = ctk.CTkButton(
            brightness_frame, 
            text="Aplicar Brilho", 
            width=100, 
            command=self.apply_brightness
        )
        btn_apply_bright.pack(side="left", padx=10)

        # Painel Divisor (Cards de Comandos em cima + Console embutido em baixo)
        paned = ctk.CTkFrame(main_frame, fg_color="transparent")
        paned.grid(row=2, column=0, sticky="nsew")
        paned.grid_rowconfigure(0, weight=3)
        paned.grid_rowconfigure(1, weight=2)
        paned.grid_columnconfigure(0, weight=1)

        # Área de Rolagem dos Cards
        self.cards_scroll = ctk.CTkScrollableFrame(paned, label_text="Comandos Disponíveis")
        self.cards_scroll.grid(row=0, column=0, sticky="nsew", pady=(0, 10))

        # Console de Saída Embutido
        console_container = ctk.CTkFrame(paned)
        console_container.grid(row=1, column=0, sticky="nsew")
        console_container.grid_rowconfigure(1, weight=1)
        console_container.grid_columnconfigure(0, weight=1)

        c_header = ctk.CTkFrame(console_container, fg_color="transparent", height=32)
        c_header.grid(row=0, column=0, sticky="ew", padx=10, pady=5)

        c_title = ctk.CTkLabel(c_header, text="Terminal Integrado (Saída em Tempo Real)", font=ctk.CTkFont(size=12, weight="bold"))
        c_title.pack(side="left")

        btn_clear = ctk.CTkButton(c_header, text="Limpar Console", width=90, height=24, command=self.clear_console)
        btn_clear.pack(side="right")

        self.console_textbox = ctk.CTkTextbox(
            console_container,
            font=ctk.CTkFont(family="Consolas", size=11),
            wrap="word",
            text_color="#38BDF8",
            fg_color="#090D16"
        )
        self.console_textbox.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        self.log_to_console("WinTools Pro Terminal iniciado. Clique em 'Executar' em qualquer comando.\\n")

        self.refresh_cards()

    def on_search(self, event=None):
        self.search_query = self.search_entry.get().strip().lower()
        self.refresh_cards()

    def on_brightness_change(self, val):
        self.bright_val_label.configure(text=f"{int(val)}%")

    def apply_brightness(self):
        val = int(self.bright_slider.get())
        cmd = f'powershell -Command "(Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, {val})"'
        self.execute_command(cmd, "Ajustar Brilho")

    def refresh_cards(self):
        # Limpar cards anteriores
        for widget in self.cards_scroll.winfo_children():
            widget.destroy()

        # Filtrar comandos
        filtered = []
        for cmd in COMMAND_DATABASE:
            # Filtro de categoria
            if self.selected_category == "Favoritos (★)":
                if cmd["id"] not in self.favorites:
                    continue
            elif self.selected_category != "Todas as Categorias":
                if cmd["cat"] != self.selected_category:
                    continue

            # Filtro de texto
            if self.search_query:
                q = self.search_query
                in_name = q in cmd["name"].lower()
                in_cmd = q in cmd["cmd"].lower()
                in_desc = q in cmd["desc"].lower()
                if not (in_name or in_cmd or in_desc):
                    continue

            filtered.append(cmd)

        if not filtered:
            empty_lbl = ctk.CTkLabel(
                self.cards_scroll,
                text="Nenhum comando encontrado com os filtros atuais.",
                text_color="gray",
                font=ctk.CTkFont(size=14)
            )
            empty_lbl.pack(pady=40)
            return

        for item in filtered:
            self.create_command_card(item)

    def create_command_card(self, item):
        card = ctk.CTkFrame(self.cards_scroll, corner_radius=8)
        card.pack(fill="x", pady=6, padx=5)

        # Linha 1: Título, Badges e Botão Favorito
        top_row = ctk.CTkFrame(card, fg_color="transparent")
        top_row.pack(fill="x", padx=12, pady=(10, 4))

        title = ctk.CTkLabel(top_row, text=item["name"], font=ctk.CTkFont(size=13, weight="bold"))
        title.pack(side="left")

        # Badges
        if item["admin"]:
            adm_badge = ctk.CTkLabel(top_row, text="ADMIN", text_color="#F59E0B", font=ctk.CTkFont(size=10, weight="bold"))
            adm_badge.pack(side="left", padx=8)

        is_fav = item["id"] in self.favorites
        fav_btn = ctk.CTkButton(
            top_row,
            text="★" if is_fav else "☆",
            width=28,
            height=24,
            fg_color="#D97706" if is_fav else "transparent",
            hover_color="#B45309",
            command=lambda i=item["id"]: self.toggle_favorite(i)
        )
        fav_btn.pack(side="right")

        # Linha 2: Descrição
        desc = ctk.CTkLabel(card, text=item["desc"], font=ctk.CTkFont(size=11), text_color="gray", anchor="w")
        desc.pack(fill="x", padx=12, pady=(0, 6))

        # Linha 3: Comando formatado
        cmd_box = ctk.CTkFrame(card, fg_color=("#F1F5F9", "#0F172A"), corner_radius=4)
        cmd_box.pack(fill="x", padx=12, pady=4)

        cmd_label = ctk.CTkLabel(
            cmd_box,
            text=item["cmd"],
            font=ctk.CTkFont(family="Consolas", size=11),
            anchor="w",
            text_color=("#0F172A", "#38BDF8")
        )
        cmd_label.pack(fill="x", padx=10, pady=6)

        # Linha 4: Ações (Copiar e Executar)
        action_row = ctk.CTkFrame(card, fg_color="transparent")
        action_row.pack(fill="x", padx=12, pady=(4, 10))

        btn_copy = ctk.CTkButton(
            action_row,
            text="Copiar",
            width=80,
            height=28,
            command=lambda c=item["cmd"]: self.copy_to_clipboard(c)
        )
        btn_copy.pack(side="left", padx=(0, 8))

        btn_run = ctk.CTkButton(
            action_row,
            text="Executar",
            width=90,
            height=28,
            fg_color="#0284C7" if not item["crit"] else "#DC2626",
            hover_color="#0369A1" if not item["crit"] else "#B91C1C",
            command=lambda i=item: self.prompt_and_run(i)
        )
        btn_run.pack(side="left")

    def copy_to_clipboard(self, text):
        self.clipboard_clear()
        self.clipboard_append(text)
        self.update()
        self.log_to_console(f"[Área de Transferência] Comando copiado: {text}\\n")

    def prompt_and_run(self, item):
        if item["crit"]:
            confirm = messagebox.askyesno(
                "Confirmação de Segurança - WinTools Pro",
                f"Atenção: O comando '{item['name']}' pode alterar configurações críticas do sistema.\\n\\n"
                f"Comando: {item['cmd']}\\n\\nDeseja realmente executá-lo agora?"
            )
            if not confirm:
                return

        if item["admin"] and not self.is_admin:
            messagebox.showwarning(
                "Aviso de Privilégios",
                "Este comando exige privilégios de Administrador.\\nExecute o WinTools Pro como Administrador caso o comando falhe."
            )

        self.execute_command(item["cmd"], item["name"])

    def execute_command(self, cmd, label="Comando"):
        self.log_to_console(f"\\n>>> [{label}] Executando: {cmd}\\n")

        # Execução assíncrona em thread para não travar a interface
        def worker():
            try:
                proc = subprocess.Popen(
                    cmd,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
                )
                stdout, stderr = proc.communicate()

                output = stdout if stdout else ""
                if stderr:
                    output += f"\\n[ERRO/AVISO]:\\n{stderr}"

                if not output.strip():
                    output = "Comando finalizado com sucesso (código 0)."

                self.after(0, lambda: self.log_to_console(output.strip() + "\\n"))
            except Exception as e:
                self.after(0, lambda: self.log_to_console(f"Falha ao executar comando: {str(e)}\\n"))

        thread = threading.Thread(target=worker, daemon=True)
        thread.start()

    def log_to_console(self, text):
        self.console_textbox.insert("end", text)
        self.console_textbox.see("end")

    def clear_console(self):
        self.console_textbox.delete("1.0", "end")

    def export_batch_script(self):
        filename = "wintools_otimizacao.bat"
        content = "@echo off\\nchcp 65001 >nul\\ntitle WinTools Pro - Rotina Automatica\\n\\n"
        content += "echo ========================================\\n"
        content += "echo  WinTools Pro - Executando Manutencao\\n"
        content += "echo ========================================\\n\\n"
        for item in COMMAND_DATABASE:
            if item["id"] in self.favorites or self.selected_category == item["cat"]:
                content += f"echo Executando: {item['name']}...\\n"
                content += f"{item['cmd']}\\n\\n"
        content += "echo.\\necho Manutencao concluida com sucesso!\\npause\\n"

        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        messagebox.showinfo("Exportado", f"Arquivo .BAT gerado com sucesso:\\n{os.path.abspath(filename)}")

    def export_ps1_script(self):
        filename = "WinTools_Script.ps1"
        content = "# WinTools Pro - PowerShell Automation Script\\n\\nWrite-Host 'Iniciando Manutencao WinTools Pro...' -ForegroundColor Cyan\\n\\n"
        for item in COMMAND_DATABASE:
            if item["id"] in self.favorites or self.selected_category == item["cat"]:
                content += f"# {item['name']}\\nWrite-Host 'Executando: {item['name']}' -ForegroundColor Yellow\\n{item['cmd']}\\n\\n"
        content += "Write-Host 'Concluido!' -ForegroundColor Green\\n"

        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        messagebox.showinfo("Exportado", f"Arquivo .PS1 gerado com sucesso:\\n{os.path.abspath(filename)}")


if __name__ == "__main__":
    app = WinToolsProApp()
    app.mainloop()
`;

export const REQUIREMENTS_TXT = `customtkinter>=5.2.0
packaging>=23.0
darkdetect>=0.8.0
pillow>=10.0.0
`;

export const PYINSTALLER_GUIDE = `# Como gerar o executável (.exe) autônomo do WinTools Pro

Passo 1: Instale o CustomTkinter e o PyInstaller
------------------------------------------------
pip install customtkinter pyinstaller

Passo 2: No diretório do script, execute o comando:
--------------------------------------------------
pyinstaller --noconsole --onefile --name "WinToolsPro" wintools_pro.py

Dica para incluir ícone personalizado (.ico):
--------------------------------------------
pyinstaller --noconsole --onefile --icon=app_icon.ico --name "WinToolsPro" wintools_pro.py

Resultado:
O executável final estará disponível na pasta 'dist/WinToolsPro.exe'.
Ele pode ser levado em um pendrive e executado em qualquer Windows 10 ou 11 sem necessidade de ter Python instalado!
`;

export const STANDALONE_POWERSHELL_SCRIPT = `<#
.SYNOPSIS
    WinTools Pro - Suíte em PowerShell Puro (com GUI WPF Nativa)
.DESCRIPTION
    Script 100% nativo para Windows que roda diretamente no PowerShell 5.1 e 7+
    sem exigir instalação do Python ou bibliotecas externas.
#>

Add-Type -AssemblyName PresentationFramework, PresentationCore, WindowsBase

[xml]$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WinTools Pro - PowerShell Native Suite" Height="700" Width="1000"
        Background="#0F172A" WindowStartupLocation="CenterScreen">
    <Grid Margin="15">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="200"/>
        </Grid.RowDefinitions>
        
        <!-- Header -->
        <Border Grid.Row="0" Background="#1E293B" CornerRadius="8" Padding="15" Margin="0,0,0,15">
            <DockPanel>
                <TextBlock Text="WinTools Pro - Ferramentas do Windows" Foreground="#38BDF8" FontSize="18" FontWeight="Bold" VerticalAlignment="Center"/>
                <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
                    <Button Name="BtnCleanDNS" Content="Limpar DNS" Background="#0284C7" Foreground="White" Padding="12,6" Margin="5,0"/>
                    <Button Name="BtnSFC" Content="SFC Scannow" Background="#D97706" Foreground="White" Padding="12,6" Margin="5,0"/>
                    <Button Name="BtnTemp" Content="Limpar Temp" Background="#DC2626" Foreground="White" Padding="12,6" Margin="5,0"/>
                </StackPanel>
            </DockPanel>
        </Border>

        <!-- Command Grid -->
        <Border Grid.Row="1" Background="#1E293B" CornerRadius="8" Padding="10" Margin="0,0,0,15">
            <ListView Name="CommandListView" Background="Transparent" BorderThickness="0" Foreground="White">
                <ListView.View>
                    <GridView>
                        <GridViewColumn Header="Nome da Ferramenta" Width="260" DisplayMemberBinding="{Binding Name}"/>
                        <GridViewColumn Header="Comando" Width="380" DisplayMemberBinding="{Binding Command}"/>
                        <GridViewColumn Header="Privilégio" Width="100" DisplayMemberBinding="{Binding Admin}"/>
                        <GridViewColumn Header="Categoria" Width="160" DisplayMemberBinding="{Binding Category}"/>
                    </GridView>
                </ListView.View>
            </ListView>
        </Border>

        <!-- Output Console -->
        <Border Grid.Row="2" Background="#090D16" CornerRadius="8" Padding="10">
            <DockPanel>
                <TextBlock DockPanel.Dock="Top" Text="Console de Saída do Windows PowerShell" Foreground="#94A3B8" FontSize="11" Margin="0,0,0,5"/>
                <TextBox Name="ConsoleOutput" Background="Transparent" Foreground="#38BDF8" FontFamily="Consolas" FontSize="12" IsReadOnly="True" TextWrapping="Wrap" VerticalScrollBarVisibility="Auto" BorderThickness="0"/>
            </DockPanel>
        </Border>
    </Grid>
</Window>
"@

$reader = (New-Object System.Xml.XmlNodeReader $xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)

$btnCleanDNS = $window.FindName("BtnCleanDNS")
$btnSFC = $window.FindName("BtnSFC")
$btnTemp = $window.FindName("BtnTemp")
$cmdList = $window.FindName("CommandListView")
$console = $window.FindName("ConsoleOutput")

function Log-Output([string]$text) {
    $console.AppendText("\`n[$(Get-Date -Format 'HH:mm:ss')] $text")
    $console.ScrollToEnd()
}

$commands = @(
    [PSCustomObject]@{ Name="Limpar Cache DNS"; Command="ipconfig /flushdns"; Admin="Sim"; Category="Rede" },
    [PSCustomObject]@{ Name="Configuração de IP"; Command="ipconfig /all"; Admin="Não"; Category="Rede" },
    [PSCustomObject]@{ Name="Verificar SFC"; Command="sfc /scannow"; Admin="Sim"; Category="Diagnóstico" },
    [PSCustomObject]@{ Name="Reparar DISM"; Command="DISM /Online /Cleanup-Image /RestoreHealth"; Admin="Sim"; Category="Diagnóstico" },
    [PSCustomObject]@{ Name="Limpar Pastas Temporárias"; Command="del /q /f /s %TEMP%\\*"; Admin="Sim"; Category="Limpeza" },
    [PSCustomObject]@{ Name="Top 10 Processos por CPU"; Command="Get-Process | Sort CPU -Desc | Select -First 10"; Admin="Não"; Category="Desempenho" },
    [PSCustomObject]@{ Name="Reiniciar Explorer"; Command="taskkill /f /im explorer.exe & start explorer.exe"; Admin="Não"; Category="Processos" },
    [PSCustomObject]@{ Name="Listar Volumes de Disco"; Command="Get-Volume"; Admin="Não"; Category="Discos" }
)

foreach ($c in $commands) {
    $cmdList.Items.Add($c)
}

$btnCleanDNS.Add_Click({
    Log-Output "Executando: ipconfig /flushdns"
    $res = ipconfig /flushdns
    Log-Output ($res -join "\`n")
})

$btnTemp.Add_Click({
    Log-Output "Limpando arquivos temporários..."
    Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue
    Log-Output "Arquivos temporários liberados com sucesso."
})

$btnSFC.Add_Click({
    Log-Output "Aviso: Iniciando SFC /scannow em nova janela de Administrador..."
    Start-Process powershell -Verb RunAs -ArgumentList "sfc /scannow; Read-Host 'Pressione Enter para fechar'"
})

Log-Output "WinTools Pro (WPF PowerShell) carregado com sucesso."
$window.ShowDialog() | Out-Null
`;
