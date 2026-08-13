import type { Client } from '@notionhq/client';
import type {
  DatabaseObjectResponse,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { comRetry } from './cliente';

type PropriedadesDeAtualizacao = NonNullable<UpdatePageParameters['properties']>;

export interface ResultadoDaEscritaDeVolta {
  urlAtualizada: boolean;
  statusAtualizado: boolean;
  /** Motivo de não ter atualizado o status (propriedade/opção não encontrada) — informativo, não erro. */
  avisoDeStatus?: string;
}

/**
 * Escreve de volta no Notion só o que foi combinado: URL do post publicado e,
 * se der pra achar com confiança, o status.
 *
 * Nunca inventa nome de propriedade nem valor de opção — acha a propriedade
 * do tipo `url` (existe no máximo uma por database, geralmente) e uma
 * propriedade `select`/`status` cuja opção pareça "publicado". Não achando
 * com segurança, avisa e segue sem escrever — o post já foi publicado no
 * blog de qualquer forma, essa escrita é um bônus, não uma dependência.
 */
export async function escreverStatusDeVolta(
  client: Client,
  pageId: string,
  databaseId: string,
  urlPublicada: string,
): Promise<ResultadoDaEscritaDeVolta> {
  const database = (await comRetry(() =>
    client.databases.retrieve({ database_id: databaseId }),
  )) as DatabaseObjectResponse;

  const propriedadeUrl = Object.entries(database.properties).find(([, p]) => p.type === 'url');
  const propriedadeStatus = Object.entries(database.properties).find(
    ([, p]) => p.type === 'select' || p.type === 'status',
  );

  const properties: PropriedadesDeAtualizacao = {};

  if (propriedadeUrl) {
    properties[propriedadeUrl[0]] = { url: urlPublicada };
  }

  let statusAtualizado = false;
  let avisoDeStatus: string | undefined;

  if (propriedadeStatus) {
    const [nome, prop] = propriedadeStatus;
    const opcoes = prop.type === 'select' ? prop.select.options : prop.type === 'status' ? prop.status.options : [];
    const opcaoPublicada = opcoes.find((o) => /public/i.test(o.name));

    if (opcaoPublicada) {
      properties[nome] = prop.type === 'select' ? { select: { id: opcaoPublicada.id } } : { status: { id: opcaoPublicada.id } };
      statusAtualizado = true;
    } else {
      avisoDeStatus = `Achei a propriedade "${nome}", mas nenhuma opção parece "publicado" — status não foi alterado.`;
    }
  } else {
    avisoDeStatus = 'Nenhuma propriedade de status (select) encontrada na database — status não foi alterado.';
  }

  if (Object.keys(properties).length > 0) {
    await comRetry(() => client.pages.update({ page_id: pageId, properties }));
  }

  return { urlAtualizada: !!propriedadeUrl, statusAtualizado, avisoDeStatus };
}
