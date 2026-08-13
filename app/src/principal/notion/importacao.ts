import type { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { comRetry } from './cliente';
import { listarTodosOsBlocos } from './paginacao';
import { blocosParaMarkdown } from './blocos';
import { baixarImagensDoArtigo } from '../midia/download';
import { pastaDeMidiaDoPost } from '../posts/caminhos';

export interface ArtigoImportado {
  titulo: string;
  corpo: string;
}

function extrairTitulo(pagina: PageObjectResponse): string {
  for (const prop of Object.values(pagina.properties)) {
    if (prop.type === 'title') {
      return prop.title.map((t) => t.plain_text).join('') || '(sem título)';
    }
  }
  return '(sem título)';
}

/**
 * Importa um artigo do Notion como rascunho local: título + corpo em
 * Markdown, com as imagens do Notion já baixadas para a pasta do post (as
 * URLs do Notion expiram — ver `midia/download.ts`).
 *
 * Não grava nada em `src/content/posts/` — devolve os dados para a tela de
 * edição, onde quem usa preenche descrição/tags e decide salvar. Fonte da
 * verdade continua sendo o `.md`, não o Notion (decisão registrada no IA.md).
 */
export async function importarArtigo(client: Client, pageId: string, slug: string): Promise<ArtigoImportado> {
  const pagina = await comRetry(() => client.pages.retrieve({ page_id: pageId }));
  if (!('properties' in pagina)) {
    throw new Error('Página do Notion sem propriedades — acesso restrito ou página arquivada.');
  }

  const titulo = extrairTitulo(pagina);
  const blocos = await listarTodosOsBlocos(client, pageId);
  const { markdown, imagens } = blocosParaMarkdown(blocos);
  const corpo = await baixarImagensDoArtigo(markdown, imagens, pastaDeMidiaDoPost(slug), slug);

  return { titulo, corpo };
}
