# Blog do Felixo

Blog pessoal de [Felipe Alcântara](https://felixo.com.br/) — programação
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

| Comando           | O que faz                                               |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento com hot reload              |
| `npm run check`   | Verificação de tipos e do schema dos posts (roda no CI) |
| `npm run build`   | Build estático em `dist/`                               |
| `npm run preview` | Serve o `dist/` já buildado                             |
| `npm run format`  | Formata tudo com Prettier                               |

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

| Campo          | Obrigatório | Descrição                                                   |
| -------------- | ----------- | ----------------------------------------------------------- |
| `titulo`       | sim         | Título do post                                              |
| `descricao`    | sim         | Resumo usado em listagem, RSS e meta tags                   |
| `publicadoEm`  | sim         | Data de publicação (`YYYY-MM-DD`)                           |
| `atualizadoEm` | não         | Data da última revisão                                      |
| `tags`         | não         | Lista de tags; cada uma ganha sua página em `/tags/<slug>/` |
| `rascunho`     | não         | `true` mostra o post só em `npm run dev`, nunca em produção |
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

Assim a imagem entra na coleção de conteúdo e o Astro otimiza. Já existe um
exemplo no repositório: `src/content/posts/testando-os-recursos-do-blog.md` +
`src/content/posts/testando-os-recursos-do-blog/capa.png`.

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
Alcântara.
