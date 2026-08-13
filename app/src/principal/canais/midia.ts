import { ipcMain } from 'electron';
import { join } from 'node:path';
import { CANAIS } from '../../ponte/contrato';
import { salvarImagemOtimizada } from '../midia/otimizacao';
import { gerarCapa } from '../midia/capa';
import { pastaDeMidiaDoPost } from '../posts/caminhos';

export function registrarCanaisMidia(): void {
  ipcMain.handle(
    CANAIS.midiaSalvarImagem,
    async (_evento, slug: string, nomeBase: string, bytes: ArrayBuffer): Promise<string> => {
      const nomeArquivo = await salvarImagemOtimizada(
        Buffer.from(bytes),
        pastaDeMidiaDoPost(slug),
        nomeBase,
      );
      return `./${slug}/${nomeArquivo}`;
    },
  );

  ipcMain.handle(
    CANAIS.midiaGerarCapa,
    async (_evento, slug: string, titulo: string, descricao: string): Promise<string> => {
      const nomeArquivo = 'capa.jpg';
      const destino = join(pastaDeMidiaDoPost(slug), nomeArquivo);
      await gerarCapa(titulo, descricao, destino);
      return `./${slug}/${nomeArquivo}`;
    },
  );
}
