/**
 * Monta um caminho interno respeitando o `base` configurado no Astro.
 *
 * Necessário porque o site roda em dois endereços: na raiz do domínio próprio
 * (`blog.felixo.com.br/posts/x/`) e numa subpasta no GitHub Pages
 * (`felipe-alcantara.github.io/felixo-blog/posts/x/`). Escrever `/posts/x/` na
 * mão quebra o segundo caso — use sempre esta função.
 */
export function caminho(destino: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpo = destino.startsWith('/') ? destino : `/${destino}`;
  return `${base}${limpo}`;
}
