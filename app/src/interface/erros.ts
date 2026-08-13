/**
 * Interpreta erros que chegam do processo principal via IPC e os transforma
 * em orientação acionável ("o que corrigir", campo por campo) em vez de
 * mostrar a string crua na tela.
 *
 * O Electron embrulha todo erro de `ipcMain.handle` numa mensagem padrão
 * (`Error invoking remote method 'x': Error: <mensagem original>`). As
 * mensagens de validação de post seguem o formato `campo: motivo` (um ou
 * mais, separados por `; `) — ver `PostInvalidoError` em
 * `principal/posts/repositorio.ts`. Quando o formato bate, viramos isso numa
 * lista de passos; quando não bate (erro de rede, de git, etc.), devolvemos
 * `null` e quem chama mostra a mensagem como está.
 */

/** Nome técnico do campo → rótulo mostrado na tela, na mesma ordem do formulário. */
const RÓTULO_DO_CAMPO: Record<string, string> = {
  titulo: 'Título',
  descricao: 'Descrição',
  publicadoEm: 'Publicado em',
  tags: 'Tags',
  rascunho: 'Rascunho',
  capa: 'Capa',
};

export interface PassoDeCorrecao {
  campo: string;
  rotulo: string;
  motivo: string;
}

/** Remove o embrulho padrão do Electron (`Error invoking remote method '...': Error: ...`). */
export function limparMensagemDoIpc(mensagem: string): string {
  const casada = mensagem.match(/Error invoking remote method '[^']+':\s*(?:Error:\s*)?([\s\S]+)/);
  return (casada ? casada[1] : mensagem).trim();
}

/**
 * Extrai uma mensagem de erro pronta pra tela a partir do que qualquer
 * `catch` recebe — já sem o embrulho do Electron. Usar em todo lugar em vez
 * de repetir `e instanceof Error ? e.message : String(e)`.
 */
export function mensagemDeErro(erro: unknown): string {
  const bruta = erro instanceof Error ? erro.message : String(erro);
  return limparMensagemDoIpc(bruta);
}

/**
 * Devolve os passos de correção quando a mensagem é uma validação de
 * frontmatter conhecida (`campo: motivo; campo: motivo`). Devolve `null`
 * para qualquer outro formato de erro — não force uma interpretação errada.
 */
export function interpretarErroDeValidacao(mensagemBruta: string): PassoDeCorrecao[] | null {
  const mensagem = limparMensagemDoIpc(mensagemBruta);
  const partes = mensagem
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  if (partes.length === 0) return null;

  const passos: PassoDeCorrecao[] = [];
  for (const parte of partes) {
    const separador = parte.indexOf(':');
    if (separador === -1) return null;

    const campo = parte.slice(0, separador).trim();
    const motivo = parte.slice(separador + 1).trim();
    const rotulo = RÓTULO_DO_CAMPO[campo];
    if (!rotulo || !motivo) return null;

    passos.push({ campo, rotulo, motivo });
  }

  return passos;
}
