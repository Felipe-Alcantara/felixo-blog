import { spawn } from 'node:child_process';
import { RAIZ_DO_BLOG } from '../posts/caminhos';

export class GeracaoDeCapaFalhou extends Error {}

const CAMINHO_SCRIPT = 'scripts/gerar-og-image.py';

/**
 * Gera a capa de um post chamando `scripts/gerar-og-image.py --titulo ...`
 * (reaproveita o gerador de cartão Open Graph do blog em vez de duplicar a
 * lógica de renderização em JS). Exige Python 3 e Playwright instalados —
 * a mesma dependência "sob demanda" que o script já tinha antes deste app
 * existir; falha com uma mensagem acionável em vez de travar em silêncio.
 */
export async function gerarCapa(titulo: string, descricao: string, saida: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const processo = spawn(
      'python3',
      [CAMINHO_SCRIPT, '--titulo', titulo, '--descricao', descricao, '--saida', saida],
      { cwd: RAIZ_DO_BLOG },
    );

    let stderr = '';
    processo.stderr.on('data', (dado: Buffer) => {
      stderr += dado.toString();
    });

    processo.on('error', (erro) => {
      reject(
        new GeracaoDeCapaFalhou(
          `Não consegui rodar "python3" (${erro.message}). Verifique se o Python 3 está instalado e no PATH.`,
        ),
      );
    });

    processo.on('close', (codigo) => {
      if (codigo === 0) {
        resolve();
      } else {
        reject(
          new GeracaoDeCapaFalhou(
            stderr.trim() ||
              `scripts/gerar-og-image.py terminou com código ${codigo}. Verifique se o Playwright está instalado (pip install playwright && playwright install chromium).`,
          ),
        );
      }
    });
  });
}
