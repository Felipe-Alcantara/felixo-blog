import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

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
  const check = await rodarNpm('check', raizDoBlog);
  if (!check.sucesso) return { sucesso: false, etapa: 'check', saida: check.saida };

  const build = await rodarNpm('build', raizDoBlog);
  if (!build.sucesso) return { sucesso: false, etapa: 'build', saida: build.saida };

  return { sucesso: true, saida: `${check.saida}\n${build.saida}` };
}

/**
 * Roda `npm run <script>` por um shell: no Windows o `npm` é o `npm.cmd`, e o
 * Node não o abre sem shell (`npm` puro dá ENOENT; `npm.cmd` dá EINVAL desde a
 * correção do CVE-2024-27980). O script vem de um tipo fechado, nunca de
 * entrada de quem usa o editor, então o shell não abre brecha de injeção.
 */
async function rodarNpm(
  script: 'check' | 'build',
  cwd: string,
): Promise<{ sucesso: boolean; saida: string }> {
  try {
    const { stdout, stderr } = await execAsync(`npm run ${script}`, {
      cwd,
      maxBuffer: 20 * 1024 * 1024,
    });
    return { sucesso: true, saida: `${stdout}\n${stderr}` };
  } catch (erro) {
    const e = erro as { stdout?: string; stderr?: string; message: string };
    return { sucesso: false, saida: `${e.stdout ?? ''}\n${e.stderr ?? e.message}` };
  }
}
