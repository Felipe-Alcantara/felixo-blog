# 🤖 IA.md — Contexto operacional do projeto

> **O que é**: memória técnica do blog para retomada de contexto por IA ou por um
> novo mantenedor, sem precisar reler todo o código ou o histórico de conversa.
> Baseado no template de contexto do Felixo System Design.
>
> **Regra**: as seções datadas são _append-only_ — acrescente registros novos, não
> reescreva os antigos. A exceção é o "ESTADO ATUAL", que é um resumo vivo.

---

## 📊 ESTADO ATUAL (RESUMO VIVO)

Última atualização: [2026-08-01]

- **Fase**: v1 entregue + revisão de front + auditoria de qualidade
  concluídas. Blog estático funcionando ponta a ponta — home, post, tags,
  sobre, RSS, sitemap, 404 e deploy automatizado — com identidade visual
  alinhada à do `Felipe-Portifolio` e `start_app.py` como porta de entrada.
- **Stack**: Astro 7 + Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript
  estrito, zero JavaScript no cliente. `start_app.py` (Python, só dev-tooling)
  usa `questionary`/`rich` para o menu — não entra no bundle do site.
- **Gate**: `npm run check` (0 erros) + `npm run build` (7 páginas) — ambos
  verdes em 2026-08-01. `npm audit`: 0 vulnerabilidades.
- **Conteúdo**: 1 post inaugural (`ola-mundo.md`).
- **Deploy**: GitHub Pages ativado por API (`build_type=workflow`); primeiro
  deploy verde em 2026-07-31. As mudanças de front e o `start_app.py` de
  2026-08-01 ainda não foram publicados (deploy só acontece a partir da
  `main`, via push).
- **URL ativa**: https://blog.felixo.com.br (domínio próprio, servindo na raiz).
- **Estado final**: não há pendência de publicação conhecida neste repositório.
  A seção "Em Breve" do repositório `Felipe-Portifolio` continua sendo uma
  tarefa separada, fora do escopo deste blog.

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

[2026-07-31] **Domínio próprio no ar.** `felixo.com.br` é gerido pelo DNS do
Registro.br (nameservers `*.sec.dns.br`), onde o portfólio já vive no GitHub
Pages (`www` → `felipe-alcantara.github.io`). O blog entrou pelo mesmo caminho:
registro `CNAME` de `blog` → `felipe-alcantara.github.io`. Só **depois** do DNS
resolver a API do Pages aceitou o `cname` — antes disso responde
`The certificate does not exist yet`, que é a ordem obrigatória, não um erro
transitório. Com o domínio ativo, `SITE`/`BASE` voltaram para a raiz e o
`public/CNAME` foi restaurado: ele é o que preserva o domínio a cada publicação
por Actions, já que o artefato substitui o conteúdo servido.

[2026-07-31] **GitHub Pages via GitHub Actions**, não branch `gh-pages`. O deploy
oficial (`upload-pages-artifact` + `deploy-pages`) dispensa commitar build e roda
o gate (`check` + `build`) antes de publicar. Domínio pretendido:
`blog.felixo.com.br`, com `public/CNAME` versionado.

[2026-07-31] **Retomada validada por Criar o meu Blog.** A configuração atual foi
confirmada após a leitura dos padrões relevantes do Felixo System Design:
`npm run check` passou sem erros e `npm run build` gerou as 7 páginas estáticas,
RSS e sitemap. O estado desta entrega está concluído; não há trabalho em
andamento neste contexto.

[2026-07-31] **Inventário da execução anterior consolidado por Criar o meu Blog.**
Claude criou o blog estático em Astro com identidade Felixo, conteúdo Markdown,
schema Zod, tags, sobre, RSS, sitemap, 404, acessibilidade e zero JavaScript no
cliente; corrigiu URLs para suportar GitHub Pages com `BASE_PATH` e o helper
`caminho()`; configurou GitHub Actions com `check` e `build`; ativou o domínio
`blog.felixo.com.br` com `public/CNAME`; registrou as decisões, o bug de CSS e
o deploy no `IA.md`; e validou a publicação com HTTP 200. Commits da execução:
`64a930a`, `e95a3f2`, `2d83a1e`, `adf756b` e a atualização final `b08de0d`.

[2026-08-01] **Front revisado por "Ajustar o front do meu blog" para se
aproximar do `Felipe-Portifolio`.** A task do Notion registrou que o v1 "ficou
com muita cara de IA" e pediu mais semelhança com o portfólio (React +
Tailwind + Framer Motion). Como o blog é estático de propósito (zero JS no
cliente), a aproximação foi feita só com CSS: os componentes `Button`/`Badge`
do portfólio viraram classes `.felixo-botao` (pílula com brilho roxo e reflexo
passando via `::before` + `transition`, sem nenhuma dependência de JS) e
`.felixo-card-glow` ganhou uma animação de respiração (`@keyframes
felixo-respirar-brilho`) no hover, no lugar do box-shadow estático — mesma
linguagem visual do `card-glow-breathe` do portfólio. Aplicado em: CTAs novos
na home ("Ver posts", "Ver portfólio", "Assinar RSS"), botão da 404, cards de
post (`rounded-3xl`, borda mais visível) e nas tags (viraram badges
maiúsculas/`tracking-wider`, no padrão do `Badge` do portfólio). O logo do
cabeçalho ganhou o mesmo glow do ícone da navbar do portfólio. A animação
respeita `prefers-reduced-motion` porque cai na regra global já existente em
`global.css` que zera `animation-duration`. Validado com `npm run check` (0
erros), `npm run build` (7 páginas) e captura de tela via Chromium headless
(Playwright baixado à parte, fora do projeto) nas rotas `/`, `/posts/ola-mundo/`
e `/tags/` — sem erros de console e com o hover do card confirmado
visualmente. Estado desta entrega: concluído.

