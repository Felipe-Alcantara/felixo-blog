/**
 * Idiomas do blog: português na raiz (`/`) e inglês em `/en/`.
 *
 * Todo texto da interface que muda de idioma mora aqui, para que traduzir
 * seja editar um arquivo só. O conteúdo dos posts continua só em português:
 * a tradução de um post entra depois que ele estiver completo em português
 * (decisão do dono, 2026-09-30). Até lá, `/en/posts/<post>/` é a cópia com a
 * interface em inglês, o texto em português e um aviso (decisão do dono,
 * 2026-10-26), e as listas em inglês marcam cada post como "In Portuguese".
 */
import { SITE } from './site';

export type Idioma = 'pt' | 'en';

/** Chave do `localStorage` onde fica o idioma que a pessoa escolheu. */
export const CHAVE_IDIOMA = 'felixo-blog:idioma';

/**
 * Como uma página em português vira a página em inglês: a home, o índice de
 * tags e os posts ganham só o prefixo `/en`; as de nome diferente ficam neste
 * mapa (caminho em português → em inglês). A página de uma tag não tem par,
 * porque o nome da tag muda de idioma: o outro idioma abre o índice de tags.
 * Uma página fora dessas regras existe só em português (a 404): o seletor
 * PT | EN leva para a home do outro idioma, e a pergunta da primeira visita não
 * troca de página.
 */
