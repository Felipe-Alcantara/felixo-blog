import { describe, expect, it, vi } from 'vitest';
import type { Client } from '@notionhq/client';
import { escreverStatusDeVolta } from '../src/principal/notion/statusDeVolta';

function databaseFalsa(properties: Record<string, unknown>) {
  return { id: 'db-1', properties };
}

function clienteFalso(database: unknown) {
  const update = vi.fn().mockResolvedValue({});
  const cliente = {
    databases: { retrieve: async () => database },
    pages: { update },
  } as unknown as Client;
  return { cliente, update };
}

describe('escreverStatusDeVolta', () => {
  it('atualiza URL e status quando acha as propriedades certas', async () => {
    const database = databaseFalsa({
      Link: { type: 'url' },
      Status: {
        type: 'select',
        select: {
          options: [
            { id: 'opt-1', name: 'Ideia' },
            { id: 'opt-2', name: 'Publicado' },
          ],
        },
      },
    });
    const { cliente, update } = clienteFalso(database);

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://blog.felixo.com.br/posts/x/');

    expect(resultado.urlAtualizada).toBe(true);
    expect(resultado.statusAtualizado).toBe(true);
    expect(resultado.avisoDeStatus).toBeUndefined();
    expect(update).toHaveBeenCalledWith({
      page_id: 'page-1',
      properties: {
        Link: { url: 'https://blog.felixo.com.br/posts/x/' },
        Status: { select: { id: 'opt-2' } },
      },
    });
  });

  // Esquema parecido com o do "Ideias criativas", com as colunas fora de ordem de propósito:
  // `Formato` (select) antes de `Etapa` e `Arquivo no GitHub` (url) antes de `URL publicada`.
  const ideiasCriativas = () =>
    databaseFalsa({
      Nome: { type: 'title' },
      'Arquivo no GitHub': { type: 'url' },
      Formato: {
        type: 'select',
        select: { options: [{ id: 'f-1', name: 'Artigo' }, { id: 'f-2', name: 'Vídeo' }] },
      },
      Etapa: {
        type: 'select',
        select: { options: [{ id: 'e-1', name: 'Ideia' }, { id: 'e-2', name: 'Publicado' }] },
      },
      'URL publicada': { type: 'url' },
    });

  it('escolhe a coluna de status pelas opções, e não a primeira select (Formato antes de Etapa)', async () => {
    const { cliente, update } = clienteFalso(ideiasCriativas());

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://blog.felixo.com.br/posts/x/');

    expect(resultado.statusAtualizado).toBe(true);
    expect(resultado.avisoDeStatus).toBeUndefined();
    expect(update).toHaveBeenCalledWith({
      page_id: 'page-1',
      properties: expect.objectContaining({ Etapa: { select: { id: 'e-2' } } }),
    });
    expect(update.mock.calls[0][0].properties).not.toHaveProperty('Formato');
  });

  it('grava a URL na coluna cujo nome diz "publicada", e não na primeira url (Arquivo no GitHub)', async () => {
    const { cliente, update } = clienteFalso(ideiasCriativas());

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://blog.felixo.com.br/posts/x/');

    expect(resultado.urlAtualizada).toBe(true);
    const escrito = update.mock.calls[0][0].properties;
    expect(escrito['URL publicada']).toEqual({ url: 'https://blog.felixo.com.br/posts/x/' });
    expect(escrito).not.toHaveProperty('Arquivo no GitHub');
  });

  it('não escolhe uma url ao acaso quando há mais de uma e nenhuma tem nome de "publicada"', async () => {
    const database = databaseFalsa({
      'Arquivo no GitHub': { type: 'url' },
      Referência: { type: 'url' },
      Etapa: { type: 'select', select: { options: [{ id: 'e-2', name: 'Publicado' }] } },
    });
    const { cliente, update } = clienteFalso(database);

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://x/');

    expect(resultado.urlAtualizada).toBe(false);
    expect(update).toHaveBeenCalledWith({
      page_id: 'page-1',
      properties: { Etapa: { select: { id: 'e-2' } } },
    });
  });

  it('com várias colunas de status e nenhuma opção "publicado", o aviso cita todas', async () => {
    const database = databaseFalsa({
      Formato: { type: 'select', select: { options: [{ id: 'f-1', name: 'Artigo' }] } },
      Etapa: { type: 'select', select: { options: [{ id: 'e-1', name: 'Ideia' }] } },
    });
    const { cliente } = clienteFalso(database);

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://x/');

    expect(resultado.statusAtualizado).toBe(false);
    expect(resultado.avisoDeStatus).toMatch(/"Formato"/);
    expect(resultado.avisoDeStatus).toMatch(/"Etapa"/);
    expect(resultado.avisoDeStatus).toMatch(/nenhuma opção parece/);
  });

  it('avisa e não altera status quando nenhuma opção parece "publicado"', async () => {
    const database = databaseFalsa({
      Status: { type: 'select', select: { options: [{ id: 'a', name: 'Ideia' }, { id: 'b', name: 'Rascunho' }] } },
    });
    const { cliente, update } = clienteFalso(database);

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://x/');

    expect(resultado.statusAtualizado).toBe(false);
    expect(resultado.avisoDeStatus).toMatch(/nenhuma opção parece/);
    expect(resultado.urlAtualizada).toBe(false); // sem propriedade url na fixture
    expect(update).not.toHaveBeenCalled(); // nada para escrever
  });

  it('avisa quando a database não tem nenhuma propriedade select/status', async () => {
    const database = databaseFalsa({ Nome: { type: 'title' } });
    const { cliente } = clienteFalso(database);

    const resultado = await escreverStatusDeVolta(cliente, 'page-1', 'db-1', 'https://x/');
    expect(resultado.avisoDeStatus).toMatch(/Nenhuma propriedade de status/);
  });
});
