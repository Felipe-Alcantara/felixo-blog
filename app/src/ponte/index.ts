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
  obterConfiguracaoNotion: () => ipcRenderer.invoke(CANAIS.notionObterConfiguracao),
  salvarConfiguracaoNotion: (config) =>
    ipcRenderer.invoke(CANAIS.notionSalvarConfiguracao, config),
  testarConexaoNotion: () => ipcRenderer.invoke(CANAIS.notionTestarConexao),
  listarArtigosNotion: () => ipcRenderer.invoke(CANAIS.notionListarArtigos),
  importarArtigoNotion: (pageId, slug) =>
    ipcRenderer.invoke(CANAIS.notionImportarArtigo, pageId, slug),
  salvarImagemDoPost: (slug, nomeBase, bytes) =>
    ipcRenderer.invoke(CANAIS.midiaSalvarImagem, slug, nomeBase, bytes),
  gerarCapaDoPost: (slug, titulo, descricao) =>
    ipcRenderer.invoke(CANAIS.midiaGerarCapa, slug, titulo, descricao),
};

contextBridge.exposeInMainWorld('felixoEditor', ponte);
