"""Gera a imagem de compartilhamento (Open Graph) do blog.

A imagem é o cartão que aparece quando um link do blog é colado no WhatsApp,
LinkedIn ou X. Sem ela, o post compartilhado sai como um retângulo vazio — que
é exatamente o que não pode acontecer no dia da divulgação.

Por que renderizar no navegador em vez de desenhar com uma biblioteca de
imagem: assim o cartão usa o MESMO CSS da identidade (gradiente de fundo,
brilho de ametista, Space Grotesk vinda do Google Fonts). Desenhar à mão com
PIL exigiria reimplementar o gradiente e a fonte, e a imagem divergiria do site
no primeiro ajuste de marca.

Roda sob demanda, não no build: a imagem é um artefato versionado em
`public/og-image.jpg`, e o build do site continua sem dependência de navegador.

    python scripts/gerar-og-image.py
"""

from __future__ import annotations

import base64
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
SAIDA = RAIZ / "public" / "og-image.jpg"
LOGO = RAIZ / "public" / "imagens" / "logo-felixo.png"

LARGURA, ALTURA = 1200, 630

GABARITO = """
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
    />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        width: __LARGURA__px;
        height: __ALTURA__px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
        padding: 72px;
        font-family: 'Space Grotesk', sans-serif;
        color: #fafafa;
        background-color: #000;
        background-image:
          radial-gradient(circle at 12% 0%, rgb(168 85 247 / 0.22), transparent 42rem),
          radial-gradient(circle at 88% 100%, rgb(192 132 252 / 0.14), transparent 38rem),
          linear-gradient(to bottom, #000, rgb(9 9 11), #000);
        position: relative;
        overflow: hidden;
      }

      /* Mesma faixa de partículas do site, em escala de cartão. */
      body::before {
        content: '';
        position: absolute;
        inset: -10%;
        opacity: 0.3;
        background-image:
          radial-gradient(circle, rgb(216 180 254 / 0.8) 0 1px, transparent 1.5px),
          radial-gradient(circle, rgb(192 132 252 / 0.6) 0 1px, transparent 1.5px);
        background-position: 0 0, 80px 120px;
        background-size: 180px 220px, 260px 300px;
        mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
      }

      .marca {
        position: relative;
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .marca img {
        width: 64px;
        height: 64px;
        object-fit: contain;
        border-radius: 18px;
        border: 1px solid rgb(168 85 247 / 0.3);
        background: rgb(168 85 247 / 0.1);
        padding: 8px;
        box-shadow: 0 0 22px rgb(168 85 247 / 0.4);
      }

      .marca span {
        font-size: 30px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      /* Mesmo tratamento de `.felixo-text-glow`, congelado no meio da animação. */
      h1 {
        position: relative;
        max-width: 900px;
        font-size: 78px;
        font-weight: 700;
        line-height: 1.1;
        background-image: linear-gradient(90deg, #fff 0%, #c084fc 55%, #fff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }

      p {
        position: relative;
        max-width: 860px;
        font-size: 28px;
        line-height: 1.5;
        color: #a1a1aa;
      }

      .rodape {
        position: relative;
        margin-top: 8px;
        font-size: 22px;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #c084fc;
      }
    </style>
  </head>
  <body>
    <div class="marca">
      <img src="__LOGO__" alt="" />
      <span>Blog do Felixo</span>
    </div>
    <h1>Programação descomplicada</h1>
    <p>
      Boas práticas, automações e notícias de tecnologia — o blog do FelixoVerse.
    </p>
    <div class="rodape">blog.felixo.com.br</div>
  </body>
</html>
"""


def montar_html() -> str:
    """Embute o logo como data URI para o navegador não depender de servidor."""
    logo_base64 = base64.b64encode(LOGO.read_bytes()).decode("ascii")
    return (
        GABARITO.replace("__LARGURA__", str(LARGURA))
        .replace("__ALTURA__", str(ALTURA))
        .replace("__LOGO__", f"data:image/png;base64,{logo_base64}")
    )


def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print(
            "Playwright não está instalado. Ele não é dependência do blog:\n"
            "  pip install playwright && playwright install chromium",
            file=sys.stderr,
        )
        return 1

    with sync_playwright() as p:
        # `PLAYWRIGHT_CHROMIUM` permite apontar um Chromium já baixado quando a
        # build que o pacote espera não é a que está na máquina — foi o caso
        # aqui, e sem isso o script morre pedindo `playwright install`.
        executavel = os.environ.get("PLAYWRIGHT_CHROMIUM") or None
        navegador = p.chromium.launch(executable_path=executavel)
        pagina = navegador.new_page(viewport={"width": LARGURA, "height": ALTURA})
        pagina.set_content(montar_html(), wait_until="networkidle")
        # A fonte vem do Google Fonts: sem esperar por ela, o cartão sai
        # renderizado na fonte de sistema — o erro mais fácil de não notar.
        pagina.wait_for_function("document.fonts.ready.then(() => true)")
        # JPEG em vez de PNG: o cartão é um gradiente escuro com texto, onde a
        # compressão com perda não aparece a olho nu e o arquivo cai de ~400 kB
        # para ~60 kB. É imagem que todo compartilhamento vai baixar.
        pagina.screenshot(path=str(SAIDA), type="jpeg", quality=92)
        navegador.close()

    print(f"Imagem gerada: {SAIDA.relative_to(RAIZ)} ({SAIDA.stat().st_size // 1024} kB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
