import { contextBridge, ipcRenderer } from 'electron';
import { CANAIS, type PonteFelixoEditor } from './contrato';

/**
 * Preload: roda em contexto isolado, com acesso a Node, mas SEM acesso ao
 * `window` da página. Expõe só as funções do contrato — nada de
 * `ipcRenderer` inteiro, nada de `require` genérico.
 */
const ponte: PonteFelixoEditor = {
  obterVersaoApp: () => ipcRenderer.invoke(CANAIS.versaoApp),
  listarPosts: () => ipcRenderer.invoke(CANAIS.postsListar),
  lerPost: (slug) => ipcRenderer.invoke(CANAIS.postsLer, slug),
  salvarPost: (slug, frontmatter, corpo) =>
    ipcRenderer.invoke(CANAIS.postsSalvar, slug, frontmatter, corpo),
};

contextBridge.exposeInMainWorld('felixoEditor', ponte);
