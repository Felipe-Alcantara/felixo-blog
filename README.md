# Blog do Felixo

Blog pessoal de [Felipe Alcântara](https://felixo.com.br/) — programação
descomplicada, boas práticas, automações e bastidores do FelixoVerse.

Site estático em **Astro + Tailwind CSS 4**, com posts em Markdown, publicado
automaticamente no GitHub Pages a cada push na `main`.

- **Produção**: https://blog.felixo.com.br
- **Identidade visual**: Felixo System Design (tema escuro, roxo `#C084FC`,
  Space Grotesk) — a mesma do portfólio.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:4321
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run check` | Verificação de tipos e do schema dos posts (roda no CI) |
| `npm run build` | Build estático em `dist/` |
| `npm run preview` | Serve o `dist/` já buildado |
| `npm run format` | Formata tudo com Prettier |

Requer Node 22.12 ou superior.

## Escrevendo um post

Crie um arquivo em `src/content/posts/`. **O nome do arquivo vira a URL**:
`meu-post.md` → `/posts/meu-post/`.

```markdown
---
titulo: 'Título do post'
descricao: 'Resumo de uma ou duas linhas — aparece na home, no RSS e no Google.'
publicadoEm: 2026-08-01
tags: ['Python', 'Automação']
---

O conteúdo em Markdown começa aqui.
```

Campos do frontmatter (validados no build — erro de digitação quebra o build de
propósito, em vez de publicar torto):

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | sim | Título do post |
| `descricao` | sim | Resumo usado em listagem, RSS e meta tags |
| `publicadoEm` | sim | Data de publicação (`YYYY-MM-DD`) |
| `atualizadoEm` | não | Data da última revisão |
| `tags` | não | Lista de tags; cada uma ganha sua página em `/tags/<slug>/` |
| `rascunho` | não | `true` mostra o post só em `npm run dev`, nunca em produção |

Blocos de código com marcação de linguagem (` ```python `) recebem realce de
sintaxe automaticamente.

## O que o site gera

- `/` — lista de posts, do mais recente para o mais antigo
- `/posts/<slug>/` — post individual, com tempo de leitura e tags
- `/tags/` e `/tags/<slug>/` — índice e listagem por assunto
- `/sobre` — página institucional
- `/rss.xml` — feed RSS
- `/sitemap-index.xml` — sitemap para buscadores
- `/404` — página de erro

## Deploy

O workflow `.github/workflows/deploy.yml` roda `npm ci`, `npm run check`,
`npm run build` e publica `dist/` no GitHub Pages a cada push na `main`.

Configuração necessária uma única vez no GitHub:

1. **Settings → Pages → Source**: selecionar **GitHub Actions**.
2. **Settings → Pages → Custom domain**: `blog.felixo.com.br` (o arquivo
   `public/CNAME` já acompanha o build).
3. No DNS de `felixo.com.br`, criar um registro `CNAME` de `blog` apontando para
   `felipe-alcantara.github.io`.

Para trocar o domínio, ajuste `site` em `astro.config.mjs`, o `public/CNAME` e a
constante `SITE.url` em `src/config/site.ts`.

## Estrutura

```
src/
├── components/     # Cabeçalho, rodapé, cartão de post
├── config/site.ts  # Título, descrição, links de navegação
├── content/posts/  # Os posts em Markdown
├── content.config.ts # Schema (frontmatter) validado no build
├── layouts/        # BaseLayout (HTML + SEO) e PostLayout
├── pages/          # Rotas do site
├── styles/         # Tema Tailwind e tipografia do corpo dos posts
└── utils/          # Listagem/ordenação de posts, tags, datas
```

## Licença

[MIT](LICENSE) para o código. Os textos dos posts são de autoria de Felipe
Alcântara.
