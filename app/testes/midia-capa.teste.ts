import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

const { spawn } = await import('node:child_process');
const { gerarCapa, GeracaoDeCapaFalhou } = await import('../src/principal/midia/capa');

function processoFalso() {
  const processo = new EventEmitter() as EventEmitter & { stderr: EventEmitter };
  processo.stderr = new EventEmitter();
  return processo;
}

describe('gerarCapa', () => {
  it('resolve quando o script termina com código 0', async () => {
    const processo = processoFalso();
    vi.mocked(spawn).mockReturnValue(processo as never);

    const promessa = gerarCapa('Título', 'Descrição', '/tmp/capa.jpg');
    processo.emit('close', 0);

    await expect(promessa).resolves.toBeUndefined();
    expect(spawn).toHaveBeenCalledWith(
      'python3',
      ['scripts/gerar-og-image.py', '--titulo', 'Título', '--descricao', 'Descrição', '--saida', '/tmp/capa.jpg'],
      expect.any(Object),
    );
  });

  it('rejeita com o stderr do script quando ele termina com código != 0', async () => {
    const processo = processoFalso();
    vi.mocked(spawn).mockReturnValue(processo as never);

    const promessa = gerarCapa('T', 'D', '/tmp/capa.jpg');
    processo.stderr.emit('data', Buffer.from('Playwright não está instalado'));
    processo.emit('close', 1);

    await expect(promessa).rejects.toThrow(GeracaoDeCapaFalhou);
    await expect(promessa).rejects.toThrow(/Playwright não está instalado/);
  });

  it('rejeita com mensagem acionável quando "python3" não existe no PATH', async () => {
    const processo = processoFalso();
    vi.mocked(spawn).mockReturnValue(processo as never);

    const promessa = gerarCapa('T', 'D', '/tmp/capa.jpg');
    processo.emit('error', new Error('spawn python3 ENOENT'));

    await expect(promessa).rejects.toThrow(/PATH/);
  });
});
