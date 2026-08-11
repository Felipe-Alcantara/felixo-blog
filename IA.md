# 🤖 IA.md — Contexto operacional do projeto

> **O que é**: memória técnica do blog para retomada de contexto por IA ou por um
> novo mantenedor, sem precisar reler todo o código ou o histórico de conversa.
> Baseado no template de contexto do Felixo System Design.
>
> **Regra**: as seções datadas são _append-only_ — acrescente registros novos, não
> reescreva os antigos. A exceção é o "ESTADO ATUAL", que é um resumo vivo.

---

## 📊 ESTADO ATUAL (RESUMO VIVO)

Última atualização: [2026-08-10]

- **Fase**: v1 entregue + revisão de front + auditoria de qualidade + **comentários
  via giscus** + **alinhamento visual de frontend e imagens** + **revisão final de
  release (2026-08-10)** concluídos. Blog
  estático funcionando ponta a ponta — home, post, tags, sobre, RSS, sitemap,
  404, comentários e deploy automatizado — com listagem de posts em coluna única
  e quadros inteiros clicáveis, identidade visual alinhada à do
  `Felipe-Portifolio` e `start_app.py` como porta de entrada.
- **Stack**: Astro 7 + Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript
  estrito, zero JavaScript no cliente **exceto** o script de terceiro do giscus
  (comentários), inerentemente dinâmico. `start_app.py` (Python, só dev-tooling)
  usa `questionary`/`rich` para o menu — não entra no bundle do site.
- **Gate**: `npm run check` (0 erros) + `npm run build` (7 páginas) — ambos
  verdes em 2026-08-05. `npm audit`: 0 vulnerabilidades.
- **Conteúdo**: 1 post inaugural (`ola-mundo.md`). Existe também um post de
  teste local (`testando-os-recursos-do-blog.md`, `rascunho: true`) usado só
  para auditar a renderização de Markdown — **nunca commitado de propósito**,
  fica de fora do controle de versão.
- **Comentários**: giscus (GitHub Discussions), sem back-end próprio. Ver seção
  "🔗 INTEGRAÇÕES E SERVIÇOS EXTERNOS" para IDs, categoria e tema customizado.
- **Deploy**: GitHub Pages ativado por API (`build_type=workflow`); primeiro
  deploy verde em 2026-07-31. Identidade visual, `start_app.py` e comentários
  via giscus já publicados (push feito, deploy verde em 2026-08-05).
- **URL ativa**: https://blog.felixo.com.br (domínio próprio, servindo na raiz).
- **Compartilhamento**: cartão Open Graph próprio em `public/og-image.jpg`,
  gerado por `scripts/gerar-og-image.py` (Playwright, sob demanda — não entra no
  build). Regerar sempre que o título ou a chamada da home mudarem.
- **Estado final**: pronto para divulgação. Não há pendência de publicação
  conhecida neste repositório. Fica **uma decisão para o dono**: o blog assina
  "Felipe Alcântara" e o portfólio assina "Felipe Martin" — os dois são ele, mas
  quem lê os dois lado a lado vê dois nomes. A seção "Em Breve" do repositório
  `Felipe-Portifolio` continua sendo uma tarefa separada, fora do escopo deste
  blog.

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

[2026-08-05] **Comentários via giscus, não Disqus nem back-end próprio.**
Pergunta de origem: como o `akitaonrails.com` (referência declarada no objetivo
do projeto) tem comentários com repositório público. Investigação: o blog do
Akita usa **Disqus** — um iframe (`layouts/partials/components/comments.html`)
aponta pra um shortname público; todo o armazenamento vive nos servidores do
Disqus, nada de segredo no repo dele.

**Alternativas consideradas:**

1. **Disqus** (igual ao Akita) — descartado: injeta anúncios/rastreamento no
   plano gratuito, e os dados de comentário ficam presos numa empresa fechada,
   sem export natural pro próprio repositório — contraria o espírito "blog
   open source" do projeto.
2. **Back-end próprio** (API + banco hospedados, ex. Railway) — mais controle,
   mas exige manter servidor, moderação e spam por conta própria. Adiado: sem
   necessidade real hoje (regra 4 do Guia Mínimo — simplicidade verificável).
