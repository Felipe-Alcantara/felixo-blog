import { describe, expect, it } from 'vitest';
import type { Client } from '@notionhq/client';
import { obterInfoDaDatabase } from '../src/principal/notion/descoberta';

/**
 * Fixture baseada no formato real de `databases.retrieve` (campos `title` e
 * `properties` documentados na API do Notion) — sem bater na rede.
 */
function clienteFalso(respostaDatabase: unknown): Client {
  return {
    databases: {
      retrieve: async () => respostaDatabase,
    },
  } as unknown as Client;
}

describe('obterInfoDaDatabase', () => {
  it('extrai título e propriedades de uma database real', async () => {
    const cliente = clienteFalso({
      id: 'db-123',
      title: [{ plain_text: 'Artigos' }],
      properties: {
        Nome: { type: 'title' },
        Status: { type: 'select' },
        Publicado: { type: 'date' },
        Tags: { type: 'multi_select' },
      },
    });

    const info = await obterInfoDaDatabase(cliente, 'db-123');

    expect(info.id).toBe('db-123');
    expect(info.titulo).toBe('Artigos');
    expect(info.propriedades).toEqual(
      expect.arrayContaining([
        { nome: 'Nome', tipo: 'title' },
        { nome: 'Status', tipo: 'select' },
        { nome: 'Publicado', tipo: 'date' },
        { nome: 'Tags', tipo: 'multi_select' },
      ]),
    );
  });

  it('junta múltiplos segmentos de rich text no título', async () => {
    const cliente = clienteFalso({
      id: 'db-456',
      title: [{ plain_text: 'Arti' }, { plain_text: 'gos' }],
      properties: {},
    });

    const info = await obterInfoDaDatabase(cliente, 'db-456');
    expect(info.titulo).toBe('Artigos');
  });

  it('devolve "(sem título)" e lista vazia quando a resposta não tem esses campos (ex.: página, não database)', async () => {
    const cliente = clienteFalso({ id: 'pg-1', object: 'page' });
    const info = await obterInfoDaDatabase(cliente, 'pg-1');
    expect(info.titulo).toBe('(sem título)');
    expect(info.propriedades).toEqual([]);
  });
});
