import type { Client } from '@notionhq/client';
import type {
  DatabaseObjectResponse,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { comRetry } from './cliente';

type PropriedadesDeAtualizacao = NonNullable<UpdatePageParameters['properties']>;
type PropriedadeDaDatabase = DatabaseObjectResponse['properties'][string];

/** Nome de coluna ou de opção que parece "publicado"/"publicada". */
const PARECE_PUBLICADO = /public/i;

function opcoesDe(prop: PropriedadeDaDatabase): { id: string; name: string }[] {
  if (prop.type === 'select') return prop.select.options;
  if (prop.type === 'status') return prop.status.options;
  return [];
}

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
 * Nunca inventa nome de propriedade nem valor de opção. As colunas são
 * achadas pelo conteúdo, e não pela posição (a database "Ideias criativas" tem
 * duas `select`, Etapa e Formato, e duas `url`, URL publicada e Arquivo no
 * GitHub, e a ordem em que a API as devolve não é garantida):
 *
 * - status: a primeira coluna `select`/`status` que tem uma opção parecida
 *   com "publicado";
 * - URL: a coluna `url` cujo nome parece "publicada"; sem nenhuma assim, só se
 *   houver uma única coluna `url` (com mais de uma, escolher uma ao acaso
 *   poderia sobrescrever o link de outra coisa).
 *
 * Não achando com segurança, avisa e segue sem escrever — o post já foi
 * publicado no blog de qualquer forma, essa escrita é um bônus, não uma
 * dependência.
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

  const propriedades = Object.entries(database.properties);

  const colunasUrl = propriedades.filter(([, p]) => p.type === 'url');
  const propriedadeUrl =
    colunasUrl.find(([nome]) => PARECE_PUBLICADO.test(nome)) ??
    (colunasUrl.length === 1 ? colunasUrl[0] : undefined);

  const colunasDeStatus = propriedades.filter(([, p]) => p.type === 'select' || p.type === 'status');
  const status = colunasDeStatus
    .map(([nome, prop]) => ({ nome, prop, opcao: opcoesDe(prop).find((o) => PARECE_PUBLICADO.test(o.name)) }))
    .find((coluna) => coluna.opcao);

  const properties: PropriedadesDeAtualizacao = {};

  if (propriedadeUrl) {
    properties[propriedadeUrl[0]] = { url: urlPublicada };
  }

  let statusAtualizado = false;
  let avisoDeStatus: string | undefined;

  if (status?.opcao) {
    const { nome, prop, opcao } = status;
    properties[nome] = prop.type === 'select' ? { select: { id: opcao.id } } : { status: { id: opcao.id } };
    statusAtualizado = true;
  } else if (colunasDeStatus.length > 0) {
    const nomes = colunasDeStatus.map(([nome]) => `"${nome}"`).join(', ');
    const rotulo = colunasDeStatus.length === 1 ? 'a propriedade' : 'as propriedades';
    avisoDeStatus = `Achei ${rotulo} ${nomes}, mas nenhuma opção parece "publicado" — status não foi alterado.`;
  } else {
    avisoDeStatus = 'Nenhuma propriedade de status (select) encontrada na database — status não foi alterado.';
  }

  if (Object.keys(properties).length > 0) {
    await comRetry(() => client.pages.update({ page_id: pageId, properties }));
  }

  return { urlAtualizada: !!propriedadeUrl, statusAtualizado, avisoDeStatus };
}