3. **giscus** (escolhido) — usa GitHub Discussions do próprio repo como
   armazenamento. Zero servidor, zero conta de terceiro além do GitHub que o
   projeto já usa, dados portáveis (visíveis/exportáveis via API do GitHub a
   qualquer momento, sem lock-in).

**Trade-off aceito**: exige que o visitante tenha conta GitHub pra comentar —
filtra o público geral, mas o público-alvo declarado (devs, acompanhando o
FelixoVerse) majoritariamente já tem conta. Caminho de evolução combinado com
o usuário: migrar pra back-end próprio no futuro caso essa barreira vire
problema real; os comentários do giscus não se perdem nessa transição, ficam
arquiváveis via API do GitHub.

**Implementação:** `has_discussions` habilitado via API do GitHub
(`gh api -X PATCH .../felixo-blog -f has_discussions=true`); categoria de
Discussion usada: **"Announcements"** (padrão do repo, formato que só permite
mantenedor/app criar discussão — o mesmo formato que o giscus recomenda pra
evitar discussão solta criada por visitantes). Não criei uma categoria
"Comentários" dedicada porque a API do GitHub **não expõe mutation** pra criar
categoria de Discussion (só a interface web) — registrado aqui como limitação
conhecida, não pendência esquecida.

Componente novo: `src/components/Comentarios.astro`, plugado no fim do
`PostLayout.astro`. Config centralizada em `GISCUS` (`src/config/site.ts`) —
`repoId`/`categoriaId` não são segredo (aparecem no HTML renderizado de
qualquer site que usa giscus). Tema customizado em `public/temas/giscus.css`
(derivado do tema "dark" oficial do giscus, MIT) trocando o azul/verde padrão
do GitHub pelo roxo `#C084FC`/`#A855F7` e o fundo cinza pelo preto/zinc do
resto do site — o preset genérico (`dark_dimmed`) destoava visualmente do
resto do blog.

