/**
 * Contrato IPC entre a janela (`interface/`) e o processo privilegiado
 * (`principal/`).
 *
 * Este é o ÚNICO jeito da interface tocar disco, git ou rede. Cada canal é
 * nomeado e tipado aqui, dos dois lados — nunca exponha `ipcRenderer` cru
 * para o React (`nodeIntegration: false`, `contextIsolation: true` no
 * `BrowserWindow`). Se um markdown importado do Notion contiver algo hostil,
 * ele fica preso na renderização de texto: não há ponte genérica por onde
 * escapar para o sistema de arquivos.
 */
import type { Frontmatter } from '../principal/posts/esquema';
import type { ConfiguracaoNotion } from '../principal/config/armazenamento';
import type { InfoDaDatabase } from '../principal/notion/descoberta';
import type { ArtigoDoNotion } from '../principal/notion/paginasDaDatabase';
import type { ArtigoImportado } from '../principal/notion/importacao';

export interface ResumoDePost {
  slug: string;
  frontmatter: Frontmatter;
}

export interface PostCompleto extends ResumoDePost {
  corpo: string;
}

export type { ConfiguracaoNotion, InfoDaDatabase, ArtigoDoNotion, ArtigoImportado };

/** Nomes dos canais IPC. Um único lugar para não duplicar strings soltas. */
export const CANAIS = {
  versaoApp: 'app:versao',
  postsListar: 'posts:listar',
  postsLer: 'posts:ler',
  postsSalvar: 'posts:salvar',
  notionObterConfiguracao: 'notion:obterConfiguracao',
  notionSalvarConfiguracao: 'notion:salvarConfiguracao',
  notionTestarConexao: 'notion:testarConexao',
  notionListarArtigos: 'notion:listarArtigos',
  notionImportarArtigo: 'notion:importarArtigo',
  midiaSalvarImagem: 'midia:salvarImagem',
  midiaGerarCapa: 'midia:gerarCapa',
} as const;

/** Formato do objeto que `window.felixoEditor` expõe ao React. */
export interface PonteFelixoEditor {
  /** Versão do Felixo Editor (do `package.json`), para exibir no rodapé. */
  obterVersaoApp: () => Promise<string>;
  /** Lista os posts existentes em `src/content/posts/`, mais recente primeiro. */
  listarPosts: () => Promise<ResumoDePost[]>;
  /** Lê um post pelo slug (nome do arquivo sem `.md`). */
  lerPost: (slug: string) => Promise<PostCompleto>;
  /** Valida e grava um post. Lança erro se o frontmatter não bater o schema. */
  salvarPost: (slug: string, frontmatter: unknown, corpo: string) => Promise<void>;
  /** Lê o token/database ID salvos (não passa pelo repositório versionado). */
  obterConfiguracaoNotion: () => Promise<ConfiguracaoNotion>;
  /** Grava a configuração do Notion no `.env` local do app. */
  salvarConfiguracaoNotion: (config: ConfiguracaoNotion) => Promise<void>;
  /** Testa a conexão: busca a database configurada e lista suas propriedades. */
  testarConexaoNotion: () => Promise<InfoDaDatabase>;
  /** Lista os artigos (páginas) da database configurada. */
  listarArtigosNotion: () => Promise<ArtigoDoNotion[]>;
  /** Importa um artigo do Notion como título + Markdown, baixando as imagens para `slug`. */
  importarArtigoNotion: (pageId: string, slug: string) => Promise<ArtigoImportado>;
  /** Salva uma imagem colada/arrastada no editor (otimizada para webp). Devolve o link relativo. */
  salvarImagemDoPost: (slug: string, nomeBase: string, bytes: ArrayBuffer) => Promise<string>;
  /** Gera a capa do post via scripts/gerar-og-image.py. Devolve o link relativo. */
  gerarCapaDoPost: (slug: string, titulo: string, descricao: string) => Promise<string>;
}

declare global {
  interface Window {
    felixoEditor: PonteFelixoEditor;
  }
}
