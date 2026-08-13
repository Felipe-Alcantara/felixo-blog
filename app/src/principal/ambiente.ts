/** Se o app está rodando via `electron-vite dev` (renderer servido por Vite). */
export const is = {
  dev: process.env['NODE_ENV'] === 'development' || !!process.env['ELECTRON_RENDERER_URL'],
};
