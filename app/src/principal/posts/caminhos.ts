import { join } from 'node:path';

/**
 * Raiz do repositório do blog, calculada a partir deste arquivo.
 *
 * Funciona tanto em dev (`app/src/principal/posts/`) quanto no build
 * (`app/dist-electron/principal/posts/`, ver `electron.vite.config.ts`): os
 * dois ficam três níveis abaixo da raiz do repositório
 * (`.../principal/posts` → `.../principal` → `app` → raiz).
 */
export const RAIZ_DO_BLOG = join(__dirname, '..', '..', '..');

export const PASTA_DE_POSTS = join(RAIZ_DO_BLOG, 'src', 'content', 'posts');

/** Caminho do arquivo `.md` do post. O nome do arquivo é a URL pública — ver AGENTS.md. */
export function caminhoDoPost(slug: string): string {
  return join(PASTA_DE_POSTS, `${slug}.md`);
}

/** Pasta de imagens do post, ao lado do `.md` (convenção do blog). */
export function pastaDeMidiaDoPost(slug: string): string {
  return join(PASTA_DE_POSTS, slug);
}
