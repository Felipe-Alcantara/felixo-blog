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
export function blocosParaMarkdown(blocos: Bloco[]): ResultadoDaConversao {
  const imagens: ImagemEncontrada[] = [];
  const linhas: string[] = [];

  for (const bloco of blocos) {
    if (!('type' in bloco)) {
      linhas.push('<!-- bloco parcial do Notion, sem conteúdo carregado -->');
      continue;
    }

    const linha = converterUmBloco(bloco, imagens);
    if (linha !== null) linhas.push(linha);
  }

  return { markdown: linhas.join('\n\n'), imagens };
}

function converterUmBloco(bloco: BlockObjectResponse, imagens: ImagemEncontrada[]): string | null {
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
      return `1. ${textoInlineParaMarkdown(bloco.numbered_list_item.rich_text)}`;

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
