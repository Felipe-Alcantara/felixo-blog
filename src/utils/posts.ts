import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Idioma } from '../config/idiomas';

export type Post = CollectionEntry<'posts'>;
export type Traducao = CollectionEntry<'traducoes'>;

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

/** A tradução em inglês do post, quando existe (`src/content/traducoes/en/<post>.md`). */
export async function buscarTraducao(post: Post): Promise<Traducao | undefined> {
  return getEntry('traducoes', post.id);
}

/**
 * O que a página mostra do post no idioma dela: título, descrição e tags da
 * tradução quando ela existe e a página é em inglês; senão, os do original.
 * `traducao` fica `undefined` quando o texto exibido é o português.
 */
export function versaoDoPost(post: Post, traducao: Traducao | undefined, idioma: Idioma) {
  const t = idioma === 'en' ? traducao : undefined;
  return {
    traducao: t,
    titulo: t?.data.titulo ?? post.data.titulo,
    descricao: t?.data.descricao ?? post.data.descricao,
    tags: t?.data.tags ?? post.data.tags,
  };
}

/**
 * Os posts de cada tag, pelo slug da tag: uma página de tag por entrada. Em
 * inglês, um post traduzido entra pelas tags da tradução; um sem tradução
 * entra pelas tags em português (`traduzida` diz de qual idioma é o nome).
 */
export async function agruparPorTag(
  idioma: Idioma = 'pt',
): Promise<{ slug: string; nome: string; posts: Post[]; traduzida: boolean }[]> {
  const porTag = new Map<
    string,
    { slug: string; nome: string; posts: Post[]; traduzida: boolean }
  >();

  for (const post of await listarPosts()) {
    const versao = versaoDoPost(post, await buscarTraducao(post), idioma);
    for (const tag of versao.tags) {
      const slug = slugDaTag(tag);
      const grupo = porTag.get(slug) ?? { slug, nome: tag, posts: [], traduzida: false };
      grupo.posts.push(post);
      grupo.traduzida ||= Boolean(versao.traducao);
      porTag.set(slug, grupo);
    }
  }

  return [...porTag.values()];
}

/** As tags com a contagem de posts, ordenadas por uso. */
export async function listarTags(
  idioma: Idioma = 'pt',
): Promise<{ nome: string; total: number; traduzida: boolean }[]> {
  const locale = idioma === 'en' ? 'en' : 'pt-BR';
  return (await agruparPorTag(idioma))
    .map(({ nome, posts, traduzida }) => ({ nome, total: posts.length, traduzida }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, locale));
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
