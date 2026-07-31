import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';
import { listarPosts } from '../utils/posts';
import { caminho } from '../utils/rotas';

export async function GET(context: APIContext) {
  const posts = await listarPosts();

  return rss({
    title: SITE.titulo,
    description: SITE.descricao,
    site: context.site ?? SITE.url,
    customData: `<language>${SITE.idioma}</language>`,
    items: posts.map((post) => ({
      title: post.data.titulo,
      description: post.data.descricao,
      pubDate: post.data.publicadoEm,
      categories: post.data.tags,
      link: caminho(`/posts/${post.id}/`),
    })),
  });
}
