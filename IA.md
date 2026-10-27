# 🤖 IA.md — Contexto operacional do projeto

> **O que é**: memória técnica do blog para retomada de contexto por IA ou por um
> novo mantenedor, sem precisar reler todo o código ou o histórico de conversa.
> Baseado no template de contexto do Felixo System Design.
>
> **Regra**: as seções datadas são _append-only_ — acrescente registros novos, não
> reescreva os antigos. A exceção é o "ESTADO ATUAL", que é um resumo vivo.

---

## 📊 ESTADO ATUAL (RESUMO VIVO)

Última atualização: [2026-10-25]

- **Fase**: v1 entregue e em evolução. Blog estático funcionando ponta a ponta —
  home, post, tags, sobre, RSS, sitemap, 404, comentários, contagem de acessos,
  assinatura por e-mail e deploy automatizado — em **dois idiomas** e com a
  abertura animada do gatinho. Identidade visual alinhada à do
  `Felipe-Portifolio`; `start_app.py` é a porta de entrada de desenvolvimento. O
  porquê de cada parte está nos registros datados mais abaixo.
- **Stack**: Astro 7 + Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript
  estrito. `start_app.py` (Python, só dev-tooling) usa `questionary`/`rich` para o
  menu — não entra no bundle do site.
- **JavaScript no cliente**: o site **não é "zero JS"**. Cada script abaixo
  existe de propósito; quem for mexer não deve removê-los por estranhamento. O que
  dá para fazer só com HTML/CSS continua sem script: a abertura do gatinho e
  abrir/fechar a janela de assinatura (`popover` nativo).
  - `Comentarios.astro`: script do giscus (terceiro), os comentários.
  - `ContagemDeAcessos.astro`: `count.js` do GoatCounter (terceiro), em toda
    página, só no build de produção; pixel em `<noscript>` para quem está sem
    JavaScript.
  - `AcessosDoPost.astro` e `AcessosNoRodape.astro`: scripts inline que leem o
    contador público do GoatCounter e escrevem o número (cabeçalho do post;
    rodapé, com a página e o total do blog).
  - `EscolhaDeIdioma.astro`: a pergunta de idioma da primeira visita (`<dialog>`,
    escolha no `localStorage`); abre quando a abertura do gatinho começa a sumir e
    fecha com uma saída suave de 0,25 s (o Esc e a troca de página são imediatos).
  - `RedirecionarParaIngles.astro`: inline, só na home em português; leva para
    `/en/` quem já escolheu inglês, antes da pintura.
  - `Assinatura.astro`: só a forma da animação da janela de assinatura, que cresce
    a partir do botão (a do modal do portfólio). Sem JavaScript a janela abre só
    com o esmaecimento.
  - `GatinhoDoCabecalho.astro`: o gatinho do cabeçalho (SVG inline), parado; o
    script dá 3 piscadas completas quando o mouse ou o foco do teclado chega no
    nome do blog (2026-10-26).
  - `PausarAnimacoes.astro` e o script inline do `<head>` do `BaseLayout`: o botão
    "Pausar animações" do rodapé (`data-animacoes="pausadas"` no `<html>`, escolha
    no `localStorage`) e o atributo devolvido antes da primeira pintura.
  - `PaginaInicial.astro`: o filtro da barra de pesquisa de posts.
- **Dois idiomas** (2026-09-30): português na raiz, inglês em `/en/`. Texto de
  interface em `TEXTOS` de `src/config/idiomas.ts`. Existem em inglês a home, as
  tags, o Sobre (`/en/about/`) e uma página de cada post (2026-10-26):
  `/en/posts/<post>/` é a tradução quando há `src/content/traducoes/en/<post>.md`
  (título, descrição, tags e texto em inglês; `revisado: false` mostra o aviso de
  tradução por IA sem revisão do autor) e declara `hreflang`; sem o arquivo, é a
  cópia com a interface em inglês, o texto em português e um aviso, sem
  `hreflang`. Só "Olá, mundo" tem tradução, e ainda não foi revisada. A página
  de uma tag não tem par exato (o nome da tag muda de idioma): o seletor leva ao
  índice de tags do outro idioma (`paginaEquivalente` guarda a regra dos
  endereços). A pergunta da primeira visita grava a escolha e o seletor PT | EN
  troca a qualquer hora, ficando na mesma página. A apresentação da home em
  inglês, o rótulo "My socials" e a descrição do site em inglês foram revisados
  pelo dono em 2026-10-26; o resto dos textos da interface em inglês (os de Tags,
  Sobre e post incluídos), a tradução do post e a do convite da home (2026-10-27)
  seguem sem revisão.
- **Abertura e gatinho** (2026-10-16): `Abertura.astro`, primeiro filho do
  `<body>` no `BaseLayout`, mostra o gatinho do FelixoVerse piscando uma vez
  (cerca de 2 s) a cada carregamento. É só CSS, decorativa (`aria-hidden`) e some
  com "reduzir movimento" e na impressão. Limite conhecido: voltar pelo histórico
  pode restaurar a página do cache (bfcache) e a abertura não repete. O ícone do
  cabeçalho é o mesmo gatinho, parado, com 3 piscadas quando o mouse ou o foco do
  teclado chega (cópia inline em `GatinhoDoCabecalho.astro`; o SVG original
  continua em `public/imagens/gatinho-piscando-headbang.svg`, sem retoque). As
  animações que se repetem sozinhas (partículas e brilho do fundo, brilho dos
  títulos e dos ícones das redes) param com "reduzir movimento" e com o botão
  "Pausar animações" do rodapé (WCAG 2.2.2, registro de 2026-10-26). O
  `logo-felixo.png` continua no repositório porque o `scripts/gerar-og-image.py`
  usa ele.
- **Home e layout** (2026-09-30 a 2026-10-22): sem caixas. Lista de posts em
  coluna única (`max-w-3xl`), cada `ItemPost` inteiro clicável, brilho só no hover
  e no foco, títulos com gradiente e botões em pílula como no felixo.com.br. A
  home abre com a apresentação em primeira pessoa, com as palavras do dono
  (`TEXTOS.<idioma>.home.apresentacao`), depois "Minhas redes", uma linha de cinco
  ícones (e-mail, GitHub, LinkedIn, Discord e Twitter: `Redes.astro`, `REDES` em
  `src/config/site.ts`) e os botões do blog (portfólio, RSS, e-mail). A
  `SITE.descricao` (buscador, cartão de compartilhamento, RSS) e a página Sobre
  usam as mesmas frases da home, escolhidas pelo dono em 2026-10-26; o cartão
  `public/og-image.jpg` foi regerado com o título "Blog do Felixo".
- **Gate**: `npm run check` (0 erros, mais `prettier --check .`, que deixa de
  fora `app/` e os posts) + `npm run build` (8 páginas: `/`, `/en/`,
  Sobre, Tags, as duas páginas de tag, o post `ola-mundo` e a 404) — verdes em
  2026-10-26. `npm audit` do blog em 2026-10-26: **0 vulnerabilidades** (eram 12
  em 2026-10-25). O `astro` está preso em `~7.3.8` de propósito: a 7.4 exige Node
  22.23.4 e o `setup-node` do CI ainda entrega a 22.23.3 (registro de
  2026-10-26). O `app/` (Felixo Editor) tem `package.json` próprio e, em
  2026-10-26, 10 vulnerabilidades (2 críticas, 7 altas, 1 moderada): ficam fora do
  build do blog e ainda sem atualização.
- **Conteúdo** (atualizado em 2026-09-30): nenhum post pronto. O
  `ola-mundo.md` no ar foi um teste e ainda vai ser revisado, assim como o
  site. Rascunho e post futuro não entram no repositório, que é público (ver
  `AGENTS.md`); rascunho vive só no Notion. Os que estavam rastreados saíram do
  repositório e do histórico em 2026-09-30.
- **Comentários**: giscus (GitHub Discussions), sem back-end próprio. Ver seção
  "🔗 INTEGRAÇÕES E SERVIÇOS EXTERNOS" para IDs, categoria e tema customizado.
  Em 2026-10-26 o fluxo de escrita (entrar, comentar, responder e reagir) foi
  conferido à mão em produção, logado como o dono, e funciona.
- **Acessos** (2026-10-16, ajustado em 2026-10-22): GoatCounter, conta `felixo`
  (`felixo.goatcounter.com`), com o contador público ligado no painel. O número
  aparece no cabeçalho do post e no rodapé de todas as páginas (a página e o
  total do blog; no post e na 404, só o total), sempre, mesmo com zero. Se a
  leitura falha, o cabeçalho do post e o rodapé avisam que um bloqueador de
  anúncio pode estar impedindo (decisão do dono em 2026-10-26). Os números são
  um mínimo: leitor com bloqueador de anúncio não é contado, e o dono usa um
  (confirmado), então as visitas dele não entram. Em
  2026-10-26 o contador tinha 10 acessos no total, 6 na home e 2 no post: a
  primeira visita real já aconteceu e o número aparece.
- **Assinatura** (2026-10-16): follow.it, feed `blog-do-felixo` na conta do
  dono, plano grátis. Botão "Receber por e-mail" na home, no fim do post, no
  Sobre e no rodapé (`BotaoAssinatura.astro`), que abre uma janela com o
  formulário (`Assinatura.astro`, `FOLLOWIT`), com a animação dos modais do
  portfólio. Sem notificação no navegador por enquanto: em 2026-10-26 o dono
  decidiu pelo OneSignal sob demanda, especificado em
  `docs/superpowers/specs/2026-10-26-notificacao-no-navegador-onesignal-design.md`,
  para implementar quando houver 3 posts publicados e a conta no OneSignal.
- **"Felixo Editor" (`app/`)**: as sete fatias concluídas e validadas com dado
  real do Notion. App desktop (Electron) para criar/editar posts e publicar a
  partir da database de ideias do Notion (`<database_id>`). Desde 2026-09-27 ela
  se chama "Ideias criativas" e guarda também vídeos e outros formatos, por isso
  a importação lista só as linhas com Formato "Artigo" (ou sem Formato). As
  propriedades são achadas dinamicamente, sem hardcode. A tela "Importar do
  Notion" foi conferida com o Notion real em 2026-10-26: 10 itens, nenhum vídeo.
  `app/.env` (gitignored) foi recriado nesta máquina na mesma data, pela tela
  Configurações. Post aceita `capa` opcional no frontmatter, vira
  `og:image`. O rascunho (texto, imagens e capa) vive em `app/rascunhos/`,
  ignorada pelo git, e só o "Publicar" copia o post para `src/content/posts/`
  (2026-10-26; antes o commit automático do Fetch All podia levá-lo antes da hora,
  registro de 2026-09-30). **Falta**: a escrita de volta no Notion e a publicação
  via git nunca foram testadas contra produção de verdade (a publicação foi
  exercitada numa cópia do repositório, com o gate de verdade e um remoto local).
  A suíte do editor passa inteira desde 2026-10-26 (99 testes): as 5 falhas que
  havia no Windows
  eram um bug do gate, que chamava o `npm` sem shell (o botão de publicar não
  passava do gate no Windows), e um teste que prendia o arquivo `.webp`. A
  escrita de volta no Notion acha a coluna de status e a de URL pelo conteúdo,
  e não pela posição (2026-10-26; o "Ideias criativas" tem duas `select` e duas
  `url`).
- **Deploy**: GitHub Pages por API (`build_type=workflow`), a cada push na
  `main`; o último deploy conferido (2026-10-26) está verde.
- **Histórico do git**: em 2026-10-26 foi reescrito a partir de `99c5a6f` (31
  commits com endereços novos) para tirar o número do WhatsApp do dono. Os hashes
  citados neste arquivo e no Notion para commits de 2026-10-22 em diante são os
  antigos; o mapa antigo para novo está na entrada de 2026-10-26. O GitHub ainda
  serve os endereços antigos até o Suporte limpar o cache (task aberta).
- **URL ativa**: https://blog.felixo.com.br (domínio próprio, servindo na raiz).
- **Compartilhamento**: cartão Open Graph genérico em `public/og-image.jpg`,
  gerado por `scripts/gerar-og-image.py` (Playwright, sob demanda — não entra no
  build). Regerar sempre que o título ou a chamada da home mudarem. Desde
  2026-08-13 (fatia 5 do Felixo Editor) o script também aceita
  `--titulo`/`--descricao`/`--saida` para gerar capa **por post**
  (`capa` opcional no frontmatter, ver `content.config.ts`); sem capa, o post
  cai no cartão genérico.
- **Estado final**: pronto para divulgação. Não há pendência de publicação
  conhecida neste repositório. O blog assina "Felipe Martin (Felixo)", igual ao
  portfólio (2026-10-26), e a `SITE.descricao` é uma frase do dono (2026-10-26).
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

[2026-10-16] **GoatCounter** (contagem de acessos) — `GOATCOUNTER` em
`src/config/site.ts`, `src/components/ContagemDeAcessos.astro` (contagem, no
fim do `<body>` de toda página) e `src/components/AcessosDoPost.astro`
(número no cabeçalho do post). Conta criada pelo dono em goatcounter.com,
grátis para uso razoável. Nenhuma credencial: o código da conta é público.
Duas dependências externas: `gc.zgo.at/count.js` (script) e
`<codigo>.goatcounter.com` (contagem e contador público
`/counter/<caminho>.json`, que responde com `Access-Control-Allow-Origin: *`).
O contador público só responde com **Allow adding visitor counts on your
website** marcado nas configurações do painel.

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

[2026-08-10] **Primeiro artigo de conteúdo escrito para o blog** (um artigo de
opinião, ainda não publicado). O texto nasceu na central de escrita do Notion e
chegou aqui com **`rascunho: true`**: a publicação depende de revisão do dono,
e a flag o deixa fora do build de produção até lá (o build seguiu com 7
páginas). _Redigido em 2026-09-30: título, arquivo e conteúdo do rascunho
saíram deste registro porque o repositório é público._

Vale registrar o método, porque ele é o que o modelo de artigo da database
manda e foi o que pegou dois erros meus: **fonte que não foi aberta não entra**.
Três afirmações factuais sustentavam o texto, e abrir as três, em vez de
confiar no resumo da busca, mudou duas delas:

1. Uma evolução de sentido de palavra que eu tinha escrito só era sustentada
   em parte pela fonte. O trecho passou a dizer o que a fonte diz.
2. Duas fontes confiáveis **divergiam em um dia** sobre uma data. O texto
   passou a citar só o mês, com a divergência registrada entre parênteses.

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

[2026-08-13] **Alinhamento do "Felixo Editor" — app desktop para criar e
publicar posts.** Registro de decisões; nenhuma linha de código escrita ainda.

Motivo do pedido: escrever e publicar post editando Markdown na mão está
custando caro demais no dia a dia. A ideia é um app desktop que leia a central
de escrita (database de Artigos do Notion, já citada no registro de 2026-08-10)
e gere o `.md` pronto neste repositório.

Decisões fechadas com o dono, em questionário, antes de qualquer construção:

- **Onde**: subpasta `app/` deste repositório, com `package.json` próprio.
  Precisa ficar fora do `tsconfig` da raiz, do Prettier e do `npm ci` do
  `deploy.yml` — o app é ferramenta local e não pode entrar no build do site.
- **Stack**: Electron + Vite + React + TypeScript. É exceção consciente à regra
  "nada de dependência nova" das regras do projeto: aquela regra protege o
  **site publicado** (estático, sem JS no cliente), não a ferramenta local.
- **Fonte da verdade é o `.md`**, não o Notion. O Notion entrega a ideia/pauta e
  o rascunho inicial do corpo; depois de importado, quem manda é o arquivo.
  Descartado o caminho bidirecional justamente para não criar conflito de versão.
- **Escrita de volta no Notion**: só status e URL do post publicado.
- **Credencial**: mesmo padrão do projeto de automações do Notion — `.env` na
  raiz com o token de integração interna, já coberto pelo `.gitignore` daqui.
  Este repositório é público; o token nunca entra em commit.
- **Templates**: vêm da página de template da própria database.
- **Imagens**: colar/arrastar, baixar as do Notion (as URLs de lá expiram, então
  linkar direto quebraria o post depois), gerar capa/OG reusando
  `scripts/gerar-og-image.py`, e converter para webp.
- **Publicação**: `npm run check` + `npm run build` como gate travando o botão,
  depois `pull --rebase`, `git add` **apenas** do `.md` e da pasta de imagens
  daquele post, commit e push. O `add` seletivo é requisito, não detalhe: o
  repositório recebe trabalho de mais de um agente em paralelo, e um `git add -A`
  publicaria código alheio pela metade.
- **Testes**: suíte automatizada cobrindo conversão de blocos do Notion,
  frontmatter, slug, caminho de imagem e o fluxo de publicação (inclusive os
  caminhos de falha), com git em repositório temporário de verdade. UI React
  fica com verificação manual, conforme a régua única de testes do padrão.
- **Fora de escopo**: assistência de IA dentro do editor (o dono usa agentes no
  terminal) e gestão de tags/configuração do site.
- **Porta de entrada**: novas opções no `start_app.py` que já existe, em vez de
  um segundo script — é um programa só, com dois componentes.

Dois riscos registrados desde já: a conversão de blocos do Notion nunca é
completa (blocos não suportados devem degradar de forma visível, nunca sumir em
silêncio), e o push automático publica sem etapa de revisão — se isso incomodar,
a saída barata é importar sempre com `rascunho: true`.

Uma verificação já feita, para poupar trabalho de quem retomar: o wrapper de
Notion do projeto de automações é fino e **não** converte blocos em Markdown,
além de ser Python. O reuso entre os dois projetos se limita ao padrão de
`.env`/token.

**Estado**: alinhamento concluído e plano técnico apresentado ao dono
(esqueleto → posts → Notion → importação → templates/mídia → publicação → docs,
um commit por fatia). Aguardando aprovação do plano para iniciar a
implementação. Nada foi criado no repositório até aqui.

[2026-08-13] **Felixo Editor, fatia 2: leitura e escrita de posts `.md`.**
Aprovação do dono para "fazer tudo direto" — as próximas fatias do plano
seguem sem pausa para aprovação a cada uma, mas continuam registradas aqui e
commitadas em pedaços pequenos.

O que entrou: `principal/posts/` (schema espelhando `content.config.ts`,
cálculo de caminhos, geração de slug, repositório com listar/ler/salvar via
`gray-matter`), canal IPC `posts:*`, e duas telas na interface (lista de
posts, editor de frontmatter + corpo). `salvarPost` valida com Zod antes de
tocar disco e nunca aceita slug com maiúscula/espaço — o nome do arquivo é a
URL pública do post.

**Risco tratado de propósito**: o schema do Astro (`content.config.ts`) só
existe dentro do runtime `astro:content`, então o app não pode importá-lo — ele
tem uma cópia (`esquema.ts`). `testes/esquema-paridade.teste.ts` lê o arquivo
do Astro de verdade (regex sobre o bloco `z.object({...})`) e falha se um
campo for adicionado ou removido de um lado só.

Validação real, não presumida:

- `npm run check` (tsc dos dois tsconfigs) e `npm run test` (9 testes, 3
  arquivos) verdes no app; `repositorio.teste.ts` grava/relê em diretório
  temporário de verdade (`mkdtemp`), não em mock de sistema de arquivos.
- Janela aberta de verdade (`electron .`) contra o repositório real: a lista
  mostrou os 3 posts existentes (títulos, data e "rascunho" corretos) e o
  editor abriu um post real com os campos certos — inclusive conferi que
  `10/08/2026` no campo de data batia com `publicadoEm: 2026-08-10` do
  arquivo (formato `dd/mm/aaaa` do `<input type="date">` em pt-BR, não bug de
  fuso horário).
- **Não terminei de validar o botão "Salvar" manualmente**: os cliques de
  mouse automatizados (`xdotool`) estavam mexendo na tela real do dono (fora
  de um ambiente isolado — a janela moveu e um vídeo que ele assistia foi
  afetado). Interrompi a automação de UI por segurança antes de clicar em
  "Salvar" em qualquer post. A gravação em si tem cobertura de teste
  automatizado equivalente e real (grava em disco, relê, confere
  frontmatter/corpo/YAML), então o comportamento está validado — só a
  confirmação visual do clique manual ficou pendente.
- Regressão do blog: `npm run check` e `npm run build` da raiz seguem em 0
  erros/avisos, 7 páginas.

**Estado**: fatia 2 concluída e commitada. Próxima: fatia 3, conexão com a
database Artigos do Notion (`.env`, descoberta do database real por trás da
página compartilhada, mapeamento de propriedades). Sem pendência bloqueante.

[2026-08-13] **Felixo Editor, fatia 3: conexão com a database Artigos do
Notion.** `principal/notion/` traz o cliente (`cliente.ts`, com
`comRetry` respeitando `Retry-After` e repetindo só em 429/5xx — conforme o
guia de integração do Felixo System Design) e a descoberta de schema
(`descoberta.ts`, `databases.retrieve` + mapeamento de propriedades).
`principal/config/armazenamento.ts` grava `NOTION_TOKEN`/`NOTION_DATABASE_ID`
no `.env` do app (fora do repositório, igual ao padrão do projeto de
automações). Tela "Notion" na interface: colar token + ID da database,
salvar, e "Testar conexão" mostra o título e as propriedades reais da
database.

**Limite honesto desta fatia**: não tenho um `NOTION_TOKEN` real, então não
validei a chamada de rede de verdade — isso é credencial do dono, não algo
que eu deva simular. O que foi validado com evidência real:

- 22 testes (6 arquivos, todos passando) — os 13 novos cobrem retry/backoff
  (incluindo respeito ao `Retry-After` e não repetir em erro não-transitório
  como 401) com o SDK do Notion mockado no nível certo (sem HTTP real);
  mapeamento de propriedades a partir de uma fixture no formato documentado
  da API (`databases.retrieve`); e leitura/escrita do `.env` num arquivo
  temporário — nunca no `.env` real de quem roda a suíte.
- `npm run check` limpo; janela aberta de verdade (`electron .`) mostrando o
  botão "Notion" e a lista de posts continuando a funcionar com `.env` vazio
  (sem crash), só por print — sem repetir a automação de clique que mexeu na
  tela do dono na fatia anterior.
