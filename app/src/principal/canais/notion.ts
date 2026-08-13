import { ipcMain } from 'electron';
import { CANAIS } from '../../ponte/contrato';
import {
  lerConfiguracaoAtual,
  salvarConfiguracao,
  type ConfiguracaoNotion,
} from '../config/armazenamento';
import { criarClienteNotion } from '../notion/cliente';
import { obterInfoDaDatabase, type InfoDaDatabase } from '../notion/descoberta';
import { listarArtigosDaDatabase, type ArtigoDoNotion } from '../notion/paginasDaDatabase';
import { importarArtigo, type ArtigoImportado } from '../notion/importacao';

function clienteConfigurado() {
  const { notionToken, notionDatabaseId } = lerConfiguracaoAtual();
  return { cliente: criarClienteNotion(notionToken), notionDatabaseId };
}

export function registrarCanaisNotion(): void {
  ipcMain.handle(CANAIS.notionObterConfiguracao, () => lerConfiguracaoAtual());

  ipcMain.handle(
    CANAIS.notionSalvarConfiguracao,
    (_evento, config: ConfiguracaoNotion) => salvarConfiguracao(config),
  );

  ipcMain.handle(CANAIS.notionTestarConexao, async (): Promise<InfoDaDatabase> => {
    const { cliente, notionDatabaseId } = clienteConfigurado();
    return obterInfoDaDatabase(cliente, notionDatabaseId);
  });

  ipcMain.handle(CANAIS.notionListarArtigos, async (): Promise<ArtigoDoNotion[]> => {
    const { cliente, notionDatabaseId } = clienteConfigurado();
    return listarArtigosDaDatabase(cliente, notionDatabaseId);
  });

  ipcMain.handle(
    CANAIS.notionImportarArtigo,
    async (_evento, pageId: string, slug: string): Promise<ArtigoImportado> => {
      const { cliente } = clienteConfigurado();
      return importarArtigo(cliente, pageId, slug);
    },
  );
}
