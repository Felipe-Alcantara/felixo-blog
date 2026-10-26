import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Client } from '@notionhq/client';

// A importação baixa as imagens do artigo para uma pasta. Esse teste garante que
// essa pasta é a do rascunho (ignorada pelo git), e não a de posts publicados.
vi.mock('../src/principal/posts/caminhos', async () => {
  const { join: joinReal } = await import('node:path');
  return {
    pastaDeMidiaDoPost: (slug: string) => joinReal('/blog', 'src', 'content', 'posts', slug),
    pastaDeMidiaDoRascunho: (slug: string) => joinReal('/blog', 'app', 'rascunhos', slug),
  };
});

vi.mock('../src/principal/notion/paginacao', () => ({
  listarTodosOsBlocos: vi.fn().mockResolvedValue([]),
}));

vi.mock('../src/principal/notion/blocos', () => ({
  blocosParaMarkdown: vi.fn().mockReturnValue({
    markdown: 'texto com imagem',
    imagens: [{ id: 'img-1', url: 'https://notion.exemplo/img.png' }],
  }),
}));

vi.mock('../src/principal/midia/download', () => ({
  baixarImagensDoArtigo: vi.fn().mockResolvedValue('texto com imagem baixada'),
}));

vi.mock('../src/principal/notion/associacoes', () => ({
  registrarOrigemDoNotion: vi.fn().mockResolvedValue(undefined),
}));

const { importarArtigo } = await import('../src/principal/notion/importacao');
const { baixarImagensDoArtigo } = await import('../src/principal/midia/download');
const { registrarOrigemDoNotion } = await import('../src/principal/notion/associacoes');

function clienteFalso(): Client {
  return {
    pages: {
      retrieve: async () => ({
        properties: { Nome: { type: 'title', title: [{ plain_text: 'Título do artigo' }] } },
      }),
    },
  } as unknown as Client;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('importarArtigo', () => {
  it('baixa as imagens para a pasta do rascunho, nunca para src/content/posts', async () => {
    const artigo = await importarArtigo(clienteFalso(), 'pagina-1', 'meu-artigo');

    expect(artigo).toEqual({ titulo: 'Título do artigo', corpo: 'texto com imagem baixada' });
    const pastaUsada = vi.mocked(baixarImagensDoArtigo).mock.calls[0][2].replaceAll('\\', '/');
    expect(pastaUsada).toContain('app/rascunhos/meu-artigo');
    expect(pastaUsada).not.toContain('src/content/posts');
    expect(registrarOrigemDoNotion).toHaveBeenCalledWith('meu-artigo', 'pagina-1');
  });
});