- `npm run check`/`build` da raiz seguem verdes, 7 páginas.

**Pendência real para o dono**: preencher `app/.env` (ou pela tela
"Notion") com `NOTION_TOKEN` e o ID da database Artigos, e confirmar que
"Testar conexão" lista as propriedades esperadas. A URL original
(`app.notion.com/p/Artigos-...`) é de página, não de database — o ID correto
só se descobre abrindo a página no Notion e copiando o ID da database
embutida, ou pela função `search` da API (não implementada nesta fatia por
não ter como testar sem token).

**Estado**: fatia 3 concluída e commitada. Próxima: fatia 4, importação de
artigos do Notion como Markdown (conversão de blocos + download de imagens).
Depende da fatia 3 estar validada pelo dono com credencial real antes de ter
sentido testar import de verdade — sigo implementando com fixtures/mocks
enquanto isso não acontece.

[2026-08-13] **Felixo Editor, fatia 4: importação de artigos do Notion como
Markdown.** `principal/notion/blocos.ts` converte blocos do Notion
(parágrafo, headings, listas, citação, callout, código com linguagem,
imagem, divisória) para Markdown, com rich text inline (negrito, itálico,
código, tachado, link); bloco não suportado vira comentário HTML visível, não
some em silêncio. `paginacao.ts` segue `has_more`/`next_cursor` da API.
`midia/download.ts` baixa as imagens do Notion (URLs pré-assinadas do S3, que
expiram) para a pasta do post e reescreve os links para o caminho relativo
local `./<slug>/notion-NN.ext` — mesma convenção dos posts existentes.
`paginasDaDatabase.ts` lista os artigos da database achando a propriedade do
tipo `title` dinamicamente, sem presumir o nome dela.

**Decisão de escopo tomada aqui, registrada em vez de escondida**: esta fatia
não recursa em blocos aninhados (`has_children`) nem implementa a tela de
mapeamento de propriedade → frontmatter do plano original. Título vem do
Notion (a propriedade `title` é estrutural, existe em toda database, então dá
para usar sem mapeamento); descrição, tags, data e rascunho continuam
preenchidos por quem usa, no editor — que já reaproveita o formulário da
fatia 2. Justificativa: sem uma database real para inspecionar, construir uma
tela de mapeamento de propriedades arbitrárias seria adivinhar um schema que
não existe ainda. Fica como próximo passo natural quando o dono validar a
fatia 3 com credencial real e mostrar como a database está montada de
verdade.

Validado: 33 testes (9 arquivos, 11 novos) — conversão de blocos com
fixtures no formato documentado da API (parágrafo/heading/lista/citação/
código/imagem/bloco não suportado), download de imagem com `fetch` mockado
(sucesso, falha HTTP, zero imagens), paginação de `databases.query` com
`has_more` real. `npm run check` limpo, `npm run test` 33/33, build do app
limpo, janela aberta de verdade confirmando por print o botão "Importar do
Notion" sem crash. `npm run check`/`build`/`audit` da raiz e do app seguem
verdes (7 páginas, 0 vulnerabilidades).

**Estado**: fatia 4 concluída e commitada. Ainda sem validação de rede real
(mesma pendência da fatia 3: falta `NOTION_TOKEN`/`NOTION_DATABASE_ID` reais
do dono). Próxima: fatia 5, templates (página de template da database) e
mídia completa (colar/arrastar no editor, webp, capa/OG via
`scripts/gerar-og-image.py`).

[2026-08-13] **Felixo Editor, fatia 5: templates, mídia (colar/arrastar +
webp) e capa por post.** Três entregas:

1. **Templates**: decisão registrada, sem código novo. A "página de
   template" mencionada pelo dono é um artigo comum dentro da própria
   database Artigos — a tela "Importar do Notion" da fatia 4 já cobre isso,
   sem precisar de mecanismo separado.
2. **Colar/arrastar imagem no editor**: `principal/midia/otimizacao.ts`
   redimensiona (máx. 1600px, nunca alarga) e converte para webp via `sharp`
   antes de gravar em `src/content/posts/<slug>/`. `EditorDePost.tsx` ganhou
   `onPaste`/`onDrop` na textarea, inserindo `![](./slug/imagem-NN.webp)` na
   posição do cursor.
3. **Capa por post**: aqui o plano original errou e foi corrigido **antes**
   de construir em cima do erro — `scripts/gerar-og-image.py` gerava só UMA
   imagem para o site inteiro, e o schema de post não tinha campo de capa.
   Perguntei ao dono como seguir; a resposta foi "construir do zero agora".
   Mudança negociada, fora do "só posts" combinado no alinhamento:
   - `content.config.ts`: campo `capa` opcional via `image()` (helper de
     assets do Astro — capa fica otimizada e com hash como qualquer imagem
     de post, não um caminho cru).
   - `BaseLayout.astro`/`PostLayout.astro`: post com capa usa ela no
     `og:image`; sem capa, cai no cartão genérico de sempre.
   - `scripts/gerar-og-image.py` ganhou `argparse` (`--titulo`, `--descricao`,
     `--saida`), **compatível com o uso original** (sem argumentos continua
     gerando `public/og-image.jpg` com o texto padrão). Título gera fonte
     menor quando passa de 40 caracteres, senão estoura a largura do cartão.
   - `principal/midia/capa.ts`: chama o script via `child_process.spawn`,
     erro claro se faltar Python/Playwright (não trava em silêncio).

**Validação real, não presumida**:

- Blog: `npm run check`/`build` limpos. Testei o pipeline de capa de ponta a
  ponta com um post temporário **não commitado** (criado e apagado nesta
  sessão): `npm run dev` mostrou o endpoint de imagem do Astro reconhecendo
  a capa (1200×630, webp, `fit=cover`); `npm run build` gerou
  `capa.D2lF3dHJ_YpWqf.webp` de verdade (13kB→2kB) com `og:image` apontando
  pra URL certa.
- `scripts/gerar-og-image.py --titulo ... --descricao ...` rodado de
  verdade (Playwright já estava instalado neste ambiente; Chromium precisou
  ser baixado com `playwright install chromium` — dependência "sob demanda"
  que já existia antes deste app). Card gerado e conferido visualmente:
  identidade correta, fonte reduzida no título longo. Uso sem argumentos
  testado e revertido (`git checkout -- public/og-image.jpg`) para não
  sujar o binário versionado com uma recompressão JPEG não-idêntica byte a
  byte (mesmo conteúdo, encoding varia).
- App: 40 testes (11 arquivos, 7 novos) — `sharp` redimensionando/convertendo
  de verdade (sem mock: cria PNG em memória, confere formato/dimensão
  reais), `gerarCapa` com `child_process.spawn` mockado (sucesso, código de
  saída != 0, `ENOENT` do `python3`). `npm run check` limpo, build limpo,
  `npm audit`: 0 vulnerabilidades.
- **Risco verificado, não hand-waved**: `sharp` emite aviso de
  incompatibilidade Electron/Linux ao subir (binário pensado para Node, não
  para o runtime do Electron). Testei de verdade rodando `sharp` dentro do
  processo do Electron (`ELECTRON_RUN_AS_NODE=1`) nesta máquina — funcionou
  (gerou webp real). Fica registrado como ponto de atenção para outras
  distros/versões de Electron, não como certeza universal.

**Estado**: fatia 5 concluída e commitada. Próxima: fatia 6, publicação
(gate `check`+`build`, `git add` seletivo, commit, push, status de volta no
Notion).

[2026-08-13] **Felixo Editor, fatia 6: publicação (gate + git seletivo +
escrita de volta no Notion).** `principal/publicacao/`: `gate.ts` roda
`npm run check` + `npm run build` na raiz do blog via `child_process`, para
antes do primeiro que falhar; `git.ts` roda comandos git reais via
`execFile` (`ComandoGitFalhou` carrega o stderr de verdade); `publicar.ts`
orquestra gate → `pull --rebase` → `git add --` **só** do `.md` e da pasta de
mídia daquele slug → commit `post: <título>` → push, parando e devolvendo a
etapa exata que falhou. Botão "Publicar" no editor salva antes (evita
publicar a versão antiga do arquivo) e mostra a saída real em caso de erro.

**Escrita de volta no Notion**, best-effort e depois do post já estar
publicado (nunca desfaz a publicação se falhar): `notion/associacoes.ts`
guarda localmente (`app/.notion-associacoes.json`, gitignored) qual slug
veio de qual página do Notion, gravado na importação (fatia 4).
`notion/statusDeVolta.ts` acha a propriedade `url` e uma propriedade
`select`/`status` cuja opção pareça "publicado" (`/public/i`) — sem propriedade
ou sem opção parecida, avisa e não escreve nada, em vez de adivinhar um
valor errado.

**Validado com evidência real, não presumida**:

- 58 testes (16 arquivos, 12 novos). Os mais importantes: `publicacao-git` e
  `publicacao-publicar` rodam contra **repositórios git reais** em diretório
  temporário (`git init --bare` como "remoto" + clone), não mock de git —
  inclusive um teste que reproduz o risco central desta fatia: um arquivo
  alheio modificado no mesmo working tree (simulando outro agente do canvas)
  continua modificado e **fora do stage** depois de publicar um post,
  confirmado lendo `git status --short` de verdade. `publicacao-gate` roda
  `npm run check`/`build` de verdade contra um `package.json` descartável
  (sem tocar no blog real). `notion-status-de-volta` cobre os três casos
  (sucesso, opção não encontrada, propriedade não encontrada) com o SDK
  mockado.
- `npm run check` limpo, build limpo, `npm audit`: 0 vulnerabilidades. Blog:
  `check`/`build` seguem verdes, 7 páginas. Janela aberta de verdade
  confirmando por print que o app sobe sem crash com os novos canais IPC.
- **Não testei o fluxo de publicação de ponta a ponta contra o repositório
  real** (isso publicaria de verdade na `main` por fora desta conversa) —
  os testes de integração usam repositórios git descartáveis de propósito. A
  primeira publicação real pelo app deve ser observada pelo dono.

**Estado**: fatia 6 concluída e commitada. Falta a fatia 7 (documentação:
README do blog + opção no `start_app.py`). Com isso, as sete fatias do plano
original estarão entregues — Notion/importação seguem sem validação de rede
real (pendência do dono: preencher `app/.env`).

[2026-08-13] **Felixo Editor, fatia 7 (última do plano): documentação e
`start_app.py`.** Sem código de produto novo — só integração do que as
fatias 1-6 entregaram ao resto do projeto:

- `start_app.py`: "Iniciar/Rodar" ganhou a opção "Felixo Editor" (só aparece
  se `app/` existir), que roda `npm run dev` dentro de `app/` sem tentar
  abrir navegador (é app desktop, não site); avisa se `app/.env` não existe
  em vez de deixar a aba Notion falhar em silêncio depois. "Instalar/Setup"
  ganhou a escolha "Só o blog" vs. "Blog + Felixo Editor". "Status" mostra se
  as dependências do app estão instaladas e se o `.env` do Notion existe.
- `README.md` do blog: nova seção "Felixo Editor", campo `capa` documentado
  na tabela de frontmatter, `app/` citado na árvore de estrutura.
- `app/README.md`: reescrito — estava descrevendo só o esqueleto da fatia 1;
  agora documenta as seis fatias entregues, a dependência "sob demanda" do
  Playwright para a capa, e a pendência de validar o Notion com token real.

Validado: `python3 -c "ast.parse(...)"` confirma sintaxe válida;
`app_existe()`, `app_node_modules_instalado()`, `app_env_configurado()`
chamadas de verdade contra o estado real deste repositório devolveram os
valores corretos (`True`, `True`, `False` — `.env` de fato não existe ainda).
**Não testei a navegação interativa do menu** (`questionary` exige teclado
simulado) — é extensão direta do padrão já usado nas outras opções do menu,
sem lógica nova além das três funções testadas acima; risco residual baixo,
mas fica registrado como não coberto por execução ponta a ponta.
`npm run check`/`build` do blog e `npm run check`/`test` do app seguem
verdes (58 testes, 7 páginas).

**Estado final do plano original de sete fatias: concluído.** Esqueleto,
CRUD de posts, conexão Notion, importação como Markdown, templates+mídia+
capa, publicação com gate+git+status no Notion, e documentação — todas
commitadas. O que falta não é fatia do plano, é validação com dado real do
dono:

1. Preencher `app/.env` (`NOTION_TOKEN`, `NOTION_DATABASE_ID`) e confirmar
   pela tela "Notion" → "Testar conexão" que a database Artigos é encontrada
   e as propriedades batem com o esperado.
2. Importar um artigo de verdade e conferir a conversão de blocos (a lista
   suportada está em `principal/notion/blocos.ts`; o que não estiver lá vira
   comentário HTML visível no editor).
3. Fazer a primeira publicação real pelo botão "Publicar" e observar o
   commit/push gerado antes de confiar no fluxo sem supervisão.

[2026-08-13] **Felixo Editor validado com dado real do Notion — e dois bugs
de conversão encontrados e corrigidos.** O dono forneceu o token de
integração já usado no ecossistema `Automa-es-do-Notion` (mesma integração,
token reutilizável entre databases desde que compartilhada com cada uma).
Configurado em `app/.env` (gitignored, confirmado fora do `git status`).

A URL original do projeto (`app.notion.com/p/Artigos-...`) era mesmo de
página, como suspeitado na fatia 3 — o ID real da database foi achado por
busca na API (`POST /v1/search`, filtro `object: database`): **Artigos**,
`<database_id>`. Schema real:

| Propriedade                                                                                        | Tipo                                   | Uso no app                                            |
| -------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| `Nome`                                                                                             | title                                  | título do artigo (achado dinamicamente, sem hardcode) |
| `URL publicada`                                                                                    | url                                    | alvo da escrita de volta                              |
| `Etapa`                                                                                            | select (Ideia/Modelo/Rascunho/Revisão) | nenhuma opção contém "public"                         |
| `Temas`, `Resumo`, `Tempo de leitura (min)`, `Data de publicação`, `Observações`, `ID` (unique_id) | —                                      | não usados pelo app nesta fatia                       |

Rodei o código do app de verdade (via `tsx`, sem mock) contra a API:
`testarConexaoNotion`/`obterInfoDaDatabase` achou a database e as 10
propriedades corretamente; `listarArtigosNotion` listou as 4 páginas reais
(1 revisão publicada, 1 template "🧩 Template para artigos", 1 revisão, 1
ideia vazia). Confirmação do desenho da fatia 6: como nenhuma opção de
`Etapa` bate `/public/i`, `escreverStatusDeVolta` avisaria em vez de
escrever errado — comportamento **observado de verdade**, não só coberto por
teste.

**Importação de artigo testada com o conteúdo mais exigente disponível**: um
artigo real (79 blocos: parágrafos, headings, listas com e sem marcador,
negrito/itálico/link) que já existia no repositório escrito à mão, o que
permitiu comparar a conversão contra o resultado humano real —
`diff` **byte a byte, zero diferença**, depois de duas correções:

1. **Listas ficavam "soltas"**: `blocosParaMarkdown` juntava todo bloco com
   `\n\n`, inclusive itens de lista consecutivos — o `.md` gerado tinha uma
   linha em branco entre cada `- item`, divergindo do estilo compacto
   (`- item\n- item`) usado em todo o resto do blog. Corrigido: itens de
   lista do mesmo tipo, quando consecutivos, ficam juntos com `\n` só;
   qualquer outra combinação de blocos continua com `\n\n`.
2. **Lista numerada sempre saía "1." repetido**, nunca 1/2/3/4 — funciona
   por acidente (a maioria dos renderizadores markdown corrige a numeração
   visualmente), mas o `.md` gerado não batia com o texto-fonte real. Corrigido
   com contador que reinicia a cada bloco que não é `numbered_list_item`.

Quatro testes novos em `notion-blocos.teste.ts` cobrindo os dois cenários
(lista compacta, numeração real, reinício de numeração depois de um
parágrafo, bulleted seguida de numbered não vira lista única) — 62 testes no
total agora, todos verdes. `npm run check` limpo. Scripts de teste manual
(`teste-conexao-real.ts`, `teste-importacao-real.ts`) foram usados só nesta
sessão e apagados — não fazem parte do produto, evidência fica registrada
aqui.

**Pendências que seguem reais**: não testei a escrita de volta no Notion de
verdade (evitei escrever em produção sem confirmação do dono) nem a
publicação via git contra o repositório real. A conversão de blocos foi
validada com o repertório de um artigo (parágrafo/heading/lista/negrito/
itálico/link) — código, quote, callout e imagem seguem cobertos só por
teste com fixture, não por artigo real do Notion que os use.

[2026-08-13] **Bug real encontrado usando o app pela primeira vez: `.env`
procurado no lugar errado.** O dono configurou `app/.env` e testou "Importar
do Notion" pelo app de verdade → `Error: NOTION_TOKEN não configurado`. Não
era timing (processo aberto antes do `.env` existir) — era cálculo de
caminho errado.

Causa raiz: `electron-vite` empacota o processo principal inteiro num único
`dist-electron/principal/index.js` (confirmado: a pasta só tem esse
arquivo, nenhuma subpasta `config/`). Isso significa que `__dirname`, dentro
de qualquer módulo incluído nesse bundle, é sempre `dist-electron/principal`
— **não** o caminho do arquivo-fonte original. `config/armazenamento.ts` e
`notion/associacoes.ts` contavam `../../..` a partir de si mesmos supondo
execução "por arquivo" (verdade em teste unitário/tsx, falso no app
empacotado de verdade), e isso resolvia pra **raiz do repositório**, não
`app/`. `janela.ts` e `posts/caminhos.ts` não tinham esse bug — o primeiro
porque usa `__dirname` corretamente (é a mesma pasta do bundle mesmo), o
segundo porque coincidentemente precisa mesmo chegar na raiz do repo.

Por que nenhum teste pegou isso: todo teste desses dois arquivos passa um
caminho explícito (diretório temporário) — nenhum testava o valor _padrão_
de verdade. E a validação manual mais cedo (fatia 3/4, via `tsx`) chamava
`criarClienteNotion` direto com o token, sem passar por
`carregarConfiguracao`/`CAMINHO_ENV_PADRAO` — o caminho exato que tinha o
bug nunca foi exercitado antes do dono testar pela UI real.

**Correção**: os dois arquivos passaram a derivar o caminho de
`RAIZ_DO_BLOG` (`join(RAIZ_DO_BLOG, 'app', '.env')` /
`join(RAIZ_DO_BLOG, 'app', '.notion-associacoes.json')`) em vez de contar
`../..` de si mesmos — uma fonte única de verdade já validada contra o app
real (a listagem de posts sempre funcionou, prova que `RAIZ_DO_BLOG` estava
certo). Teste novo em `config-armazenamento.teste.ts` trava essa relação —
registrado com a ressalva honesta de que ele não teria pego o bug original
sozinho (roda sob `vitest`, que não empacota como o `electron-vite`; a
proteção real é arquitetural — nunca mais contar `__dirname` relativo por
arquivo neste processo).

Validado: `npm run check` limpo, 63 testes (1 novo) verdes. Rebuild
completo, app reaberto (via `electron .` direto, não pela sessão do dono) —
subiu sem erro. **Não cliquei em "Importar do Notion" para confirmar
visualmente** desta vez: percebi uma instância separada de `start_app.py`
rodando (aparentemente do dono, testando em paralelo) e preferi não
arriscar interferir tocando teclado/mouse na tela compartilhada. Encerrei
só o processo Electron que eu mesmo tinha aberto.

**Pendência**: o dono precisa fechar e reabrir o Felixo Editor (o processo
antigo continua com o bug em memória) e confirmar que "Importar do Notion"
funciona agora.

[2026-08-13] **Segundo achado real de uso: mensagem de erro ao salvar era
JSON cru do Zod.** O dono importou o template do Notion e tentou salvar sem
preencher a descrição (esperado — o importador só traz título+corpo de
propósito, ver fatia 4). O app funcionou corretamente (rejeitou o
salvamento), mas a mensagem mostrada foi um dump de array JSON dos issues
do Zod, ilegível. Causa: `salvarPost` em `repositorio.ts` usava
`esquemaFrontmatter.parse()` (lança `ZodError` cru) em vez de `safeParse()`
com mensagem formatada — `lerPost` já fazia certo, `salvarPost` não.
Corrigido para o mesmo padrão: `PostInvalidoError` com
`"campo: mensagem"` por issue. Teste novo trava a mensagem legível para o
caso exato que apareceu (descrição vazia). 64 testes, `npm run check`/build
do app e do blog limpos.

**Sugestão não implementada, registrada para não se perder**: dá para
reduzir esse atrito de origem preenchendo `descricao` automaticamente na
importação a partir da propriedade "Resumo" da database (existe e está
com texto útil nos artigos reais, confirmado na validação anterior). Não
implementei agora porque a fatia 4 decidiu deliberadamente não presumir
nomes de propriedade além do `title` estrutural — "Resumo" é específico
desta database, não garantido em outra. Fica como ideia de contribuição
futura, não como pendência.

[2026-08-13] **Erro de validação passou a mostrar passo a passo na tela, com
foco automático no campo errado.** Pedido direto do dono depois de ver a
mensagem "descricao: Descrição não pode ser vazia" (já legível, fatia
anterior) mas ainda como texto solto — queria orientação acionável, não só
mensagem.

`interface/erros.ts` (novo): `limparMensagemDoIpc` remove o embrulho padrão
do Electron (`Error invoking remote method '...': Error: ...`);
`interpretarErroDeValidacao` reconhece o formato `campo: motivo` (um ou mais,
separados por `;`) que `PostInvalidoError` usa, e devolve `null` para
qualquer outro formato de erro (rede, git, Notion) — nunca força uma
interpretação errada em cima de erro que não é de validação.
`mensagemDeErro(erro: unknown)` substitui o padrão repetido
`e instanceof Error ? e.message : String(e)` nas 4 telas do app, já limpo do
embrulho do Electron.

`EditorDePost.tsx`: quando o erro é interpretável, mostra um painel
("Não deu para salvar — corrija antes de tentar de novo:") com um item por
campo, cada um um botão que foca aquele input; o primeiro campo errado
recebe foco automaticamente assim que o erro aparece (via `useEffect`).
Erro não interpretável (rede, git) continua caindo no texto simples de
sempre — o fallback não desapareceu.

