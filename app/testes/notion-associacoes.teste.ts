import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { obterOrigemDoNotion, registrarOrigemDoNotion } from '../src/principal/notion/associacoes';

let pastaTemp: string;
let caminho: string;

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-associacoes-'));
  caminho = join(pastaTemp, 'associacoes.json');
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
});

describe('registrarOrigemDoNotion + obterOrigemDoNotion', () => {
  it('devolve null para slug nunca registrado', async () => {
    expect(await obterOrigemDoNotion('nunca-importado', caminho)).toBeNull();
  });

  it('grava e relê a associação slug -> pageId', async () => {
    await registrarOrigemDoNotion('meu-post', 'page-abc', caminho);
    expect(await obterOrigemDoNotion('meu-post', caminho)).toBe('page-abc');
  });

  it('preserva associações antigas ao adicionar uma nova', async () => {
    await registrarOrigemDoNotion('post-a', 'page-a', caminho);
    await registrarOrigemDoNotion('post-b', 'page-b', caminho);

    expect(await obterOrigemDoNotion('post-a', caminho)).toBe('page-a');
    expect(await obterOrigemDoNotion('post-b', caminho)).toBe('page-b');
  });
});
