import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  carregarConfiguracao,
  lerConfiguracaoAtual,
  salvarConfiguracao,
} from '../src/principal/config/armazenamento';

// Sempre grava num .env temporário — nunca no .env real de quem roda a suíte.
let pastaTemp: string;
let caminhoEnv: string;

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-env-'));
  caminhoEnv = join(pastaTemp, '.env');
  delete process.env['NOTION_TOKEN'];
  delete process.env['NOTION_DATABASE_ID'];
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
  delete process.env['NOTION_TOKEN'];
  delete process.env['NOTION_DATABASE_ID'];
});

describe('salvarConfiguracao + carregarConfiguracao', () => {
  it('grava o .env e atualiza process.env na hora, sem precisar recarregar', async () => {
    await salvarConfiguracao(
      { notionToken: 'ntn_abc', notionDatabaseId: 'db-123' },
      caminhoEnv,
    );

    expect(lerConfiguracaoAtual()).toEqual({
      notionToken: 'ntn_abc',
      notionDatabaseId: 'db-123',
    });

    const bruto = await readFile(caminhoEnv, 'utf-8');
    expect(bruto).toContain('NOTION_TOKEN=ntn_abc');
    expect(bruto).toContain('NOTION_DATABASE_ID=db-123');
  });

  it('carregarConfiguracao lê um .env já existente em disco', async () => {
    await salvarConfiguracao({ notionToken: 'ntn_x', notionDatabaseId: 'db-y' }, caminhoEnv);
    delete process.env['NOTION_TOKEN'];
    delete process.env['NOTION_DATABASE_ID'];

    carregarConfiguracao(caminhoEnv);

    expect(lerConfiguracaoAtual()).toEqual({ notionToken: 'ntn_x', notionDatabaseId: 'db-y' });
  });

  it('carregarConfiguracao não lança erro se o .env não existir', () => {
    expect(() => carregarConfiguracao(join(pastaTemp, 'nao-existe.env'))).not.toThrow();
    expect(lerConfiguracaoAtual()).toEqual({ notionToken: '', notionDatabaseId: '' });
  });
});
