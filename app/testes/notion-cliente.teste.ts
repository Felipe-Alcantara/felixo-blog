import { describe, expect, it, vi } from 'vitest';
import { APIResponseError, APIErrorCode } from '@notionhq/client';
import { comRetry, criarClienteNotion, ConfiguracaoNotionAusente } from '../src/principal/notion/cliente';

function erroDeStatus(status: number, headers: Record<string, string> = {}): APIResponseError {
  const erro = new APIResponseError({
    code: status === 429 ? APIErrorCode.RateLimited : APIErrorCode.InternalServerError,
    status,
    headers: headers as unknown as Headers,
    message: 'erro simulado',
    rawBodyText: '',
  });
  return erro;
}

describe('criarClienteNotion', () => {
  it('lança ConfiguracaoNotionAusente se o token estiver vazio', () => {
    expect(() => criarClienteNotion('')).toThrow(ConfiguracaoNotionAusente);
    expect(() => criarClienteNotion('   ')).toThrow(ConfiguracaoNotionAusente);
  });

  it('cria o cliente normalmente com token preenchido', () => {
    expect(() => criarClienteNotion('ntn_teste')).not.toThrow();
  });
});

describe('comRetry', () => {
  it('devolve o resultado direto quando não há erro', async () => {
    const resultado = await comRetry(async () => 42);
    expect(resultado).toBe(42);
  });

  it('repete em erro 429 e devolve o resultado da tentativa seguinte', async () => {
    const chamada = vi
      .fn()
      .mockRejectedValueOnce(erroDeStatus(429))
      .mockResolvedValueOnce('ok');

    const resultado = await comRetry(chamada, { esperaBaseMs: 1 });
    expect(resultado).toBe('ok');
    expect(chamada).toHaveBeenCalledTimes(2);
  });

  it('não repete em erro não-transitório (ex.: 401 não mapeado como retry)', async () => {
    const chamada = vi.fn().mockRejectedValue(erroDeStatus(401));
    await expect(comRetry(chamada, { esperaBaseMs: 1 })).rejects.toThrow();
    expect(chamada).toHaveBeenCalledTimes(1);
  });

  it('desiste depois do número de tentativas configurado', async () => {
    const chamada = vi.fn().mockRejectedValue(erroDeStatus(500));
    await expect(comRetry(chamada, { tentativas: 2, esperaBaseMs: 1 })).rejects.toThrow();
    expect(chamada).toHaveBeenCalledTimes(2);
  });

  it('respeita o cabeçalho Retry-After quando presente', async () => {
    const chamada = vi
      .fn()
      .mockRejectedValueOnce(erroDeStatus(429, { 'retry-after': '0' }))
      .mockResolvedValueOnce('ok');

    const inicio = Date.now();
    const resultado = await comRetry(chamada, { esperaBaseMs: 5000 });
    // Com Retry-After: 0, a espera não deve usar o backoff de 5s configurado.
    expect(Date.now() - inicio).toBeLessThan(1000);
    expect(resultado).toBe('ok');
  });
});
