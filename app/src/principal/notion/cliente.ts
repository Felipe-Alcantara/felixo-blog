import { Client, APIResponseError } from '@notionhq/client';

export class ConfiguracaoNotionAusente extends Error {
  constructor() {
    super('NOTION_TOKEN não configurado. Preencha em Configurações.');
  }
}

export function criarClienteNotion(token: string): Client {
  if (!token.trim()) {
    throw new ConfiguracaoNotionAusente();
  }
  return new Client({ auth: token });
}

interface OpcoesRetry {
  tentativas?: number;
  esperaBaseMs?: number;
}

/**
 * Retry com backoff exponencial para chamadas à API do Notion, respeitando
 * `Retry-After` quando presente. Só repete em erros transitórios (429/5xx) —
 * conforme o guia de integração: `POST` (criação) só pode repetir nesses
 * casos para não duplicar; aqui usamos só para leitura, então é seguro
 * repetir sempre que o erro for transitório.
 */
export async function comRetry<T>(
  chamada: () => Promise<T>,
  opcoes: OpcoesRetry = {},
): Promise<T> {
  const tentativas = opcoes.tentativas ?? 4;
  const esperaBaseMs = opcoes.esperaBaseMs ?? 500;

  let ultimoErro: unknown;
  for (let tentativa = 0; tentativa < tentativas; tentativa++) {
    try {
      return await chamada();
    } catch (erro) {
      ultimoErro = erro;
      if (!erroTransitorio(erro) || tentativa === tentativas - 1) {
        throw erro;
      }
      const espera = tempoDeEspera(erro, tentativa, esperaBaseMs);
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }
  throw ultimoErro;
}

function erroTransitorio(erro: unknown): boolean {
  if (erro instanceof APIResponseError) {
    return erro.status === 429 || erro.status >= 500;
  }
  return false;
}

function tempoDeEspera(erro: unknown, tentativa: number, esperaBaseMs: number): number {
  const retryAfter = obterRetryAfter(erro);
  if (retryAfter !== null) {
    const segundos = Number(retryAfter);
    if (!Number.isNaN(segundos)) return segundos * 1000;
  }
  return esperaBaseMs * 2 ** tentativa;
}

/**
 * `erro.headers` vem como `Headers` da Fetch API em produção (com `.get()`),
 * mas os testes mockam um objeto simples — aceitamos os dois formatos.
 */
function obterRetryAfter(erro: unknown): string | null {
  const headers = (erro as { headers?: unknown })?.headers;
  if (!headers) return null;
  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get('retry-after');
  }
  return (headers as Record<string, string>)['retry-after'] ?? null;
}
