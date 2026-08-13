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
      if (resultado.object === 'page' && 'properties' in resultado) {
        artigos.push({ id: resultado.id, titulo: extrairTitulo(resultado) });
      }
    }
    cursor = pagina.has_more ? (pagina.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return artigos;
}
