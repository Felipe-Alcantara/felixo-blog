import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export class ComandoGitFalhou extends Error {
  constructor(
    public readonly comando: string[],
    public readonly stderr: string,
  ) {
    super(`git ${comando.join(' ')} falhou: ${stderr.trim() || '(sem saída de erro)'}`);
  }
}

/** Roda um comando git no diretório informado. Lança `ComandoGitFalhou` com o stderr real em caso de erro. */
export async function git(args: string[], cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd });
    return stdout;
  } catch (erro) {
    const stderr = (erro as { stderr?: string }).stderr ?? String(erro);
    throw new ComandoGitFalhou(args, stderr);
  }
}

/**
 * `true` se há algo em stage (depois de um `git add`) pronto para commit.
 *
 * `git diff --cached --quiet` sai com código 1 quando HÁ diferença — não é
 * erro. Qualquer outro código (128, "not a git repository" etc.) é erro de
 * verdade e precisa continuar subindo, não virar falso silencioso.
 */
export async function haAlgoEmStage(cwd: string): Promise<boolean> {
  try {
    await execFileAsync('git', ['diff', '--cached', '--quiet'], { cwd });
    return false;
  } catch (erro) {
    if ((erro as { code?: number }).code === 1) return true;
    throw new ComandoGitFalhou(['diff', '--cached', '--quiet'], String((erro as { stderr?: string }).stderr ?? erro));
  }
}
