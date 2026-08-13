import { z } from 'zod';

/**
 * Espelha `src/content.config.ts` (schema Zod do Astro) do lado do app.
 *
 * Não importamos o arquivo do Astro diretamente — ele depende de
 * `astro:content`, que só existe dentro do runtime do Astro. Por isso este
 * schema é uma cópia deliberada, e `testes/esquema-paridade.teste.ts` lê o
 * `content.config.ts` de verdade e falha se os campos divergirem. O dia que
 * alguém mudar um schema sem mudar o outro, o `npm test` avisa em vez do
 * `.md` gerado quebrar o build do site semanas depois.
 */
export const esquemaFrontmatter = z.object({
  titulo: z.string().min(1, 'Título não pode ser vazio.'),
  descricao: z.string().min(1, 'Descrição não pode ser vazia.'),
  publicadoEm: z.coerce.date(),
  atualizadoEm: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  rascunho: z.boolean().default(false),
  /** Caminho da capa, relativo ao `.md` (ex.: `./meu-post/capa.jpg`). Ver content.config.ts. */
  capa: z.string().optional(),
});

export type Frontmatter = z.infer<typeof esquemaFrontmatter>;

/** Nomes dos campos do frontmatter, na ordem em que devem ser gravados no `.md`. */
export const CAMPOS_FRONTMATTER = [
  'titulo',
  'descricao',
  'publicadoEm',
  'atualizadoEm',
  'tags',
  'rascunho',
  'capa',
] as const satisfies readonly (keyof Frontmatter)[];