Validado: 6 testes novos em `interface-erros.teste.ts` (embrulho do
Electron, campo único, múltiplos campos, `null` para erro de rede/git e para
campo desconhecido) — 70 testes no total, todos verdes. `npm run check`
limpo, build limpo, `npm audit`: 0 vulnerabilidades. Janela aberta de
verdade confirmando que o build sobe sem crash (sem repetir clique/foco por
teclado desta vez — a lógica já está coberta por teste unitário real,
inclusive com o texto exato de erro que apareceu na tela do dono).

**Pendência**: confirmação visual do painel de correção em uso real (o dono
preencher a Descrição do template e ver o foco automático funcionando) ainda
não foi feita — fica para quando o dono testar de novo.

[2026-08-13] **Bug real: salvar post sem capa quebrava com `YAMLException`.**
Achado pelo dono rodando o app pela porta de entrada certa (`start_app.py` →
Felixo Editor) e tentando salvar o post do template depois de preencher a
descrição. Log real: `YAMLException: unacceptable kind of an object to dump
[object Undefined]`, disparado dentro de `gray-matter`/`js-yaml`.

Causa: `EditorDePost.tsx` monta o objeto de frontmatter com
`capa: estado.capa || undefined` — quando `capa` está vazia, isso cria a
chave `capa` com valor `undefined` **explícito**, não uma chave ausente.
`esquemaFrontmatter.safeParse` aceita `undefined` num campo `.optional()` e
preserva a chave no resultado; `matter.stringify` repassa esse objeto pro
serializador YAML, que não sabe serializar `undefined` e lança em vez de
simplesmente omitir.

Corrigido na borda de gravação (`repositorio.ts`), não só na tela: nova
função `removerCamposIndefinidos` filtra qualquer chave `undefined` do
frontmatter validado antes de `matter.stringify`. Protege contra qualquer
chamador que mande `campo: undefined` explícito, não só o `EditorDePost`
atual — é a mesma lógica de "não presumir só um caminho de entrada" já usada
em outras partes do app.

Validado: teste novo reproduzindo o formato exato do bug (`capa: undefined`
no objeto de entrada) confirma que salva sem lançar, que `capa` sai ausente
do `.md` gravado (`bruto`, sem a chave `capa:`), e que `lerPost` relê
`capa: undefined` de volta. 71 testes no total, `npm run check`/build do
app e do blog limpos.

**Padrão de risco a vigiar**: qualquer campo `.optional()` novo no schema
que a interface monte com `campo || undefined` está sujeito ao mesmo bug se
alguém remover a correção da borda de gravação — a defesa agora vive em
`repositorio.ts`, não em cada tela.

[2026-08-13] **Lista de posts recarrega sozinha ao a janela ganhar foco.**
Pedido do dono depois de perguntar se um post criado manualmente nos
arquivos aparece automaticamente na lista — a resposta honesta era "só ao
reabrir a tela ou o app" (sem observador de arquivo). Pedido explícito de
tornar automático.

`ListaDePosts.tsx`: a busca de posts virou uma função nomeada (`carregar`),
chamada no mount e de novo em todo evento `focus` da janela
(`window.addEventListener('focus', carregar)`, limpo no unmount). Cobre o
caso real — editar/criar um `.md` por fora (outro editor, importação manual)
e voltar o foco pro app — sem precisar de um observador de arquivo (`fs.watch`)
nem de polling.

Sem teste automatizado: é comportamento de UI amarrado ao evento `focus` do
DOM do Chromium, sem lógica de negócio nova — a régua única de testes do
projeto trata isso como opcional, com verificação manual registrada em vez
de suíte nova. `npm run check` limpo, suíte completa (71 testes) sem
regressão. Build feito; a verificação visual ficou pendente porque o dono
já tinha uma instância própria aberta (`electron-vite dev`, que recarrega o
processo principal sozinho ao detectar mudança no código-fonte — a
correção já deve estar ativa nela sem precisar reabrir).

[2026-09-30] **Guia de linguagem natural (v0) e limpeza do que não devia estar
no repositório público.** O dono retomou o blog: o único post no ar
(`ola-mundo.md`) foi um teste e ainda vai ser revisado, assim como o site. E
deixou duas regras explícitas: o repositório é público, então nada pode vazar
nem deixar caminho explícito; e post futuro ou em escrita não fica no
repositório.

Guia: `LINGUAGEM-NATURAL.md` na raiz, com regras de voz e o que a IA pode ou
não fazer numa revisão, e regra nova no `AGENTS.md` apontando para ele. O
material de origem (textos crus, comparações) fica fora do repositório. As
anotações de revisão de um post ficam numa subpágina da linha dele no Notion,
não no corpo: o importador converte todo parágrafo do corpo em texto do post,
não recursa em `has_children`, e uma subpágina vira só o comentário HTML
`bloco do Notion não suportado: "child_page"`.

Auditoria medida hoje: nenhum token, `.env` real, e-mail pessoal ou caminho
absoluto rastreado. Exposto: três rascunhos e uma cópia `.md.save` em
`src/content/posts/`, o ID da database do Notion e o título e o conteúdo de um
rascunho neste arquivo, e o mesmo título num dado de teste do app. **Causa de
dois dos rascunhos**: o commit automático do Fetch All (`11e777f` e `36bcf60`)
leva tudo o que está na árvore, inclusive o post de teste que o "ESTADO ATUAL"
dava como "nunca commitado". Disciplina não segura rascunho; precisa de
`.gitignore`.

Feito na árvore de trabalho: registros antigos deste arquivo redigidos (ID
trocado por `<database_id>`, título e conteúdo do rascunho trocados por
descrição genérica), exceção consciente à regra de append-only porque era
vazamento; dado de teste do app com título neutro; README sem apontar para o
post de teste.

Decisões do dono, no mesmo dia: rascunho vive **só no Notion**, e o arquivo
entra no repositório na hora de publicar. O histórico público foi
**reescrito** com `git filter-repo` para tirar de todas as versões e mensagens
de commit os arquivos de rascunho e de teste, o ID do Notion e o título e as
fontes do rascunho, com backup completo (`git bundle --all`) fora do
repositório antes. O `ola-mundo.md` fica no ar e vai ser editado depois.

Risco que continua aberto: o importador do Felixo Editor grava o post
importado direto em `src/content/posts/`, então entre importar e publicar o
arquivo fica exposto ao commit automático do Fetch All. O editor precisa ser
atualizado para isso, e também porque a database mudou de nome e de formato no
Notion.

Resultado, no mesmo dia: push forçado com lease no hash que estava no GitHub
(`36bcf60` → `d25bcc1`, 32 commits; o commit que só adicionava o rascunho
sumiu), deploy verde e post de teste respondendo 200. Nenhum fork. Conferido
no histórico novo: nenhum ID do Notion, nenhum arquivo de rascunho em nenhum
commit, nenhum título de rascunho nas mensagens. A execução do Actions cujo
título era a mensagem do commit do rascunho foi apagada, com aval do dono.

**Resíduo fora do alcance do git**: o GitHub continua servindo os commits
antigos pelo hash até o suporte dele limpar o cache (o pedido é do dono; os
hashes ficaram no backup local). Clone antigo em outra máquina precisa ser
refeito: um `git pull` nele traria o histórico velho de volta.

Achado de passagem: `app/testes/publicacao-gate.teste.ts` estoura o timeout
padrão de 5 s quando a suíte inteira roda (o teste chama `npm run` duas vezes)
e passa sozinho. Instável, anterior a esta mudança.

[2026-09-30] **Layout sem "cara de IA", sem sair do tema do felixo.com.br.**
Pedido do dono: o blog estava bonito, mas algo ainda dava cara de IA, talvez
"os blocos e o layout quadrados demais". Comparando com as duas referências
que ele citou ao criar o blog (akitaonrails.com e rapha.land, capturadas em
headless), as duas são texto primeiro: lista de posts com data e título,
apresentação em primeira pessoa, tag como texto. A home seguia o molde que IA
gera por padrão: rótulo em caixa alta, título com gradiente brilhante, três
botões em pílula com ícone, e cada post numa caixa com borda e brilho.

Caminho até a decisão: a primeira versão tirou brilho demais (títulos sem
gradiente, botões virando links de texto, tag como `#texto`) e o dono achou
que "ficou bom, mas saiu um pouco do tema" do felixo.com.br. Capturado o
portfólio, a assinatura da marca é: títulos com gradiente brilhante,
partículas soltas no fundo, botões em pílula com ícone, etiquetas em pílula
com texto normal ("Web", "Python") e brilho roxo nas bordas.

DECISÃO (meio-termo): a identidade volta, as caixas não. Voltaram o
`felixo-text-glow` em todos os títulos de página, os botões `felixo-botao`
(na home, "Ver portfólio" e "Assinar RSS"; "Ver posts" saiu porque só rolava
até a lista logo abaixo), as etiquetas em pílula (sem caixa alta) e as
partículas com a opacidade original, agora em quatro camadas de tamanhos
primos entre si para não formarem grade. Ficaram de fora o rótulo em caixa
alta acima do título e a caixa parada em volta de cada post: o post na lista
virou `ItemPost` (data mono, título, resumo, pílulas), e o brilho de
respiração do portfólio aparece só no hover ou com foco dentro
(`felixo-item-post`). Cabeçalho sem barra fixa nem caixa no logo (igual ao
felixo.com.br), coluna única de `max-w-3xl` em todas as páginas, busca
compacta ao lado do título "Posts", citação sem caixa e foto do Sobre sem os
halos. Saíram do CSS só as classes que ficaram sem uso: `felixo-card-glow` e
`felixo-foto-perfil-glow*`.

Regressão pega pelo dono no preview: a primeira versão do `ItemPost` deixava
só o título clicável e perdia o "quadro inteiro clicável" pedido em
2026-08-05 (registro mais acima, que eu não reli antes de trocar o cartão).
Voltou sem a caixa: o `::after` do link do título cobre o item, e as tags
ficam acima dele com `relative z-10`; o `::after` cobre também a margem do
painel do brilho. Conferido com Playwright clicando por
coordenada (o clique normal do Playwright recusa o parágrafo justamente
porque o link está por cima): título, resumo e data abrem o post, e a tag
abre a página da tag, na home e em `/tags/<tag>/`, em 1280 px e 390 px; pelo
teclado, o Tab depois da busca cai no título do post.

Fora de propósito: os textos do site (slogan, chamada, Sobre) continuam os
mesmos, porque reescrever é trabalho do dono com o `LINGUAGEM-NATURAL.md`.
Validado com `npm run check`, `npm run build` e captura em desktop e celular.
Achado: `public/imagens/logo-felixo.png` tem 4096×4096 px (319 KB) para ser
exibido a 32 px; carrega tarde e vale uma versão pequena.