[2026-08-01] **Repositório auditado contra o Felixo System Design (Guia
Mínimo de Qualidade).** Pedido explícito: "colocar o repositório no padrão de
qualidade e trazer a identidade visual do felixo.com.br". A identidade visual
já tinha sido tratada na entrega anterior deste mesmo dia; esta rodada focou
no checklist de qualidade (`GUIA_MINIMO_QUALIDADE.md`). Achados:
`npm audit` sem vulnerabilidades, lockfile commitado, dependências pinadas —
ok. Gap real encontrado: faltava o `start_app.py` na raiz, exigido pelo
`GUIA-START-APP-SCRIPT.md` para **todo programa**, incluindo sites — os
projetos irmãos (`Felipe-Portifolio`, `Felixo-AI-Core`) já têm o deles.
Adicionado `start_app.py` com menu interativo (`questionary` + `rich`, únicas
dependências Python do repo, listadas em `requirements.txt` e usadas só para
desenhar o menu — o blog continua Node/Astro puro) cobrindo as quatro ações
mínimas do contrato: **Iniciar/Rodar** (`npm run dev` ou build+preview, com
abertura automática do navegador), **Instalar/Setup** (`npm install`),
**Configurar** (overrides de `SITE_URL`/`BASE_PATH` só para a sessão do menu,
para testar um preview em subpasta sem tocar no deploy real) e
**Status/Sair** (versão do Node, dependências, porta 4321, branch e
alterações git). O bootstrap do menu contorna Python "externally managed"
(PEP 668) com fallback `--user` → `--break-system-packages`, no mesmo padrão
já validado no `Felixo-AI-Core`. `README.md` atualizado para documentar
`python3 start_app.py` como forma principal de rodar o projeto, com o fluxo
`npm install`/`npm run dev` mantido logo abaixo como alternativa direta.
Validado executando o menu de ponta a ponta via pty (navegação por setas,
abertura da tela de Status com dados reais, saída limpa com código 0) — sem
esse teste seria só "deve funcionar", não validação. `npm run check` e
`npm run build` seguem verdes após a mudança. Nenhuma outra lacuna do guia
mínimo foi encontrada: responsabilidades já separadas, contratos (`caminho()`,
schema Zod) preservados, segurança de frontend (seção 10 do design system)
já coberta — todo link `target="_blank"` já usava `rel="noopener noreferrer"`.
Estado desta entrega: concluído.

---

## 📁 ESTRUTURA E CONVENÇÕES

[2026-07-31] Português em todo o código (`titulo`, `descricao`, `publicadoEm`),
Conventional Commits com o tipo extra `post:` para publicação de conteúdo.
Identidade visual centralizada no bloco `@theme` de `src/styles/global.css` —
cor de marca `#C084FC` / `#A855F7`, fundo Zinc/preto, Space Grotesk.

O nome do arquivo do post é o slug público (`meu-post.md` → `/posts/meu-post/`);
renomear quebra links já compartilhados.

[2026-08-01] `start_app.py` na raiz é a porta de entrada padrão do repositório
(contrato do Felixo System Design) — menu interativo em `questionary`/`rich`
para instalar, rodar, configurar e checar o status do blog. Único uso de
Python no projeto; suas dependências ficam em `requirements.txt`, isoladas do
`package.json`.

---

## 🐛 PROBLEMAS RESOLVIDOS

[2026-07-31] `astro check` acusava `props` como `unknown` nas rotas dinâmicas
(`posts/[...id].astro` e `tags/[tag].astro`): o tipo `GetStaticPaths` não propaga
as props para `Astro.props`. Resolvido declarando `interface Props` explícita em
cada rota e anotando `Astro.props as Props`.

[2026-07-31] **"A página só tem texto, sem design nenhum."** O primeiro deploy
saiu com `site` apontando para `blog.felixo.com.br` e sem `base`, então todo
caminho absoluto (`/_astro/...css`, `/posts/...`) dava 404 na URL real do GitHub
Pages, que serve numa subpasta (`/felixo-blog/`). Como o DNS do domínio próprio
ainda não existia, o site ficou só com o HTML.

Correção: `base: '/felixo-blog'` no `astro.config.mjs` (com `SITE`/`BASE` em
constantes trocáveis, também via env `SITE_URL`/`BASE_PATH`) e um helper
`caminho()` em `src/utils/rotas.ts` por onde passam **todos** os links internos —
incluindo favicon, feed RSS, links do rodapé e os `link` dos itens do RSS. O
comparador de rota ativa do cabeçalho descarta o prefixo `base` antes de comparar.
O `public/CNAME` foi removido do build: ele só faz sentido quando o domínio
próprio entrar, e no mesmo momento em que `BASE` volta para `/`.

**Lição registrada no `AGENTS.md`**: link interno escrito na mão é bug latente
neste projeto; sempre `caminho()`.

[2026-07-31] O npm 11 bloqueia scripts de pós-instalação por padrão, e o
`esbuild` precisa do dele para baixar o binário da plataforma. Sem
`npm approve-scripts esbuild` o build falha. No CI o `npm ci` já respeita o campo
`allowScripts` gravado no `package.json`.
