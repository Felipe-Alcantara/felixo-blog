# Felixo Editor

App desktop (Electron) para criar, editar e publicar posts do
[felixo-blog](../README.md) a partir da database "Artigos" do Notion, sem
precisar escrever Markdown na mão. Fonte da verdade continua sendo o `.md` do
repositório — o Notion entrega a pauta e o rascunho inicial do texto; depois
de importado, quem manda é o arquivo.

> Decisões e histórico completo: ver os registros datados `2026-08-13` em
> [`../IA.md`](../IA.md).

## Como rodar

Forma mais simples — pelo menu do blog, que também instala/verifica:

```bash
python3 start_app.py   # na raiz do repositório → Iniciar/Rodar → Felixo Editor
```

Direto por npm:

```bash
cd app
npm install
cp .env.example .env   # preencha NOTION_TOKEN e NOTION_DATABASE_ID
npm run dev
```

Sem `.env` preenchido o app abre normalmente — só a aba "Notion" fica sem
dados até você configurar (pela tela "Notion" dentro do app, ou editando o
`.env` direto).

## O que o app faz

- **Posts**: listar, criar, editar e salvar `.md` em `src/content/posts/`,
  com frontmatter validado contra o mesmo schema do Astro
  (`src/content.config.ts` — `testes/esquema-paridade.teste.ts` garante que
  os dois nunca divergem).
- **Notion**: conectar na database "Artigos" (token + ID, telas
  "Notion"/"Importar do Notion"), listar artigos, importar um deles
  convertendo os blocos do Notion para Markdown (parágrafo, headings,
  listas, citação, callout, código com linguagem, imagem, divisória — bloco
  não suportado vira comentário HTML visível, nunca some em silêncio) e
  baixando as imagens (as URLs do Notion expiram).
- **Mídia**: colar/arrastar imagem no editor (otimizada para webp,
  redimensionada); gerar a capa do post reaproveitando
  `scripts/gerar-og-image.py` do blog.
- **Publicar**: roda o mesmo gate do CI (`npm run check` + `npm run build`
  do blog), `git pull --rebase`, `git add` **só** dos arquivos daquele post
  (nunca `-A` — o repositório recebe trabalho de mais de um agente/pessoa em
  paralelo), commit `post: <título>` e push. Se o post veio do Notion, tenta
  (best-effort, sem desfazer a publicação caso falhe) escrever a URL e o
  status de volta na página de origem.

## Scripts

| Comando               | O que faz                                               |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`           | Sobe o app em modo desenvolvimento (hot reload)          |
| `npm run build`         | Empacota os três processos (principal/ponte/interface)   |
| `npm run check`         | Checagem de tipos (sem emitir arquivo)                   |
| `npm run test`          | Roda a suíte de testes uma vez                           |
| `npm run test:watch`    | Suíte de testes em modo observação                        |

## Estrutura

```
app/
├── src/
│   ├── principal/   # processo main — Notion, git, arquivos, publicação
│   │   ├── posts/       # schema, slug, leitura/escrita do .md
│   │   ├── notion/       # cliente, conversão de blocos, importação
│   │   ├── midia/         # otimização de imagem, geração de capa
│   │   ├── publicacao/     # gate de qualidade + git
│   │   └── config/          # .env (token do Notion)
│   ├── ponte/        # preload — único canal entre a janela e o principal
│   └── interface/     # renderer (React) — só UI, sem acesso a disco/rede
└── testes/
```

`principal/` é a única camada com privilégio de Node. `interface/` roda em
contexto isolado (`contextIsolation: true`, `nodeIntegration: false`,
`sandbox: true`) e só fala com o resto do app pelas funções tipadas expostas
em `ponte/contrato.ts` — nunca por um `ipcRenderer` genérico.

## Dependências externas "sob demanda"

- **Notion**: token de integração interna, criado em
  [notion.so/my-integrations](https://www.notion.so/my-integrations) —
  compartilhe a database "Artigos" com a integração depois de criá-la.
- **Capa do post**: reaproveita `scripts/gerar-og-image.py`, que exige Python
  3 + [Playwright](https://playwright.dev/python/) instalados
  (`pip install playwright && playwright install chromium`) — mesma
  dependência que o script já tinha antes deste app existir. Sem isso, o
  botão "Gerar capa" falha com uma mensagem explicando o que instalar (não
  trava em silêncio).

## Estado atual

Fatias 1 a 6 do plano concluídas: esqueleto do app, CRUD de posts, conexão
com o Notion, importação de artigos como Markdown, templates (reaproveita a
importação — não há mecanismo separado) + mídia + capa por post, e
publicação com gate + git seletivo + escrita de volta no Notion. Suíte de
testes cobrindo cada uma dessas camadas, incluindo publicação testada contra
repositórios git reais em diretório temporário.

**Pendência conhecida**: a integração com o Notion não foi validada contra
uma conta/token reais — quem for usar precisa preencher `app/.env` e
conferir pela tela "Notion" ("Testar conexão") que a database é encontrada
corretamente antes de importar artigos de verdade.
