/**
 * Idiomas do blog: português na raiz (`/`) e inglês em `/en/`.
 *
 * Todo texto da interface que muda de idioma mora aqui, para que traduzir
 * seja editar um arquivo só. O conteúdo dos posts continua só em português:
 * a versão em inglês de um post entra depois que ele estiver completo em
 * português (decisão do dono, 2026-09-30). Até lá, a home em inglês lista os
 * posts com o aviso de que estão em português.
 */
import { SITE } from './site';

export type Idioma = 'pt' | 'en';

/** Chave do `localStorage` onde fica o idioma que a pessoa escolheu. */
export const CHAVE_IDIOMA = 'felixo-blog:idioma';

/**
 * Páginas que existem nos dois idiomas, pelo caminho em português. Uma página
 * fora desta lista existe só em português: o seletor PT | EN leva para a home
 * em inglês, e a pergunta da primeira visita não troca de página.
 */
const PAGINAS_EM_INGLES: Record<string, string> = {
  '/': '/en/',
};

type Link = { rotulo: string; href: string };

export const TEXTOS = {
  pt: {
    lang: 'pt-BR',
    localeOG: 'pt_BR',
    localeDatas: 'pt-BR',
    tituloSite: SITE.titulo,
    descricao: SITE.descricao,
    pularParaConteudo: 'Pular para o conteúdo',
    navegacaoPrincipal: 'Navegação principal',
    seletorIdioma: 'Idioma',
    navegacao: [
      { rotulo: 'Posts', href: '/' },
      { rotulo: 'Tags', href: '/tags' },
      { rotulo: 'Sobre', href: '/sobre' },
    ] as Link[],
    linksExternos: [
      { rotulo: 'Portfólio', href: 'https://felixo.com.br/' },
      { rotulo: 'GitHub', href: 'https://github.com/Felipe-Alcantara' },
      { rotulo: 'RSS', href: '/rss.xml' },
    ] as Link[],
    feitoCom: 'Feito com Astro.',
    home: {
      titulo: 'Oi, eu sou o Felixo!',
      // Texto do dono, ditado por ele (ver `LINGUAGEM-NATURAL.md`).
      apresentacao: [
        'Sou desenvolvedor, engenheiro de IA, engenheiro de áudio e produtor musical, líder de uma startup brasileira e entusiasta de ativos criativos, como blogs, vídeos e produção de conteúdo.',
        'Aqui eu escrevo sobre a minha história e o que ando construindo e aprendendo no caminho. Não são apenas notícias, muito menos tutoriais, é a minha visão de mercado e como foi meu aprendizado até chegar aonde cheguei.',
      ],
      verPortfolio: 'Ver portfólio',
      assinarRss: 'Assinar RSS',
      posts: 'Posts',
      pesquisar: 'Pesquisar',
      pesquisarPosts: 'Pesquisar posts',
      nenhumPost: 'Nenhum post publicado ainda. Em breve.',
      nenhumResultado: 'Nenhum post encontrado.',
    },
    /** Selo para post que não está no idioma da página. */
    postEmOutroIdioma: '',
  },
  en: {
    lang: 'en',
    localeOG: 'en_US',
    // en-GB para a data sair "31 Jul 2026", no mesmo formato da coluna em português.
    localeDatas: 'en-GB',
    tituloSite: "Felixo's Blog",
    descricao:
      "Here I write about my story and what I've been building and learning along the way.",
    pularParaConteudo: 'Skip to content',
    navegacaoPrincipal: 'Main navigation',
    seletorIdioma: 'Language',
    // Tags e Sobre ainda não existem em inglês; entram junto com os posts.
    navegacao: [{ rotulo: 'Posts', href: '/en/' }] as Link[],
    linksExternos: [
      { rotulo: 'Portfolio', href: 'https://felixo.com.br/' },
      { rotulo: 'GitHub', href: 'https://github.com/Felipe-Alcantara' },
      { rotulo: 'RSS', href: '/rss.xml' },
    ] as Link[],
    feitoCom: 'Made with Astro.',
    home: {
      titulo: "Hi, I'm Felixo!",
      // Tradução do texto do dono, para ele revisar.
      apresentacao: [
        "I'm a developer, AI engineer, audio engineer and music producer, leader of a Brazilian startup and an enthusiast of creative assets like blogs, videos and content production.",
        "Here I write about my story and what I've been building and learning along the way. It's not just news, much less tutorials: it's my take on the market and how my learning got me to where I am today.",
      ],
      verPortfolio: 'See portfolio',
      assinarRss: 'RSS feed',
      posts: 'Posts',
      pesquisar: 'Search',
      pesquisarPosts: 'Search posts',
      nenhumPost: 'No posts yet. Coming soon.',
      nenhumResultado: 'No posts found.',
    },
    postEmOutroIdioma: 'In Portuguese',
  },
} as const satisfies Record<Idioma, unknown>;

/** Garante a barra final, para comparar `/sobre` e `/sobre/` como iguais. */
function normalizar(caminhoSemBase: string): string {
  return caminhoSemBase.endsWith('/') ? caminhoSemBase : `${caminhoSemBase}/`;
}

/** Idioma de uma página pelo caminho (sem o prefixo `base`). */
export function idiomaDoCaminho(caminhoSemBase: string): Idioma {
  return normalizar(caminhoSemBase).startsWith('/en/') ? 'en' : 'pt';
}

/**
 * A mesma página no outro idioma, quando ela existe; `undefined` quando a
 * página só existe no idioma atual.
 */
export function paginaEquivalente(
  caminhoSemBase: string,
  alvo: Idioma,
): string | undefined {
  const atual = normalizar(caminhoSemBase);
  if (idiomaDoCaminho(atual) === alvo) return atual;
  if (alvo === 'en') return PAGINAS_EM_INGLES[atual];
  return Object.entries(PAGINAS_EM_INGLES).find(([, en]) => en === atual)?.[0];
}

/** Para o seletor PT | EN: a página equivalente ou, se não houver, a home do idioma. */
export function destinoNoIdioma(caminhoSemBase: string, alvo: Idioma): string {
  return paginaEquivalente(caminhoSemBase, alvo) ?? (alvo === 'en' ? '/en/' : '/');
}
