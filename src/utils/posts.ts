import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * Devolve os posts publicáveis, do mais recente para o mais antigo.
 *
 * Rascunhos aparecem apenas em desenvolvimento (`npm run dev`), nunca no build
 * de produção.
 */
export async function listarPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.rascunho : true,
  );

  return posts.sort(
    (a, b) => b.data.publicadoEm.valueOf() - a.data.publicadoEm.valueOf(),
  );
}

/** Agrupa as tags de todos os posts com a contagem de ocorrências, ordenadas por uso. */
export async function listarTags(): Promise<{ nome: string; total: number }[]> {
  const posts = await listarPosts();
  const contagem = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      contagem.set(tag, (contagem.get(tag) ?? 0) + 1);
    }
  }

  return [...contagem.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** Os posts de cada tag, pelo slug da tag: uma página de tag por entrada, nos dois idiomas. */
export async function agruparPorTag(): Promise<
  { slug: string; nome: string; posts: Post[] }[]
> {
  const posts = await listarPosts();
  const porTag = new Map<string, { slug: string; nome: string; posts: Post[] }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugDaTag(tag);
      const grupo = porTag.get(slug) ?? { slug, nome: tag, posts: [] };
      grupo.posts.push(post);
      porTag.set(slug, grupo);
    }
  }

  return [...porTag.values()];
}

/** Converte uma tag em slug de URL (`Boas Práticas` → `boas-praticas`). */
export function slugDaTag(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
