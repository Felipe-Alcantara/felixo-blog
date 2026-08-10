import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` reexportado por `astro:content` está deprecado no Astro 7; o caminho que
// os próprios tipos gerados usam é `astro/zod`. Mesmo Zod, sem o aviso.
import { z } from 'astro/zod';

/**
 * Coleção de posts do blog.
 *
 * Cada post é um arquivo Markdown em `src/content/posts/`. O nome do arquivo
 * vira o slug da URL (`/posts/<nome-do-arquivo>`).
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    publicadoEm: z.coerce.date(),
    atualizadoEm: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Marca o post como rascunho: fica fora do build de produção. */
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { posts };
