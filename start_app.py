#!/usr/bin/env python3
"""
start_app.py — Menu de entrada do Blog do Felixo.

Porta única por onde qualquer pessoa instala, configura, inicia e verifica o
blog, sem precisar decorar comandos npm. O blog em si é Node/Astro — este
script só orquestra os comandos de `package.json` atrás de um menu.

Contrato: GUIA-START-APP-SCRIPT.md do Felixo System Design (todo programa tem
um `start_app.py` com menu interativo, nunca flags decoradas).

Uso:
    python3 start_app.py
"""

from __future__ import annotations

import json
import os
import re
import shutil
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from urllib.parse import urlparse

PROJECT_DIR = Path(__file__).resolve().parent
PACKAGE_JSON = PROJECT_DIR / "package.json"
REQUIREMENTS_FILE = PROJECT_DIR / "requirements.txt"

# Casa qualquer URL http(s) impressa pelo Astro, seja no formato clássico
# ("Local   http://localhost:4321/") ou no log estruturado que ele usa fora
# de um TTY interativo ("Dev server running at http://localhost:4321 (pid…").
URL_SERVIDOR_RE = re.compile(r'(https?://[^\s"]+)')
HOST_PADRAO = "localhost"
PORTA_PADRAO = 4321
TEMPO_MAX_ESPERA_SERVIDOR = 60

# Overrides de SITE_URL/BASE_PATH válidos só para esta sessão do menu — ver
# `_menu_configurar`. Nunca persistidos em disco: servem para testar um
# preview em subpasta sem editar astro.config.mjs nem exportar variável na
# mão, e não têm nenhum efeito no deploy real (fixo no workflow do GitHub
# Actions).
_overrides: dict[str, str] = {}


def info(msg: str) -> None:
    print(f"\033[1;35m[start]\033[0m {msg}")


def erro(msg: str) -> None:
    print(f"\033[1;31m[erro]\033[0m {msg}", file=sys.stderr)


# --------------------------------------------------------------------------
# Bootstrap das dependências do menu (questionary + rich)
# --------------------------------------------------------------------------


def _tui_importavel() -> bool:
    try:
        import questionary  # noqa: F401
        import rich  # noqa: F401
    except ImportError:
        return False
    return True


def _em_virtualenv() -> bool:
    return sys.prefix != getattr(sys, "base_prefix", sys.prefix)


def _instalar_com_pip(args: list[str]) -> subprocess.CompletedProcess[str]:
    """Instala com pip, contornando um Python "externally managed" (PEP 668).

    Debian/Ubuntu e o Homebrew recusam `pip install` direto no Python do
    sistema. Tenta, nessa ordem, a instalação simples, `--user` e por fim
    `--break-system-packages` (a saída documentada pelo próprio PEP 668) — os
    dois pacotes envolvidos são puro-Python e servem só para desenhar este
    menu, não para o blog em si.
    """
    comando = [sys.executable, "-m", "pip", "install", *args]
    resultado = subprocess.run(comando, cwd=PROJECT_DIR, capture_output=True, text=True)

    if resultado.returncode == 0 or _em_virtualenv():
        return resultado

    if "externally-managed-environment" not in resultado.stdout.lower():
        return resultado

    info("Python com instalação protegida (PEP 668). Tentando com --user...")
    resultado_user = subprocess.run(
        [*comando, "--user"], cwd=PROJECT_DIR, capture_output=True, text=True
    )
    if (
        resultado_user.returncode == 0
        or "externally-managed-environment" not in resultado_user.stdout.lower()
    ):
        return resultado_user

    info("Ainda bloqueado. Tentando com --break-system-packages...")
    return subprocess.run(
        [*comando, "--break-system-packages"], cwd=PROJECT_DIR, capture_output=True, text=True
    )


