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

/** Nomes dos canais IPC. Um único lugar para não duplicar strings soltas. */
export const CANAIS = {
  versaoApp: 'app:versao',
} as const;

/** Formato do objeto que `window.felixoEditor` expõe ao React. */
export interface PonteFelixoEditor {
  /** Versão do Felixo Editor (do `package.json`), para exibir no rodapé. */
  obterVersaoApp: () => Promise<string>;
}

declare global {
  interface Window {
    felixoEditor: PonteFelixoEditor;
  }
}
