import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAMPOS_FRONTMATTER } from '../src/principal/posts/esquema';

/**
 * Guarda contra a divergência mais cara deste app: o schema do Astro
 * (`src/content.config.ts`) e o schema do editor (`esquema.ts`) descrevem o
 * mesmo frontmatter em dois arquivos separados, porque o primeiro só existe
 * dentro do runtime `astro:content`. Este teste lê o arquivo do Astro de
 * verdade e falha se um campo for adicionado/removido de um lado só.
 */
describe('paridade entre o schema do app e o schema do Astro', () => {
  it('todo campo de content.config.ts aparece no schema do editor', async () => {
    const caminho = join(__dirname, '../../src/content.config.ts');
    const texto = await readFile(caminho, 'utf-8');

    const blocoSchema = texto.match(/schema:\s*z\.object\(\{([\s\S]*?)\}\),?\s*\}\);/);
    expect(blocoSchema, 'não encontrei o bloco "schema: z.object({...})" em content.config.ts').not.toBeNull();

    const camposDoAstro = [...blocoSchema![1].matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
    expect(camposDoAstro.length).toBeGreaterThan(0);

    for (const campo of camposDoAstro) {
      expect(CAMPOS_FRONTMATTER as readonly string[]).toContain(campo);
    }
    for (const campo of CAMPOS_FRONTMATTER) {
      expect(camposDoAstro).toContain(campo);
    }
  });
});
