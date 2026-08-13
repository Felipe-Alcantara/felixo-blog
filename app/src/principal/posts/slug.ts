/** Formato de slug aceito: minúsculas, dígitos e hífen — vira nome de arquivo e URL. */
const PADRAO_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugValido(slug: string): boolean {
  return PADRAO_SLUG.test(slug);
}

/**
 * Deriva um slug a partir de um título livre (ex.: vindo do Notion).
 *
 * Remove acentos, pontuação e espaços — mesma ideia de `slugDaTag` em
 * `src/utils/posts.ts`, mas para nome de arquivo em vez de segmento de URL de
 * tag. O resultado ainda deve passar por `slugValido` antes de virar arquivo.
 */
export function derivarSlug(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // marcas de acento isoladas pelo NFD
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
