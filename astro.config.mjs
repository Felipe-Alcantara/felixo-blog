// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/*
 * Endereço de publicação: domínio próprio, servindo na raiz.
 *
 * Se um dia o site voltar a rodar numa subpasta (ex.: preview em
 * `felipe-alcantara.github.io/felixo-blog/`), basta definir as variáveis de
 * ambiente `SITE_URL` e `BASE_PATH` — todos os links internos passam por
 * `caminho()` (`src/utils/rotas.ts`) e se ajustam sozinhos.
 */
const SITE = process.env.SITE_URL ?? 'https://blog.felixo.com.br';
const BASE = process.env.BASE_PATH ?? '/';

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
