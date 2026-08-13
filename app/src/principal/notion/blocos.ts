import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type Bloco = BlockObjectResponse | PartialBlockObjectResponse;

export interface ImagemEncontrada {
  /** URL do Notion (S3 pré-assinada — expira em cerca de 1h, ver `imagens.ts`). */
  url: string;
  /** Texto alternativo, quando o bloco tiver legenda. */
  alt: string;
}

export interface ResultadoDaConversao {
  markdown: string;
  imagens: ImagemEncontrada[];
}

/** Converte rich text do Notion (negrito, itálico, código, link, tachado) para Markdown inline. */
export function textoInlineParaMarkdown(itens: RichTextItemResponse[]): string {
  return itens
    .map((item) => {
      let texto = item.plain_text;
      if (!texto) return '';

      const url = item.href ?? undefined;
      const { bold, italic, strikethrough, code } = item.annotations;

      if (code) texto = `\`${texto}\``;
      if (bold) texto = `**${texto}**`;
      if (italic) texto = `_${texto}_`;
      if (strikethrough) texto = `~~${texto}~~`;
      if (url) texto = `[${texto}](${url})`;

      return texto;
    })
    .join('');
}

/**
 * Converte uma lista achatada de blocos do Notion em Markdown.
 *
 * Blocos aninhados (`has_children`) não são recursados nesta versão — o
 * conteúdo dos filhos simplesmente não aparece. É uma limitação conhecida e
 * registrada no IA.md, não um bug silencioso: blocos não suportados viram um
 * comentário HTML visível no editor (`<!-- ... -->`), nunca somem calados.
 */
/** Tipos de bloco cujas linhas ficam juntas (sem linha em branco) quando consecutivas — é uma única lista. */
const TIPOS_DE_ITEM_DE_LISTA = new Set(['bulleted_list_item', 'numbered_list_item']);

export function blocosParaMarkdown(blocos: Bloco[]): ResultadoDaConversao {
  const imagens: ImagemEncontrada[] = [];
  const itens: { tipo: string; linha: string }[] = [];
  let numeroDaListaAtual = 0;

  for (const bloco of blocos) {
    if (!('type' in bloco)) {
      itens.push({ tipo: 'desconhecido', linha: '<!-- bloco parcial do Notion, sem conteúdo carregado -->' });
      numeroDaListaAtual = 0;
      continue;
    }

    // Numeração real (1, 2, 3…), não "1." repetido: a maioria dos
    // renderizadores corrige visualmente, mas o `.md` gerado deve bater com
    // o texto-fonte, não depender disso.
    numeroDaListaAtual = bloco.type === 'numbered_list_item' ? numeroDaListaAtual + 1 : 0;

    const linha = converterUmBloco(bloco, imagens, numeroDaListaAtual);
    if (linha !== null) itens.push({ tipo: bloco.type, linha });
  }

  let markdown = '';
  itens.forEach((item, indice) => {
    if (indice > 0) {
      const anterior = itens[indice - 1];
      // Dois itens de lista do MESMO tipo seguidos formam uma lista compacta
      // (sem parágrafo entre eles) — igual ao que o resto do blog já usa.
      const listaCompacta =
        TIPOS_DE_ITEM_DE_LISTA.has(item.tipo) && anterior.tipo === item.tipo;
      markdown += listaCompacta ? '\n' : '\n\n';
    }
    markdown += item.linha;
  });

  return { markdown, imagens };
}

function converterUmBloco(
  bloco: BlockObjectResponse,
  imagens: ImagemEncontrada[],
  numeroDaLista: number,
): string | null {
  switch (bloco.type) {
    case 'paragraph':
      return textoInlineParaMarkdown(bloco.paragraph.rich_text) || null;

    case 'heading_1':
      return `# ${textoInlineParaMarkdown(bloco.heading_1.rich_text)}`;
    case 'heading_2':
      return `## ${textoInlineParaMarkdown(bloco.heading_2.rich_text)}`;
    case 'heading_3':
      return `### ${textoInlineParaMarkdown(bloco.heading_3.rich_text)}`;

    case 'bulleted_list_item':
      return `- ${textoInlineParaMarkdown(bloco.bulleted_list_item.rich_text)}`;
    case 'numbered_list_item':
      return `${numeroDaLista}. ${textoInlineParaMarkdown(bloco.numbered_list_item.rich_text)}`;

    case 'quote':
      return `> ${textoInlineParaMarkdown(bloco.quote.rich_text)}`;

    case 'callout': {
      const emoji = bloco.callout.icon?.type === 'emoji' ? `${bloco.callout.icon.emoji} ` : '';
      return `> ${emoji}${textoInlineParaMarkdown(bloco.callout.rich_text)}`;
    }

    case 'code': {
      const linguagem = bloco.code.language || '';
      const codigo = bloco.code.rich_text.map((t) => t.plain_text).join('');
      return `\`\`\`${linguagem}\n${codigo}\n\`\`\``;
    }

    case 'divider':
      return '---';

    case 'image': {
      const url = bloco.image.type === 'file' ? bloco.image.file.url : bloco.image.external.url;
      const alt = textoInlineParaMarkdown(bloco.image.caption) || 'imagem';
      imagens.push({ url, alt });
      return `![${alt}](${url})`;
    }

    default:
      return `<!-- bloco do Notion não suportado: "${bloco.type}" -->`;
  }
}
