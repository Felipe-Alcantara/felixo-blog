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

/** Linha da "Ideias criativas": `formato` null é a coluna Formato sem valor. */
function paginaComFormato(id: string, formato: string | null) {
  const pagina = paginaFalsa(id, 'Nome', `Ideia ${id}`);
  (pagina.properties as Record<string, unknown>).Formato = {
    type: 'select',
    select: formato === null ? null : { name: formato },
  };
  return pagina;
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
      paginaFalsa('p1', 'Artigo', 'Artigo de exemplo'),
      paginaFalsa('p2', 'Título do post', 'Outro artigo'),
    ]);

    const artigos = await listarArtigosDaDatabase(cliente, 'db-1');
    expect(artigos).toEqual([
      { id: 'p1', titulo: 'Artigo de exemplo' },
      { id: 'p2', titulo: 'Outro artigo' },
    ]);
  });

  it('lista só as linhas com Formato = Artigo, sem diferenciar maiúsculas', async () => {
    const cliente = clienteFalso([
      paginaComFormato('p1', 'Artigo'),
      paginaComFormato('p2', 'Vídeo'),
      paginaComFormato('p3', 'Música'),
      paginaComFormato('p4', 'artigo'),
    ]);

    const artigos = await listarArtigosDaDatabase(cliente, 'db-1');
    expect(artigos.map((a) => a.id)).toEqual(['p1', 'p4']);
  });

  it('mantém a linha com Formato vazio e a database sem a coluna Formato', async () => {
    const cliente = clienteFalso([
      paginaComFormato('p1', null),
      paginaFalsa('p2', 'Nome', 'Sem a coluna'),
      paginaComFormato('p3', 'Vídeo'),
    ]);

    const artigos = await listarArtigosDaDatabase(cliente, 'db-1');
    expect(artigos.map((a) => a.id)).toEqual(['p1', 'p2']);
  });

  it('ignora uma coluna Formato que não é select', async () => {
    const pagina = paginaFalsa('p1', 'Nome', 'Formato em outro tipo');
    (pagina.properties as Record<string, unknown>).Formato = {
      type: 'multi_select',
      multi_select: [{ name: 'Vídeo' }],
    };

    const artigos = await listarArtigosDaDatabase(clienteFalso([pagina]), 'db-1');
    expect(artigos.map((a) => a.id)).toEqual(['p1']);
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
