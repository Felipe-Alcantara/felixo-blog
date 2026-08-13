# Felixo Editor

App desktop (Electron) para criar, editar e publicar posts do
[felixo-blog](../README.md) a partir da database "Artigos" do Notion, sem
precisar escrever Markdown na mão. Fonte da verdade continua sendo o `.md` do
repositório — o Notion entrega a pauta e o rascunho inicial do texto.

> Decisões e histórico completo: ver o registro `[2026-08-13]` em
> [`../IA.md`](../IA.md).

## Como rodar

Ainda não há `start_app.py` próprio: o menu do `start_app.py` da raiz deste
repositório vai ganhar as opções do editor numa fatia futura do plano. Por
enquanto, direto por npm:

```bash
cd app
npm install
cp .env.example .env   # preencha NOTION_TOKEN e NOTION_DATABASE_ID
npm run dev
```

## Scripts

| Comando         | O que faz                                             |
| --------------- | ------------------------------------------------------ |
| `npm run dev`     | Sobe o app em modo desenvolvimento (hot reload)       |
| `npm run build`   | Empacota os três processos (principal/ponte/interface) |
| `npm run check`   | Checagem de tipos (sem emitir arquivo)                |
| `npm run test`    | Roda a suíte de testes uma vez                        |
| `npm run test:watch` | Suíte de testes em modo observação                 |

## Estrutura

```
app/
├── src/
│   ├── principal/   # processo main — Notion, git, arquivos, publicação
│   ├── ponte/        # preload — único canal entre a janela e o principal
│   └── interface/     # renderer (React) — só UI, sem acesso a disco/rede
└── testes/
```

`principal/` é a única camada com privilégio de Node. `interface/` roda em
contexto isolado (`contextIsolation: true`, `nodeIntegration: false`,
`sandbox: true`) e só fala com o resto do app pelas funções tipadas expostas
em `ponte/contrato.ts` — nunca por um `ipcRenderer` genérico.

## Estado atual

Esqueleto inicial: janela abre, IPC de exemplo (`app:versao`) funcionando,
identidade visual herdada do blog, suíte de testes rodando. Notion, edição de
posts, mídia e publicação chegam nas próximas fatias — ver o plano no `IA.md`
da raiz.
