import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  caminhoDoPost,
  caminhoDoRascunho,
  pastaDeMidiaDoPost,
  pastaDeMidiaDoRascunho,
} from './caminhos';

export function existeRascunho(slug: string): boolean {
  return existsSync(caminhoDoRascunho(slug));
}

export interface CopiaParaOsPosts {
  /** Devolve `src/content/posts/` ao que era antes da cópia (apaga o que criou, restaura o que sobrescreveu). */
  desfazer: () => Promise<void>;
}

/** Todos os arquivos de uma pasta, com o caminho relativo a ela (percorre as subpastas). */
async function arquivosDaPasta(pasta: string, prefixo = ''): Promise<string[]> {
  const entradas = await readdir(join(pasta, prefixo), { withFileTypes: true });
  const arquivos: string[] = [];
  for (const entrada of entradas) {
    const relativo = join(prefixo, entrada.name);
    if (entrada.isDirectory()) arquivos.push(...(await arquivosDaPasta(pasta, relativo)));
    else if (entrada.isFile()) arquivos.push(relativo);
  }
  return arquivos;
}

/**
 * Copia o rascunho (o `.md` e a pasta de imagens) para `src/content/posts/`,
 * mantendo o rascunho onde está. É o primeiro passo do "Publicar": o gate de
 * qualidade e o `git add` só enxergam o post depois de ele estar na pasta
 * pública. Se um passo seguinte falhar, `desfazer()` tira o post de lá, para o
 * texto não publicado não ficar numa pasta rastreável do repositório.
 */
export async function copiarRascunhoParaOsPosts(slug: string): Promise<CopiaParaOsPosts> {
  if (!existeRascunho(slug)) {
    throw new Error(`Não há rascunho de "${slug}" para publicar.`);
  }

  const copiados: { destino: string; anterior: Buffer | null }[] = [];
  const pastasCriadas: string[] = [];

  const desfazer = async (): Promise<void> => {
    for (const { destino, anterior } of copiados.reverse()) {
      if (anterior) await writeFile(destino, anterior);
      else await rm(destino, { force: true });
    }
    for (const pasta of pastasCriadas) {
      await rm(pasta, { recursive: true, force: true });
    }
  };

  const copiar = async (origem: string, destino: string): Promise<void> => {
    const criada = await mkdir(dirname(destino), { recursive: true });
    if (criada) pastasCriadas.push(criada);
    const anterior = existsSync(destino) ? await readFile(destino) : null;
    await copyFile(origem, destino);
    copiados.push({ destino, anterior });
  };

  try {
    await copiar(caminhoDoRascunho(slug), caminhoDoPost(slug));

    const midia = pastaDeMidiaDoRascunho(slug);
    if (existsSync(midia)) {
      for (const relativo of await arquivosDaPasta(midia)) {
        await copiar(join(midia, relativo), join(pastaDeMidiaDoPost(slug), relativo));
      }
    }
  } catch (erro) {
    await desfazer();
    throw erro;
  }

  return { desfazer };
}

/** Apaga o rascunho (o `.md` e a pasta de imagens). Não falha se não houver nada. */
export async function removerRascunho(slug: string): Promise<void> {
  await rm(caminhoDoRascunho(slug), { force: true });
  await rm(pastaDeMidiaDoRascunho(slug), { recursive: true, force: true });
}
