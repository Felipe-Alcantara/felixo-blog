import { join } from 'node:path';
import { BrowserWindow, shell } from 'electron';
import { is } from './ambiente';

/**
 * Cria a janela principal do Felixo Editor com o isolamento de segurança
 * que sustenta todo o contrato de `ponte/`: sem integração direta de Node
 * no renderer, contexto isolado, sandbox ativo.
 */
export function criarJanelaPrincipal(): BrowserWindow {
  const janela = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#09090b', // zinc-950, mesmo fundo escuro do blog
    webPreferences: {
      preload: join(__dirname, '../ponte/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  janela.once('ready-to-show', () => janela.show());

  // Qualquer link externo (ex.: abrir o post publicado) vai pro navegador
  // do sistema, nunca para dentro da janela do Electron.
  janela.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void janela.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    void janela.loadFile(join(__dirname, '../interface/index.html'));
  }

  return janela;
}
