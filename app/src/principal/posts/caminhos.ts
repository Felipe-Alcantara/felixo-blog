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

/**
 * Onde o editor guarda tudo o que ainda não foi publicado: o texto importado ou
 * escrito, as imagens e a capa. Fica em `app/`, ignorada pelo git (`.gitignore`
 * da raiz), ao lado do `.env`: o repositório é público e o commit automático do
 * Fetch All leva tudo o que está na árvore, então nada não publicado pode ficar
 * em `src/content/posts/`. Só o "Publicar" copia o post para lá.
 */
export const PASTA_DE_RASCUNHOS = join(RAIZ_DO_BLOG, 'app', 'rascunhos');

/** Caminho do `.md` do rascunho. */
export function caminhoDoRascunho(slug: string): string {
  return join(PASTA_DE_RASCUNHOS, `${slug}.md`);
}

/** Pasta de imagens do rascunho, com a mesma estrutura da pasta do post publicado. */
export function pastaDeMidiaDoRascunho(slug: string): string {
  return join(PASTA_DE_RASCUNHOS, slug);
}
