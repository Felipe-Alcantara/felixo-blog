import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { salvarImagemOtimizada } from '../src/principal/midia/otimizacao';

let pastaTemp: string;

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-otimizacao-'));
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
});

/** PNG sólido gerado em memória — sem depender de arquivo de fixture no repo. */
async function pngDeTeste(largura: number, altura: number): Promise<Buffer> {
  return sharp({
    create: { width: largura, height: altura, channels: 3, background: { r: 200, g: 100, b: 250 } },
  })
    .png()
    .toBuffer();
}

describe('salvarImagemOtimizada', () => {
  it('converte para webp e devolve o nome do arquivo gravado', async () => {
    const png = await pngDeTeste(400, 300);
    const nomeArquivo = await salvarImagemOtimizada(png, pastaTemp, 'imagem-01');

    expect(nomeArquivo).toBe('imagem-01.webp');
    const info = await sharp(join(pastaTemp, nomeArquivo)).metadata();
    expect(info.format).toBe('webp');
    expect(info.width).toBe(400);
    expect(info.height).toBe(300);
  });

  it('encolhe imagem maior que a largura máxima, preservando proporção', async () => {
    const png = await pngDeTeste(3200, 1600);
    const nomeArquivo = await salvarImagemOtimizada(png, pastaTemp, 'grande');

    const info = await sharp(join(pastaTemp, nomeArquivo)).metadata();
    expect(info.width).toBe(1600);
    expect(info.height).toBe(800);
  });

  it('não alarga imagem menor que a largura máxima', async () => {
    const png = await pngDeTeste(200, 100);
    const nomeArquivo = await salvarImagemOtimizada(png, pastaTemp, 'pequena');

    const info = await sharp(join(pastaTemp, nomeArquivo)).metadata();
    expect(info.width).toBe(200);
  });

  it('cria a pasta de destino se ela ainda não existir', async () => {
    const png = await pngDeTeste(100, 100);
    const pastaAninhada = join(pastaTemp, 'meu-post');
    await salvarImagemOtimizada(png, pastaAninhada, 'foto');

    const info = await stat(join(pastaAninhada, 'foto.webp'));
    expect(info.isFile()).toBe(true);
  });
});
