import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ResultadoDoGate {
  sucesso: boolean;
  etapa?: 'check' | 'build';
  saida: string;
}

/**
 * Roda o mesmo gate do CI (`npm run check` + `npm run build`) na raiz do
 * blog, antes de qualquer commit. Publicar sem isso é o jeito mais rápido de
 * quebrar o site em produção — o botão de publicar fica travado até passar.
 */
export async function rodarGate(raizDoBlog: string): Promise<ResultadoDoGate> {
  const check = await rodarNpm(['run', 'check'], raizDoBlog);
  if (!check.sucesso) return { sucesso: false, etapa: 'check', saida: check.saida };

  const build = await rodarNpm(['run', 'build'], raizDoBlog);
  if (!build.sucesso) return { sucesso: false, etapa: 'build', saida: build.saida };

  return { sucesso: true, saida: `${check.saida}\n${build.saida}` };
}

async function rodarNpm(args: string[], cwd: string): Promise<{ sucesso: boolean; saida: string }> {
  try {
    const { stdout, stderr } = await execFileAsync('npm', args, { cwd, maxBuffer: 20 * 1024 * 1024 });
    return { sucesso: true, saida: `${stdout}\n${stderr}` };
  } catch (erro) {
    const e = erro as { stdout?: string; stderr?: string; message: string };
    return { sucesso: false, saida: `${e.stdout ?? ''}\n${e.stderr ?? e.message}` };
  }
}
