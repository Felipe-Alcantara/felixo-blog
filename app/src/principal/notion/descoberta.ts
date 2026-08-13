import type { Client } from '@notionhq/client';
import { comRetry } from './cliente';

export interface PropriedadeDaDatabase {
  nome: string;
  tipo: string;
}

export interface InfoDaDatabase {
  id: string;
  titulo: string;
  propriedades: PropriedadeDaDatabase[];
}

/**
 * Busca a database pelo ID configurado e lista suas propriedades — passo
 * exigido antes de mapear frontmatter, porque não presumimos nomes de
 * propriedade (a URL que originou este projeto era de página, não de
 * database; o schema real só se sabe perguntando à API).
 */
export async function obterInfoDaDatabase(
  client: Client,
  databaseId: string,
): Promise<InfoDaDatabase> {
  const database = await comRetry(() => client.databases.retrieve({ database_id: databaseId }));

  const titulo =
    'title' in database
      ? database.title.map((t) => t.plain_text).join('')
      : '(sem título)';

  const propriedades: PropriedadeDaDatabase[] =
    'properties' in database
      ? Object.entries(database.properties).map(([nome, prop]) => ({
          nome,
          tipo: prop.type,
        }))
      : [];

  return { id: database.id, titulo, propriedades };
}
