/**
 * Chave do `localStorage` onde fica a escolha do botão "Pausar animações"
 * (`PausarAnimacoes.astro`). O valor guardado é `pausadas`; sem ele, as
 * animações rodam. O script do `<head>` (`BaseLayout.astro`) lê a mesma chave
 * antes da primeira pintura.
 */
export const CHAVE_ANIMACOES = 'felixo-blog:animacoes';
