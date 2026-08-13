import { describe, expect, it } from 'vitest';
import type { Client } from '@notionhq/client';
import { listarArtigosDaDatabase } from '../src/principal/notion/paginasDaDatabase';

function paginaFalsa(id: string, tituloProp: string, titulo: string) {
  return {
    object: 'page',
    id,
    properties: {
      Status: { type: 'select', select: { name: 'Rascunho' } },
      [tituloProp]: { type: 'title', title: [{ plain_text: titulo }] },
    },
  };
}

function clienteFalso(paginas: unknown[], has_more = false): Client {
  return {
    databases: {
      query: async () => ({ results: paginas, has_more, next_cursor: null }),
    },
  } as unknown as Client;
}

describe('listarArtigosDaDatabase', () => {
  it('extrai o título mesmo quando a propriedade não se chama "Nome" ou "Title"', async () => {
    const cliente = clienteFalso([
      paginaFalsa('p1', 'Artigo', 'Reescrevendo a internet'),
      paginaFalsa('p2', 'Título do post', 'Outro artigo'),
    ]);

    const artigos = await listarArtigosDaDatabase(cliente, 'db-1');
    expect(artigos).toEqual([
      { id: 'p1', titulo: 'Reescrevendo a internet' },
      { id: 'p2', titulo: 'Outro artigo' },
    ]);
  });

  it('segue a paginação até has_more ser falso', async () => {
    let chamadas = 0;
    const cliente = {
      databases: {
        query: async ({ start_cursor }: { start_cursor?: string }) => {
          chamadas += 1;
          if (!start_cursor) {
            return { results: [paginaFalsa('p1', 'Nome', 'Primeiro')], has_more: true, next_cursor: 'c2' };
          }
          return { results: [paginaFalsa('p2', 'Nome', 'Segundo')], has_more: false, next_cursor: null };
        },
      },
    } as unknown as Client;

    const artigos = await listarArtigosDaDatabase(cliente, 'db-1');
    expect(chamadas).toBe(2);
    expect(artigos.map((a) => a.titulo)).toEqual(['Primeiro', 'Segundo']);
  });
});
