import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rodarGate } from '../src/principal/publicacao/gate';

let pastaTemp: string;

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-gate-'));
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
});

describe('rodarGate', () => {
  it('reporta falha na etapa "check" quando o script check não existe', async () => {
    await writeFile(
      join(pastaTemp, 'package.json'),
      JSON.stringify({ name: 'x', scripts: { build: 'echo build' } }),
    );

    const resultado = await rodarGate(pastaTemp);
    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapa).toBe('check');
  });

  it('roda check e build de verdade quando os dois scripts existem e passam', async () => {
    await writeFile(
      join(pastaTemp, 'package.json'),
      JSON.stringify({
        name: 'x',
        scripts: { check: 'node -e "process.exit(0)"', build: 'node -e "process.exit(0)"' },
      }),
    );

    const resultado = await rodarGate(pastaTemp);
    expect(resultado.sucesso).toBe(true);
  });

  it('reporta falha na etapa "build" quando check passa mas build falha', async () => {
    await writeFile(
      join(pastaTemp, 'package.json'),
      JSON.stringify({
        name: 'x',
        scripts: { check: 'node -e "process.exit(0)"', build: 'node -e "process.exit(1)"' },
      }),
    );

    const resultado = await rodarGate(pastaTemp);
    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapa).toBe('build');
  });
});
