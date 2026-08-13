import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ_DO_BLOG } from '../posts/caminhos';

/**
 * Lembra de qual página do Notion cada post local veio, para a escrita de
 * volta (status + URL) depois de publicar saber em qual página mexer.
 *
 * Fica num JSON local fora do repositório versionado (mesma pasta do
 * `.env`) — não é conteúdo do blog, é estado interno do app. Deriva de
 * `RAIZ_DO_BLOG` em vez de contar `../..` a partir deste arquivo — ver o
 * comentário equivalente em `config/armazenamento.ts` (bug real encontrado
 * testando contra o Notion: o electron-vite empacota o processo principal
 * inteiro num único arquivo, então `__dirname` local não reflete a posição
 * original do código-fonte).
 */
export const CAMINHO_ASSOCIACOES_PADRAO = join(RAIZ_DO_BLOG, 'app', '.notion-associacoes.json');

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
