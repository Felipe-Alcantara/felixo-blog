import type { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { comRetry } from './cliente';

export interface ArtigoDoNotion {
  id: string;
  titulo: string;
}

/** Acha o valor do texto simples da propriedade do tipo `title` (toda database tem uma, nome livre). */
function extrairTitulo(pagina: PageObjectResponse): string {
  for (const prop of Object.values(pagina.properties)) {
    if (prop.type === 'title') {
      return prop.title.map((t) => t.plain_text).join('') || '(sem título)';
    }
  }
  return '(sem título)';
}

const COLUNA_FORMATO = 'Formato';
const FORMATO_ARTIGO = 'artigo';

/**
 * A database "Ideias criativas" guarda vídeos, músicas, prompts e outros
 * formatos além de artigos. Só vira post quem tem Formato = Artigo; linha sem
 * Formato preenchido, ou database sem essa coluna, entra por compatibilidade.
 *
 * shortcut: reconhece a coluna só pelo nome "Formato" e pelo tipo select;
 * renomeá-la volta a listar tudo, e aí o nome passa a vir da configuração.
 */
function ehArtigo(pagina: PageObjectResponse): boolean {
  const formato = pagina.properties[COLUNA_FORMATO];
  if (formato?.type !== 'select' || !formato.select) return true;
  return formato.select.name.toLowerCase() === FORMATO_ARTIGO;
}

/** Lista as páginas (artigos) da database, seguindo a paginação da API. */
export async function listarArtigosDaDatabase(
  client: Client,
  databaseId: string,
): Promise<ArtigoDoNotion[]> {
  const artigos: ArtigoDoNotion[] = [];
  let cursor: string | undefined;

  do {
    const pagina = await comRetry(() =>
      client.databases.query({ database_id: databaseId, start_cursor: cursor }),
    );
    for (const resultado of pagina.results) {
      if (resultado.object === 'page' && 'properties' in resultado && ehArtigo(resultado)) {
        artigos.push({ id: resultado.id, titulo: extrairTitulo(resultado) });
      }
    }
    cursor = pagina.has_more ? (pagina.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return artigos;
}
