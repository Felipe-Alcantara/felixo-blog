# 🤖 IA.md — Contexto operacional do projeto

> **O que é**: memória técnica do blog para retomada de contexto por IA ou por um
> novo mantenedor, sem precisar reler todo o código ou o histórico de conversa.
> Baseado no template de contexto do Felixo System Design.
>
> **Regra**: as seções datadas são *append-only* — acrescente registros novos, não
> reescreva os antigos. A exceção é o "ESTADO ATUAL", que é um resumo vivo.

---

## 📊 ESTADO ATUAL (RESUMO VIVO)

Última atualização: [2026-07-31]

- **Fase**: v1 entregue. Blog estático funcionando ponta a ponta — home, post,
  tags, sobre, RSS, sitemap, 404 e deploy automatizado.
- **Stack**: Astro 7 + Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript
  estrito, zero JavaScript no cliente.
- **Gate**: `npm run check` (0 erros) + `npm run build` (7 páginas) — ambos
  verdes em 2026-07-31.
- **Conteúdo**: 1 post inaugural (`ola-mundo.md`).
- **Deploy**: GitHub Pages ativado por API (`build_type=workflow`); primeiro
  deploy verde em 2026-07-31.
- **Pendência do usuário (fora do código)**: criar o registro `CNAME` de `blog`
  apontando para `felipe-alcantara.github.io` no DNS de `felixo.com.br`. A API
  do Pages recusa configurar o domínio antes disso ("The certificate does not
  exist yet"); assim que o DNS resolver, o `public/CNAME` versionado assume no
  deploy seguinte. **Enquanto isso**, a URL provisória
  `felipe-alcantara.github.io/felixo-blog/` serve o HTML mas quebra CSS e links,
  porque o build usa caminhos a partir da raiz do domínio — comportamento
  esperado, não bug.
- **Pendência conhecida**: a seção "Em Breve" do repositório `Felipe-Portifolio`
  (`src/sections/blog.jsx`) ainda aponta para `#blog`; precisa passar a apontar
  para `https://blog.felixo.com.br` quando o domínio estiver no ar.

---

## 🎯 OBJETIVO DO PROJETO

[2026-07-31] O blog nasce da task "Criar o meu Blog" do Notion. Objetivo: um
espaço próprio para publicar sobre programação descomplicada, boas práticas,
automações e o desenvolvimento do FelixoVerse (incluindo os ARGs), além de
comentários sobre notícias de tecnologia.

Referências declaradas na task: [akitaonrails.com](https://akitaonrails.com/) e
[rapha.land](https://rapha.land/) como modelo de blog (texto no centro, sem
distração), e [felixo.com.br](https://felixo.com.br/) como padrão de design.

Público: pessoas aprendendo programação e desenvolvedores acompanhando os
projetos do FelixoVerse. Distribuição: site público e feed RSS.

---

## 🏛️ DECISÕES DE ARQUITETURA

[2026-07-31] **Astro em vez de Vite+React (a stack do portfólio).** O blog é
conteúdo, não aplicação: renderização estática entrega HTML pronto, o que dá SEO
e tempo de carregamento melhores do que uma SPA que baixa React para exibir
texto. Astro também traz coleções de conteúdo com schema validado, realce de
sintaxe no build e integrações oficiais de RSS e sitemap. **Trade-off aceito**:
não dá para reaproveitar diretamente os componentes React do portfólio; a
identidade visual foi reimplementada em CSS/Tailwind. Se um dia o blog precisar
de ilhas interativas, `@astrojs/react` resolve sem trocar a stack.

[2026-07-31] **Posts em Markdown no repositório, não em CMS nem no Notion.**
Conteúdo versionado junto do código: histórico no git, revisão por diff e zero
dependência externa em runtime. Uma futura ponte Notion → Markdown continua
possível (o ecossistema `Automa-es-do-Notion` já tem a CLI para isso), mas seria
um gerador de arquivos, não uma dependência de build.

[2026-07-31] **Tipografia do corpo do post escrita à mão, sem plugin de prose.**
`@tailwindcss/typography` traria um tema genérico que precisaria ser sobrescrito
quase por completo para bater com a identidade Felixo. A classe `.conteudo-post`
em `src/styles/global.css` faz o mesmo com menos dependência e controle total das
cores de marca.

[2026-07-31] **Frontmatter validado por schema Zod** (`src/content.config.ts`).
Erro de digitação em campo de post quebra o build em vez de publicar torto —
falha cedo, no CI, não na cara do leitor.

[2026-07-31] **Zero JavaScript no cliente.** Nenhuma página envia JS. Toda
interação (hover, foco, navegação) é HTML e CSS. Manter assim é uma regra, não um
acaso — está registrada no `AGENTS.md`.

[2026-07-31] **GitHub Pages via GitHub Actions**, não branch `gh-pages`. O deploy
oficial (`upload-pages-artifact` + `deploy-pages`) dispensa commitar build e roda
o gate (`check` + `build`) antes de publicar. Domínio pretendido:
`blog.felixo.com.br`, com `public/CNAME` versionado.

---

## 📁 ESTRUTURA E CONVENÇÕES

[2026-07-31] Português em todo o código (`titulo`, `descricao`, `publicadoEm`),
Conventional Commits com o tipo extra `post:` para publicação de conteúdo.
Identidade visual centralizada no bloco `@theme` de `src/styles/global.css` —
cor de marca `#C084FC` / `#A855F7`, fundo Zinc/preto, Space Grotesk.

O nome do arquivo do post é o slug público (`meu-post.md` → `/posts/meu-post/`);
renomear quebra links já compartilhados.

---

## 🐛 PROBLEMAS RESOLVIDOS

[2026-07-31] `astro check` acusava `props` como `unknown` nas rotas dinâmicas
(`posts/[...id].astro` e `tags/[tag].astro`): o tipo `GetStaticPaths` não propaga
as props para `Astro.props`. Resolvido declarando `interface Props` explícita em
cada rota e anotando `Astro.props as Props`.

[2026-07-31] O npm 11 bloqueia scripts de pós-instalação por padrão, e o
`esbuild` precisa do dele para baixar o binário da plataforma. Sem
`npm approve-scripts esbuild` o build falha. No CI o `npm ci` já respeita o campo
`allowScripts` gravado no `package.json`.
