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
