// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/*
 * Endereço de publicação.
 *
 * Enquanto o DNS de `blog.felixo.com.br` não estiver configurado, o site vive em
 * `felipe-alcantara.github.io/felixo-blog/` — uma SUBPASTA, e por isso o `base`.
 *
 * Quando o domínio próprio entrar no ar, troque as duas constantes abaixo por
 * `'https://blog.felixo.com.br'` e `'/'`. Nada mais precisa mudar: todos os
 * links internos passam por `caminho()` (`src/utils/rotas.ts`).
 */
const SITE = process.env.SITE_URL ?? 'https://felipe-alcantara.github.io';
const BASE = process.env.BASE_PATH ?? '/felixo-blog';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'night-owl',
      wrap: true,
    },
  },
});
