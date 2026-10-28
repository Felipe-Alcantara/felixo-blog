import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const diretorio = path.dirname(fileURLToPath(import.meta.url));
const quadros = 49;
const larguraDoQuadro = 301;
const alturaDoQuadro = 320;
const colunas = 7;
const linhas = 7;
const caminhoDosQuadros = path.join(diretorio, '..', 'out', 'quadros');
const caminhoDoSprite = path.resolve(
  diretorio,
  '..',
  '..',
  '..',
  'src',
  'content',
  'posts',
  'ola-mundo',
  'gatinho-tchau-sprite.png',
);

const entradas = Array.from({ length: quadros }, (_, indice) => ({
  input: path.join(caminhoDosQuadros, `quadro-${String(indice).padStart(2, '0')}.png`),
  left: (indice % colunas) * larguraDoQuadro,
  top: Math.floor(indice / colunas) * alturaDoQuadro,
}));

await mkdir(path.dirname(caminhoDoSprite), { recursive: true });
await rm(caminhoDoSprite, { force: true });
await sharp({
  create: {
    width: colunas * larguraDoQuadro,
    height: linhas * alturaDoQuadro,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(entradas)
  .png({ palette: true, quality: 100, effort: 10 })
  .toFile(caminhoDoSprite);

console.log(`Sprite criado: ${caminhoDoSprite}`);
