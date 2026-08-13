import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const LARGURA_MAXIMA = 1600;
const QUALIDADE_WEBP = 82;

/**
 * Salva uma imagem colada/arrastada no editor: redimensiona (nunca alarga,
 * só encolhe se passar de `LARGURA_MAXIMA`) e converte para webp — formato
 * menor que PNG/JPEG na maioria dos casos, sem perda visível no post.
 *
 * Devolve o nome do arquivo gravado (não o caminho completo — quem chama já
 * sabe a pasta e monta o link relativo `./slug/arquivo.webp`).
 */
export async function salvarImagemOtimizada(
  bytes: Buffer,
  pastaDestino: string,
  nomeBase: string,
): Promise<string> {
  await mkdir(pastaDestino, { recursive: true });

  const nomeArquivo = `${nomeBase}.webp`;
  await sharp(bytes)
    .resize({ width: LARGURA_MAXIMA, withoutEnlargement: true })
    .webp({ quality: QUALIDADE_WEBP })
    .toFile(join(pastaDestino, nomeArquivo));

  return nomeArquivo;
}
