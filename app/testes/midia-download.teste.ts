import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { baixarImagensDoArtigo } from '../src/principal/midia/download';

let pastaTemp: string;

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-midia-'));
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
  vi.unstubAllGlobals();
});

describe('baixarImagensDoArtigo', () => {
  it('baixa a imagem, salva na pasta do post e troca a URL no markdown', async () => {
    const bytesFalsos = new Uint8Array([1, 2, 3]);
    const fetchFalso = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => bytesFalsos.buffer,
    });
    vi.stubGlobal('fetch', fetchFalso);

    const markdownOriginal = '![foto](https://s3.amazonaws.com/notion/img.png?assinatura=x)';
    const resultado = await baixarImagensDoArtigo(
      markdownOriginal,
      [{ url: 'https://s3.amazonaws.com/notion/img.png?assinatura=x', alt: 'foto' }],
      join(pastaTemp, 'meu-post'),
      'meu-post',
    );

    expect(resultado).toBe('![foto](./meu-post/notion-01.png)');
    expect(fetchFalso).toHaveBeenCalledWith('https://s3.amazonaws.com/notion/img.png?assinatura=x');

    const salvo = await readFile(join(pastaTemp, 'meu-post', 'notion-01.png'));
    expect([...salvo]).toEqual([1, 2, 3]);
  });

  it('lança erro claro quando o download falha (URL expirada, por exemplo)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

    await expect(
      baixarImagensDoArtigo(
        '![x](https://s3.amazonaws.com/notion/expirada.png)',
        [{ url: 'https://s3.amazonaws.com/notion/expirada.png', alt: 'x' }],
        join(pastaTemp, 'post'),
        'post',
      ),
    ).rejects.toThrow(/403/);
  });

  it('não baixa nada e devolve o markdown inalterado quando não há imagens', async () => {
    const fetchFalso = vi.fn();
    vi.stubGlobal('fetch', fetchFalso);

    const resultado = await baixarImagensDoArtigo('texto sem imagem', [], join(pastaTemp, 'x'), 'x');
    expect(resultado).toBe('texto sem imagem');
    expect(fetchFalso).not.toHaveBeenCalled();
  });
});
