import { ipcMain } from 'electron';
import { CANAIS } from '../../ponte/contrato';
import {
  lerConfiguracaoAtual,
  salvarConfiguracao,
  type ConfiguracaoNotion,
} from '../config/armazenamento';
import { criarClienteNotion } from '../notion/cliente';
import { obterInfoDaDatabase, type InfoDaDatabase } from '../notion/descoberta';

export function registrarCanaisNotion(): void {
  ipcMain.handle(CANAIS.notionObterConfiguracao, () => lerConfiguracaoAtual());

  ipcMain.handle(
    CANAIS.notionSalvarConfiguracao,
    (_evento, config: ConfiguracaoNotion) => salvarConfiguracao(config),
  );

  ipcMain.handle(CANAIS.notionTestarConexao, async (): Promise<InfoDaDatabase> => {
    const { notionToken, notionDatabaseId } = lerConfiguracaoAtual();
    const cliente = criarClienteNotion(notionToken);
    return obterInfoDaDatabase(cliente, notionDatabaseId);
  });
}
