import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

/**
 * Configuração do electron-vite: três alvos de build, um por processo.
 *
 * `principal` (main) e `ponte` (preload) rodam em Node e podem tocar disco,
 * git e rede — por isso `externalizeDepsPlugin()`, que mantém as
 * dependências como `require` em vez de empacotá-las. `interface` (renderer)
 * é a única parte que roda no Chromium da janela e nunca deve importar nada
 * de `principal/` diretamente: toda comunicação passa pelo contrato exposto
 * em `ponte/`.
 */
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/principal',
      rollupOptions: {
        input: resolve(__dirname, 'src/principal/index.ts'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/ponte',
      rollupOptions: {
        input: resolve(__dirname, 'src/ponte/index.ts'),
        // CJS explícito: preload com sandbox ativo (ver `janela.ts`) espera
        // `.js`/CommonJS, independente do `"type": "module"` do package.json.
        output: { format: 'cjs', entryFileNames: 'index.js' },
      },
    },
  },
  renderer: {
    root: 'src/interface',
    build: {
      outDir: 'dist-electron/interface',
      rollupOptions: {
        input: resolve(__dirname, 'src/interface/index.html'),
      },
    },
    plugins: [react()],
  },
});
