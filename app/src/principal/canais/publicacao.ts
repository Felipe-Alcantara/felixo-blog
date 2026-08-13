import { ipcMain } from 'electron';
import { CANAIS } from '../../ponte/contrato';
import { publicarPost, type ResultadoDaPublicacao } from '../publicacao/publicar';
import { lerConfiguracaoAtual } from '../config/armazenamento';
import { criarClienteNotion } from '../notion/cliente';
import { escreverStatusDeVolta } from '../notion/statusDeVolta';
import { obterOrigemDoNotion } from '../notion/associacoes';
import { SITE } from '../../../../src/config/site';

export function registrarCanaisPublicacao(): void {
  ipcMain.handle(
    CANAIS.publicarPost,
    async (_evento, slug: string, titulo: string): Promise<ResultadoDaPublicacao> => {
      const resultado = await publicarPost(slug, titulo);

      if (resultado.sucesso && !resultado.semMudanca) {
        await tentarEscreverDeVoltaNoNotion(slug);
      }

      return resultado;
    },
  );
}

/**
 * Best-effort: se o post veio de uma importação do Notion, atualiza URL e
 * status. Falha aqui vira aviso no `detalhe` retornado depois de já ter
 * publicado no blog, nunca desfaz a publicação — o post já está no ar.
 */
async function tentarEscreverDeVoltaNoNotion(slug: string): Promise<void> {
  const pageId = await obterOrigemDoNotion(slug);
  if (!pageId) return;

  const { notionToken, notionDatabaseId } = lerConfiguracaoAtual();
  if (!notionToken || !notionDatabaseId) return;

  try {
    const cliente = criarClienteNotion(notionToken);
    const url = `${SITE.url}/posts/${slug}/`;
    await escreverStatusDeVolta(cliente, pageId, notionDatabaseId, url);
  } catch (erro) {
    // Não interrompe nem marca a publicação como falha — só registra.
    console.error(`[felixo-editor] escrita de volta no Notion falhou para "${slug}":`, erro);
  }
}
