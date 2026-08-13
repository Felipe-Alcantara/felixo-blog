import { app, BrowserWindow } from 'electron';
import { criarJanelaPrincipal } from './janela';
import { registrarCanaisApp } from './canais/appInfo';
import { registrarCanaisPosts } from './canais/posts';
import { registrarCanaisNotion } from './canais/notion';
import { carregarConfiguracao } from './config/armazenamento';

/**
 * Ponto de entrada do processo principal (main) do Felixo Editor.
 *
 * Responsabilidade: subir a janela e registrar os handlers IPC. Lógica de
 * negócio (Notion, posts, mídia, publicação) fica em seus próprios módulos
 * sob `principal/`, nunca aqui — este arquivo só orquestra.
 */
void app.whenReady().then(() => {
  carregarConfiguracao();
  registrarCanaisApp();
  registrarCanaisPosts();
  registrarCanaisNotion();
  criarJanelaPrincipal();

  app.on('activate', () => {
    // Padrão macOS: recriar a janela ao clicar no ícone do dock sem janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) {
      criarJanelaPrincipal();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