[2026-09-30] **Home com apresentação em primeira pessoa.** O dono achou o
texto da home "muito genérico": o slogan "Programação descomplicada" e a
chamada abstrata serviam para qualquer blog de tecnologia e não diziam quem
escreve. Seguindo o `LINGUAGEM-NATURAL.md`, foram oferecidas três versões
montadas com frases já escritas por ele, com a origem de cada trecho
marcada; ele escolheu a apresentação direta, trocou "Felipe" por "Felixo" no
título ("Oi, eu sou o Felixo!") e ditou o texto. A `SITE.chamada` virou
`TEXTOS.pt.home.apresentacao` (ver registro seguinte), um item por parágrafo, todo com as palavras dele: quem
ele é (desenvolvedor, engenheiro de IA, engenheiro de áudio e produtor
musical, líder de uma startup brasileira, entusiasta de ativos criativos) e
o que o blog é (a história dele, a visão de mercado e o aprendizado, "não
são apenas notícias, muito menos tutoriais"). A revisão só mexeu em
pontuação e concordância: "uma" antes de "startup", "como" no lugar de
"etc.", vírgula depois de "notícias", "tutoriais" no plural e "e" no lugar
de "+". A `SITE.descricao` ainda fala em "notícias de tecnologia", o que agora
contradiz a home. Continuam genéricos e ficam para depois, com o
dono: a `SITE.descricao` (buscador, cartão de compartilhamento, RSS e
`scripts/gerar-og-image.py`) e a lista da página Sobre.

[2026-09-30] **Blog em dois idiomas: português na raiz, inglês em `/en/`.**
Pedido do dono, para divulgar também para público em inglês: perguntar o
idioma ao abrir o site. Decisões dele: perguntar **na primeira visita** e
lembrar (com troca a qualquer hora pelo seletor PT | EN no topo); e os posts
só ganham versão em inglês **depois de completos em português**, feita junto
com ele.

O que entrou:

- `src/config/idiomas.ts`: todo texto de interface nos dois idiomas
  (`TEXTOS`), o mapa `PAGINAS_EM_INGLES` (hoje só `/` → `/en/`) e as funções
  de equivalência entre páginas. `LINKS_NAVEGACAO`, `LINKS_EXTERNOS` e a
  apresentação da home saíram do `site.ts` para cá.
- A home virou `PaginaInicial.astro`, usada por `src/pages/index.astro` e
  `src/pages/en/index.astro`. Em inglês, os posts aparecem com o selo "In
  Portuguese" e `lang="pt-BR"` no item, para o leitor de tela; a data sai em
  `en-GB` ("31 Jul 2026"), no mesmo formato da coluna em português.
- `BaseLayout` tira o idioma do caminho: `lang` do HTML, `og:locale`,
  `hreflang` (pt-BR, en e x-default) quando a página existe nos dois idiomas.
- `EscolhaDeIdioma.astro`: `<dialog>` nativo na primeira visita (foco e Esc
  de graça), escolha no `localStorage` (`felixo-blog:idioma`). Escolher o
  outro idioma leva para a página equivalente; numa página que só existe em
  português (um post), avisa e mantém a pessoa nela. Esc fecha e grava o
  idioma da página. Sem JavaScript ou com o armazenamento bloqueado, a
  pergunta não aparece, porque sem onde guardar ela voltaria a cada página.
- `RedirecionarParaIngles.astro`: na home em português, quem já escolheu
  inglês vai para `/en/` antes da pintura. Só a home redireciona: link
  compartilhado para uma página específica é respeitado. O seletor PT | EN
  grava a escolha no clique, senão a home mandaria de volta para `/en/`.
- Em inglês, o menu tem só "Posts": Tags e Sobre ainda não existem em
  inglês e entram junto com os posts traduzidos. O nome no topo fica
  "Felixo's Blog".

Validado com Playwright, cada cenário num perfil novo: a pergunta abre na
primeira visita com foco em "Português"; English leva para `/en/` e grava;
voltar à raiz redireciona; PT no topo volta e não redireciona de novo; num
post, English mantém no post com o aviso; Esc fecha e grava; `lang`, selo,
data e `hreflang` certos em `/en/`. A apresentação em inglês é tradução do
texto do dono e espera a revisão dele.

Achado no caminho: na lista, a `<ul>` das tags ficava acima do link do post
e engolia o clique nos espaços entre as tags (e no selo). Agora ela tem
`pointer-events-none` e só os links das tags capturam o clique.

[2026-10-16] **Abertura com o gatinho do FelixoVerse a cada carregamento.**
Pedido do dono: toda vez que o site abrir, trocar de página ou recarregar, a
animação do gatinho piscando com um mini headbang abre o site. O desenho e
os keyframes vieram do arquivo dele (`gatinho-piscando-headbang`), sem
retoque, inclusive o rosa do gatinho, que não é o roxo do blog.

Como ficou (`src/components/Abertura.astro`, primeiro filho do `<body>` no
`BaseLayout`): camada fixa preta, com o brilho roxo do fundo, e o gatinho no
centro dando **uma** piscadinha (os primeiros 40% do ciclo de 3,5 s do
original); depois a camada some sozinha. Uns 2 s no total. É só CSS: como o
site é estático, cada navegação é um carregamento novo e a animação roda de
novo sem script. Decorativa (`aria-hidden`), sem nada focável. Com "reduzir
movimento" não aparece; na impressão também não.

Conflito resolvido: o `<dialog>` da pergunta de idioma abre na camada de topo
do navegador, acima de qualquer `z-index`, e cobria o gatinho na primeira
visita. A primeira correção esperava a abertura terminar, e o dono viu o
problema no localhost: a abertura sumia, a página aparecia clara e a
pergunta "piscava" por cima. Agora `EscolhaDeIdioma` abre o `showModal()`
quando a animação `abertura-sumir` **começa** (lê `delay` e `currentTime`
dela pela Web Animations API), e o `::backdrop` escurece em 0,35 s, o
mesmo tempo da saída da abertura: um fundo escuro passa para o outro sem a
página clarear no meio. A caixa entra logo depois, subindo um pouco
(`pergunta-entrar`). Sem abertura (reduzir movimento), abre na hora e a
regra global zera as durações.

Limite conhecido: voltar ou avançar pelo histórico pode restaurar a página
do cache (bfcache) já pronta, e aí a abertura não repete.

Validado com `npm run check`, `npm run build` e capturas do Chrome headless
em tempos diferentes: gatinho surgindo, olho fechado com a cabeça inclinada
(home e post), camada sumindo e a pergunta de idioma só depois; com
`--force-prefers-reduced-motion`, a página e a pergunta aparecem direto. A
transição suave foi medida no build de produção, lendo as opacidades via
CDP a cada ~50 ms: o fundo da pergunta chega a 0,66 com a abertura ainda em
0,97, e já está em 1 quando a abertura passa por 0,43. A página não fica
clara em nenhum momento da troca.

[2026-10-16] **Ícone do cabeçalho: o gatinho em loop.** Pedido do dono: no
lugar do `logo-felixo.png`, a versão em loop do mesmo gatinho, que pisca com
o mini headbang a cada 3,5 s. O arquivo é `public/imagens/gatinho-piscando-headbang.svg`,
o SVG do dono sem retoque (desenho, keyframes e `<style>` embutido), usado
como `<img>` em `Cabecalho.astro`. O enquadramento é o mesmo do PNG
(1932×1932), então o tamanho no topo não mudou. O PNG continua no
repositório: `scripts/gerar-og-image.py` usa ele no cartão de
compartilhamento.

Por que `<img>` e não o SVG inline: a animação mora no próprio arquivo, sem
JavaScript, e o arquivo fica isolado da página, sem disputar o
`id="gatinho-rosa"` do gradiente com o SVG da abertura.

"Reduzir movimento" é tratado pelo `@media (prefers-reduced-motion)` de
dentro do SVG. Validado no Chrome headless via CDP, contando quadros
distintos do ícone em 45 capturas (4,5 s): 19 distintos no modo normal e
1 só com `--force-prefers-reduced-motion`, igual ao quadro de repouso do
modo normal. **Atenção ao testar:** a emulação de `prefers-reduced-motion`
do DevTools/CDP (`Emulation.setEmulatedMedia`) não chega a SVG carregado
como imagem, e o gatinho continua piscando. Para testar, use a preferência
do sistema ou a flag do Chrome.

[2026-10-16] **Contagem de acessos com GoatCounter.** Pedido do dono: saber
quantos acessos o site tem, sem servidor, como já é com os comentários. A
contagem anônima não pode morar no próprio repositório (exigiria um token
exposto no site público), então vai para um serviço externo. Escolhido o
GoatCounter: sem cookie, sem dado pessoal, grátis, de código aberto. O
Google Analytics foi descartado: usa cookie, pede banner de consentimento e
pesa demais para este site. O dono pediu "com todos os scripts" e com o
número visível no post.

Como ficou:

- `ContagemDeAcessos.astro`: o `count.js` completo (origem, tamanho de tela)
  e o pixel de 1×1 em `<noscript>` para quem está sem JavaScript. Só no build
  de produção; o `count.js` também ignora localhost sozinho. O caminho vai
  explícito (`data-goatcounter-settings` com `path` = `Astro.url.pathname`),
  para a contagem e o número do post usarem a mesma chave e um `?utm=` não
  virar outra página no painel.
- `AcessosDoPost.astro`: "· 1.234 acessos" no fim da linha de data e tempo
  de leitura. Um script inline lê `/counter/<caminho>.json`, fica só com os
  dígitos (o GoatCounter separa milhar com espaço, "1 234") e formata no
  idioma da página (`acessos` em `TEXTOS`). Começa com `hidden` e só aparece
  com um número maior que zero. Sem JavaScript, com bloqueador, com o
  contador desligado no painel ou com 404 (post ainda sem acesso), a linha
  fica como antes.
- Com `GOATCOUNTER.codigo` vazio nada disso entra no HTML, nem script.
  **Estado: pronto e desligado, esperando o dono criar a conta e passar o
  código** (passo a passo no README, seção "Contagem de acessos").

Validado: `npm run check` (0 erros) e `npm run build` com o código vazio,
sem nenhuma ocorrência de GoatCounter no `dist/`. Com um código de teste
temporário, o HTML gerado foi conferido na home e no post. No Chrome
headless, as chamadas ao GoatCounter foram interceptadas via CDP (`Fetch`)
com respostas simuladas: `"1 234"` aparece como "1.234 acessos", `"1"` como
"1 acesso" e um 404 deixa a linha sem o número. Nada foi enviado a uma conta
real.

Mais tarde no mesmo dia, o dono criou a conta: código `felixo`, preenchido em
`GOATCOUNTER.codigo`. Build com as 8 páginas contando e o número só no post.
O contador público respondeu 403 ("Need to enable the 'allow using the
visitor counter' setting") porque a opção ainda não estava marcada no
painel. Esse é o caso em que o número fica escondido, como previsto.

[2026-10-16] **Assinatura dos posts novos com follow.it (em andamento: só a
verificação publicada).** Pedido do dono: a pessoa assina no blog e recebe os
posts novos por e-mail, no celular e no navegador, sem back-end, só com
serviço grátis. Pesquisa dos planos grátis: RSS-to-email é pago no Kit, no
Buttondown e no MailerLite. Ficaram duas opções que cobrem tudo de graça:
OneSignal + GitHub Actions (sem anúncio, aviso na hora, mais trabalho) e
follow.it (quase sem código). O dono escolheu o **follow.it**, sabendo que o
plano grátis põe anúncios, a marca e "artigos sugeridos" nos e-mails e lê o
feed só a cada 6 h.

Feito: feed `blog-do-felixo` criado no follow.it a partir do `rss.xml`, com o
formulário configurado no visual do blog (pelo Claude in Chrome, no Brave do
dono). O formulário gerado é um `<form>` HTML puro (POST para
`api.follow.it/subscription-form/…/8`, um campo `email`), então dá para
assinar sem JavaScript no blog. Para o dono assumir o feed (ver e exportar
assinantes), o follow.it pede prova de propriedade: a meta tag
`follow.it-verification-code`, só no `<head>` da página inicial
(`FOLLOWIT.verificacao` em `src/config/site.ts`).

Pendente: o formulário no blog (fim do post, home, Sobre e rodapé), que
espera a aprovação do design, e a notificação no navegador, que a página
pública do feed não lista entre as opções do leitor (RSS, e-mail, app,
página pessoal).

[2026-10-16] **Assinatura no blog publicada (conclui o registro anterior).**
O dono assumiu o feed no follow.it (prova pela meta tag, commit `ebdc9ca`) e
aprovou o design. Especificação e plano em
`docs/superpowers/specs/2026-10-16-assinatura-follow-it-design.md` e
`docs/superpowers/plans/2026-10-16-assinatura-follow-it.md`.

Como ficou: `src/components/Assinatura.astro`, variante `destaque` (fim do
post, home PT e EN, Sobre) e `compacta` (rodapé de todas as páginas). É um
`<form>` HTML puro (POST para `FOLLOWIT.formulario`, campo `email`), abrindo o
follow.it em aba nova porque o plano grátis não redireciona de volta. Os ids
vêm de um prop por instância (`assinatura-post`, `-home`, `-sobre`,
`-rodape`), porque a mesma página tem dois formulários. Textos em
`TEXTOS.<idioma>.assinatura`, fiéis ao plano grátis ("um e-mail no dia em que
sair post novo", com anúncios do follow.it). `FOLLOWIT.formulario` vazio
desliga tudo sem deixar espaço (o componente recebe `class` em vez de um
`<div>` com margem em volta).

Decisões na implementação: o `<form>` ficou sem `rel="noopener"` porque os
tipos do Astro não aceitam `rel` em formulário (`target="_blank"` já implica
`noopener` nos navegadores atuais, e o destino é o follow.it). Na validação
visual, o texto de privacidade e o placeholder saíram em `zinc-500` com 4,35:1
sobre o preto, abaixo do AA: passaram para `zinc-400` (8,19:1), e o campo
ficou igual ao da busca (texto branco, borda roxa no hover e no foco).

Configuração no follow.it, feita pelo Claude in Chrome no Brave do dono, com
o ok dele a cada salvamento: feed ligado à conta, frase curta em português,
imagem do gatinho, idioma das telas automático pelo navegador. Travados no
plano grátis: diretório, padrão do e-mail (fica "Newspaper", o resumo
diário), horários e redirecionamento.

Validado: `npm run check` (0 erros), `npm run build` (8 páginas); no `dist/`,
2 formulários no post, na home PT e EN e no Sobre, 1 nas demais, ids sem
repetição, textos em inglês em `/en/`; desligado, nenhum formulário (a meta de
verificação continua na home). Capturas do Chrome headless em 1280 e 360 px
sem rolagem horizontal; Tab chega ao campo e ao botão do destaque e do rodapé
com foco visível; contraste dos textos da assinatura de 8,19:1 a 14,21:1.
Pendente: o teste ponta a ponta com e-mail real, que é do dono.

[2026-10-16] **Assinatura vira botão com janela, com a animação do portfólio.**
Pedido do dono: o cartão de assinatura aberto no meio da página ficou
intrusivo, melhor dentro de um botão. Entre abrir uma janela, abrir logo abaixo
do botão e ir direto ao follow.it, ele escolheu a janela; no meio do trabalho,
pediu as animações dos modais do felixo.com.br.

Como ficou: `BotaoAssinatura.astro` tem três variantes, `botao` (pílula ao
lado de "Assinar RSS" na home), `chamada` ("Quer saber quando sair post novo?"
e o botão, no fim do post e no Sobre) e `link` ("E-mail" entre os links do
rodapé, com nome acessível "Receber por e-mail"). Todas abrem a mesma janela,
`Assinatura.astro`, que o `BaseLayout` põe uma vez por página: um
`<dialog popover>` com o formulário de antes, um ✕ e o aviso do follow.it. O
`popover` nativo abre e fecha sem JavaScript, inclusive com Esc e clique fora,
e o `autofocus` do campo só age quando a janela abre. Saíram a variante
`compacta` e os ids por instância: agora há um formulário por página.

Animação: é a do modal de contato do portfólio (repositório
`Felipe-Portifolio`), em que o `layoutId` do framer-motion transforma o botão
"Enviar mensagem" no cartão. Os tempos vieram do bundle publicado do
felixo.com.br: 0,45 s com `cubic-bezier(.4, 0, .1, 1)` para a forma (o padrão
de layout do framer-motion) e 0,3 s com `cubic-bezier(.25, .1, .35, 1)` para o
esmaecimento. O esmaecimento é CSS (`@starting-style`). A forma é um script
curto: mede o botão clicado, anima a janela a partir dele (FLIP com Web
Animations, corrigindo o canto arredondado durante a escala), esconde o botão
enquanto a janela está aberta e, ao fechar, encolhe a janela de volta para
ele. Para a janela continuar na tela durante a saída, o CSS usa
`allow-discrete` em `display` e `overlay`, só onde `overlay` existe; nos outros
navegadores ela some na hora. Com "reduzir movimento", nada se move; sem
JavaScript, a janela abre só com o esmaecimento.

Decisões: o script é a exceção à regra de "sem JS de interface" só para a
animação, porque o dono pediu a do portfólio e ela depende de medir o botão;
abrir e fechar continuam sem JS. O botão some por uma animação de opacidade, e
não por `style.opacity`, porque o link do rodapé tem a transição de opacidade
do Tailwind. O script procura `[popovertarget]` e compara com o id da janela,
em vez de escrever o seletor inteiro, porque o Astro embute o script no HTML e
o seletor contaria como mais um botão nas asserções. A regra global de "reduzir
movimento" usa `*`, que não pega o `::backdrop`; o componente cobre isso.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No `dist/`:
uma janela e um formulário por página, dois botões na home PT e EN, no post e no
Sobre e um em Tags e na 404, ids sem repetição, textos em inglês em `/en/`;
desligado, nenhum botão, janela ou link do follow.it. No Chrome headless, em
360 e 1280 px, nas cinco páginas: carrega fechada e sem roubar o foco, abre
crescendo do botão e termina no lugar com o foco no campo, cabe na tela, Esc
fecha encolhendo e o botão volta; ✕ e clique fora fecham; Enter abre pelo
teclado, Tab vai ao Assinar e Esc devolve o foco ao botão; com "reduzir
movimento" e sem JavaScript, abre e fecha; contraste de 7,53:1 a 13,46:1 sobre
o fundo da janela.

[2026-10-22] **Espaço que faltava nos Comentários e acessos no rodapé de todas as
páginas.** Pedido do dono, depois de conferir em produção se a assinatura, os
comentários, as reações e o registro de visitas funcionavam (tudo funcionando):
corrigir o espaço e mostrar o número de visitas acumulado em todas as
páginas. Para o segundo, a pergunta "qual número?" teve a resposta "os dois": o
da própria página e o total do blog.

Espaço: o HTML publicado saía com `salvos como uma<a ...>Discussion pública`,
porque o `compressHTML` do Astro tira a quebra de linha entre um texto e o link
que vem na linha seguinte. Corrigido com `{' '}` em `Comentarios.astro`. Varredura
do `dist/` inteiro atrás de palavra colada em `<a>`, `<strong>`, `<em>`, `<code>`
ou `<time>`: nenhuma outra ocorrência. Regra para o futuro: texto seguido de
link na linha de baixo, num componente Astro, precisa de `{' '}`.

Rodapé: `AcessosNoRodape.astro`, dentro de `Rodape.astro`, mostra
"3 acessos nesta página · 5 acessos no blog" (em inglês, "views of this page" e
"views on the blog"). Lê o contador público do GoatCounter, o mesmo do
`AcessosDoPost.astro`: o número da página vem de `/counter/<caminho>.json`, com
o mesmo caminho que `ContagemDeAcessos.astro` manda na contagem, e o total vem
do caminho especial `TOTAL`. Começa escondido e cada número só entra quando é
maior que zero; sem JavaScript, com bloqueador ou com o contador desligado, o
rodapé fica como era. Escolhas, e o motivo:

- No post, o rodapé mostra só o total: o número da página já está no
  cabeçalho. O `BaseLayout` decide isso pelo `tipoOG === 'article'`.
- Na 404, só o total (`acessosDaPagina={false}` em `404.astro`): o caminho
  contado ali é o de todos os links quebrados juntos, e o número não diria nada.
- O texto é "acessos", como já está no cabeçalho do post, e o número é o `count`
  do GoatCounter (acessos, não visitantes únicos). Trocar a palavra é mexer em
  `acessosRodape` de `src/config/idiomas.ts`.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No build de
produção servido local, em Chrome headless com o `count.js` bloqueado (o teste
não gerou visita): home "3 acessos nesta página · 5 acessos no blog", Sobre e
Tags "1 acesso nesta página · 5 acessos no blog", `/tags/meta/` e `/en/` só o
total (sem acesso ainda), post e 404 só o total, `/en/` em inglês; sem estouro
horizontal em 390 e 1000 px.

Achado: o contador público do GoatCounter responde com `Cache-Control: public`
e uma leitura feita antes da primeira visita pode ficar em cache (vimos um 404
com zeros enquanto, com um parâmetro a mais na URL, o valor real era 3). Para
conferir o número de verdade, acrescente `?cb=<aleatório>`. E uma visita de
teste feita por Chrome headless não apareceu no contador do post, o que é
esperado se o GoatCounter a descarta como robô (inferência, não medido).

[2026-10-22] **Os acessos aparecem mesmo com zero.** O dono abriu o blog e
"não achou nada que indicasse as visitas", e pediu o número "mesmo que seja 0".
A causa era o desenho da entrada anterior: cada número só aparecia quando era
maior que zero, e nas páginas de hoje o post tem 0, então o cabeçalho do post
ficava sem nada, e o rodapé de uma página sem acesso mostrava só o total.

Agora o número aparece sempre. Para uma página sem acesso o GoatCounter
responde 404, mas com JSON `count` 0; os dois scripts (`AcessosDoPost.astro` e
`AcessosNoRodape.astro`) passaram a tratar o 404 como resposta, e isso vira
"0 acessos" (em inglês, "0 views"). Qualquer outra falha na leitura (rede fora,
bloqueador de anúncio, contador desligado no painel) é diferente de zero: no
rodapé o número vira um traço ("– acessos nesta página · – acessos no blog"),
para o contador não parecer ausente, e no cabeçalho do post a leitura que falha
continua escondida, para não pôr um traço solto ao lado do tempo de leitura.
Uma resposta sem o campo `count` também cai no traço, e não num 0 inventado.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No build de
produção servido local, em Chrome headless com o `count.js` bloqueado: post com
"31 de julho de 2026 · 2 min de leitura · 0 acessos" no cabeçalho; `/tags/meta/`
com "0 acessos nesta página · 5 acessos no blog"; `/en/` com "0 views of this
page · 5 views on the blog"; home e Sobre com os números de antes (3 e 1). Com a
leitura do contador bloqueada (`*goatcounter.com*`), o rodapé mostra os traços
nas duas línguas e o cabeçalho do post continua escondido.

Hipótese não medida: bloqueadores de anúncio (uBlock, Brave) costumam barrar o
GoatCounter, tanto o `count.js` quanto a leitura do contador. Se o navegador do
dono tem um, ele vê os traços e a contagem dele não entra; só dá para confirmar
no navegador dele. O número só sai do navegador de quem lê; ler os números no
build, para valerem mesmo com bloqueador, deixaria o valor velho até o próximo
deploy, e por isso não foi feito sem o dono decidir.

[2026-10-22] **Confirmado: o "0" do dono era o bloqueador de anúncio dele.**
Depois de o post passar a mostrar "0 acessos", o dono disse que tinha tido
acessos em outros dias, e logo em seguida confirmou que era o bloqueador de
anúncio do navegador dele. Fecha a hipótese da entrada anterior ("não medida").

O que isso explica: o bloqueador barra o `count.js` do GoatCounter, então as
visitas dele nunca chegam ao contador. A leitura do contador
(`/counter/<caminho>.json`) passou, e por isso apareceu "0" e não o traço (se a
leitura falhasse, o cabeçalho do post ficaria escondido e o rodapé mostraria
traços). O zero estava certo para o que foi contado: o contador público do
GoatCounter, lido na hora com `?cb=`, tinha 3 acessos em `/`, 1 em `/sobre/`, 1
em `/tags/` e 5 no total, e 0 no post e em `/en/`, mesmo olhando as variações do
caminho do post (com e sem barra final, `index.html`, `.html`). Todas as
contagens vêm de quem não usa bloqueador.

Consequência para quem for mexer nisso: os números são um mínimo, porque
leitor com bloqueador não é contado, e as visitas do próprio dono, que usa
bloqueador, também não entram. Para ver a contagem funcionando é preciso abrir
o blog num navegador ou numa janela anônima sem a extensão ligada para o site.
Não há correção de código: não se contorna bloqueador de anúncio num site
estático sem um endereço próprio para o script de contagem, e isso não foi
avaliado.

[2026-10-22] **Apresentação da home refeita com as marcações do dono.** O dono
mandou o texto da home com correções entre parênteses e um segundo parágrafo
reescrito por ele, mais a frase "Minhas redes em baixo". Seguindo o
`LINGUAGEM-NATURAL.md`, apliquei o que era claro e perguntei o que mudava o
sentido (3 perguntas pela ferramenta interativa).

Aplicado direto, como ele marcou: ponto final depois da primeira lista e a
segunda frase na linha de baixo; "líder" virou "criador"; "uma startup
brasileiraa" virou "algumas startups brasileiras" (a palavra "algumas" é dele; o
plural de "startup" e "brasileiras" é concordância); entrou no fim "e passo a
maior parte do meu tempo estudando Inteligência Artificial"; o segundo parágrafo
é o que ele reescreveu, só com "Aqui" em maiúscula depois do ponto e "público"
com acento. Mantive "pra frente" como ele escreveu: se "pra" fica ou vira "para"
é pergunta em aberto no `LINGUAGEM-NATURAL.md`.

Perguntado, com a resposta dele:

- "meio redundante" em "engenheiro de áudio e produtor musical": **fica só
  "engenheiro de áudio"** (a lista virou "desenvolvedor, engenheiro de IA e
  engenheiro de áudio").
- A segunda linha ficaria sem verbo ("Criador de algumas startups… e passo a
  maior parte do meu tempo…"): **começa com "Sou"**.
- "Minhas redes em baixo": **a frase "Minhas redes" antes dos botões** da home
  ("Ver portfólio", "Assinar RSS", "Receber por e-mail"). Está em
  `TEXTOS.<idioma>.home.minhasRedes` e é renderizada em `PaginaInicial.astro`.

A segunda linha é um parágrafo próprio (`apresentacao` tem um item por
parágrafo), com o mesmo espaço entre parágrafos, e não uma quebra de linha
colada. Se ele quiser as duas linhas coladas, é trocar por `<br>`.

O inglês acompanha como **tradução para o dono revisar** ("I'm a developer, AI
engineer and audio engineer." etc.; "Minhas redes" virou "My social networks").
Não passou pela revisão dele.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No build de
produção servido local, em Chrome headless a 1000 e 390 px: os três parágrafos
na ordem e "Minhas redes" entre o texto e os botões (conferido olhando as
capturas; o estouro horizontal não foi medido desta vez).

[2026-10-22] **Redes da home como no felixo.com.br.** Depois da frase "Minhas redes"
(registro anterior), o dono mandou a captura da home, com a frase em cima dos
três botões, e a da seção "Sobre" do portfólio: "Não colocou as redes como é no
meu site". O que ele queria era a linha de ícones, não os botões.

Origem: `src/sections/about.jsx` do repositório `Felipe-Portifolio` (público).
Seis ícones só com o desenho, de 28 px, na ordem e com os endereços de lá:
e-mail, GitHub, LinkedIn, WhatsApp, Discord e Twitter (o ícone é o passarinho;
o endereço é `x.com/Felixo_Tech`, o mesmo de `SITE.twitter`). Cor `#A855F7` com
o brilho pulsante de `.text-felixo-purple-glow` do portfólio (só a parte do
`drop-shadow`, a que vale para SVG), crescimento de 1,5× no hover e uma linha
roxa brilhante embaixo. Na home, a ordem ficou: parágrafos, "Minhas redes",
ícones, linha, e os três botões de antes (portfólio, RSS, e-mail), que são
ações do blog e não redes.

Onde está cada coisa: endereços em `REDES` de `src/config/site.ts` (o `id` é o
nome do ícone e a chave do rótulo); rótulos em `TEXTOS.<idioma>.home.redes`;
linha em `src/components/Redes.astro`; desenhos em `Icone.astro`, agora com
`github` e `linkedin` (Lucide 0.292.0, a versão do portfólio) e as marcas
`whatsapp`, `discord` e `twitter`, que não existem no Lucide e vêm do Font
Awesome Free 5.15.4 (CC BY 4.0, atribuição no comentário do `Icone.astro`), os
mesmos que o portfólio usa via `react-icons`. O `Icone` ganhou o tamanho 28.
Brilho em `.felixo-icone-brilho` de `global.css`, que para com "reduzir
movimento".

Acessibilidade, que o portfólio não tem: link só com ícone tem `aria-label` e
`title` (em inglês, "Email"); o SVG é `aria-hidden`; o crescimento vale também
para o foco do teclado; os links externos abrem em nova aba com
`rel="noopener noreferrer"`.

Atenção: o e-mail e o número do WhatsApp passam a estar no HTML do blog e neste
repositório, que é público. São os mesmos que já estão no portfólio, que
também é público, e o dono pediu que fosse igual ao site; a diferença é que o
blog tem mais uma cópia para robôs de spam lerem.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No build de
produção servido local, em Chrome headless: seis links com o endereço certo, o
nome certo e abertura em nova aba (menos o e-mail), em português e em inglês; a
1000 e 390 px a linha cabe sem estouro horizontal; com o mouse sobre o ícone do
GitHub ele vai de 28 para 42 px, e o foco do teclado dá o mesmo; cor medida
`rgb(168, 85, 247)` com a animação ativa. Não medido: o custo do `drop-shadow`
animado em celular fraco (se pesar, o brilho passa a ser fixo) e a aparência
em Safari e Firefox.

[2026-10-22] **WhatsApp fora das redes da home.** O dono pediu: "Tira o
whatsapp". A linha de redes (registro anterior) ficou com cinco ícones: e-mail,
GitHub, LinkedIn, Discord e Twitter, na mesma ordem do portfólio, que continua
com o WhatsApp.

Saíram o item de `REDES` (`src/config/site.ts`), o rótulo `whatsapp` nos dois
idiomas (`TEXTOS.<idioma>.home.redes`) e o desenho do WhatsApp em `Icone.astro`,
que só ele usava; o comentário do `Icone` agora fala só em Discord e Twitter
como marcas do Font Awesome. O número do WhatsApp não está mais no código nem
no HTML gerado.

Atenção, o que a retirada não faz: o número continua no **histórico do git**
deste repositório público, nos commits a partir de `99c5a6f`, e no portfólio
(site e repositório). Tirar do histórico exigiria reescrever o histórico e
forçar o push, como se fez em 2026-09-30 com os rascunhos, e isso só com pedido
explícito do dono. Pesa pouco, porque o mesmo número já é público no
portfólio, mas fica dito.

Validado: `npm run check` (0 erros) e `npm run build` (8 páginas). No `dist/`,
nenhuma página tem o número nem `wa.me`; na home, em português e em inglês,
restam cinco links com o nome e o endereço certos; no Chrome headless a 1000 px
a linha cabe sem estouro horizontal e a captura mostra os cinco ícones.

[2026-10-23] **Felixo Editor lista só artigos na importação do Notion.** Em
2026-09-27 a database que o editor lê como fila de posts virou "Ideias
criativas" e passou a guardar também vídeos, músicas, prompts e outros formatos,
com a coluna **Formato** (select, 12 opções, uma delas "Artigo"). Sem filtro, as
linhas de vídeo apareciam na tela "Importar do Notion" como se fossem posts.

`listarArtigosDaDatabase` (`app/src/principal/notion/paginasDaDatabase.ts`)
agora descarta a linha cujo Formato é outro que não "Artigo" (sem diferenciar
maiúsculas). Fica a linha com Formato vazio e toda linha de uma database que não
tem a coluna, por compatibilidade: o editor aceita qualquer database
configurada.

O filtro roda no cliente, depois da consulta, e não como `filter` da API do
Notion. Uma consulta filtrada por uma propriedade que a database não tem volta
com erro 400, e justamente a database sem a coluna precisa continuar listando.
O custo é baixar a lista inteira antes de filtrar, o que o editor já fazia.
Limite assumido (marcado como `shortcut:` no código): a coluna só é reconhecida
pelo nome "Formato" e pelo tipo select.

Validado: três testes novos em `app/testes/notion-paginas-database.teste.ts`.
Dois falham sem a correção e passam com ela; o terceiro (coluna Formato que não
é select) só trava a compatibilidade e passa nos dois estados. `npm run check`
do editor sem erros; `npm run check` (0 erros) e `npm run build` (8 páginas) na
raiz. Na database real, com 19 linhas (9 Artigo, 9 Vídeo e 1 sem Formato), o
critério mantém 10 e tira os 9 vídeos.

Não medido: a tela do editor rodando (não há pasta de dados local nesta máquina)
e a listagem contra a API do Notion. A suíte do editor tem 5 falhas que já
existiam sem esta mudança: três em `midia-otimizacao` (EBUSY ao apagar arquivo
temporário no Windows) e duas em `publicacao-gate`.

[2026-10-25] **Saída suave da pergunta de idioma.** A entrada da pergunta já era
suave (2026-10-16), mas escolher "Português" ou "English" numa página que fica no
mesmo lugar fechava o `<dialog>` na hora: o fundo escuro sumia num quadro e a
página clareava de uma vez, o mesmo "pisca" que o dono pediu para tirar na
entrada. Medido antes da mudança, no build de produção servido local, em Chrome
headless (156) dirigido por CDP, lendo a opacidade da caixa e do `::backdrop` a
cada quadro: depois do clique em "Português", zero quadros com a pergunta ainda
aberta (fechava em 1 ms); com Esc, 15 ms.

Como ficou (`src/components/EscolhaDeIdioma.astro`):

- Ao escolher um idioma e **ficar na página** (o idioma é o da página, ou a
  página não existe no outro idioma, como o Sobre), o `<dialog>` ganha a classe
  `saindo`: caixa e fundo somem juntos em 0,25 s (`pergunta-sair` e
  `pergunta-fundo-sair`, mais rápidas que a entrada). O `close()` vem no
  `animationend` de `pergunta-sair`.
- Ao escolher o **outro idioma com destino** (a home `/` para `/en/`), nada
  muda: `close()` e `location.assign` na hora, sem esperar a animação.
- O Esc continua fechando direto, como a task recomendava: o `cancel` não é
  adiado, e quem aperta Esc quer fechar. Não testei interceptá-lo.
- Um segundo clique durante a saída é ignorado (`saindo` já está na classe).
- Tempo de reserva: um `setTimeout` de 600 ms chama o mesmo `fechar()`, que só
  age se o `<dialog>` ainda estiver aberto. Existe porque, se a animação for
  anulada ou cancelada, o `animationend` não vem e a pergunta ficaria presa na
  frente da página, sem botão que a feche além do Esc.

Validado (`npm run check` com 0 erros e `npm run build` com 8 páginas; mesmo
método de medição de antes):

- "Português" em `/sobre/`: 17 quadros com a pergunta aberta depois do clique,
  fundo e caixa indo de 1 a 0 em ~289 ms (0,25 s da animação mais um quadro), e
  só então fechada. "English" em `/sobre/` (que fica na página) deu a mesma
  curva e salvou `en`.
- Com `--force-prefers-reduced-motion`: fecha em ~33 ms. A regra global zera a
  duração para 0,01 ms, mas o `animationend` vem mesmo assim, então o fechamento
  não depende da reserva de 600 ms. Com Esc, 16 ms.
- Reserva: com a animação anulada por CSS, fechou em 616 ms.
- Esc em modo normal: fechou em 12 ms (instantâneo, como antes).
- English na home: logo depois do clique, `saindo` é falso e o `<dialog>` já
  está fechado; `/en/` carregou antes do primeiro sondado, 50 ms depois, e `en`
  ficou salvo.
- Três cliques seguidos em "Português": sem erro no console, `<dialog>` fechado,
  `pt` salvo.
- Depois de fechar: `document.activeElement` é o `body` (nada estava focado
  antes de abrir) e não sobra nenhum `[inert]` na página.
- Capturei um quadro com as animações pausadas no meio da saída: caixa e fundo
  translúcidos, a página aparecendo aos poucos.

Não medido: Safari e Firefox, tela de celular de verdade, e o foco devolvido
quando algum elemento tinha foco antes de a pergunta abrir (na primeira visita
não há nenhum). O `getComputedStyle(dialog, '::backdrop')` usado na medição
funciona no Chrome 156; não foi conferido em outros navegadores.

[2026-10-26] **Abertura e pergunta de idioma conferidas em Firefox, WebKit e
celular emulado.** A abertura (2026-10-16) e a saída suave da pergunta
(2026-10-25) só tinham sido medidas no Chrome. Rodei o site publicado em cinco
perfis com o Playwright 1.64, instalado fora do repositório (nada entrou no
`package.json`; os scripts ficaram na pasta temporária da sessão): Chrome 156,
Chrome com a tela de um Pixel 7, Firefox 157 (Gecko), WebKit 27.2 e WebKit com a
tela de um iPhone 15. GoatCounter e giscus ficaram bloqueados para os testes não
entrarem na contagem de acessos.

Resultado nos cinco perfis:

- **Camada de abertura:** aparece com a animação rodando e termina de sumir
  (`visibility` em `hidden`) entre 2,1 e 2,7 s depois do início da navegação, já
  contando a rede. Depois disso o centro da tela deixa de ser a camada e tocar
  ou clicar num link interno navega. Capturas no meio da piscadinha, em Firefox
  e WebKit, mostram o gatinho de olho fechado em arco e a boquinha sorrindo,
  como no Chrome.
- **Entrada da pergunta:** lendo a hora de início das animações
  (`document.getAnimations()`, que não depende da taxa de quadros), o fundo e a
  caixa começam de 23 a 44 ms depois do começo da saída da camada. A claridade
  estimada da página (camada preta e fundo a 70%) ficou entre 0,30 e 0,37
  durante a troca, contra 0,30 no estado final; os 0,37 vieram das primeiras
  rodadas de Firefox e WebKit, que tiram poucos quadros por segundo. Nas fotos
  da tela, a luminosidade média nunca passou da fase do gatinho (afora o quadro
  branco do Firefox, comentado abaixo) e só sobe de 0,2 a 1,1 no fim, quando a
  caixa da pergunta entra.
- **Saída da pergunta:** "Português" faz caixa e fundo esmaecerem juntos até 0 e
  fecha entre 258 e 459 ms, antes da reserva de 600 ms. Logo, o `animationend`
  de `pergunta-sair` chega também em Gecko e WebKit. Depois, o foco fica no
  `body`, nada fica `[inert]` e `pt` está salvo. O Esc fecha em 6 a 36 ms (só
  nos perfis de computador).
- **"Reduzir movimento":** a camada fica em `display: none`, a pergunta abre e
  fecha ao clicar sem ficar presa, em 9 a 110 ms (360 ms no iPhone emulado com
  tela 3x, que roda a 3 quadros por segundo nesta máquina).
- **Post e recarregar:** a abertura repete.
- **Redes da home:** cinco ícones roxos (`rgb(168, 85, 247)`), com o brilho indo
  de 26 a 56 px de desfoque em todos e parado em 26 px com "reduzir movimento".
  A task de origem fala em seis ícones: são cinco desde a retirada do WhatsApp
  (2026-10-22).

Nada falhou, então `Abertura.astro` e `EscolhaDeIdioma.astro` não mudaram.

Não medido: Safari do iPhone e do Mac, Firefox e Chrome do celular de verdade. O
WebKit e o Firefox do Playwright são o motor, não o navegador final, e o celular
é emulação de tela e toque, sem a GPU e o toque reais. Esta máquina desenha
Firefox e WebKit por software (8 a 19 quadros por segundo na troca, contra 130 a
140 no Chrome), então a suavidade a olho nu e o peso do brilho animado em
celular fraco continuam sem resposta. No Firefox, a primeira foto (292 ms, antes
do primeiro desenho) saiu branca; pode ser efeito de fotografar antes da página
pintar, e não conferi a olho nu.

[2026-10-26] **Vulnerabilidades do `npm audit` zeradas no blog, com o Astro
preso na 7.3.x.** O `npm audit` acusava 12 vulnerabilidades desde 2026-10-25 (1
crítica, 10 altas, 1 moderada, em `astro`, `devalue`, `fast-uri`,
`http-cache-semantics`, `js-yaml`, `nanoid`, `sharp`, `smol-toml`,
`source-map-js`, `svgo`, `vite` e `zod`). A crítica e quase todas as altas vêm
do `astro` até a 7.3.2 e de dependências dele; onze das doze estão na árvore de
`dependencies` (só uma é de dev). Todas tinham correção sem subir versão maior.

**O primeiro deploy quebrou.** O `npm audit fix`, sem `--force`, rodado aqui
(Node 25.3, npm 11.6.2), levou o Astro à 7.4.2 e deu 0 vulnerabilidades, com
`check` e `build` verdes. Mas o deploy 40268048817 falhou no `npm ci`, e o
`main` ficou vermelho por cerca de 15 minutos (a produção não mudou, porque o
job de deploy é pulado quando o build falha). Eram dois problemas que só o CI
mostra:

- O `npm ci` do runner (npm 10.9.9, Node 22) recusou o lock gravado pelo npm 11:
  "Missing: @emnapi/core@1.11.3" e "@emnapi/runtime@1.11.3". O npm 11 deixa de
  gravar essas duas entradas hoisted, e o npm 10 as exige.
- O `astro` 7.4.2 exige Node `>=22.23.4`, confere isso ao iniciar
  (`bin/astro.mjs`) e sai. O `setup-node` com `node-version: 22` entregou a
  22.23.3. A 7.4.0 já subiu para `>=22.22.0`; até a 7.3.8 o piso é `>=22.12.0`.

**Correção** (commit `88d795c`): a faixa do `astro` passou de `^7.1.6` para
`~7.3.8` (a 7.3.3 já corrige o aviso crítico, e a 7.3.8 é a última 7.3.x). O
lock foi regravado do zero, com o npm 11 num diretório limpo
(`npm install --package-lock-only`). Esse lock, ao contrário do primeiro, passa
no npm 10. O npm 10.9.9 não serve para regravar: quebra com "Cannot read
properties of null (reading 'edgesOut')" tanto trocando o Astro num lock
existente quanto resolvendo sem lock, então ele só instala a partir de um lock
pronto. Também saiu do `package.json` o `allowScripts` do `esbuild@0.28.1`
(registro de 2026-08): o `esbuild` deixou a árvore (o Vite 8.3 usa o rolldown) e
o único pacote com script de instalação que sobrou é o `fsevents` (opcional, só
macOS).

Versões: `astro` 7.1.6 → 7.3.8, `vite` 8.2.0 → 8.3.5, `sharp` 0.35.3 → 0.35.5,
`zod` 4.4.3 → 4.6.7, `devalue` 5.9.0 → 5.9.4, `rolldown` 1.2.1 → 1.2.15. Como o
lock foi regravado do zero, vieram junto atualizações dentro das faixas já
declaradas (`@astrojs/check` 0.9.10 → 0.9.12, `prettier` 3.9.6 → 3.9.10,
`@astrojs/sitemap` 3.7.3 → 3.7.4, `shiki` 4.4.1 → 4.5.0, `postcss` 8.5.25 →
8.5.31): 162 pacotes com versão trocada, 26 novos e 57 fora.

Validado (resultado final):

- `npm audit`: 0 vulnerabilidades. `npm run check`: 0 erros, 0 avisos, 0 dicas
  (34 arquivos). `npm run build`: 8 páginas.
- Ensaio do CI numa cópia limpa do repositório, com as mesmas versões do runner:
  `npx -y npm@10.9.9 ci --dry-run` reproduz o erro do lock (e passa com o lock
  novo); `npm ci`, `astro check` e `astro build` rodando com o Node 22.23.3
  (`npx -y node@22.23.3`) e o npm 10.9.9 passaram. Essa é a receita para
  qualquer atualização futura: o Node 25 e o npm 11 locais escondem os dois
  problemas acima.
- Deploy 40269241461: sucesso. Em produção: gerador `Astro v7.3.8`, as sete URLs
  conferidas (home, Sobre, `/en/`, o post, Tags, `rss.xml` e
  `sitemap-index.xml`) respondem 200, e o CSS novo traz os prefixos `-webkit-`.
- Comparação do `dist` com o de antes: nas 8 páginas só mudam a meta
  `generator`, o hash do CSS e os dois scripts embutidos, e nestes o minificador
  trocou `if(c){a;return}b` por `c?a:b`, o mesmo comportamento. O CSS ganhou
  `-webkit-backdrop-filter`, `-webkit-mask-image` e `-webkit-background-clip`
  (ajuda no Safari) e fundiu seletores do `popover-open`, sem declaração
  perdida. `rss.xml`, o sitemap e os arquivos de `public/` ficaram idênticos.
- A conferência de navegador do registro de hoje (Chrome, Firefox, WebKit e
  Pixel 7 emulado) deu os mesmos números no build novo e na produção: a camada
  de abertura some em ~2,2 a 2,5 s, o fundo da pergunta começa 16 a 85 ms depois
  do começo da saída da camada, a pergunta fecha em 255 a 433 ms, o Esc fecha na
  hora, "reduzir movimento" tira a abertura, a abertura repete ao recarregar e
  os cinco ícones das redes continuam com o brilho de 26 a 56 px. Uma medição de
  3,05 s no Chrome logo depois do deploy não se repetiu em quatro rodadas
  seguintes (2,27 a 2,54 s): cache frio do CDN. No Firefox, `localhost` soma
  ~1,9 s por causa da resolução de endereço; o mesmo `dist` em `127.0.0.1` volta
  a ~2,4 s.
- `astro dev` sobe e serve `/`, `/sobre/`, `/en/`, o post, `/tags/` e `/rss.xml`
  com 200 e sem erro no log.

**Ficou preso de propósito:** subir o `astro` para a 7.4 ou mais exige antes
`node-version` do CI em 22.23.4 ou mais (o `setup-node` em `22` ainda entrega a
22.23.3 hoje) ou numa versão maior, como a 24. Um `npm audit fix` ou
`npm update` não cruza o `~7.3.8` sozinho. Se aparecer aviso novo no `astro`
7.3.x, o caminho é subir o Node do CI primeiro.

Não medido: a instalação dos binários nativos de Linux (o Docker Desktop estava
desligado e não o subi; o CI de Linux foi a prova, e passou); o changelog do
Astro 7.2 a 7.3 item por item (a prova foi a comparação do `dist` e a
conferência de navegador); e o `app/` (Felixo Editor), que tem `package.json`
próprio, não foi tocado e tem 10 vulnerabilidades no `npm audit` dele em
2026-10-26 (2 críticas, 7 altas e 1 moderada, entre elas `electron`, `vitest` e
`tinypool`).

[2026-10-26] **Primeira visita real ao post confirmada pelo contador público.**
A pendência de 2026-10-16 era ver uma visita de verdade passar por todo o
caminho: o `count.js` no navegador, a contagem no GoatCounter e o número
aparecendo no post. Em 2026-10-22 o post ainda tinha 0 (registro daquele dia).
Lido hoje, com o parâmetro `?cb=` aleatório para furar o cache de até 4 horas do
contador (`/counter/<caminho>.json`): total 10, `/` 6, `/sobre/` 1, `/tags/` 1,
**`/posts/ola-mundo/` 2** e `/en/` 0 (404 com zeros). Em 2026-10-22 eram total
5, `/` 3, `/sobre/` 1, `/tags/` 1 e post 0. O post saiu de 0 para 2, então o
caminho inteiro funciona em produção.

O número aparece na tela. Abri o site publicado num Chrome sem bloqueador
(Playwright, uma janela por página) com o envio da visita (`POST /count`)
bloqueado, para o teste não entrar na estatística: o post mostra "2 acessos" no
cabeçalho e "10 acessos no blog" no rodapé; a home, "6 acessos nesta página · 10
acessos no blog"; o Sobre, "1 acesso nesta página · 10 acessos no blog"
(singular certo). As leituras do contador responderam 200. Os três envios do
teste foram abortados, e uma leitura nova depois mostrou os mesmos números
(total 10, post 2, home 6).

Não medido:

- O painel em si (`felixo.goatcounter.com`) exige o login do dono: não o abri, e
  o contador público é o mesmo dado "ligado no painel". Por isso não sei dizer
  de onde vieram as 2 visitas ao post (navegador, país, origem).
- Quem fez as 2 visitas. O navegador do dono tem bloqueador (registro de
  2026-10-22), então elas não vêm dele, a não ser que ele tenha aberto o blog em
  outro. O servidor descarta robôs (`HeadlessChrome/`), e as 2 passaram nesse
  filtro.
- O `skipgc` (`localStorage.setItem('skipgc', 't')`, que o dono pode ligar nos
  navegadores sem bloqueador para não contar as próprias visitas) não foi
  aplicado.

[2026-10-26] **Gatinho do cabeçalho só com mouse ou teclado, e botão "Pausar
animações".** Decisão do dono sobre a pendência de acessibilidade aberta em
2026-10-16. A regra 2.2.2 do WCAG (nível A) pede um jeito de pausar, parar ou
esconder animação que começa sozinha, passa de 5 s e aparece junto com outro
conteúdo. O gatinho do cabeçalho (`<img>` com o SVG do dono) piscava a cada 3,5
s para sempre. Era uma decisão de produto: o loop é charme da marca, e eu não
decidi sozinho.

Perguntas e respostas (as opções que não foram escolhidas estão entre
parênteses):

- O que o gatinho do cabeçalho deve fazer? **Piscar só com mouse ou teclado em
  cima** (parar depois de algumas piscadas, que era a recomendada; manter o
  loop; ficar sempre parado).
- Quantas piscadas? **3 piscadas**, e, na segunda rodada, **3 completas mesmo se
  o mouse sair** (e não só enquanto o mouse estiver em cima).
- Posso editar o SVG do dono? **Fazer uma cópia só para o cabeçalho**; o
  original continua intocado em `public/imagens/`.
- As outras animações infinitas entram? **Revisar todas agora, nesta mesma
  task**; e como atender a regra? **Botão "Pausar animações" no rodapé** (que as
  animações parem sozinhas depois de uns 5 s, ou deixar como estão).

O que a investigação mediu, no site publicado (Chrome 156, amostrando o ícone a
cada ~100 ms): o gatinho piscava a cada 3,5 s; a primeira piscada, a ~0,6 s,
acontecia atrás da camada de abertura e ninguém a via, a primeira visível
começava a ~4,1 s. O CSS global tem outras quatro animações infinitas que também
passam de 5 s: as partículas do fundo (20 s), o brilho do fundo (18 s), o brilho
dos títulos (7,5 s) e o brilho dos ícones das redes (5,5 s), mais o pulso do
item de post no hover (3 s). Achado no caminho: com "reduzir movimento" o brilho
dos títulos continuava com uma animação `running`, infinita, de 0,01 ms, e a
posição do gradiente saiu diferente em 2 de 30 quadros (um tremor ocasional,
justamente para quem pediu menos movimento); o pulso do item de post no hover
tem a mesma configuração (infinito, só com a duração zerada), que eu li no CSS e
não medi.

Como ficou:

- `GatinhoDoCabecalho.astro` (novo): cópia inline do desenho, com o `id` do
  gradiente renomeado (`gatinho-rosa-cabecalho`, para não repetir o
  `gatinho-rosa` da abertura). Fica parado; um script dá 3 ciclos de 3,5 s (a
  piscadinha nos primeiros 40% de cada um) quando o mouse ou o foco de teclado
  chega no nome do blog, e termina mesmo que o mouse saia. No toque o gatinho
  fica parado (o gesto já leva para a home), e também com "reduzir movimento" e
  com o botão ligado. Os `@keyframes` `gatinho-*` são os do `Abertura.astro`,
  que está em toda página; renomear lá exige mexer aqui.
- `PausarAnimacoes.astro` (novo) no rodapé, entre RSS e E-mail: "Pausar
  animações" / "Retomar animações" (e "Pause animations" / "Resume animations"
  em inglês). Põe `data-animacoes="pausadas"` no `<html>` e guarda a escolha no
  `localStorage` (`CHAVE_ANIMACOES`, em `src/config/animacoes.ts`); um script
  inline no `<head>` do `BaseLayout` devolve o atributo antes da primeira
  pintura, para a abertura nem começar em quem já pausou. Fica escondido sem
  JavaScript e com "reduzir movimento" no sistema (as animações já estão
  paradas).
- `global.css`: duas listas de seletores iguais, a de "reduzir movimento" e a do
  atributo, com `animation: none` nas partículas e no brilho do fundo, nos
  títulos, nos ícones das redes e no pulso do item de post (no repouso, o título
  fica no quadro de repouso e o item de post, com o contorno estático). Quem
  criar uma animação infinita nova põe o seletor nas duas. Isso também tirou o
  tremor de 0,01 ms. A abertura some com o atributo, como some com "reduzir
  movimento".
- `Cabecalho.astro` passou a usar o componente novo; `AGENTS.md` ganhou a regra
  e as linhas na tabela.

Validado (build local servido em 127.0.0.1; Chrome 156, Firefox 157, WebKit 27.2
e Pixel 7 e iPhone 15 emulados):

- Em repouso o gatinho não se mexe: 0 piscadas em 7 s (317 a 333 quadros do
  ícone).
- Com o mouse em cima, as animações do gatinho rodam de ~0,05 s a 10,5 s, com a
  terceira iteração alcançada (Chrome, Firefox 10,507 s, WebKit 10,461 s). Se o
  mouse sai em 1 s, termina igual, em 10,5 s. Os quadros do meio das piscadas
  diferem do repouso (olho fechado em arco, cabeça inclinada), as pausas voltam
  ao mesmo quadro, e depois do fim o ícone volta exatamente ao quadro de
  repouso, sem animação sobrando. Tab até a marca também pisca (Chrome e
  Firefox).
- "Reduzir movimento": 0 animações no ícone com hover e com Tab, o recorte
  idêntico ao repouso em 25 quadros, e o botão escondido. Toque (evento `touch`)
  não pisca.
- Botão: para as partículas, o brilho do fundo, o brilho dos títulos e, na home,
  os 5 ícones das redes (de `running` para 0 animações); o atributo e a chave
  ficam gravados; depois de recarregar o atributo já está lá e a abertura fica
  em `display: none`; "Retomar" devolve todas as animações e apaga a chave.
  Enter e Espaço alternam, o contorno de foco é de 2 px, o nome acessível é o
  texto visível e não há `id` duplicado na página. Nos três motores o
  comportamento foi o mesmo (no iPhone emulado, por toque).
- Regressão: a conferência da abertura e da pergunta de idioma de hoje deu os
  mesmos números no build novo (camada some em 2,2 a 2,5 s, fundo da pergunta 16
  a 92 ms depois do começo da saída da camada, pergunta fecha em 256 a 414 ms,
  Esc, "reduzir movimento", recarga, cinco ícones das redes).
- `npm run check`: 0 erros, 0 avisos, 0 dicas (37 arquivos); `npm run build`: 8
  páginas; ensaio do CI com Node 22.23.3 numa cópia limpa: `astro check` e
  `astro build` passaram.
- Produção (deploy 40274734528, do commit `86aa9ad`): o HTML traz o botão e
  o gatinho inline com os dois `id` de gradiente distintos, as seis URLs
  conferidas respondem 200, e o mesmo roteiro rodou no site publicado com os
  mesmos resultados: 0 piscadas em repouso; animações do gatinho de ~0,04 a
  10,5 s com a terceira iteração alcançada, inclusive com o mouse saindo em 1 s;
  foco de teclado pisca; "reduzir movimento" esconde o botão; o botão para,
  lembra, esconde a abertura depois de recarregar e retoma; "Pause animations"
  em inglês.

Limites e o que não foi medido:

- No Safari, `Tab` pula os links (só para em botões, a menos que a opção
  "Pressione Tab para realçar cada item" esteja ligada ou se use Option+Tab): lá
  o gatinho só pisca pelo teclado nesses casos. Vale para qualquer link do site.
  O botão de pausa, sendo botão, é alcançável.
- No celular o gatinho não pisca (o toque já leva para a home). Safari e Chrome
  de aparelho de verdade não foram testados (só emulação).
- Sem `localStorage` (aba anônima com bloqueio), a pausa vale só para a página
  aberta.
- O botão cobre as animações que se repetem sozinhas; não mexe nas transições
  que a própria pessoa dispara (a janela de assinatura, a pergunta de idioma),
  que são curtas.
- A conta dos 5 s: o botão é o mecanismo exigido, então a duração deixa de
  importar; sem ele, o limite seria o movimento acabar em 5 s.

[2026-10-26] **Notificação no navegador: decidido o OneSignal sob demanda,
especificado, para implementar quando houver 3 posts.** Decisão do dono sobre a
pendência de 2026-10-16 (A: continuar sem; B: OneSignal só para o navegador).
Era decisão de produto, e eu não decidi sozinho.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- O blog deve ganhar notificação no navegador? **Implementar OneSignal sob
  demanda** (continuar sem e reavaliar quando houver público, que era a
  recomendada; continuar sem, decisão fechada; OneSignal padrão, com o script em
  toda página).
- Qual o gatilho para olhar de novo? (pergunta feita para quem continuasse sem)
  **3 posts publicados** (50 assinantes no follow.it; 3 meses, em 2027-01-26).
- No lugar da notificação, para quem quer aviso rápido hoje? **Abrir uma task
  para avaliar outros serviços depois** (nada, e-mail, app e RSS já cobrem, que
  era a recomendada; dar mais destaque ao app e ao RSS).
- Esclarecimento, porque as respostas se cruzavam (implementar e, ao mesmo
  tempo, um gatilho de 3 posts): **especificação agora, implementar quando
  houver 3 posts** (especificação e código agora, desligado até haver conta; só
  registrar a decisão).

O que foi medido, em 2026-10-26: o plano grátis do OneSignal tem "máx. 10.000
assinantes por envio" e API de envio ilimitada (página de preços, editada em
2026-09-28). O script custa, com gzip, 42,6 KB (`OneSignalSDK.page.es6.js`, mais
590 B do carregador) em toda página que o carregasse, contra 8,7 KB do CSS
inteiro do blog e 3,5 KB do `count.js` do GoatCounter; por isso o modo sob
demanda, que só carrega no clique. A lista EasyPrivacy barra as chamadas da API
do OneSignal (`onesignal.com/api/v*/apps/`, `/api/v1/sync/` e outras), então
quem usa bloqueador, como o dono no Brave, não consegue ativar, igual ao
GoatCounter. A documentação do OneSignal exige HTTPS, o service worker na raiz,
na mesma origem, a permissão da pessoa e, no iPhone, o site na Tela de Início;
não funciona em janela anônima. O `rss.xml` tem 1 item hoje, o post de teste.

Resultado: nenhuma mudança no site. A especificação ficou em
`docs/superpowers/specs/2026-10-26-notificacao-no-navegador-onesignal-design.md`:
botão "Avisar no navegador" dentro da janela de assinatura, com seis estados e
carregamento só depois do clique; service worker de uma linha em `public/`;
`ONESIGNAL.appId` em `site.ts` (vazio desliga tudo); e um job `avisar` no
deploy, depois do `deploy`, que compara o `rss.xml` de antes e de depois e envia
a notificação dos posts novos (no máximo 3, de até 7 dias), sem derrubar o
deploy se falhar. A implementação virou uma task com o gatilho de 3 posts
publicados e o pré-requisito de o dono criar a conta no OneSignal, o App ID e a
chave de API (que vai só como secret do GitHub); a avaliação de outros serviços
de aviso virou outra task.

Não medido: o `Content-Type` do `.js` no GitHub Pages (hoje não existe nenhum
`.js` estático no site), o comportamento do Brave com notificação push, a lista
exata de dados que o OneSignal guarda (conferir na política dele antes de
publicar a linha de privacidade) e os nomes exatos dos campos de título, de link
e do segmento padrão da API de envio (a especificação manda conferir ao
implementar). Nada disso foi testado com uma conta real, porque ela não existe.

[2026-10-26] **Assinatura: ajustes menores da revisão final (acessibilidade e
CSS).** Pendência aberta em 2026-10-16 e parcialmente resolvida em 2026-10-17,
quando a janela substituiu o cartão. Era melhoria de código, sem decisão de
produto para o dono.

O que já não valia mais (a troca do cartão pela janela removeu o objeto): o
`aria-label` duplicado da variante compacta, os dois formulários colados no
Sobre (a variante `compacta` não existe; hoje a página tem um botão de chamada
e, no rodapé, um link de texto) e o link "Prefere app ou RSS?" dentro da
descrição do campo. A pergunta "a compacta some onde há destaque?" ficou sem
objeto e a página ficou como está.

O que foi feito:

- **Leitor de tela:** `aria-describedby` do campo agora aponta só para a frase
  de privacidade (`assinatura-privacidade`), e o botão "Assinar" ganhou
  `aria-describedby` para o aviso de nova aba (`assinatura-nova-aba`), porque é
  o botão que abre a aba. Antes, o campo era descrito pelas duas frases juntas
  (descrição calculada pelo Chrome: "...cancelar a qualquer momento. Abre o
  follow.it em nova aba.") e o botão não tinha descrição. Agora cada frase
  aparece uma vez, no PT e no EN.
- **`rel="noopener"` no `<form>` voltou.** A decisão de 2026-10-16 o tirou
  porque os tipos do Astro não aceitam `rel` em formulário. `src/env.d.ts`
  (novo) amplia `astroHTML.JSX.FormHTMLAttributes` com `rel`. Prova: sem o
  arquivo, `npm run check` dá 1 erro
  (`Property 'rel' does not exist on type 'FormHTMLAttributes'`); com ele, 0.
- **`.felixo-campo`** (em `src/styles/global.css`) é o desenho único do campo de
  texto, usado pela busca da home e pelo e-mail da assinatura; saiu o
  `.assinatura-campo` do `Assinatura.astro` e o `.felixo-busca input` virou só o
  recuo da lupa (`.felixo-busca .felixo-campo`). A busca não mudou (39 px,
  `padding` 8/14/8/36 px). O campo da assinatura ganhou o brilho roxo no hover e
  no foco, que a busca já tinha, e passou de 40,6 px para 43 px, a altura do
  botão "Assinar", que não mudou; antes os dois ficavam 2,4 px fora de
  alinhamento. O campo maior também aumenta a área de toque.
- **`FOLLOWIT.seguir`** passou a constar no README e no comentário de `site.ts`.
  Vazio, antes virava `<a href="">`; agora tira só o link "Prefere app ou RSS?"
  (build com `seguir: ''`: nenhuma ocorrência do texto nem `href=""`).

O que foi medido, em 2026-10-26, com Playwright sobre o `dist`: campo e botão
com 43 px e a mesma posição vertical no Chrome (desktop e Pixel 7 emulado), no
Firefox e no WebKit (desktop), em português e em inglês no Chrome;
`aria-describedby` apontando para ids que existem; `relList` do formulário com
`noopener`; brilho e contorno de 2 px no foco do campo; busca da home sem
mudança. As asserções do script rodaram sem falha. A descrição acessível foi
lida da árvore de acessibilidade do Chrome.

Não medido: leitor de tela de verdade (NVDA, VoiceOver, TalkBack): só a
descrição calculada pelo Chrome; a descrição acessível no Firefox e no WebKit
(só os atributos); Firefox e Safari de celular reais.

[2026-10-26] **Teste ponta a ponta da assinatura: inscrição enviada e aceita
pelo follow.it; falta confirmar o e-mail.** Pendência de 2026-10-16 ("testar com
e-mail real e ver o primeiro aviso chegar"). O dono passou um e-mail de teste
(pessoal, por isso fora deste repositório público) e autorizou o envio.

O que foi feito e medido, em 2026-10-26, no site em produção: pelo post de
teste, abri a janela de assinatura, preenchi o e-mail e cliquei em "Assinar" num
Brave de verdade (conectado ao Claude in Chrome). O formulário abriu a aba nova
do follow.it, que respondeu em `confirm-request` dizendo que mandou o link de
confirmação para o e-mail informado. Ou seja: janela, `POST` ao follow.it e
e-mail de confirmação funcionam do lado do blog.

Achado: depois do envio, o follow.it passa o leitor por uma verificação de
segurança do Cloudflare (a página "A executar uma rápida verificação de
segurança… Verificando…"). No Chrome automatizado do Playwright a página ficou
parada nela e nenhuma inscrição foi registrada; no Brave de uma pessoa ela
passou sozinha em poucos segundos. Por isso esse teste não se automatiza (e a
verificação não deve ser contornada): precisa de navegador de pessoa.

Não feito: confirmar o e-mail e ver o assinante no painel do feed
`blog-do-felixo`. No Brave da máquina do dono, o Gmail de teste não estava
logado e o follow.it pedia login, e agente não digita senha. O primeiro aviso de
um post novo também fica para depois, porque o blog só tem o post de teste.
Nenhum código mudou; as duas pendências viraram tasks (confirmar e ver o painel;
conferir o resumo do primeiro post novo).

Não medido: que o e-mail de confirmação de fato chegou (só a página do follow.it
diz que enviou), em quanto tempo e se caiu em spam; e tudo o que vem depois da
confirmação.

[2026-10-26] **Correção da entrada anterior (teste da assinatura): o Playwright
não "travou" na verificação do Cloudflare, ficou sem resposta conclusiva.** Na
entrada acima escrevi que, no Chrome automatizado do Playwright, a página do
follow.it "ficou parada" na verificação de segurança e que "nenhuma inscrição
foi registrada", e daí que o teste "não se automatiza". Isso foi exagero: fechei
aquele navegador cerca de 3 s depois do envio, ainda em "Verificando…", e no
Brave a página seguinte (`confirm-request`) apareceu em até 4 s. Não sei se a
verificação passaria sozinha no Playwright, nem se aquela tentativa registrou
uma inscrição (pode haver duas inscrições pendentes para o mesmo e-mail; se
chegarem dois e-mails de confirmação, basta clicar em um). O que está medido: a
verificação do Cloudflare existe depois do envio e o Brave passou por ela. Como
tentar passar por um anti-robô é contornar, o teste da assinatura fica para
navegador de pessoa.

[2026-10-26] **Prettier entra no `npm run check` (o gate), no repositório todo
menos `app/` e os posts.** Task de 2026-10-22 ("formatar a tabela de campos do
README, que já estava fora do padrão do Prettier"), que trazia um item opcional
que era decisão do dono: o gate passar a verificar o Prettier.

Pergunta e resposta do dono (as alternativas não escolhidas estão entre
parênteses): o gate passa a rodar o Prettier em modo de verificação? **Checar o
repositório todo** (manter como está, que era a recomendada; checar só o código
e o README, num `format:check` limitado a `src/`, `README.md` e `AGENTS.md`).

O que foi feito:

- **Tabela do README** (commit `5ac281c`): o Prettier realinhava a tabela de
  campos inteira porque a linha da `capa` entrou sem alinhar com as outras (a
  descrição dela é longa). Só a tabela mudou; o resto do arquivo já estava no
  padrão.
- **`npm run check`** virou `astro check && prettier --check .`. O CI
  (`deploy.yml`) e o botão de publicar do Felixo Editor (`rodarGate`) já rodavam
  `check`, então os dois passam a verificar o Prettier sem outra mudança. Um
  arquivo fora do padrão derruba o `check` e, no CI, o deploy.
- **`"endOfLine": "auto"`** em `.prettierrc.json`: sem isso, no Windows
  (checkout em CRLF, `autocrlf`) o `--check .` acusava 33 arquivos só pelo fim
  de linha. Com `auto`, o Prettier respeita o de cada arquivo e o `--write`
  deixa de converter CRLF em LF.
- **Três arquivos formatados**, só formatação, sem mudar texto: `CLAUDE.md`
  (quebra de linha no fim), `LINGUAGEM-NATURAL.md` (uma tabela realinhada) e
  este `IA.md` (quatro linhas em branco, uma tabela realinhada no registro de
  2026-08-13 do Felixo Editor, e `*padrão*` virando `_padrão_`).
  Foi a exceção consciente à regra de não reescrever os registros antigos, que
  decorre de o dono ter escolhido "o repositório todo"; nenhuma palavra de
  registro nenhum mudou.
- **`src/content/posts/` entrou no `.prettierignore`** (decisão minha, dentro da
  escolha do dono): o texto dos posts é do Felipe, e um post fora do padrão
  travaria o `check`, o deploy e o botão de publicar do Felixo Editor. `app/` já
  estava ignorado.
- `README.md` e `AGENTS.md` descrevem o novo `check`.

O que foi medido, em 2026-10-26: antes, `prettier --check . --end-of-line auto`
acusava 4 arquivos (`CLAUDE.md`, `IA.md`, `LINGUAGEM-NATURAL.md`, `README.md`);
depois, nenhum. Ensaio do CI numa cópia da árvore com fim de linha LF e sem
`node_modules` próprio (ligado ao do projeto): `prettier --check .` passa; com
um `.ts` mal formatado acrescentado, falha com código 1; com um post fora do
padrão acrescentado, ele não é listado. Não foi medido o CI real com esse passo
novo, só o ensaio acima e o gate local.

[2026-10-26] **Comentários conferidos à mão, logado no GitHub: entrar, comentar,
responder e reagir funcionam.** Pendência de 2026-10-22: só a leitura tinha sido
validada, porque escrever exige login e agente não entra em contas. Em
2026-10-26, com o ok do dono para publicar e depois apagar, usei o Brave dele,
que já estava logado no GitHub com a conta dele (mantenedora do repositório).

O que foi medido, no post `ola-mundo` em produção (discussão 1):

- **Entrar:** o clique em "Entre com GitHub" no widget voltou para a página já
  logado, sem tela de autorização (o app giscus já estava autorizado pelo dono).
  A caixa passou de "Entre para comentar" para "Escreva um comentário".
- **Comentar:** o comentário de teste apareceu no widget (contador de 4 para 5)
  e na discussão do GitHub, com o autor do dono, a marca "with giscus" e o selo
  de mantenedor.
- **Responder:** a resposta apareceu no widget ("1 resposta") e na discussão.
- **Reagir:** 🚀 no post (de 2 para 3 reações) e 🚀 no comentário de teste, os
  dois salvos na discussão. A reação 👀 do post já era do dono antes do teste e
  ficou intocada.
- **Limpeza:** apaguei o comentário, a resposta e a reação 🚀 do post pela API
  do GitHub (`deleteDiscussionComment` e `removeReaction`), pelos ids, depois de
  listar a discussão. Estado final igual ao inicial: 4 comentários, reações do
  post 👀 (dono) e ❤️ (outra pessoa), nenhum dos 4 comentários de outras pessoas
  mexido. Também saí da conta no widget, que começou deslogado.

Observação, sem correção: os botões "Comment" e "Reply" do widget saem em inglês
mesmo com `idioma: 'pt'` em `GISCUS` (o resto está em português). Não verifiquei
se a causa é a tradução do próprio giscus.

Não medido: o fluxo com a conta de um leitor comum (o teste usou a conta do
dono, que é mantenedora); Firefox, Safari e celular reais; se o GitHub mandou
e-mail de notificação ao dono por causa do comentário e da resposta de teste; e
se o widget oferece apagar (apaguei pela API).

[2026-10-26] **Correção da entrada anterior (comentários): não vi se houve tela
de autorização.** Na entrada acima escrevi que a entrada pelo giscus voltou "sem
tela de autorização". O que eu vi foi só o resultado: depois do clique em "Entre
com GitHub", a página já estava de volta e logada, e o widget mostrava "Escreva
um comentário". Se uma tela de autorização do app giscus passou no meio do
caminho, não a vi. Para um leitor novo, que ainda não autorizou o app, a tela
provavelmente aparece; isso não foi medido.

[2026-10-26] **Acessos com bloqueador de anúncio: o blog passa a avisar que o
bloqueador pode estar impedindo; as visitas de quem bloqueia continuam fora da
contagem.** Decisão do dono sobre a pendência de 2026-10-22 ("decidir se o
número de acessos deve aparecer também com bloqueador"). Era decisão de produto,
e eu não decidi sozinho.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Quando o navegador barra a leitura do contador, o que o blog mostra no lugar
  do número? **"Avisar que o bloqueador impede"**, resposta livre (deixar o
  traço, que era a recomendada; mostrar o número da última publicação; esconder
  o rodapé de acessos).
- Vale tentar contar também as visitas de quem usa bloqueador? **Não, aceitar o
  mínimo** (abrir task para avaliar um proxy próprio; abrir task para avaliar
  outro contador).
- Quando o número não carrega, o traço deve explicar o motivo? **"Sempre
  mostrar"**, resposta livre, que entendi como "a explicação sempre visível"
  (texto ao passar o mouse, que era a recomendada; só o traço).

O que foi medido, em 2026-10-26: no Brave do dono, com os Shields ligados, o
post mostra "2 acessos" e o rodapé "10 acessos no blog", então a leitura do
número passa nesse navegador. Se a visita dele entra na contagem não foi medido,
porque o painel do GoatCounter pede login. Segundo a documentação do
GoatCounter: "a maioria dos bloqueadores barra goatcounter.com", e o autor
estima "cerca de um terço" das visitas perdidas; domínio próprio (CNAME) não
impede os bloqueadores, é só nome bonito; hospedar só o `count.js` no site não
adianta, porque o envio da visita continua indo para
`<conta>.goatcounter.com/count`. Só escapam um proxy próprio ou um GoatCounter
hospedado por conta própria (os dois precisam de servidor, fora do GitHub Pages)
ou a importação de logs (o GitHub Pages não dá logs).

O que foi feito: quando a leitura do contador falha, o cabeçalho do post mostra
"acessos indisponíveis (bloqueador de anúncio?)" (antes sumia) e o rodapé mostra
"Os acessos não carregaram: um bloqueador de anúncio pode estar impedindo."
(antes era um traço mudo), com os textos em português e em inglês em
`src/config/idiomas.ts`. Se qualquer uma das duas leituras do rodapé falha, a
frase substitui os dois números. O ponto separador do cabeçalho agora quebra de
linha junto com o texto (`inline-flex`), para não sobrar um ponto no fim da
linha no celular. O aviso diz "pode estar impedindo", e não "impede", porque a
leitura também falha com a rede fora ou com o contador desligado no painel; o
404 do GoatCounter com `count` 0 continua sendo um zero de verdade.

Validação com Playwright sobre o `dist` (Chrome, Firefox e WebKit, mais um Pixel
7 emulado no Chrome), sem enviar visita nem carregar comentários: com a leitura
normal, os números aparecem como antes; com tudo bloqueado, o aviso aparece no
cabeçalho e no rodapé, em português e, no rodapé da home, em inglês; com só a
leitura da página bloqueada, o cabeçalho avisa; com o 404 do GoatCounter,
aparece 0; sem JavaScript, nada aparece; a cor do aviso é a mesma dos números e
não há rolagem lateral no celular. As asserções rodaram sem falha.

Não medido: o aviso num bloqueador que realmente barra a leitura (no Brave do
dono a leitura passa, então o aviso não apareceu lá); leitor de tela real; e
quantas visitas se perdem de fato neste blog.

[2026-10-26] **Descrição do site, página Sobre e cartão de compartilhamento
alinhados à apresentação da home.** Pendência de 2026-09-30 e de 2026-10-22: a
`SITE.descricao` e a lista do Sobre ainda diziam "notícias de tecnologia", o que
contradiz a home do dono. O texto é dele, então, seguindo o
`LINGUAGEM-NATURAL.md`, eu não escrevi nada: perguntei, com opções feitas só de
frases dele (as da apresentação da home), com a origem marcada.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Qual frase vira a descrição do site (buscador, cartão de compartilhamento e
  RSS)? **"Aqui, eu escrevo sobre a minha história, o que eu aprendi ao longo da
  jornada, e o que ando construindo nesse tempo."**, sem mudar uma palavra (essa
  mesma frase com "Sou desenvolvedor, engenheiro de IA e engenheiro de áudio."
  antes, com 175 caracteres; a frase do "não é notícia", com 148).
- Qual título grande vai no cartão? **"Blog do Felixo"** ("Oi, eu sou o
  Felixo!"; manter "Programação descomplicada"). Avisei que o nome já aparece ao
  lado do logo, no alto do cartão, e que o título repetiria; ele manteve a
  escolha.
- O que fazer com a abertura e a lista do Sobre, que eram texto da IA? **Usar as
  frases da home** (tirar só "Notícias de tecnologia"; deixar como está).
- O "o blog do FelixoVerse" da descrição antiga entra na descrição e no cartão?
  **Não, fica fora** (no fim da descrição; só no cartão).

O que foi feito: `SITE.descricao` em `src/config/site.ts` virou a frase
escolhida; o cartão (`public/og-image.jpg`) foi regerado com o título "Blog do
Felixo" e essa descrição (os padrões de `scripts/gerar-og-image.py` mudaram
junto); o Sobre passou a mostrar os três parágrafos da home, lidos de
`TEXTOS.pt.home.apresentacao` (uma fonte só, então não divergem), e manteve a
foto e a seção "Onde mais me encontrar". O RSS usa a descrição nova. A descrição
em inglês já era a tradução da mesma frase ("Here I write about my story and
what I've been building and learning along the way."), então não mudou; ela
continua sendo tradução que o dono ainda não revisou. Meta `description` da
página Sobre não mudou ("Sobre Felipe Alcântara e o Blog do Felixo.").

Medido, em 2026-10-26: o `dist` traz a frase nova em `description`,
`og:description` e no RSS, e nenhuma ocorrência de "notícias de tecnologia"; o
Sobre tem os mesmos três parágrafos da home, no Chrome, no Firefox, no WebKit e
num Pixel 7 emulado, sem rolagem lateral. O cartão novo tem 1200 por 630 px e 70
kB, com a Space Grotesk carregada (pesos 400, 500 e 700). Como o Python daqui
não tem Playwright, montei o HTML com a própria `montar_html` do script e o
renderizei com o Chrome do Playwright em Node, no mesmo tamanho e com a mesma
qualidade (JPEG 92): o resultado deve ser igual ao do script, mas não foi gerado
por ele. O rodapé "BLOG.FELIXO.COM.BR" saiu mais leve que no cartão antigo; o
CSS pede o peso 500 e a fonte carregou o 500, e não investiguei por que o antigo
saiu mais pesado.

Não medido: como o cartão aparece de verdade no WhatsApp, no LinkedIn e no X
(eles guardam o cartão antigo em cache; é preciso reinspecionar o link nas
ferramentas de cada um); o post `ola-mundo`, que ainda tem a lista "O que você
vai encontrar aqui" com a mesma linha antiga, por ser um teste que o dono vai
revisar; "pra frente" na apresentação, que segue como ele escreveu (a pergunta
sobre "pra" segue em aberto no `LINGUAGEM-NATURAL.md`).

[2026-10-26] **Tradução em inglês da apresentação da home revisada pelo dono.**
Pendência de 2026-10-22: a versão em inglês (`TEXTOS.en.home.apresentacao`, o
rótulo "My social networks" e a descrição do site em inglês) era tradução
minha, no ar sem a revisão dele. Pelo
`LINGUAGEM-NATURAL.md`, eu mostrei o texto, marquei o que me parecia duvidoso e
só mudei o que ele apontou, sem trocar o sentido.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Título e dois primeiros parágrafos ("Hi, I'm Felixo!", "I'm a developer, AI
  engineer and audio engineer." e "I'm the creator of a few Brazilian
  startups…")? **Aprovados como estão** (ajustar algo).
- Terceiro parágrafo, primeira parte, com "the field" e os dois-pontos (que eu
  achava meus, porque no português ele usa vírgula)? **"the field" vira "the
  industry"** e **os dois-pontos viram ponto final**, duas frases (nenhum
  ajuste). Escolha de múltipla marcação.
- Última frase, com "pass it on" e "record my take"? **"share it" no lugar de
  "pass it on"** (como estava; "pass it forward"). Avisei que "passar pra
  frente" perde um pouco a ideia de repassar.
- "My social networks"? **"My socials"** (como estava; "My social media").
- Descrição do site em inglês? **Igual à primeira frase do terceiro parágrafo**,
  na mesma ordem do português (como estava: "Here I write about my story and
  what I've been building and learning along the way.", que juntava e invertia a
  ordem da frase dele). Na pergunta eu disse que a frase tinha 111 caracteres;
  são 107.

Resultado em `src/config/idiomas.ts`: terceiro parágrafo "Here, I write about my
story, what I've learned along the way, and what I've been building in the
meantime. Here, you won't find just news, much less tutorials. It's my take on
the industry and how my learning got me to where I am today. And I'd like to
share it and record my take and everything I saw along the way, and I decided to
make all of this public!"; `minhasRedes` "My socials"; `descricao` "Here, I
write about my story, what I've learned along the way, and what I've been
building in the meantime."; o comentário do código passou de "para ele revisar"
para "revisada por ele em 2026-10-26".

Medido: o `dist` de `/en/` traz o texto novo na página e em `description` e
`og:description`, sem "the field", "pass it on" nem "My social networks";
Playwright (Chrome, Firefox e WebKit) lê na home em inglês o título, os três
parágrafos exatamente como acima e o rótulo "My socials"; capturei a tela e o
texto cabe sem estouro.

Não revisado, e fora desta task: o resto dos textos da interface em inglês
(botões como "RSS feed" e "Get posts by email", a janela de assinatura, os
avisos de acessos e outros), que também são tradução minha. Virou uma task.

[2026-10-26] **Segurança: e-mail e WhatsApp do dono no blog. O e-mail fica; o
número do WhatsApp saiu do histórico público (reescrita), mas o GitHub ainda
serve os endereços antigos.** Pendência de 2026-10-22: o e-mail e o número
entraram em `REDES` quando a home ganhou a linha de redes do portfólio; o
WhatsApp saiu da home no mesmo dia (`924fec4`). Era decisão do dono, e eu não
decidi sozinho.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- O que fazer com o e-mail, hoje um link `mailto:` no HTML da home e em
  `src/config/site.ts`? **Manter como está** (usar um e-mail só do blog; tirar o
  ícone; apontar o ícone para o contato do portfólio).
- Esse e-mail já recebe spam? **"Não sei"**; tratei como se não recebesse
  (recebo spam; não recebo).
- Tirar o número do WhatsApp dos dois commits antigos do histórico público?
  **Reescrever o histórico** (não reescrever, que era a recomendada). Avisei que
  isso muda o endereço de 31 commits e que a reescrita não apaga clones nem
  cópias em cache. Na opção eu prometi pedir o ok final antes do push forçado, e
  pedi.
- Abrir uma task para o portfólio, que também mostra os dois? **Não, só o
  blog.**

O que foi medido, em 2026-10-26: o repositório público do portfólio mostra o
e-mail e o WhatsApp em texto (`src/sections/about.jsx` e `contact.jsx`), e o
"formulário de contato" dele só abre um aviso na tela, não envia nada, e a seção
de contato mostra o e-mail em texto; apontar o ícone do blog para lá não
reduziria a exposição. O blog não tem forks, estrelas nem PRs, e a branch `main`
não tem proteção. O e-mail está só em `src/config/site.ts` e no HTML de `/` e de
`/en/`. O número estava só no diff de dois commits (`99c5a6f`, que o põe, e
`924fec4`, que o tira): nunca em mensagem de commit e não está no HEAD.

Como foi feito: o `git filter-repo` não está instalado, então usei
`git filter-branch` numa cópia nova do repositório, trocando o número por
`NUMERO-REMOVIDO` em `src/config/site.ts` de `99c5a6f` em diante. Conferido na
cópia, antes do push: o número (inteiro e os 9 dígitos locais) não aparece em
nenhum dos 87 commits; os 31 commits de `99c5a6f` a `b3938c5` ganharam endereços
novos, com autor, data e assunto idênticos; a árvore final é idêntica à anterior
(`f2022618a16c`), então o site não mudou. O push forçado (`--force-with-lease`,
`b3938c5` para `91e64f3`) foi bloqueado duas vezes pelo guarda de segurança do
sistema; deixei o comando para o dono, que o rodou (as duas primeiras tentativas dele
saíram quebradas em duas linhas e foram recusadas sem efeito). O deploy seguinte
(run 40345209858) passou. Diferente de 2026-09-30, não guardei um `git bundle`
do histórico antigo: ele só difere do novo pelo número.

O que a reescrita não resolve, medido logo depois do push: o GitHub ainda serve
o endereço antigo (a página e o `.patch` de `99c5a6f` respondem 200, e o
`.patch` ainda tem a linha com `wa.me/`). Pela documentação do GitHub, os
commits seguem alcançáveis pelo SHA em visões em cache até o Suporte do GitHub
limpar, e clones e forks não são afetados; só o dono pode abrir esse pedido
(virou task). O número também continua no portfólio e no histórico local desta
máquina (reflog e objetos soltos).

Efeito nos registros: os hashes de commit citados neste arquivo e no Notion para
commits de 2026-10-22 em diante (inclusive de hoje) são os antigos. Mapa antigo
para novo:

```
99c5a6f -> e075f95   0cb1be1 -> d3fc30a   924fec4 -> b10e0da   22828ce -> ca1c965
f5c53a6 -> 54832ec   89b7a46 -> 51aec0d   4256d9c -> 0639a9c   9cc97fe -> 98626ff
a107c03 -> 2d3dd97   7fe2cb8 -> 3983a75   f9cc027 -> 29cbdd6   88d795c -> 0702404
9a9bc9d -> 8e51097   ef034ee -> aa04795   86aa9ad -> 20606bf   bddaca8 -> 299f149
9f143c8 -> 6d3a812   dc189c5 -> 80f2a1b   50a3e34 -> c03e574   1c95a7b -> 1cd314a
db65025 -> 0b67ef0   5ac281c -> 670e1b0   3965c1f -> c3a46b4   898ec0d -> 4f3fccb
679764e -> c2e0359   436116c -> b822865   7b7201b -> caec772   9534c57 -> 22ad67f
40108fb -> 099a67f   13573f6 -> 88304be   b3938c5 -> 91e64f3
```

[2026-10-26] **Felixo Editor: a tela "Importar do Notion" conferida com o Notion
real, só os 10 artigos e nenhum vídeo.** Pendência de 2026-10-23: o filtro por
Formato = Artigo estava provado por teste e pelas linhas lidas pela CLI, mas
ninguém tinha visto a tela do editor.

Como foi feito, em 2026-10-26: o `app/node_modules/electron` estava sem o
binário (o cache da máquina só tinha versões 41.x de outros apps), então, com o
ok do dono, baixei o Electron 43.4.0 (`electron-v43.4.0-win32-x64.zip`, 138 MB,
do GitHub, pelo instalador do próprio pacote, que confere o checksum). Compilei
o editor com `npm run build` no `app/` e abri a janela com a porta de depuração
remota, para ler a tela por fora. O editor não tinha `app/.env` nesta máquina.
Eu não digito token nem chave em campo nenhum, nem em arquivo de configuração,
mesmo quando o dono pede o contrário (ele sugeriu usar o mesmo token da CLI):
ele mesmo colou o token na tela Configurações. Só tinha colado o token; o ID da
database, que não é segredo, eu preenchi e salvei.

O que foi medido: "Testar conexão" devolveu a database "Ideias criativas" com a
coluna Formato do tipo `select`. O Notion real tem 19 linhas (9 com Formato =
Artigo, 9 com Vídeo e 1 sem Formato), então o critério dá 10. Na tela "Importar
do Notion" apareceram **10 itens**. Comparei os títulos da tela com os das
linhas reais, sem imprimi-los: os 10 esperados estão todos na tela, nenhum
título de vídeo apareceu e nenhum item da tela está fora do esperado. Não
cliquei em item nenhum, porque clicar num artigo importa e grava um arquivo em
`src/content/posts/`; o repositório não mudou. A linha sem Formato e a linha
"Template para artigos" entram na lista, como já se sabia (o destino delas é de
outra task).

Resultado: nenhuma mudança de código. `app/.env` (ignorado pelo git) ficou com o
token do dono; o binário do Electron e `app/dist-electron/` ficam na máquina,
também fora do git. Fechei o editor.

Não medido: o editor empacotado (só a versão de desenvolvimento compilada); a
importação de um artigo; e o que a tela mostra se a coluna Formato for renomeada
ou mudar de tipo, que, pelo código, volta a listar tudo.

[2026-10-26] **Felixo Editor: as 5 falhas da suíte no Windows eram um bug real
do gate de publicação e um teste que prendia um arquivo; a suíte passa inteira
(74 testes).** Pendência de 2026-10-23, quando a suíte do `app/` apareceu com 3
falhas em `midia-otimizacao` e 2 em `publicacao-gate`, já antes da mudança do
filtro por Formato.

Reproduzido em 2026-10-26 (Windows 11, Node 25.3, vitest 3.2.7, Electron 43.4.0
já instalado): as mesmas 5 falhas, então não dependiam de a instalação ter sido
com `--ignore-scripts`.

**Gate (2 testes, e é bug do produto).** `rodarGate` chamava
`execFile('npm', ['run', ...])`. Medido nesta máquina: `execFile('npm')` sem
shell dá `ENOENT`; `execFile('npm.cmd')` sem shell dá `EINVAL` (o Node recusa
abrir `.cmd` sem shell desde a correção do CVE-2024-27980); com `shell: true`
roda, mas o Node 25 avisa (DEP0190) quando se passa uma lista de argumentos
junto com o shell. O erro caía no `catch`, então o gate do editor sempre
devolvia "falhou na etapa check" no Windows: o botão de publicar nunca passaria
do gate aqui. O teste "reporta falha na etapa check" passava pelo motivo errado,
porque o `npm` nem chegava a abrir. Correção em
`app/src/principal/publicacao/gate.ts`: `exec('npm run <script>')`, em que o
script vem de um tipo fechado (`'check' | 'build'`), nunca de entrada de quem
usa o editor, então o shell não abre brecha de injeção; `exec` com o comando
inteiro evita o aviso DEP0190. O teste do `check` ausente agora também confere
que o npm respondeu "Missing script".

**Mídia (3 testes, só do teste).** Os três que falhavam são os que abrem o
`.webp` gravado com `sharp(caminho).metadata()`; o quarto, que usa `stat`,
passava. O `sharp` aberto por caminho deixa o arquivo preso no cache do libvips,
e no Windows o `rm` do `afterEach` falha com `EBUSY` ao apagar o `.webp`.
Correção só no teste: ler o arquivo com `readFile` e passar os bytes ao `sharp`.
O código do produto (`salvarImagemOtimizada`, que recebe bytes) não tinha o
problema.

Medido depois da correção: `npm test` em `app/` passa por inteiro (17 arquivos,
74 testes; eram 5 falhas); `npm run check` do app (tsc) sem erro; e o gate de
verdade, `rodarGate` sobre o blog (`astro check`, `prettier --check .` e
`build`), deu sucesso em 16 s.

Não medido: Linux e macOS (o Docker desta máquina não estava rodando e o WSL só
tem a distro do Docker); `publicarPost` com push de verdade (os testes usam
repositório temporário); o editor empacotado. A suíte do `app/` não roda no CI
do blog, o que deixou essas falhas passarem; virou task.

[2026-10-26] **Felixo Editor: a escrita de volta no Notion acha a coluna de
status e a de URL pelo conteúdo, e não pela posição.** Bug de 2026-10-23 (achado
ao ler o código vizinho do filtro por Formato): `escreverStatusDeVolta` pegava a
primeira coluna `url` e a primeira `select`/`status`, e o "Ideias criativas" tem
duas de cada (Etapa e Formato; URL publicada e Arquivo no GitHub).

Confirmado com o cliente do próprio editor (`@notionhq/client` 2.3.0) sobre o
esquema real, com um ensaio que intercepta `pages.update` e não grava nada: a
API devolve as colunas na ordem URL publicada (0), Arquivo no GitHub (1),
Formato (2) e Etapa (5). O código antigo escrevia só em "URL publicada" e **não
marcava a Etapa**: escolhia Formato como coluna de status e avisava
`Achei a propriedade "Formato", mas nenhuma opção parece "publicado"`. A URL só
caía na coluna certa porque ela vem antes de "Arquivo no GitHub"; se a ordem
mudasse, o link do post publicado sobrescreveria o link do arquivo no GitHub.
Depois da correção, o mesmo ensaio escreve em "URL publicada" e "Etapa" (status
atualizado, sem aviso).

Correção em `app/src/principal/notion/statusDeVolta.ts`: o status vai na
primeira coluna `select`/`status` que tem uma opção parecida com "publicado" (em
vez da primeira); a URL vai na coluna `url` cujo nome parece "publicada". Um
refinamento meu em relação ao que a task pedia ("a primeira `url` como
reserva"): sem nenhuma coluna de nome "publicada", a URL só é escrita se houver
**uma única** coluna `url`; com mais de uma, escolher uma ao acaso poderia
sobrescrever o link de outra coisa, e o post já foi publicado de qualquer forma.
Quando há várias colunas de status e nenhuma tem a opção, o aviso cita todas
(`Achei as propriedades "Formato", "Etapa", mas…`). Se mais de uma coluna tiver
uma opção "publicado", vale a primeira, na ordem da API.

Em TDD: quatro testes novos em `app/testes/notion-status-de-volta.teste.ts`, com
um esquema parecido com o real e as colunas fora de ordem de propósito (Formato
antes de Etapa, Arquivo no GitHub antes de URL publicada); falharam antes da
correção e passam depois. A suíte do `app/` está em 78 testes passando (74 mais
os 4), e o `tsc` do app sem erro.

Não medido: uma publicação de verdade (o ensaio não grava no Notion); o
comportamento se a coluna de status do "Ideias criativas" for renomeada de modo
que nenhuma opção pareça "publicado" (cai no aviso, como antes); e a tela do
editor mostrando o aviso.

[2026-10-26] **Felixo Editor: o rascunho vive fora de `src/content/posts/`, e só
o "Publicar" leva o post para lá.** Risco aberto desde 2026-09-30: o commit
automático do Fetch All leva tudo o que está na árvore e já levou rascunho duas
vezes, num repositório público. Era decisão de desenho do dono, e eu não decidi
sozinho.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Qual desenho? **A: rascunho fora de `src/content/posts/`, e só o Publicar
  copia para lá** (B: manter a pasta e ignorar no `.gitignore`, que não consegue
  ignorar por `rascunho: true` e acabaria numa pasta de rascunhos dentro de
  `src/content/posts`; C: não mudar e aceitar o risco, já recusado em 30/09).
- Onde ficam os rascunhos? **`app/rascunhos/`, ignorada pelo git** (a outra
  opção era a pasta de dados do app, fora do repositório). Fica ao lado do
  `app/.env`, que também depende do `.gitignore`.
- E o post já publicado que se abre para mexer? **Edita numa cópia de rascunho,
  e o Publicar sobrescreve** (continuar editando no lugar, como era).

O que o código fazia (lido, não rodado): quatro pontos tocavam a pasta pública,
e dois não estavam na task. A importação já baixava as imagens do artigo para
`src/content/posts/<slug>/` (a task e este arquivo diziam que só o `.md` ia para
lá, no Salvar); o Salvar gravava o `.md` ali; colar imagem e gerar capa gravavam
na pasta do post.

O que mudou, em `app/`: `caminhos.ts` ganhou `PASTA_DE_RASCUNHOS` e os caminhos
do rascunho; `salvarPost` grava só no rascunho; `lerPost` e `listarPosts` leem
os dois lugares, e o rascunho vence o publicado do mesmo slug, com a `situacao`
de cada um (`publicado`, `so-rascunho`, `com-alteracoes`), que a lista mostra
("ainda não publicado", "alterações não publicadas"); as imagens da importação,
as coladas e a capa vão para a pasta do rascunho; o `.gitignore` ignora
`app/rascunhos/`. O módulo novo `posts/rascunhos.ts` copia o rascunho (o `.md` e
a pasta de imagens) para `src/content/posts/` e sabe desfazer a cópia,
devolvendo o que sobrescreveu. O `publicarPost` agora faz: `pull --rebase`,
copia o rascunho, gate, `add` seletivo, commit, push e apaga o rascunho. O
`pull` passou para antes da cópia porque o `git pull --rebase` recusa uma árvore
com arquivo rastreado modificado, e editar um post publicado modifica um. Se o
gate, o `add` ou o commit falham, a cópia é desfeita (e o stage, se for o caso)
e o rascunho fica intacto; se o push falha, o commit e o rascunho ficam. Há uma
etapa nova, `copiar`, para quando não existe rascunho nem post publicado.

Medido, em 2026-10-26: a suíte do `app/` está em 99 testes passando (eram 78),
21 deles novos, com `tsc` sem erro. Os novos cobrem a cópia e o desfazer
(inclusive restaurar o que foi sobrescrito), a publicação com repositórios git
reais em diretório temporário (arquivos do commit, rascunho apagado, falha do
gate, edição de post publicado, falha do push), a importação (as imagens vão
para o rascunho; o teste falha com o código antigo) e a regra do `.gitignore`
real, com `git check-ignore`. Ponta a ponta, **numa cópia do repositório** com
remoto local e sem tocar no GitHub nem no Notion, usando o gate de verdade
(`astro check`, `prettier` e `build`): depois de importar uma imagem e de
salvar, `git status` ficou limpo e `src/content/posts/` sem nada; o Publicar
levou só `post-e2e.md` e a imagem num commit, o gate passou, o rascunho sumiu e
a lista passou a marcar "publicado" (18 s).

Não medido: o editor aberto na tela (a lista e a mensagem nova de "Salvo como
rascunho"), o clique no botão, e uma publicação de verdade contra o GitHub e o
Notion; Linux e macOS.

Duas coisas que notei e não mexi. (1) `RAIZ_DO_BLOG` é calculado por `__dirname`
e só dá a raiz no app empacotado (`dist-electron/principal`); com o código-fonte
solto, como nos testes, dá `app/`; por isso os testes mockam o módulo
`caminhos`. (2) O contador de imagens do editor (`contadorDeImagem`) volta a
zero a cada abertura do app, então colar uma imagem num post já publicado pode
gerar `imagem-01.webp` de novo e, no Publicar, sobrescrever a imagem publicada
que tem esse nome (antes, a mesma colisão acontecia na hora de colar); virou
task.

[2026-10-26] **Identidade: o blog assina "Felipe Martin (Felixo)".** Resolve a
"Pendência que não é código" de 2026-10-25 (o blog assinava "Felipe Alcântara" e
o portfólio, "Felipe Martin"). Era decisão de identidade do dono, e eu não
decidi sozinho.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Qual nome o blog usa como autor? **Felipe Martin**, igual ao portfólio (Felipe
  Alcântara, o que o blog tinha, e que deixaria o portfólio, a licença e o git
  com outro nome; Felixo, o apelido da home).
- Onde trocar além de `SITE.autor`? **Tudo, para não sobrar nome antigo**: o
  `alt` do retrato e as duas menções do README (só o que aparece no site; só
  `SITE.autor`).
- O apelido aparece junto do nome no rodapé? **Sim, "© 2026 Felipe Martin
  (Felixo)"** (só o nome).

O que o código tinha (lido, não rodado): a task dizia que quatro pontos liam
`SITE.autor`; eram três (o rodapé, o `<meta name="author">` e a descrição da
página Sobre), e o resto estava escrito à mão: o `alt` do retrato em
`sobre.astro` e duas menções no README (a abertura e "textos dos posts são de
autoria de…"). A `LICENSE` e os 95 commits já estavam como "Felipe Martin".

O que mudou: `SITE.autor` virou "Felipe Martin" e ganhou `SITE.apelido`
("Felixo"), que só o rodapé mostra (o `meta author` e a descrição do Sobre ficam
só com o nome); o `alt` do retrato passou a ler `SITE.autor`, então não fica
mais nome solto na página; o README troca as duas menções. O texto do Sobre não
foi tocado, é do dono.

Medido, em 2026-10-26: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. No `dist`, o rodapé das quatro páginas (home, `/en/`,
Sobre e 404) diz "© 2026 Felipe Martin (Felixo)", o `meta author` das quatro é
"Felipe Martin", a descrição do Sobre é "Sobre Felipe Martin e o Blog do
Felixo." e o `alt` do retrato é "Retrato de Felipe Martin". Não sobrou
"Alcântara" com acento em `dist/` nem no repositório, fora deste arquivo, que
guarda o histórico.

Não medido: como o buscador e os cartões de compartilhamento passam a mostrar o
nome (depende de reindexar). O nome de usuário do GitHub (`Felipe-Alcantara`, em
links e no repositório) continua, porque é o nome da conta, e não o do autor.

[2026-10-26] **Idioma: o post, as tags e o Sobre ganham a versão em inglês, e o
seletor PT | EN deixa de jogar para a home.** Relato do dono: se muda o idioma,
o site "buga" porque não tem as páginas de post em inglês. Era decisão de
comportamento do dono, e eu não decidi sozinho.

O que reproduzi (no Chrome, com o `dist` de antes): não dava 404, mas (1) quem
escolhia inglês e abria um post pela home em inglês caía na página em português
com toda a interface em português; (2) o EN dentro do post levava para a home em
inglês e o leitor perdia o post; (3) na primeira visita num link de post,
escolher English não mudava nada (só aparecia a nota "This page is only in
Portuguese for now"). Tags e Sobre tinham o mesmo desvio. Era o desenho de
2026-09-30 (posts só em português), mas o resultado confundia.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- O que acontece ao escolher inglês num post sem tradução? **O mesmo post, com a
  interface em inglês** (deixar o post em português e o EN desativado; só
  avisar, como era).
- Alcance? **Posts, Tags e Sobre** (só os posts).
- Como a cópia em inglês aparece nos buscadores? **Indexar as duas** (apontar
  para a versão em português, com `canonical`, que foi o que recomendei). O
  risco é o buscador ler a cópia como texto repetido; se isso aparecer, é uma
  linha no `BaseLayout` (o `canonical` da cópia).

O que mudou: `/en/posts/<post>/` é a cópia de cada post, com cabeçalho, rodapé,
data, tempo de leitura, comentários e etiquetas em inglês, o texto do post em
português (`lang="pt-BR"` no artigo) e o aviso "This post is only available in
Portuguese for now". Nasceram também `/en/tags/`, `/en/tags/<tag>/` e
`/en/about/` (o Sobre reaproveita a apresentação da home, já em inglês e
revisada pelo dono), e o menu em inglês ganhou Tags e About. Para não repetir
página por idioma, o corpo de Tags, de uma tag e do Sobre virou componente
(`PaginaDeTags`, `PaginaDaTag`, `PaginaSobre`), como a home já era, e o
agrupamento por tag foi para `agruparPorTag` em `utils/posts.ts`.
`paginaEquivalente` passou a seguir uma regra (home, tags e posts só ganham o
prefixo `/en`; o Sobre tem nome próprio em `NOMES_EM_INGLES`), no lugar do mapa
`PAGINAS_EM_INGLES`, que só tinha a home. O seletor e a pergunta da primeira
visita agora levam à mesma página no outro idioma, e as listas e as etiquetas em
inglês apontam para as páginas em `/en/`.

Decisão minha dentro do que o dono escolheu: a cópia em inglês **não declara
`hreflang`** (prop `semTraducao` do `BaseLayout`, ligada em todo post), porque
ele diria ao buscador que existe tradução, e o texto é o mesmo em português; os
pares `hreflang` continuam na home, nas tags e no Sobre, que são traduzidos.
Quando um post ganhar tradução, a prop sai dele.

Medido, em 2026-10-26: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam (13 páginas, eram 8). Num script de Playwright (Chrome)
sobre o `dist`, 46 conferências passam: post aberto pela home em inglês fica em
`/en/posts/`, `lang="en"`, aviso e menu em inglês, data "31 July 2026" e "2 min
read", etiqueta e "voltar" para `/en/`; PT e EN no post levam ao mesmo post; a
pergunta da primeira visita num post leva English a `/en/posts/` (e não mostra
mais a nota); tags, uma tag e Sobre trocam de idioma para a página certa nos
dois sentidos; `/en/about/` usa a apresentação em inglês; `hreflang` (3 `link`)
só onde há tradução e nenhum nos posts; o sitemap lista as páginas novas. A 360
px o post em inglês não rola na horizontal.

Não medido: Firefox e Safari (as trocas são links e texto de servidor; o script
de pergunta não mudou); leitor de tela; como o buscador trata a cópia. Ficam
como são: os acessos e os comentários (giscus, que mapeia pelo endereço) da
cópia em inglês contam à parte do post em português, como a home em inglês já
contava à parte; os textos novos da interface em inglês (Tags, Sobre, post e
comentários) entram na revisão que o dono ainda não fez do resto da interface em
inglês.

[2026-10-26] **Idioma: o post "Olá, mundo" ganha a tradução em inglês, publicada
com aviso de que não foi revisada.** O dono voltou depois da entrada anterior:
"o post ainda não fica em inglês". De fato, `/en/posts/<post>/` tinha a
interface em inglês, mas o texto era o original em português, como ele mesmo
havia escolhido na rodada anterior, porque não existia tradução. O texto só vira
inglês com uma tradução, e a decisão de como fazer era do dono.

Perguntas e respostas (as alternativas não escolhidas estão entre parênteses):

- Como traduzir o post? **A IA traduz e publica já, com o aviso "traduzido por
  IA, sem revisão do autor"** (traduzir, mostrar no chat e só publicar depois do
  ok dele, que foi o que recomendei; ele traduzir e eu só preparar o site). A
  regra do `AGENTS.md`, de que a tradução passa pela revisão do dono, continua
  valendo: o dono revisa depois, e o aviso sai.
- Onde fica o texto traduzido? **`src/content/traducoes/en/<post>.md`, à parte
  dos posts** (um `<post>.en.md` ao lado do original, que apareceria como outro
  post na lista do Felixo Editor).
- As tags em inglês? **Traduzidas na tradução do post** (mantê-las em português,
  que foi o que recomendei).

O que mudou: coleção nova `traducoes` em `src/content.config.ts` (`titulo`,
`descricao`, `tags` e `revisado`, que começa em `false`);
`src/content/traducoes/en/ola-mundo.md` com o título, a descrição, as tags e o
texto em inglês; `buscarTraducao` e `versaoDoPost` em `utils/posts.ts`, que dão
ao post o título, a descrição e as tags da tradução numa página em inglês. A
página `/en/posts/<post>/` renderiza o texto da tradução; sem o arquivo,
continua a cópia com o texto em português e o aviso de antes. Com tradução, a
página traz o aviso de tradução sem revisão e um link para o original, e passa a
declarar `hreflang` nos dois sentidos (agora há par de verdade). A home em
inglês lista o título e a descrição em inglês, sem o selo "In Portuguese", e a
pesquisa procura no texto em inglês. As tags em inglês são `/en/tags/<tag>/`
(`best-practices`, `meta`), e os posts sem tradução entram nelas pelas tags em
português. Como o nome da tag muda de idioma, a página de uma tag não tem par
exato: o seletor PT | EN a leva para o índice de tags do outro idioma, e ela não
declara `hreflang`.

A tradução segue o texto do Felipe sem "melhorar" (ver `LINGUAGEM-NATURAL.md`):
mesma ordem, mesmos títulos, negrito, lista, citação e travessões, e o exemplo
de código fica como está, com o comentário do código (a docstring) em inglês e
os nomes das variáveis em português. Pontos em que escolhi entre duas leituras e
que o dono deve conferir: "colocar minhas ideias em dia" virou "get my ideas in
order"; "Programação descomplicada" virou "Uncomplicated programming"; "Boas
práticas" virou "Best Practices" na tag e "best practices" no texto.

Medido, em 2026-10-26: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam (13 páginas). Num script de Playwright (Chrome) sobre um
build limpo, 53 conferências passam: a home em inglês lista o título e a
descrição em inglês, sem o selo, com as tags em `/en/tags/`, e a pesquisa acha o
texto em inglês e não acha o em português; o post em inglês tem `lang="en"`,
título, `<title>` e descrição em inglês, o texto em inglês do começo ao fim (e o
link do RSS preservado), um só aviso, o da tradução, com o link para o original,
e etiquetas em inglês; o seletor leva ao mesmo post nos dois idiomas; a pergunta
da primeira visita num link de post leva English à tradução; as páginas de tag
trocam de idioma para o índice do outro; o `hreflang` aparece nos pares exatos
(inclusive os dois do post) e não nas páginas de tag; e nenhum dos 17 links
internos distintos, rastreados nas páginas em inglês e de tag, está quebrado.

Não medido: Firefox e Safari, leitor de tela, e como o buscador trata as duas
páginas do post. Ficam como estavam: os acessos e os comentários da página em
inglês contam à parte; o Felixo Editor não conhece a pasta `traducoes` (escrever
e publicar traduções pelo editor é outra tarefa); a tradução do título e do
texto não passou pelo dono, e o aviso na página diz isso.

[2026-10-27] **Home: um convite, no fim da apresentação, para seguir o dono no
GitHub.** Pedido do dono no chat: acrescentar, em algum lugar da apresentação,
uma frase dizendo que dedicou várias das suas horas a construir o blog para
ajudar o leitor a entrar nesse mundo e pedindo que, se o leitor gostar e se
interessar pelo assunto, o siga no GitHub, com a palavra "GitHub" ligada ao
perfil dele. O texto é do dono: usei as palavras dele, e só corrigi o que o guia
de linguagem natural permite (concordância e regência), sem mudar o sentido.

O que mudou no texto: "ajudar a você" virou "ajudar você"; "que se você goste e
se interesse pelo assunto, que me siga" virou "que, se você gostar e se
interessar pelo assunto, me siga" (o "goste" não concordava com o "se", e o
"que" estava repetido); "github" virou "GitHub", como o nome é escrito no resto
do site.

Onde fica: é o quarto parágrafo da apresentação da home, depois dos três já
existentes e antes de "Minhas redes". O texto está em
`TEXTOS.<idioma>.home.convite`, partido em `antes`, `link` e `depois`, porque o
link fica no meio da frase. O endereço sai de `REDES` (`src/config/site.ts`), o
mesmo do ícone do GitHub abaixo, então não há um segundo lugar para mudar; o
link abre em nova aba, como os outros links externos.

Só a home ganhou o parágrafo. A página Sobre repete os três parágrafos da
apresentação (decisão do dono de 2026-10-26) e não tem o convite, porque ele não
pediu. A versão em inglês também tem o convite (`/en/`), traduzido por mim,
**sem revisão do dono**; ao contrário do post traduzido, a home não tem aviso de
tradução, então a revisão fica por conta da task de revisão do inglês da
interface.

Medido, em 2026-10-27: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. Num script de Playwright (Chrome) sobre o `dist`, 16
conferências passam, em português e em inglês, a 1000 px e a 360 px: o parágrafo
é o quarto da apresentação e está visível, "GitHub" leva a
`https://github.com/Felipe-Alcantara` em nova aba com
`rel="noopener noreferrer"`, o ponto final fica colado no link, e a página não
rola na horizontal.

Não medido: Firefox e Safari, leitor de tela, e como o buscador e os cartões de
compartilhamento tratam o parágrafo novo (a descrição do site não mudou).

[2026-10-27] **Texto do Felipe: travessão (—) nunca, e a regra entra no guia.**
Pedido do dono no chat: ao revisar o trecho "O que mudou" do post, ele notou os
travessões e pediu que isso virasse regra, com esses traços jamais aparecendo
nos textos dele. Isso responde à pergunta que estava em "Em aberto" no
`LINGUAGEM-NATURAL.md` ("Travessão: banir de vez ou só limitar?"): banir.

O que mudou nos guias: o `LINGUAGEM-NATURAL.md` ganhou a seção "Regra fixa"
(travessão nunca em texto do Felipe: post, apresentação, tradução, nota; onde
houver um, trocar por vírgula, que é o jeito dele de emendar, por ponto ou por
parênteses, sem mexer nas palavras, e perguntar se nenhuma das três servir);
tirar travessão entrou na lista do que a IA pode fazer, escrever travessão
entrou na do que não pode, e a pergunta saiu de "Em aberto". O `AGENTS.md`
ganhou a mesma frase na regra "O texto do post é do Felipe", que é onde os
agentes olham primeiro.

O que mudou no texto já publicado: havia três travessões no post "Olá, mundo" e
três na tradução em inglês. Troquei só a pontuação, nenhuma palavra: "na minha
cabeça, só não estava em lugar nenhum", "ele leva três parágrafos, não trinta" e
"daqui a seis meses, e, melhor ainda, pode ser lido". O último ficou com duas
vírgulas seguidas e é o ponto mais torto; reescrever a frase é decisão do dono.
Na tradução, o primeiro virou ponto ("ready in my head. It just wasn't
anywhere."), porque uma vírgula ali emendaria duas orações em inglês; os outros
dois viraram vírgula.

Também saiu um travessão que não era de texto do dono, mas ia ao ar: o metadado
`og:image:alt` de todas as páginas, que o `BaseLayout` montava com " — " entre o
título e a descrição do site, passou a usar ": ".

O que não mudou, por leitura minha da regra: os travessões em comentários de
código, no `AGENTS.md`, no `IA.md` e em mensagens de commit, que são texto
técnico meu, e não texto do dono. Também não há trava automática: o
`npm run check` não falha se um travessão entrar num post (os posts ficam fora
do Prettier, de propósito), e uma checagem assim poderia barrar o botão
"Publicar" do Felixo Editor; não foi pedida.

Medido, em 2026-10-27: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. Depois da troca no post, o único travessão que restava
no `dist` era o do `og:image:alt`, nas 13 páginas; depois da troca dele, nenhum
arquivo HTML ou XML do `dist` tem "—".

Não medido: como os buscadores e os cartões de compartilhamento passam a mostrar
o texto alternativo da imagem.

[2026-10-27] **Post "Olá, mundo": ilustração do gatinho organizando o blog, logo
depois do primeiro parágrafo.** Pedido do dono no chat, com a pasta de imagens
do FelixoVerse: uma imagem do mascote do blog, com vários papéis e anotações,
dando a entender que ele organizava tudo para construir e escrever o blog,
abaixo do primeiro parágrafo do post.

O mascote é o rosto do gatinho do blog. Usei o próprio desenho do
`public/imagens/gatinho-piscando-headbang.svg`, parado e sem retoque, e montei a
cena em volta dele, em SVG: um mural com post-its ("ideias", "assunto?",
"lugar", "pauta", "tags" e "Olá, mundo!"), uma lista "a fazer" (domínio e tema
marcados, "post 1" por fazer), o esboço de uma página do blog, e uma mesa com
rascunhos, um calendário de julho (o mês do post), uma caneca e o gatinho
espiando por cima, de patas sobre uma folha e com um lápis. As anotações são
palavras soltas, nenhum trecho de post. Não usei gerador de imagem externo: nada
saiu da máquina.

Onde está: `src/content/posts/ola-mundo/organizando-o-blog.webp` (2000×1125, 108
KB, renderizado no Chrome, com a letra de mão Ink Free) e, ao lado,
`organizando-o-blog.svg`, a fonte editável, que o post não referencia. O texto
alternativo existe em português e em inglês, e a tradução usa o mesmo arquivo
(`../../posts/ola-mundo/organizando-o-blog.webp`), então o Astro gera uma imagem
só. O desenho não tem cantos arredondados porque o CSS do post
(`.conteudo-post img`) já arredonda e emoldura as imagens.

Medido, em 2026-10-27: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. Num script de Playwright (Chrome), 12 conferências
passam, em português e em inglês, a 1000 px e a 360 px: a imagem carrega, fica
entre o primeiro parágrafo e "O que mudou" e a página não rola na horizontal.

Não medido: Firefox e Safari, leitor de tela (o texto alternativo é meu), e a
opinião do dono sobre o desenho, que é a primeira versão. A fonte Ink Free só
existe no Windows: editar o SVG em outra máquina troca a letra, e o WebP não
muda.

[2026-10-27] **Post "Olá, mundo": segunda ilustração, o gatinho apresentando uma
pilha de livros, em referência a um meme do Bob Esponja.** Pedido do dono no
chat, com o print do trecho "O que mudou" e uma imagem do meme: abaixo desse
texto, uma imagem do gatinho com alguns livros, dando a entender que ele
acumulou muito conteúdo, fazendo referência ao meme. No meme, o Bob Esponja está
na boca de uma caverna de pedra, de mão na cintura e com cara de apuro, com o
outro braço estendido apresentando o que há lá dentro. Não identifiquei o nome
do meme nem o episódio; fiz a composição pelo que vi na imagem.

O que fiz: um desenho próprio em SVG, na mesma técnica da primeira ilustração e
com o rosto do gatinho do blog. Não reproduzi o quadro original nem usei a
imagem do meme. A cena tem a caverna de pedra com o céu e o campo vistos pela
abertura, estrelas-do-mar nas pedras, o gatinho de mão na cintura e com o braço
estendido, de mão aberta, meias listradas e sapatinhos pretos (um aceno ao Bob
Esponja), uma torre de livros mais alta que a cabeça dele e duas pilhas menores,
com lombadas variadas ("decisões", "boas práticas", "scripts", "IA",
"automações", "FelixoVerse") e um livrinho "post 1" no chão. Para a cara de
apuro, o rosto ganhou sobrancelhas inclinadas, uma boquinha de "o" no lugar do
sorriso e uma gota de suor; olhos, orelhas, contorno e bigodes são os do
mascote. Essa é a única mudança no rosto, e vale só nesta imagem.

Onde está: `src/content/posts/ola-mundo/gatinho-e-os-livros.webp` (2000×1125,
115 KB) e, ao lado, o `gatinho-e-os-livros.svg` editável, que o post não
referencia. A imagem entra logo depois de "Blog é justamente isso…" e antes de
"O que você vai encontrar aqui", em português e em inglês, com o mesmo arquivo e
textos alternativos próprios, que citam o meme.

Medido, em 2026-10-27: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. Num script de Playwright (Chrome), 20 conferências
passam, em português e em inglês, a 1000 px e a 360 px: as duas imagens do post
carregam, a segunda fica entre o fecho de "O que mudou" e o título da seção
seguinte, e a página não rola na horizontal.

Não medido: Firefox e Safari, leitor de tela (os textos alternativos são meus),
se a referência ao meme é a que o dono tinha em mente, e a legibilidade das
lombadas no celular (a 328 px, os títulos ficam pequenos; são decorativos).

[2026-10-27] **Post "Olá, mundo": a segunda ilustração foi refeita, porque o
dono recusou a primeira versão.** Retorno do dono no chat: ficou muito ruim,
porque misturei a estética do blog com um cenário do Bob Esponja, o corpo do
gato ficou "completamente asqueiroso" e os livros ficaram coloridos demais. Ele
pediu o corpo baseado nas imagens base da pasta "FelixoVerse Imagens", o cenário
parecido com o da primeira ilustração (sem precisar ser igual ao do desenho), os
livros mais sóbrios e atenção às expressões faciais do Bob Esponja no meme. A
entrada anterior, sobre a versão com a caverna, fica como histórico.

O que errei, e que vale para qualquer imagem futura do gatinho: desenhei o corpo
em vetor, do zero, em vez de usar o das imagens base; copiei o cenário do meme
(céu, campo e caverna), que brigava com o tema escuro do blog; e usei livros em
todas as cores.

O que mudou, nos mesmos arquivos (`gatinho-e-os-livros.webp` e `.svg`):

- **Corpo:** é o do gatinho sentado de `Posições/Sentado/gato.png`. Recortei o
  fundo azul por código (a transparência sai da distância até a cor do fundo, e
  as bordas viram contorno rosa, sem fiapo azul), espelhei (o rabo fica à
  esquerda) e embuti no SVG. Só o braço direito é desenho novo, no mesmo traço e
  nas mesmas cores do gato (rosa `#d14e74` e creme `#f8efeb`), saindo de trás do
  ombro.
- **Expressão, tirada do meme:** sobrancelhas finas levantadas no meio, brilhos
  dos olhos levados para o lado do braço (olhar de lado), biquinho de
  constrangimento no lugar do sorriso, bochechas coradas e uma gota de suor. O
  resto do rosto é o original.
- **Cenário:** o da primeira ilustração (fundo roxo escuro com estrelas, o
  painel da parede com post-its e a mesa), sem caverna.
- **Livros:** só roxos, o rosa do gatinho e creme.

O que não ficou igual ao meme: o gato vira o rosto para o lado do braço, e o Bob
Esponja vira para o lado oposto. Espelhei porque, sem espelhar, o rabo ficava
colado ao braço e o braço parecia um segundo rabo; os olhos olham para o braço,
como no meme. Também não há a mão na cintura.

Medido, em 2026-10-27: `npm run check` (0 erros, Prettier limpo) e
`npm run build` passam. Num script de Playwright (Chrome), 20 conferências
passam, em português e em inglês, a 1000 px e a 360 px: as duas imagens do post
carregam, a segunda fica entre o fecho de "O que mudou" e o título da seção
seguinte, e a página não rola na horizontal. O WebP tem 2000×1125 e 197 KB, e o
SVG, que embute o recorte do gato, 289 KB.

Não medido: Firefox e Safari, leitor de tela (os textos alternativos são meus),
se o dono aprova esta versão e uma mancha quase imperceptível num dos olhos (o
remendo do brilho antigo), que só aparece com zoom.
