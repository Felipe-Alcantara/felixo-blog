import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { caminhoDoPost, pastaDeMidiaDoPost, RAIZ_DO_BLOG } from '../posts/caminhos';
import {
  copiarRascunhoParaOsPosts,
  existeRascunho,
  removerRascunho,
  type CopiaParaOsPosts,
} from '../posts/rascunhos';
import { rodarGate } from './gate';
import { git, haAlgoEmStage, ComandoGitFalhou } from './git';

export type EtapaDePublicacao = 'copiar' | 'gate' | 'pull' | 'add' | 'commit' | 'push';

export interface ResultadoDaPublicacao {
  sucesso: boolean;
  /** `true` quando não havia nada para publicar (arquivos já commitados). */
  semMudanca?: boolean;
  etapaComFalha?: EtapaDePublicacao;
  detalhe: string;
}

/**
 * Publica um post: `pull --rebase` → copia o rascunho para `src/content/posts/`
 * → gate de qualidade → `add` só dos arquivos daquele post → commit → push →
 * apaga o rascunho.
 *
 * O texto não publicado vive em `app/rascunhos/` (ignorada pelo git) e só chega
 * à pasta pública aqui, porque o gate e o `add` precisam dele lá. Se o gate, o
 * `add` ou o commit falharem, a cópia é desfeita e o rascunho continua intacto,
 * para tentar de novo. Se o push falhar, o commit fica e o rascunho também.
 *
 * O `pull` vem antes da cópia porque o `git pull --rebase` recusa uma árvore
 * com arquivo rastreado modificado, e editar um post já publicado modifica um.
 *
 * O `add` seletivo (nunca `git add -A`) é o que protege o trabalho de outros
 * agentes e edições manuais soltas no mesmo repositório — decisão registrada
 * no IA.md. Qualquer etapa que falhar interrompe a publicação e devolve a
 * saída real do comando, sem tentar "consertar" nada sozinho.
 */
export async function publicarPost(slug: string, titulo: string): Promise<ResultadoDaPublicacao> {
  const temRascunho = existeRascunho(slug);
  if (!temRascunho && !existsSync(caminhoDoPost(slug))) {
    return {
      sucesso: false,
      etapaComFalha: 'copiar',
      detalhe: `Não há rascunho nem post publicado com o slug "${slug}".`,
    };
  }

  try {
    await git(['pull', '--rebase'], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'pull', detalhe: mensagemDoErro(erro) };
  }

  let copia: CopiaParaOsPosts | null = null;
  if (temRascunho) {
    try {
      copia = await copiarRascunhoParaOsPosts(slug);
    } catch (erro) {
      return { sucesso: false, etapaComFalha: 'copiar', detalhe: mensagemDoErro(erro) };
    }
  }

  const gate = await rodarGate(RAIZ_DO_BLOG);
  if (!gate.sucesso) {
    await copia?.desfazer();
    return { sucesso: false, etapaComFalha: 'gate', detalhe: gate.saida };
  }

  const caminhosParaAdicionar = [relative(RAIZ_DO_BLOG, caminhoDoPost(slug))];
  const pastaMidia = pastaDeMidiaDoPost(slug);
  if (existsSync(pastaMidia)) {
    caminhosParaAdicionar.push(relative(RAIZ_DO_BLOG, pastaMidia));
  }

  /** Tira o post do stage (se chegou lá) e da pasta pública: a publicação não aconteceu. */
  const abortar = async (): Promise<void> => {
    await git(['reset', '-q', '--', ...caminhosParaAdicionar], RAIZ_DO_BLOG).catch(() => undefined);
    await copia?.desfazer();
  };

  try {
    await git(['add', '--', ...caminhosParaAdicionar], RAIZ_DO_BLOG);
  } catch (erro) {
    await abortar();
    return { sucesso: false, etapaComFalha: 'add', detalhe: mensagemDoErro(erro) };
  }

  if (!(await haAlgoEmStage(RAIZ_DO_BLOG))) {
    await removerRascunho(slug);
    return { sucesso: true, semMudanca: true, detalhe: 'Nada para publicar — o post já está igual ao commit atual.' };
  }

  try {
    await git(['commit', '-m', `post: ${titulo}`], RAIZ_DO_BLOG);
  } catch (erro) {
    await abortar();
    return { sucesso: false, etapaComFalha: 'commit', detalhe: mensagemDoErro(erro) };
  }

  try {
    await git(['push'], RAIZ_DO_BLOG);
  } catch (erro) {
    return { sucesso: false, etapaComFalha: 'push', detalhe: mensagemDoErro(erro) };
  }

  await removerRascunho(slug);
  return { sucesso: true, detalhe: 'Publicado.' };
}

function mensagemDoErro(erro: unknown): string {
  return erro instanceof ComandoGitFalhou ? erro.message : String(erro);
}
