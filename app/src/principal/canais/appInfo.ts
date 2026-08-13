import { app, ipcMain } from 'electron';
import { CANAIS } from '../../ponte/contrato';

/** Registra os handlers IPC do canal `app:*`. */
export function registrarCanaisApp(): void {
  ipcMain.handle(CANAIS.versaoApp, () => app.getVersion());
}
