/** Configuração única do blog — evita strings duplicadas pelas páginas. */
export const SITE = {
  titulo: 'Blog do Felixo',
  autor: 'Felipe Alcântara',
  descricao:
    'Programação descomplicada, boas práticas, automações e notícias de tecnologia — o blog do FelixoVerse.',
  idioma: 'pt-BR',
  url: 'https://blog.felixo.com.br',
} as const;

export const LINKS_NAVEGACAO = [
  { rotulo: 'Posts', href: '/' },
  { rotulo: 'Tags', href: '/tags' },
  { rotulo: 'Sobre', href: '/sobre' },
] as const;

export const LINKS_EXTERNOS = [
  { rotulo: 'Portfólio', href: 'https://felixo.com.br/' },
  { rotulo: 'GitHub', href: 'https://github.com/Felipe-Alcantara' },
  { rotulo: 'RSS', href: '/rss.xml' },
] as const;

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
} as const;
