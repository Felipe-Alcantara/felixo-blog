/** Configuração única do blog — evita strings duplicadas pelas páginas. */
export const SITE = {
  titulo: 'Blog do Felixo',
  autor: 'Felipe Alcântara',
  descricao:
    'Programação descomplicada, boas práticas, automações e notícias de tecnologia — o blog do FelixoVerse.',
  idioma: 'pt-BR',
  url: 'https://blog.felixo.com.br',
  /** Perfil usado no `twitter:site` do cartão — o mesmo do portfólio. */
  twitter: '@Felixo_Tech',
} as const;

/**
 * Configuração do giscus (comentários via GitHub Discussions).
 * IDs obtidos com `gh api graphql` sobre o repositório felixo-blog — não são
 * segredo: aparecem no HTML renderizado de qualquer site que usa giscus.
 */
export const GISCUS = {
  repo: 'Felipe-Alcantara/felixo-blog',
  repoId: 'R_kgDOTpm1Ow',
  categoria: 'Announcements',
  categoriaId: 'DIC_kwDOTpm1O84DCwaM',
  mapeamento: 'pathname',
  idioma: 'pt',
  /** Tema customizado (public/temas/giscus.css) pra bater com o Felixo System Design. */
  temaUrl: `${SITE.url}/temas/giscus.css`,
} as const;

/**
 * Contagem de acessos via GoatCounter (sem cookie, sem back-end próprio).
 * `codigo` é o nome da conta, o que vem antes de `.goatcounter.com`. Não é
 * segredo: aparece no HTML de qualquer site que usa GoatCounter. Vazio
 * desliga tudo: nem o script de contagem nem o número no post entram na página.
 */
export const GOATCOUNTER = {
  codigo: 'felixo',
};

/** Endereço da conta no GoatCounter, ex.: `https://felixo.goatcounter.com`. */
export const contaGoatCounter = () => `https://${GOATCOUNTER.codigo}.goatcounter.com`;

/**
 * Assinatura dos posts novos via follow.it (e-mail e app, lendo o `rss.xml`),
 * feed `blog-do-felixo`. `verificacao` é o código que prova ao follow.it que o
 * site é do dono do feed: vai numa meta tag da página inicial e é público por
 * natureza, como o do Google Search Console. Vazio tira a meta tag.
 */
export const FOLLOWIT = {
  verificacao: 'nDnjKRVEAyctn8CkYXUb',
};