def preparar_menu() -> bool:
    """Garante que questionary/rich existem antes de desenhar o menu."""
    if _tui_importavel():
        return True

    info("Preparando dependências do menu (questionary, rich)...")
    args = (
        ["-r", str(REQUIREMENTS_FILE)]
        if REQUIREMENTS_FILE.exists()
        else ["questionary>=2.0", "rich>=13.0"]
    )
    resultado = _instalar_com_pip(args)

    if resultado.returncode != 0:
        erro("Não foi possível instalar as dependências do menu (questionary, rich).")
        print(resultado.stdout)
        erro(
            "Crie um virtualenv e tente de novo: python3 -m venv .venv && "
            "source .venv/bin/activate && python3 start_app.py"
        )
        return False

    return _tui_importavel()


# --------------------------------------------------------------------------
# Node / npm / estado do projeto
# --------------------------------------------------------------------------


def comando_existe(nome: str) -> str | None:
    return shutil.which(nome)


def versao_minima_node() -> str | None:
    try:
        dados = json.loads(PACKAGE_JSON.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    exigido = dados.get("engines", {}).get("node", "")
    achou = re.search(r"\d+\.\d+\.\d+", exigido)
    return achou.group(0) if achou else None


def versao_node_instalada() -> str | None:
    node = comando_existe("node")
    if not node:
        return None
    resultado = subprocess.run([node, "--version"], capture_output=True, text=True)
    return resultado.stdout.strip().lstrip("v") or None


def node_modules_instalado() -> bool:
    return (PROJECT_DIR / "node_modules").is_dir()


def porta_em_uso(porta: int, host: str = HOST_PADRAO) -> bool:
    alvo = "127.0.0.1" if host == "localhost" else host
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        return sock.connect_ex((alvo, porta)) == 0


def ambiente_com_overrides() -> dict[str, str]:
    env = os.environ.copy()
    env.update(_overrides)
    return env


# --------------------------------------------------------------------------
# Ações do menu
# --------------------------------------------------------------------------


def _abrir_navegador_quando_pronto(
    processo: subprocess.Popen, url_detectada: dict[str, str], sinalizado: threading.Event
) -> None:
    inicio = time.time()
    while time.time() - inicio < TEMPO_MAX_ESPERA_SERVIDOR:
        if sinalizado.is_set() or processo.poll() is not None:
            return

        url = url_detectada.get("url")
        if url:
            partes = urlparse(url)
            host, porta = partes.hostname or HOST_PADRAO, partes.port or PORTA_PADRAO
        else:
            host, porta = HOST_PADRAO, PORTA_PADRAO
            url = f"http://{host}:{porta}/"

        if porta_em_uso(porta, host):
            info(f"Servidor no ar. Abrindo {url} no navegador...")
            webbrowser.open(url)
            sinalizado.set()
            return

        time.sleep(0.5)

    if not sinalizado.is_set():
        erro("Servidor não respondeu a tempo; abra a URL manualmente.")


def _rodar_streaming(comando: list[str], *, abrir_navegador: bool) -> None:
    """Roda um comando npm espelhando a saída, com Ctrl+C encerrando limpo."""
    processo = subprocess.Popen(
        comando,
        cwd=PROJECT_DIR,
        env=ambiente_com_overrides(),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    sinalizado = threading.Event()
    url_detectada: dict[str, str] = {}
    if abrir_navegador:
        threading.Thread(
            target=_abrir_navegador_quando_pronto,
            args=(processo, url_detectada, sinalizado),
            daemon=True,
        ).start()

    try:
        assert processo.stdout is not None
        for linha in processo.stdout:
            print(linha, end="")
            if abrir_navegador and "url" not in url_detectada:
                achou = URL_SERVIDOR_RE.search(linha)
                if achou:
                    url_detectada["url"] = achou.group(1)
        processo.wait()
    except KeyboardInterrupt:
        info("Encerrando (Ctrl+C)...")
        processo.terminate()
        try:
            processo.wait(timeout=10)
        except subprocess.TimeoutExpired:
            processo.kill()
        info("Encerrado.")
        return

    if processo.returncode not in (0, None):
        erro(f"O comando terminou com código {processo.returncode}.")


def _menu_iniciar(console, questionary) -> None:
    if not comando_existe("npm"):
        console.print(
            "[red]npm não encontrado. Instale o Node.js (>=22.12.0) e tente de novo.[/red]"
        )
        return

    if not node_modules_instalado():
        console.print(
            "[yellow]Dependências ainda não instaladas — rode Instalar/Setup antes.[/yellow]"
        )
        return

    escolha = questionary.select(
        "O que você quer rodar?",
        choices=[
            questionary.Choice(
                f"Servidor de desenvolvimento — hot reload em http://localhost:{PORTA_PADRAO}",
                value="dev",
            ),
            questionary.Choice(
                "Build + preview — testa o build de produção localmente", value="preview"
            ),
            questionary.Choice("Voltar", value=None),
        ],
    ).ask()

    if not escolha:
        return

    if escolha == "dev":
        console.print("[green]Subindo o servidor de desenvolvimento (Ctrl+C para parar)...[/green]")
        _rodar_streaming(["npm", "run", "dev"], abrir_navegador=True)
        return

    console.print("[green]Buildando...[/green]")
    build = subprocess.run(["npm", "run", "build"], cwd=PROJECT_DIR, env=ambiente_com_overrides())
    if build.returncode != 0:
        console.print("[red]Build falhou — veja a saída acima.[/red]")
        return
    console.print("[green]Build ok. Subindo o preview (Ctrl+C para parar)...[/green]")
    _rodar_streaming(["npm", "run", "preview"], abrir_navegador=True)


def _menu_instalar(console) -> None:
    if not comando_existe("npm"):
        console.print("[red]npm não encontrado. Instale o Node.js (>=22.12.0) e tente de novo.[/red]")
        return

    console.print("[green]Instalando dependências (npm install)...[/green]")
    resultado = subprocess.run(["npm", "install"], cwd=PROJECT_DIR)
    if resultado.returncode != 0:
        console.print("[red]npm install falhou — veja a saída acima.[/red]")
        return
    console.print("[green]Dependências instaladas.[/green]")


def _menu_configurar(console, questionary) -> None:
    campos = {
        "SITE_URL": "URL completa do site (padrão: https://blog.felixo.com.br)",
        "BASE_PATH": "Prefixo de caminho, para preview em subpasta (padrão: /)",
    }

    rotulo_por_campo = {
        f"{campo} — {descricao} [{_overrides.get(campo, 'não definido')}]": campo
        for campo, descricao in campos.items()
    }

    escolha = questionary.select(
        "O que você quer configurar? (vale só para esta sessão do menu)",
        choices=[*rotulo_por_campo.keys(), "Limpar overrides", "Voltar"],
    ).ask()

    if not escolha or escolha == "Voltar":
        return

    if escolha == "Limpar overrides":
        _overrides.clear()
        console.print("[green]Overrides limpos — usando os padrões do astro.config.mjs.[/green]")
        return

    campo = rotulo_por_campo[escolha]
    valor = questionary.text(
        f"{campo} (Enter em branco remove o override):", default=_overrides.get(campo, "")
    ).ask()

    if valor is None:
        return
    if valor == "":
        _overrides.pop(campo, None)
    else:
        _overrides[campo] = valor

    if _overrides:
        console.print(f"[green]Overrides ativos: {_overrides}[/green]")
    else:
        console.print("[dim]Nenhum override definido.[/dim]")


def _menu_verificar(console) -> None:
    console.print("[green]Rodando npm run check (tipos + schema dos posts)...[/green]")
    checagem = subprocess.run(["npm", "run", "check"], cwd=PROJECT_DIR)
    if checagem.returncode != 0:
        console.print("[red]npm run check encontrou problemas — veja acima.[/red]")
        return

    console.print("[green]Rodando npm run format (Prettier)...[/green]")
    subprocess.run(["npm", "run", "format"], cwd=PROJECT_DIR)
    console.print("[green]Verificação concluída.[/green]")


def _menu_status(console) -> None:
    from rich.table import Table

    tabela = Table(show_header=False, border_style="dim")
    tabela.add_column("Item", style="bold")
    tabela.add_column("Valor")

    instalada = versao_node_instalada()
    minima = versao_minima_node()
    if instalada:
        tabela.add_row("Node.js", f"[green]{instalada}[/green] (mínimo {minima or '?'})")
    else:
        tabela.add_row("Node.js", f"[red]não encontrado[/red] (mínimo {minima or '?'})")

    tabela.add_row(
        "Dependências npm",
        "[green]instaladas[/green]" if node_modules_instalado() else "[yellow]faltando[/yellow]",
    )

    tabela.add_row(
        f"Porta {PORTA_PADRAO}",
        "[yellow]em uso (servidor rodando?)[/yellow]"
        if porta_em_uso(PORTA_PADRAO)
        else "[dim]livre[/dim]",
    )

    if (PROJECT_DIR / ".git").is_dir() and comando_existe("git"):
        branch = subprocess.run(
            ["git", "branch", "--show-current"], cwd=PROJECT_DIR, capture_output=True, text=True
        ).stdout.strip()
        alteracoes = (
            subprocess.run(
                ["git", "status", "--porcelain"], cwd=PROJECT_DIR, capture_output=True, text=True
            )
            .stdout.strip()
            .splitlines()
        )
        tabela.add_row("Branch git", branch or "(detached)")
        tabela.add_row(
            "Alterações locais",
            f"[yellow]{len(alteracoes)} arquivo(s)[/yellow]" if alteracoes else "[green]nenhuma[/green]",
        )
    else:
        tabela.add_row("Git", "[dim]não é um checkout Git[/dim]")

    tabela.add_row(
        "Overrides de sessão",
        ", ".join(f"{k}={v}" for k, v in _overrides.items()) if _overrides else "[dim]nenhum[/dim]",
    )

    console.print(tabela)


# --------------------------------------------------------------------------
# Menu principal
# --------------------------------------------------------------------------


def rodar_menu() -> int:
    import questionary
    from rich.console import Console
    from rich.panel import Panel

    console = Console()

    while True:
        console.clear()
        console.print(
            Panel.fit(
                "[bold magenta]Blog do Felixo[/bold magenta]\n"
                "[dim]Astro + Tailwind CSS 4, publicado em blog.felixo.com.br[/dim]",
                border_style="magenta",
            )
        )

        escolha = questionary.select(
            "O que você quer fazer?",
            choices=[
                questionary.Choice(
                    "Iniciar / Rodar   — servidor de dev ou preview do build", value="iniciar"
                ),
                questionary.Choice("Instalar / Setup  — npm install", value="instalar"),
                questionary.Choice(
                    "Configurar        — SITE_URL/BASE_PATH desta sessão", value="configurar"
                ),
                questionary.Choice(
                    "Verificar         — npm run check + npm run format", value="verificar"
                ),
                questionary.Choice(
                    "Status            — o que está instalado e pronto agora", value="status"
                ),
                questionary.Choice("Sair", value="sair"),
            ],
        ).ask()

        if escolha in (None, "sair"):
            console.print("[dim]Até mais![/dim]")
            return 0

        if escolha == "iniciar":
            _menu_iniciar(console, questionary)
        elif escolha == "instalar":
            _menu_instalar(console)
        elif escolha == "configurar":
            _menu_configurar(console, questionary)
        elif escolha == "verificar":
            _menu_verificar(console)
        elif escolha == "status":
            _menu_status(console)

        questionary.press_any_key_to_continue("Pressione uma tecla para voltar ao menu...").ask()


def main() -> int:
    if not preparar_menu():
        return 1
    return rodar_menu()


if __name__ == "__main__":
    raise SystemExit(main())
