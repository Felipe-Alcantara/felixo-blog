import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { config as carregarDotenv } from 'dotenv';

export interface ConfiguracaoNotion {
  notionToken: string;
  notionDatabaseId: string;
}

/** Caminho do `.env` do app — fora do repositório versionado, ver `.gitignore` da raiz. */
export const CAMINHO_ENV_PADRAO = join(__dirname, '..', '..', '..', '.env');

/** Carrega o `.env` do app para `process.env`, se existir. Chamar uma vez, na inicialização. */
export function carregarConfiguracao(caminhoEnv: string = CAMINHO_ENV_PADRAO): void {
  if (existsSync(caminhoEnv)) {
    carregarDotenv({ path: caminhoEnv });
  }
}

export function lerConfiguracaoAtual(): ConfiguracaoNotion {
  return {
    notionToken: process.env['NOTION_TOKEN'] ?? '',
    notionDatabaseId: process.env['NOTION_DATABASE_ID'] ?? '',
  };
}

/**
 * Grava `NOTION_TOKEN`/`NOTION_DATABASE_ID` no `.env` do app e atualiza
 * `process.env` na hora, sem exigir reiniciar o app. Recebe o caminho por
 * parâmetro (em vez de fixo) para que o teste grave num arquivo temporário
 * e nunca sobrescreva um `.env` real de quem estiver rodando a suíte.
 */
export async function salvarConfiguracao(
  config: ConfiguracaoNotion,
  caminhoEnv: string = CAMINHO_ENV_PADRAO,
): Promise<void> {
  const conteudo = [
    '# Gerado pelo Felixo Editor — não commitar (ver .gitignore da raiz).',
    `NOTION_TOKEN=${config.notionToken}`,
    `NOTION_DATABASE_ID=${config.notionDatabaseId}`,
    '',
  ].join('\n');

  await writeFile(caminhoEnv, conteudo, 'utf-8');
  process.env['NOTION_TOKEN'] = config.notionToken;
  process.env['NOTION_DATABASE_ID'] = config.notionDatabaseId;
}
