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