**Validado com evidência real de execução** (regra 8 do Guia Mínimo), em duas
rodadas: (1) Chromium headless via Playwright abrindo `/posts/ola-mundo/` em
`npm run dev`, confirmando o iframe do giscus carregado sem erro de "app não
instalado" (`0 reações`, `0 comentários`, botão "Entre com GitHub"); um
comentário real de teste (`@Iasminmins`) apareceu na Discussion
[`#1`](https://github.com/Felipe-Alcantara/felixo-blog/discussions/1) logo
depois, confirmando o ciclo completo funcionando em produção. (2) Após o tema
customizado, novo screenshot **contra a URL de produção já publicada**
(`blog.felixo.com.br`), confirmando visualmente o roxo da marca no botão e no
fundo preto — o primeiro teste, contra `localhost`, deu falso-negativo (tema
CSS ainda não publicado = 404 = giscus trava em opacidade baixa) e o segundo,
apontando a `data-theme` pro próprio `localhost`, foi bloqueado por CORS
(`private network access` do Chromium não deixa uma origem pública como
`giscus.app` buscar um recurso em `localhost`) — por isso a validação final
só é confiável contra o domínio real, publicado. `npm run check` e
`npm run build` seguem verdes. Estado desta entrega: concluído.

---

## 🔗 INTEGRAÇÕES E SERVIÇOS EXTERNOS

[2026-08-05] **giscus** (comentários via GitHub Discussions) —
`src/config/site.ts` (`GISCUS`) e `src/components/Comentarios.astro`.
Repositório: `Felipe-Alcantara/felixo-blog`, categoria `Announcements`.
Requer o GitHub App [giscus](https://github.com/apps/giscus) instalado no
repo (autorização manual, feita pelo dono do repo — nenhuma API cobre esse
passo). Tema customizado servido em `/temas/giscus.css` (arquivo público,
sem segredo). Nenhuma credencial ou variável de ambiente envolvida: todos os
IDs usados (`repoId`, `categoriaId`) são públicos por natureza do protocolo.

[2026-08-05] **Alinhamento de Front-End e imagens por Alinhamento de Front-End.**
O shell do blog passou a usar a composição ampla e responsiva do portfólio
(`max-w-7xl`, grid mobile-first e cards em duas colunas quando há espaço), com
ambiente visual em camadas de CSS, gradiente animado nos títulos e glow de foto
inspirado no `Felixo-Portifolio`. O cabeçalho agora reutiliza o logo do
portfólio (`public/imagens/logo-felixo.png`) e a página Sobre ganhou a foto de
perfil (`public/imagens/foto-felipe.jpg`) com tratamento responsivo, vinheta e
glow; imagens Markdown também receberam borda, sombra e estado de hover.
Nenhuma dependência ou JavaScript de interface foi adicionado; `caminho()`,
`aria-current`, skip link, foco visível e `prefers-reduced-motion` foram
preservados. Validação concluída com `npm run format`, `npm run check`,
`npm run build` e HTTP 200 nas rotas `/`, `/sobre`, `/posts/ola-mundo/`,
`/tags/`, `/rss.xml` e nos dois assets. **Estado desta entrega: concluído.**

[2026-08-05] **Listagem de posts em coluna única e quadro clicável por
Alinhamento de Front-End.** A home e as páginas de tag voltaram para uma lista
vertical; cada cartão agora tem um link de cobertura acessível que leva ao post
inteiro ao clicar em qualquer área livre do quadro. Os badges de tag continuam
com seus próprios links para não perder a navegação por assunto. `CartaoPost`
mantém a semântica de artigo, foco visível e suporte a teclado. Validado com
`npm run format`, `npm run check` e `npm run build`. A mesma validação corrigiu
a separação visual da contagem de posts na página de tag (`1post` → `1 post`).
**Estado desta entrega: concluído.**

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

[2026-08-02] **Auditoria visual (Chromium headless via Playwright, instalado à
parte) achou dois bugs reais**, verificados com um post de teste cobrindo todo
o Markdown suportado (GFM completo, H2–H6, tabela com alinhamento, imagem,
código com e sem linguagem):

1. `src/pages/tags/[tag].astro` renderizava **"2posts"** sem espaço. Causa:
   `{posts.length}` e a expressão seguinte (`'post'`/`'posts'`) em linhas
   separadas — o Astro colapsa a quebra de linha entre expressões adjacentes,
   igual JSX. Corrigido juntando as duas na mesma linha.
2. `.conteudo-post` em `global.css` não estilizava **H5/H6** (saíam idênticos
   a um parágrafo, sem negrito nem cor de título) e **H4** não tinha
   `font-size` próprio (herdava o tamanho do corpo do texto, só com negrito).
   Também faltava estilo para **lista de tarefas** do GFM (`- [ ]`): checkbox
   com a cor padrão cinza do navegador, com um bullet redundante do lado.
   Corrigido: H4/H5/H6 ganharam escala tipográfica própria (H6 tratado como
   rótulo maiúsculo roxo, reaproveitando o padrão de "olho de seção" já usado
   em outras páginas); `li.task-list-item` perdeu o bullet e o checkbox ganhou
   `accent-color` da marca.

Cada correção foi validada com estilo computado real via Playwright
(`getComputedStyle`), não só inspeção visual do print — ex.:
`accentColor: "rgb(168, 85, 247)"`, `listStyleType: "none"`,
`textTransform: "uppercase"` no H6. `npm run check` e `npm run build`
seguem verdes. O post de teste que gerou a auditoria ficou de fora do commit,
de propósito (ver ESTADO ATUAL).

[2026-08-10] **Revisão final de front antes da divulgação** (task do Notion
"Revisar e finalizar o front do blog antes de divulgar"). A parte estrutural já
estava sólida e a identidade já vinha alinhada das rodadas anteriores, então
esta rodada foi de acabamento, com tudo verificado no navegador em vez de no
olho — mesmo método da auditoria de 2026-08-02.

**O que estava faltando de verdade, em ordem de gravidade:**

1. **Nenhuma imagem de compartilhamento.** O `<head>` não tinha `og:image` nem
   `twitter:image`: qualquer link do blog colado no WhatsApp, LinkedIn ou X sairia
   como um retângulo vazio. Para uma tarefa cujo objetivo é _divulgar_, era o
   defeito mais caro e o menos visível navegando no site. Criado
   `scripts/gerar-og-image.py`, que **renderiza o cartão no próprio navegador**
   (Playwright) em vez de desenhá-lo com uma biblioteca de imagem — assim o
   cartão usa o mesmo gradiente, o mesmo brilho de ametista e a mesma Space
   Grotesk do site, e não diverge no primeiro ajuste de marca. JPEG em vez de PNG:
   64 kB contra 397 kB, sem diferença visível num gradiente escuro com texto.
   Entraram junto `og:locale`, `og:image:alt`, dimensões e `twitter:site`
   (`@Felixo_Tech`, o mesmo perfil do portfólio).

2. **Contraste abaixo de AA em todo texto secundário.** `text-zinc-500` sobre o
   fundo preto mede **4,35:1**, e o mínimo para texto normal é 4,5 — medido no
   navegador, não estimado. Aparecia em data do post, rodapé, contadores de tag,
   rótulos de seção e nos avisos do giscus. Trocado por `text-zinc-400` (8,01:1).
   O `AGENTS.md` deste repositório lista contraste AA como obrigatório, então isto
   era regressão de uma regra própria, não preferência.
   A varredura final passou a acusar **0 falhas em 6 páginas**, com a pior razão
   em 7,09:1.

   _Nota de método_: a primeira versão do script de auditoria deu falso positivo
   em tudo, porque lia `getComputedStyle().color` com uma expressão regular de
   `rgb()` — e o Tailwind 4 emite `oklch()`. A versão que vale resolve a cor
   pintando num `<canvas>` e lendo o pixel, deixando a conversão com o navegador.
   Texto com `background-clip: text` (os títulos com brilho) é excluído de
   propósito: a cor dele é `transparent` e não há razão de contraste a medir.

3. **Cabeçalho cortado no celular.** Em 360px a marca e os três links não cabiam
   na mesma linha e "Sobre" ficava clipado na borda. O `overflow-x-auto` que
   existia "resolvia" virando um trilho de rolagem horizontal que ninguém percebe
   que rola. Trocado por `flex-wrap`: a navegação cai para a linha de baixo, nada
   é escondido. Verificado em 320, 360 e 414px — sem estouro horizontal e com o
   último link dentro da tela nos três.

**Ícones num conjunto só.** Já eram todos Lucide (a mesma família do
`lucide-react` do portfólio), mas colados inline, com os dez atributos repetidos
em cada um — e duas navegações usavam `←` de texto, que não é da família. Agora
há `src/components/Icone.astro`: um registro único de formas, com grid de 24,
traço 2 e pontas arredondadas fixos, e um `tamanho` restrito a 16 (junto de
texto) ou 20 (junto de título). Sem dependência nova — o site continua sem
JavaScript de interface, como manda o `AGENTS.md`.

**Duplicação removida.** A pílula de tag estava escrita duas vezes, com a mesma
lista de classes, no cartão da home e no cabeçalho do post; virou
`src/components/Etiqueta.astro`. Saíram também `--felixo-glow-intensity`
(declarada em `:root`, lida por ninguém — veio junto na cópia do portfólio, onde
ela de fato controla o brilho) e a classe `felixo-foto-perfil`, usada na página
Sobre e definida em lugar nenhum.

**Build sem aviso.** `z` reexportado por `astro:content` está deprecado no Astro
7; passou a vir de `astro/zod`, que é o caminho que os próprios tipos gerados
usam. `npm run check` foi de 9 hints para **0 erros, 0 avisos, 0 hints**.

**Uma correção de texto.** A home repetia "Programação descomplicada" no `h1` e
nas primeiras palavras do parágrafo logo abaixo, porque o parágrafo reusava
`SITE.descricao`. A descrição é escrita para buscador e cartão de
compartilhamento, onde repetir o nome ajuda; na tela, incomoda. Criado
`SITE.chamada` para a home, sem mexer na descrição.

**Verificação lado a lado**: blog e portfólio abertos no mesmo navegador, mesma
viewport, com print dos dois. Fonte computada idêntica (Space Grotesk), mesmo
fundo preto com brilho roxo, mesma família de ícone, mesmo tratamento de título
com gradiente. `npm run check`, `npm run build` (7 páginas) e `npm run format`
verdes.

**Pendência que não é código**: o blog assina "Felipe Alcântara" (`SITE.autor`) e
o portfólio assina "Felipe Martin". Não foi alterado por conta própria — é o nome
do dono, e escolher por ele seria passar do ponto. Se os dois sites devem ler
como a mesma pessoa, o ajuste é de uma linha em `src/config/site.ts` e do `alt`
do retrato em `src/pages/sobre.astro`.

[2026-08-10] **Primeiro artigo de conteúdo escrito para o blog** (task do Notion
"Reescrevendo a internet: Sendo otimista sobre IAs"). O texto nasceu na database
de Artigos do Notion, que é a central de escrita, e chegou aqui como
`src/content/posts/reescrevendo-a-internet.md` com **`rascunho: true`** — a
publicação depende de revisão do dono, e a flag garante que ele fica fora do
build de produção até lá (o build seguiu com 7 páginas, sem contar o novo post).

Vale registrar o método, porque ele é o que o modelo de artigo da database
manda e foi o que pegou dois erros meus: **fonte que não foi aberta não entra**.
Três afirmações factuais sustentam o texto — a palavra do ano do Merriam-Webster,
um estudo da Graphite sobre a proporção de artigos gerados por IA, e a
atualização Panda de 2011 — e abrir as três, em vez de confiar no resumo da
busca, mudou duas delas:

1. A evolução do sentido da palavra "slop" que eu tinha escrito (lama mole →
   restos de comida → lixo) só é sustentada em parte pela fonte, que fala de
   "lama mole" e depois "algo de pouco valor". O trecho passou a dizer o que a
   fonte diz.
2. Search Engine Land e Search Engine Journal **divergem em um dia** sobre a
   data do Panda (23 ou 24 de fevereiro de 2011). O texto passou a citar só o
   mês, com a divergência registrada entre parênteses.

Também entrou a formulação oficial do Google sobre o alvo do Panda ("reduzir o
ranqueamento de sites de baixa qualidade"), com a nota de que _content farms_
foi o alvo entendido e não o declarado.

A renderização foi conferida no navegador com o servidor de desenvolvimento, que
mostra rascunhos: 5 links no corpo, nenhum quebrado, listas ordenadas e ênfases
corretas. O tempo de leitura da propriedade no Notion foi ajustado de 11 para 10
para bater com o que o próprio blog calcula e mostra — onde os dois divergem,
vale o número que o leitor vê.

[2026-08-11] **Barra de pesquisa de posts na home.** Pedido: reproduzir o
filtro de projetos do portfólio (`Felipe-Portifolio`, componente
`projects-modal.jsx`) — campo escuro com lupa roxa à esquerda, filtrando em
tempo real. Implementação deliberadamente diferente: o portfólio é React
(`useState`/`useMemo`); o blog é estático e sem framework de UI por decisão
deste repositório (ver seção "Regras do projeto" acima), então o resultado
visual e o comportamento foram reproduzidos com vanilla JS mínimo, sem puxar
dependência nova.

O que mudou: `Icone.astro` ganhou a forma `busca` (lupa Lucide, mesmo
grid/traço dos outros ícones); `global.css` ganhou `.felixo-busca`, reusando
as cores e o raio já usados em `.felixo-botao`/`.felixo-card-glow`; em
`index.astro`, cada post ganhou `data-busca` (título + descrição + tags em
minúsculas) e um `<script>` filtra a `#lista-posts` no evento `input`,
alternando `hidden` por item e mostrando "Nenhum post encontrado." (com
`aria-live="polite"`) quando nada bate.

Acessibilidade: `<label class="sr-only">` associado ao campo (em vez de só
`aria-label`, por semântica), `role="search"` no contêiner, `aria-controls`
apontando para a lista filtrada. Cor de texto do campo é a mesma
`text-zinc-400` já usada no resto do blog, que mede ~8:1 de contraste sobre
preto (ver correção de 2026-08 acima) — nenhuma cor nova foi introduzida.

`npm run check` e `npm run build` seguiram em 0 erros/avisos/hints, 7 páginas.
Sem teste automatizado: é filtro puramente visual sobre dado já renderizado,
sem lógica de negócio — verificação manual (digitar termo existente,
inexistente e limpar o campo) registrada aqui em vez de suíte nova.
