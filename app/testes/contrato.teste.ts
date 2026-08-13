import { describe, expect, it } from 'vitest';
import { CANAIS } from '../src/ponte/contrato';

describe('contrato IPC', () => {
  it('define um nome de canal para cada função exposta na ponte', () => {
    // Guarda contra regressão boba: canal duplicado ou vazio quebraria o
    // roteamento de IPC em silêncio (o handler errado responderia).
    const nomes = Object.values(CANAIS);
    expect(nomes.length).toBeGreaterThan(0);
    expect(new Set(nomes).size).toBe(nomes.length);
    for (const nome of nomes) {
      expect(nome).toMatch(/^[a-z]+:[a-zA-Z]+$/);
    }
  });
});
