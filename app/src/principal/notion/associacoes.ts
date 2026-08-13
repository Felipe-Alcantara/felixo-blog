import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Lembra de qual página do Notion cada post local veio, para a escrita de
 * volta (status + URL) depois de publicar saber em qual página mexer.
 *
 * Fica num JSON local fora do repositório versionado (mesma pasta do
 * `.env`) — não é conteúdo do blog, é estado interno do app.
 */
export const CAMINHO_ASSOCIACOES_PADRAO = join(__dirname, '..', '..', '..', '.notion-associacoes.json');

type Associacoes = Record<string, string>; // slug -> pageId

async function ler(caminho: string): Promise<Associacoes> {
  if (!existsSync(caminho)) return {};
  try {
    return JSON.parse(await readFile(caminho, 'utf-8')) as Associacoes;
  } catch {
    return {};
  }
}

export async function registrarOrigemDoNotion(
  slug: string,
  pageId: string,
  caminho: string = CAMINHO_ASSOCIACOES_PADRAO,
): Promise<void> {
  const associacoes = await ler(caminho);
  associacoes[slug] = pageId;
  await writeFile(caminho, JSON.stringify(associacoes, null, 2), 'utf-8');
}

export async function obterOrigemDoNotion(
  slug: string,
  caminho: string = CAMINHO_ASSOCIACOES_PADRAO,
): Promise<string | null> {
  const associacoes = await ler(caminho);
  return associacoes[slug] ?? null;
}