const NOMES_EM_INGLES: Record<string, string> = {
  '/sobre/': '/en/about/',
};
const IGUAL_COM_PREFIXO = /^\/(tags\/|posts\/.+)?$/;
const PAGINA_DE_TAG = /^\/tags\/.+/;

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
      // O nome é o botão que abre a apresentação (2026-10-29).
      titulo: { antes: 'Oi, eu sou o ', nome: 'Felixo', depois: '!' },
      // Texto do dono, ditado por ele (ver `LINGUAGEM-NATURAL.md`).
      apresentacao: [
        'Sou desenvolvedor, engenheiro de IA e engenheiro de áudio.',
        'Sou criador de algumas startups brasileiras, entusiasta de ativos criativos, como blogs, vídeos e produção de conteúdo, e passo a maior parte do meu tempo estudando Inteligência Artificial.',
        'Aqui, eu escrevo sobre a minha história, o que eu aprendi ao longo da jornada, e o que ando construindo nesse tempo. Aqui, você não encontrará apenas notícias, muito menos tutoriais, é a minha visão sobre a área, e como foi meu aprendizado até chegar aonde cheguei. E gostaria de passar pra frente e registrar minha visão e tudo que eu vi no caminho e resolvi deixar tudo isso público!',
      ],
      // Convite do dono (2026-10-27), depois da apresentação; o link vai entre
      // `antes` e `depois` e aponta para o GitHub de `REDES`.
      convite: {
        antes:
          'Dediquei várias das minhas preciosas horas para construir este blog para ajudar você a entrar nesse mundo! E só te peço que, se você gostar e se interessar pelo assunto, me siga no meu ',
        link: 'GitHub',
        depois: '.',
      },
      minhasRedes: 'Minhas redes',
      // Nome de cada rede para leitor de tela e dica (ver `REDES` em `site.ts`).
      redes: {
        email: 'E-mail',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        discord: 'Discord',
        twitter: 'Twitter',
      },
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
    /** Página do post (`PostLayout.astro`); o aviso só aparece na cópia em inglês. */
    post: {
      minLeitura: 'min de leitura',
      atualizadoEm: 'atualizado em',
      voltar: 'Voltar para todos os posts',
      avisoSoPortugues: '',
      avisoSemRevisao: '',
      lerOriginal: '',
    },
    comentarios: {
      titulo: 'Comentários',
      antes: 'Os comentários usam sua conta do GitHub e ficam salvos como uma',
      link: 'Discussion pública do repositório',
      semJs:
        'Ative o JavaScript para ver e deixar comentários (via giscus/GitHub Discussions).',
    },
    tags: {
      titulo: 'Tags',
      chamada: 'Navegue pelos assuntos do blog.',
      descricao: 'Todos os assuntos abordados no blog do Felixo.',
      nenhuma: 'Nenhuma tag ainda.',
      todas: 'Todas as tags',
      postsSobre: 'Posts do blog do Felixo sobre',
      post: { singular: 'post', plural: 'posts' },
    },
    sobre: {
      titulo: 'Sobre',
      descricao: `Sobre ${SITE.autor} e o ${SITE.titulo}.`,
      retrato: `Retrato de ${SITE.autor}`,
      ondeMais: 'Onde mais me encontrar',
      portfolio: 'Portfólio',
      github: 'GitHub',
      rss: 'Feed RSS',
    },
    /**
     * Número de acessos no cabeçalho do post (ver `AcessosDoPost.astro`).
     * `indisponivel` aparece quando a leitura do contador falha.
     */
    acessos: {
      singular: 'acesso',
      plural: 'acessos',
      indisponivel: 'acessos indisponíveis (bloqueador de anúncio?)',
    },
    /** Botão do rodapé que para as animações (ver `PausarAnimacoes.astro`). */
    animacoes: { pausar: 'Pausar animações', retomar: 'Retomar animações' },
    /** Números no rodapé de todas as páginas (ver `AcessosNoRodape.astro`). */
    acessosRodape: {
      pagina: { singular: 'acesso nesta página', plural: 'acessos nesta página' },
      total: { singular: 'acesso no blog', plural: 'acessos no blog' },
      indisponivel:
        'Os acessos não carregaram: um bloqueador de anúncio pode estar impedindo.',
    },
    /**
     * Assinatura do follow.it: a janela (`Assinatura.astro`) e os botões que a
     * abrem (`BotaoAssinatura.astro`). O padrão do plano grátis é um resumo
     * diário: não prometer aviso "na hora".
     */
    assinatura: {
      abrir: 'Receber por e-mail',
      chamada: 'Quer saber quando sair post novo?',
      rodape: 'E-mail',
      fechar: 'Fechar',
      titulo: 'Receba os posts novos',
      texto: 'Um e-mail no dia em que sair post novo.',
      rotuloEmail: 'Seu e-mail',
      placeholder: 'voce@exemplo.com',
      botao: 'Assinar',
      privacidade:
        'Quem envia é o follow.it, que guarda o seu e-mail e coloca anúncios nas mensagens. Dá para cancelar a qualquer momento.',
      novaAba: 'Abre o follow.it em nova aba.',
      outrasOpcoes: 'Prefere app ou RSS?',
    },
  },
  en: {
    lang: 'en',
    localeOG: 'en_US',
    // en-GB para a data sair "31 Jul 2026", no mesmo formato da coluna em português.
    localeDatas: 'en-GB',
    tituloSite: "Felixo's Blog",
    descricao:
      "Here, I write about my story, what I've learned along the way, and what I've been building in the meantime.",
    pularParaConteudo: 'Skip to content',
    navegacaoPrincipal: 'Main navigation',
    seletorIdioma: 'Language',
    navegacao: [
      { rotulo: 'Posts', href: '/en/' },
      { rotulo: 'Tags', href: '/en/tags' },
      { rotulo: 'About', href: '/en/about' },
    ] as Link[],
    linksExternos: [
      { rotulo: 'Portfolio', href: 'https://felixo.com.br/' },
      { rotulo: 'GitHub', href: 'https://github.com/Felipe-Alcantara' },
      { rotulo: 'RSS', href: '/rss.xml' },
    ] as Link[],
    feitoCom: 'Made with Astro.',
    home: {
      titulo: { antes: "Hi, I'm ", nome: 'Felixo', depois: '!' },
      // Tradução do texto do dono, revisada por ele em 2026-10-26.
      apresentacao: [
        "I'm a developer, AI engineer and audio engineer.",
        "I'm the creator of a few Brazilian startups, an enthusiast of creative assets like blogs, videos and content production, and I spend most of my time studying Artificial Intelligence.",
        "Here, I write about my story, what I've learned along the way, and what I've been building in the meantime. Here, you won't find just news, much less tutorials. It's my take on the industry and how my learning got me to where I am today. And I'd like to share it and record my take and everything I saw along the way, and I decided to make all of this public!",
      ],
      // Tradução do convite, feita por IA e ainda sem revisão do dono.
      convite: {
        antes:
          "I've dedicated several of my precious hours to building this blog to help you get into this world! And all I ask is that, if you like it and are interested in the subject, you follow me on my ",
        link: 'GitHub',
        depois: '.',
      },
      minhasRedes: 'My socials',
      redes: {
        email: 'Email',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        discord: 'Discord',
        twitter: 'Twitter',
      },
      verPortfolio: 'See portfolio',
      assinarRss: 'RSS feed',
      posts: 'Posts',
      pesquisar: 'Search',
      pesquisarPosts: 'Search posts',
      nenhumPost: 'No posts yet. Coming soon.',
      nenhumResultado: 'No posts found.',
    },
    postEmOutroIdioma: 'In Portuguese',
    post: {
      minLeitura: 'min read',
      atualizadoEm: 'updated',
      voltar: 'Back to all posts',
      avisoSoPortugues: 'This post is only available in Portuguese for now.',
      avisoSemRevisao:
        'This post was translated by AI and has not been reviewed by the author yet.',
      lerOriginal: 'Read the original in Portuguese',
    },
    comentarios: {
      titulo: 'Comments',
      antes: 'Comments use your GitHub account and are saved as a',
      link: 'public Discussion in the repository',
      semJs:
        'Enable JavaScript to see and leave comments (via giscus/GitHub Discussions).',
    },
    tags: {
      titulo: 'Tags',
      chamada: "Browse the blog's topics.",
      descricao: "All the topics covered on Felixo's blog.",
      nenhuma: 'No tags yet.',
      todas: 'All tags',
      postsSobre: "Posts from Felixo's blog about",
      post: { singular: 'post', plural: 'posts' },
    },
    sobre: {
      titulo: 'About',
      descricao: `About ${SITE.autor} and Felixo's Blog.`,
      retrato: `Portrait of ${SITE.autor}`,
      ondeMais: 'Where else to find me',
      portfolio: 'Portfolio',
      github: 'GitHub',
      rss: 'RSS feed',
    },
    acessos: {
      singular: 'view',
      plural: 'views',
      indisponivel: 'views unavailable (ad blocker?)',
    },
    animacoes: { pausar: 'Pause animations', retomar: 'Resume animations' },
    acessosRodape: {
      pagina: { singular: 'view of this page', plural: 'views of this page' },
      total: { singular: 'view on the blog', plural: 'views on the blog' },
      indisponivel: 'Views could not load: an ad blocker may be blocking them.',
    },
    assinatura: {
      abrir: 'Get posts by email',
      chamada: 'Want to know when a new post is out?',
      rodape: 'Email',
      fechar: 'Close',
      titulo: 'Get new posts',
      texto:
        'An email on the day a new post comes out (posts are in Portuguese for now).',
      rotuloEmail: 'Your email',
      placeholder: 'you@example.com',
      botao: 'Subscribe',
      privacidade:
        'Emails are sent by follow.it, which stores your address and adds ads to its messages. You can unsubscribe at any time.',
      novaAba: 'Opens follow.it in a new tab.',
      outrasOpcoes: 'Prefer an app or RSS?',
    },
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
  if (alvo === 'en') {
    if (IGUAL_COM_PREFIXO.test(atual)) return `/en${atual}`;
    return PAGINA_DE_TAG.test(atual) ? '/en/tags/' : NOMES_EM_INGLES[atual];
  }
  const nomeEmPortugues = Object.entries(NOMES_EM_INGLES).find(
    ([, en]) => en === atual,
  )?.[0];
  if (nomeEmPortugues) return nomeEmPortugues;
  const semPrefixo = atual.slice('/en'.length);
  if (IGUAL_COM_PREFIXO.test(semPrefixo)) return semPrefixo;
  return PAGINA_DE_TAG.test(semPrefixo) ? '/tags/' : undefined;
}

/** Para o seletor PT | EN: a página equivalente ou, se não houver, a home do idioma. */
export function destinoNoIdioma(caminhoSemBase: string, alvo: Idioma): string {
  return paginaEquivalente(caminhoSemBase, alvo) ?? (alvo === 'en' ? '/en/' : '/');
}
