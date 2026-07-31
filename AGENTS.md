# AGENTS.md — Guia para agentes de IA

Blog estático em Astro. Leia isto antes de mexer em qualquer coisa; o
[`README.md`](README.md) cobre o uso do dia a dia e o [`IA.md`](IA.md) guarda o
histórico de decisões.

## Regras do projeto

- **Português em tudo**: código, comentários, nomes de variáveis, commits e
  conteúdo. `titulo`, não `title`.
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`,
  `post:` (usado para publicação de conteúdo).
- **Identidade visual é herdada**, não inventada: o blog segue o Felixo System
  Design (tema escuro, roxo `#C084FC`/`#A855F7`, Space Grotesk). Cores e fontes
  ficam centralizadas no bloco `@theme` de `src/styles/global.css`.
- **Nada de dependência nova sem necessidade real.** O site é estático de
  propósito: sem framework de UI, sem JS no cliente. Se uma feature exigir JS,
  prefira HTML/CSS primeiro.
- **Acessibilidade é obrigatória**: contraste AA, foco visível, `aria-current` na
  navegação, link de pular para o conteúdo, `prefers-reduced-motion` respeitado.
  Não regrida nenhum desses pontos.

## Onde mexer

| O pedido é sobre…                            | Arquivo                              |
| -------------------------------------------- | ------------------------------------ |
| Escrever ou editar um post                   | `src/content/posts/<slug>.md`        |
| Adicionar campo ao frontmatter               | `src/content.config.ts` (schema Zod) |
| Título, descrição, links de navegação/rodapé | `src/config/site.ts`                 |
| Cores, fontes, tipografia do corpo do post   | `src/styles/global.css`              |
| `<head>`, SEO, Open Graph, canonical         | `src/layouts/BaseLayout.astro`       |
| Cabeçalho do post, tags, tempo de leitura    | `src/layouts/PostLayout.astro`       |
| Home / listagem de posts                     | `src/pages/index.astro`              |
| Páginas de tag                               | `src/pages/tags/`                    |
| Feed RSS                                     | `src/pages/rss.xml.ts`               |
| Ordenação, filtro de rascunho, slug de tag   | `src/utils/posts.ts`                 |
| Domínio, sitemap, tema de realce de código   | `astro.config.mjs`                   |
| Deploy                                       | `.github/workflows/deploy.yml`       |

## Gate de qualidade

Antes de commitar, rode **os dois**:

```bash
npm run check   # tipos + schema dos posts
npm run build   # o build precisa passar; é o mesmo do CI
```

`npm run format` antes do commit mantém o diff limpo.

## Cuidados

- `post.id` é o nome do arquivo e **é a URL pública**. Renomear um post quebra
  links já compartilhados — só faça com pedido explícito.
- `rascunho: true` esconde o post apenas no build de produção; em `npm run dev`
  ele continua visível. Não use isso como controle de segredo.
- **Nunca escreva um link interno na mão** (`href="/tags"`). Hoje o site serve na
  raiz de `blog.felixo.com.br` e caminho absoluto até funcionaria, mas basta um
  `BASE_PATH` (preview em subpasta) para tudo quebrar de uma vez — CSS e
  navegação juntos, com o sintoma "a página só tem texto, sem design". Já
  aconteceu uma vez; ver `IA.md`. Use sempre `caminho()` de
  `src/utils/rotas.ts`.
- Trocar de domínio é mexer nas constantes `SITE`/`BASE` no topo de
  `astro.config.mjs` (ou nas variáveis `SITE_URL`/`BASE_PATH`), no
  `public/CNAME` e em `SITE.url` de `src/config/site.ts`. Ver a seção Deploy do
  README.
- Este repositório é **público**. Nada de token, `.env` ou dado pessoal de
  terceiros no conteúdo.
