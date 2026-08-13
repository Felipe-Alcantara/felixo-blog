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

export interface ResumoDePost {
  slug: string;
  frontmatter: Frontmatter;
}

export interface PostCompleto extends ResumoDePost {
  corpo: string;
}

/** Nomes dos canais IPC. Um único lugar para não duplicar strings soltas. */
export const CANAIS = {
  versaoApp: 'app:versao',
  postsListar: 'posts:listar',
  postsLer: 'posts:ler',
  postsSalvar: 'posts:salvar',
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
}

declare global {
  interface Window {
    felixoEditor: PonteFelixoEditor;
  }
}
