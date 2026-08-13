import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { caminhoDoPost, pastaDeMidiaDoPost, RAIZ_DO_BLOG } from '../posts/caminhos';
import { rodarGate } from './gate';
import { git, haAlgoEmStage, ComandoGitFalhou } from './git';

export type EtapaDePublicacao = 'gate' | 'pull' | 'add' | 'commit' | 'push';

export interface ResultadoDaPublicacao {
  sucesso: boolean;
  /** `true` quando não havia nada para publicar (arquivos já commitados). */
  semMudanca?: boolean;
  etapaComFalha?: EtapaDePublicacao;
  detalhe: string;
}

/**
 * Publica um post: gate de qualidade → `pull --rebase` → `add` só dos
 * arquivos daquele post → commit → push.
 *
 * O `add` seletivo (nunca `git add -A`) é o que protege o trabalho de outros
 * agentes e edições manuais soltas no mesmo repositório — decisão registrada
 * no IA.md. Qualquer etapa que falhar interrompe a publicação e devolve a
 * saída real do comando, sem tentar "consertar" nada sozinho.
 */
export async function publicarPost(slug: string, titulo: string): Promise<ResultadoDaPublicacao> {
  const gate = await rodarGate(RAIZ_DO_BLOG);
  if (!gate.sucesso) {
    return { sucesso: false, etapaComFalha: 'gate', detalhe: gate.saida };
  }

  try {
    await git(['pull', '--rebase'], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'pull', detalhe: mensagemDoErro(erro) };
  }

  const caminhosParaAdicionar = [relative(RAIZ_DO_BLOG, caminhoDoPost(slug))];
  const pastaMidia = pastaDeMidiaDoPost(slug);
  if (existsSync(pastaMidia)) {
    caminhosParaAdicionar.push(relative(RAIZ_DO_BLOG, pastaMidia));
  }

  try {
    await git(['add', '--', ...caminhosParaAdicionar], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'add', detalhe: mensagemDoErro(erro) };
  }

  if (!(await haAlgoEmStage(RAIZ_DO_BLOG))) {
    return { sucesso: true, semMudanca: true, detalhe: 'Nada para publicar — o post já está igual ao commit atual.' };
  }

  try {
    await git(['commit', '-m', `post: ${titulo}`], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'commit', detalhe: mensagemDoErro(erro) };
  }

  try {
    await git(['push'], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'push', detalhe: mensagemDoErro(erro) };
  }

  return { sucesso: true, detalhe: 'Publicado.' };
}

function mensagemDoErro(erro: unknown): string {
  return erro instanceof ComandoGitFalhou ? erro.message : String(erro);
}
