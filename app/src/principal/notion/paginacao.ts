import type { Client } from '@notionhq/client';
import type { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { comRetry } from './cliente';

/**
 * Lista todos os blocos filhos de uma página/bloco, seguindo a paginação da
 * API do Notion (`start_cursor`/`has_more`). Não recursa em blocos com
 * `has_children` — ver limitação registrada em `blocos.ts`.
 */
export async function listarTodosOsBlocos(
  client: Client,
  blockId: string,
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> {
  const blocos: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];
  let cursor: string | undefined;

  do {
    const pagina = await comRetry(() =>
      client.blocks.children.list({ block_id: blockId, start_cursor: cursor }),
    );
    blocos.push(...pagina.results);
    cursor = pagina.has_more ? (pagina.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocos;
}
