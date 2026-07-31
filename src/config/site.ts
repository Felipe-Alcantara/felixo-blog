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
