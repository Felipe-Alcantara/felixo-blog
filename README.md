# Blog do Felixo

Blog pessoal de [Felipe Martin](https://felixo.com.br/) — programação
descomplicada, boas práticas, automações e bastidores do FelixoVerse.

Site estático em **Astro + Tailwind CSS 4**, com posts em Markdown, publicado
automaticamente no GitHub Pages a cada push na `main`.

- **No ar**: https://blog.felixo.com.br
- **Identidade visual**: Felixo System Design (tema escuro, roxo `#C084FC`,
  Space Grotesk) — a mesma do portfólio.

## Rodando localmente

Forma mais simples — abre o menu interativo onde você instala, configura,
inicia e verifica o blog, sem precisar decorar comando nenhum:

```bash
python3 start_app.py
```

No menu você escolhe: **Iniciar/Rodar** (blog ou, se `app/` existir, o
[Felixo Editor](#felixo-editor)), **Instalar/Setup**, **Configurar**
(`SITE_URL`/`BASE_PATH` para testar um preview em subpasta), **Verificar**
(`check` + `format`) e **Status/Sair**.

Ou, direto pelo npm:

```bash
npm install
npm run dev      # http://localhost:4321
```

| Comando           | O que faz                                                  |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento com hot reload                 |
| `npm run check`   | Tipos, schema dos posts e formatação Prettier (roda no CI) |
| `npm run build`   | Build estático em `dist/`                                  |
| `npm run preview` | Serve o `dist/` já buildado                                |
| `npm run format`  | Formata tudo com Prettier (menos `app/` e os posts)        |

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

| Campo          | Obrigatório | Descrição                                                                                                                                |
| -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `titulo`       | sim         | Título do post                                                                                                                           |
| `descricao`    | sim         | Resumo usado em listagem, RSS e meta tags                                                                                                |
| `publicadoEm`  | sim         | Data de publicação (`YYYY-MM-DD`)                                                                                                        |
| `atualizadoEm` | não         | Data da última revisão                                                                                                                   |
| `tags`         | não         | Lista de tags; cada uma ganha sua página em `/tags/<slug>/`                                                                              |
| `rascunho`     | não         | `true` mostra o post só em `npm run dev`, nunca em produção                                                                              |
| `capa`         | não         | Imagem de capa (caminho relativo, ex.: `./meu-post/capa.jpg`); vira o `og:image` do post. Sem capa, o post usa o cartão genérico do site |

Blocos de código com marcação de linguagem (` ```python `) recebem realce de
sintaxe automaticamente.

### Imagens em um post

Editar o `.md` não publica nada sozinho: o site é gerado por build, então a
mudança só aparece no ar depois de `npm run check`, `npm run build` e o
deploy (veja a seção [Deploy](#deploy)). Em `npm run dev` o efeito é imediato.

Para imagens específicas de um post, crie uma pasta com o mesmo nome do
arquivo `.md` e coloque a imagem dentro:

```
src/content/posts/
├── meu-post.md
└── meu-post/
    └── capa.png
```

E referencie com caminho relativo no Markdown, sempre com texto alternativo
real (acessibilidade):

```markdown
![Descrição alternativa da imagem](./meu-post/capa.png)
```

Assim a imagem entra na coleção de conteúdo e o Astro otimiza.

Imagens institucionais/compartilhadas (logo, foto de perfil etc.), que não
pertencem a um post específico, vão em `public/imagens/` e são referenciadas
por caminho absoluto (ex.: `/imagens/logo-felixo.png`), sem otimização
automática — é o caso de `logo-felixo.png` e `foto-felipe.jpg`.

## Felixo Editor

Escrever direto em Markdown tem custo — para quem prefere não editar `.md` na
mão, existe o **Felixo Editor** (`app/`): um app desktop (Electron) que lista,
cria e edita os posts deste repositório, importa artigos de uma database
"Artigos" do Notion (convertendo os blocos para Markdown e baixando as
imagens), gera a capa do post e publica com um botão — rodando o mesmo gate
de qualidade deste README (`check` + `build`) antes de qualquer commit, e
commitando **só** os arquivos daquele post.

```bash
python3 start_app.py   # → Iniciar/Rodar → Felixo Editor
```

Detalhes de configuração (token do Notion, estrutura interna) em
[`app/README.md`](app/README.md). Decisões e histórico completo em
[`IA.md`](IA.md) (registros datados `2026-08-13`).

## Comentários

Cada post tem uma seção de comentários via [giscus](https://giscus.app),
usando as **Discussions do próprio repositório GitHub** como armazenamento —
sem back-end, sem banco de dados. Comentar exige login com GitHub. Config em
`GISCUS` (`src/config/site.ts`), componente em `src/components/Comentarios.astro`,
tema customizado em `public/temas/giscus.css`.

## Contagem de acessos

As visitas são contadas pelo [GoatCounter](https://www.goatcounter.com), sem
cookie e sem back-end próprio. Os números ficam no painel da conta. Cada post
mostra quantos acessos teve ao lado do tempo de leitura, e o rodapé de todas as
páginas mostra os acessos da página em que a pessoa está e o total do blog
(`AcessosNoRodape.astro`). Para ligar:

1. Crie a conta em [goatcounter.com/signup](https://www.goatcounter.com/signup).
   O _Account name_ vira o endereço `<codigo>.goatcounter.com`.
2. No painel, em **Settings**, marque **Allow adding visitor counts on your
   website** e salve. Sem isso, a contagem funciona, mas o número não aparece
   no post.
3. Preencha `codigo` em `GOATCOUNTER` (`src/config/site.ts`) e publique.

Com `codigo` vazio, nada do GoatCounter entra no site. A contagem só roda no
build de produção, então os testes no `npm run dev` não contam. Os números do
post e do rodapé ficam em cache por até 4 horas no GoatCounter.

Leitor com bloqueador de anúncio não é contado (o GoatCounter estima cerca de um
terço das visitas), então os números são um mínimo. Se o navegador também barra
a leitura do número, o cabeçalho do post e o rodapé avisam que um bloqueador de
anúncio pode estar impedindo, em vez de sumir ou mostrar um traço mudo. Domínio
próprio no GoatCounter é só nome bonito e não escapa dos bloqueadores; contar
essas visitas exigiria um proxy próprio, fora do GitHub Pages.

## Assinatura dos posts novos

Quem lê pode assinar os posts novos pelo [follow.it](https://follow.it), sem
back-end próprio. O botão "Receber por e-mail"
(`src/components/BotaoAssinatura.astro`) fica na home, no fim de cada post, no
Sobre e no rodapé, e abre uma janela (`src/components/Assinatura.astro`) com um
`<form>` HTML puro que envia o e-mail direto ao follow.it, que lê o `rss.xml` e
avisa os assinantes. A janela usa o `popover` nativo, então abre e fecha sem
JavaScript; um script curto só faz a animação dos modais do felixo.com.br (o
botão cresce até virar a janela). Configuração em `FOLLOWIT`
(`src/config/site.ts`): `formulario` vazio desliga tudo; `verificacao` é a
meta tag que prova ao follow.it que o site é do dono do feed; `seguir` é a
página do feed para quem prefere app ou RSS ("Prefere app ou RSS?" na janela),
e vazio tira só esse link. Textos em `TEXTOS.<idioma>.assinatura`.

Limites do plano grátis: o follow.it lê o feed a cada 6 horas; o padrão do
e-mail é um resumo diário (cada assinante pode trocar para um e-mail por post);
os e-mails têm anúncios e a marca do follow.it; e, depois de assinar, o leitor
fica no follow.it (por isso o formulário abre numa aba nova). Notificação no
navegador não é oferecida. Assinantes e estatísticas ficam no painel do feed
`blog-do-felixo`, na conta do dono no follow.it.

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

Tudo já está configurado: Source = GitHub Actions, domínio próprio
`blog.felixo.com.br` (registro `CNAME` de `blog` → `felipe-alcantara.github.io`
no DNS do Registro.br) e `public/CNAME` versionado, que preserva o domínio a
cada publicação.

### Trocando de endereço

`astro.config.mjs` concentra o endereço em duas constantes no topo (`SITE` e
`BASE`), ambas sobrescrevíveis pelas variáveis de ambiente `SITE_URL` e
`BASE_PATH`. Para servir numa subpasta — um preview em
`felipe-alcantara.github.io/felixo-blog/`, por exemplo — basta
`BASE_PATH=/felixo-blog`.

Nenhuma página precisa mudar: todo link interno passa pelo helper `caminho()`
(`src/utils/rotas.ts`). Ao trocar de domínio, atualize junto o `public/CNAME` e a
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

public/
├── imagens/         # Logo e foto de perfil alinhados ao portfólio
└── temas/           # Tema visual do giscus

app/                 # Felixo Editor — app desktop, package.json próprio
                      # (ver "Felixo Editor" acima e app/README.md)
```

## Licença

[MIT](LICENSE) para o código. Os textos dos posts são de autoria de Felipe
Martin.
