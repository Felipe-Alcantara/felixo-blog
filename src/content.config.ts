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
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string(),
      publicadoEm: z.coerce.date(),
      atualizadoEm: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** Marca o post como rascunho: fica fora do build de produção. */
      rascunho: z.boolean().default(false),
      /**
       * Capa do post, relativa ao arquivo `.md` (ex.: `./meu-post/capa.jpg`).
       * Vira a imagem Open Graph do post; sem ela, cai no cartão genérico do
       * site (`public/og-image.jpg`, gerado por `scripts/gerar-og-image.py`).
       * `image()` faz Astro otimizar e servir o arquivo com hash, igual às
       * imagens já usadas no corpo dos posts.
       */
      capa: image().optional(),
    }),
});

/**
 * Tradução em inglês de um post: `src/content/traducoes/en/<post>.md`, com o
 * mesmo nome do post. A data, a capa e o endereço vêm do original; aqui ficam
 * só o texto e o que muda de idioma. Sem arquivo, a página em inglês do post
 * mostra o texto em português com um aviso.
 */
const traducoes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/traducoes/en' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    /** Tags em inglês; a página de tag em inglês agrupa por elas. */
    tags: z.array(z.string()).default([]),
    /** `false` mostra o aviso de tradução sem revisão; o dono vira para `true` depois de revisar. */
    revisado: z.boolean().default(false),
  }),
});

export const collections = { posts, traducoes };
