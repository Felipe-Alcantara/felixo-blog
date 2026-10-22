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
 * Redes do dono, as mesmas da seção "Sobre" do felixo.com.br e na mesma ordem
 * (pedido do dono, 2026-10-22). São endereços que já são públicos no
 * portfólio. O `id` é também o nome do ícone em `Icone.astro` e a chave do
 * rótulo em `TEXTOS.<idioma>.home.redes`. `externo` abre em nova aba.
 */
export const REDES = [
  { id: 'email', href: 'mailto:FelipeTheFeh@Gmail.com', externo: false },
  { id: 'github', href: 'https://github.com/Felipe-Alcantara', externo: true },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/felipealcantaramartins/',
    externo: true,
  },
  { id: 'whatsapp', href: 'https://wa.me/5524998545803', externo: true },
  { id: 'discord', href: 'https://discord.gg/DmW9tHcGpV', externo: true },
  { id: 'twitter', href: 'https://x.com/Felixo_Tech', externo: true },
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
 *
 * `formulario` é o endereço de envio do formulário gerado pelo follow.it (POST,
 * um campo `email`); vazio desliga a assinatura em todas as páginas (ver
 * `Assinatura.astro`). `seguir` é a página do feed onde o leitor escolhe o
 * canal; o `?pub` mantém o e-mail dele na lista do dono. Os dois aparecem no
 * HTML de qualquer site que usa follow.it: não são segredo.
 */
export const FOLLOWIT = {
  verificacao: 'nDnjKRVEAyctn8CkYXUb',
  formulario:
    'https://api.follow.it/subscription-form/Z2NUZVdmSzRYcm90N0tCK0NmMjcwc3JkUHBzcXhDVTJzbEpLMEpodGIvV0dqT1dCeTQ4V2RjU2k0VFAvZlJ3VVRXTFFGb3BncjNKQXBQQzQ4cFJDZ2ExTndqM0xrbjcyTlZraXBsVFJvUCtYT2twN0pvOVhpWVhoM3IycnYwbCt8YXFHSUVGOEdnQmxuV1NCNW1wdXpvMjl1WVI1RlhvMDV6cWM1N2RvWUFWMD0=/8',
  seguir: 'https://follow.it/blog-do-felixo?pub',
};
