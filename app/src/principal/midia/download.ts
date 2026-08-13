import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { ImagemEncontrada } from '../notion/blocos';

const EXTENSAO_PADRAO = '.png';

function extensaoDaUrl(url: string): string {
  try {
    const caminho = new URL(url).pathname;
    const ext = extname(caminho);
    return ext || EXTENSAO_PADRAO;
  } catch {
    return EXTENSAO_PADRAO;
  }
}

/**
 * Baixa as imagens hospedadas no Notion (URLs pré-assinadas do S3, que
 * expiram em cerca de 1h — por isso baixamos na importação em vez de linkar
 * direto) para `pastaDestino`, e devolve o markdown com os links já
 * apontando para o caminho relativo local (`./<slug>/nome.ext`).
 */
export async function baixarImagensDoArtigo(
  markdown: string,
  imagens: ImagemEncontrada[],
  pastaDestino: string,
  slug: string,
): Promise<string> {
  if (imagens.length === 0) return markdown;

  await mkdir(pastaDestino, { recursive: true });

  let resultado = markdown;
  let indice = 0;
  for (const imagem of imagens) {
    indice += 1;
    const nomeArquivo = `notion-${String(indice).padStart(2, '0')}${extensaoDaUrl(imagem.url)}`;
    const destino = join(pastaDestino, nomeArquivo);

    const resposta = await fetch(imagem.url);
    if (!resposta.ok) {
      throw new Error(`Falha ao baixar imagem do Notion (HTTP ${resposta.status}): ${imagem.url}`);
    }
    const bytes = Buffer.from(await resposta.arrayBuffer());
    await writeFile(destino, bytes);

    resultado = resultado.replaceAll(imagem.url, `./${slug}/${nomeArquivo}`);
  }

  return resultado;
}
