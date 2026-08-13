import { describe, expect, it } from 'vitest';
import { blocosParaMarkdown, textoInlineParaMarkdown } from '../src/principal/notion/blocos';
import type { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

function textoSimples(conteudo: string, extra: Partial<RichTextItemResponse['annotations']> = {}): RichTextItemResponse {
  return {
    type: 'text',
    text: { content: conteudo, link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
      ...extra,
    },
    plain_text: conteudo,
    href: null,
  } as RichTextItemResponse;
}

function blocoParagrafo(rich_text: RichTextItemResponse[]): BlockObjectResponse {
  return {
    object: 'block',
    id: 'b1',
    type: 'paragraph',
    paragraph: { rich_text, color: 'default' },
    has_children: false,
  } as unknown as BlockObjectResponse;
}

describe('textoInlineParaMarkdown', () => {
  it('aplica negrito, itálico, código e link', () => {
    expect(textoInlineParaMarkdown([textoSimples('negrito', { bold: true })])).toBe('**negrito**');
    expect(textoInlineParaMarkdown([textoSimples('itálico', { italic: true })])).toBe('_itálico_');
    expect(textoInlineParaMarkdown([textoSimples('código', { code: true })])).toBe('`código`');

    const comLink = {
      ...textoSimples('portfólio'),
      href: 'https://felixo.com.br/',
    } as RichTextItemResponse;
    expect(textoInlineParaMarkdown([comLink])).toBe('[portfólio](https://felixo.com.br/)');
  });

  it('junta múltiplos segmentos preservando cada formatação', () => {
    const texto = textoInlineParaMarkdown([
      textoSimples('normal '),
      textoSimples('negrito', { bold: true }),
    ]);
    expect(texto).toBe('normal **negrito**');
  });
});

describe('blocosParaMarkdown', () => {
  it('converte parágrafo, heading, lista e citação', () => {
    const blocos: BlockObjectResponse[] = [
      blocoParagrafo([textoSimples('Um parágrafo.')]),
      {
        object: 'block',
        id: 'h1',
        type: 'heading_2',
        heading_2: { rich_text: [textoSimples('Um título')], color: 'default', is_toggleable: false },
        has_children: false,
      } as unknown as BlockObjectResponse,
      {
        object: 'block',
        id: 'li1',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: [textoSimples('Item')], color: 'default' },
        has_children: false,
      } as unknown as BlockObjectResponse,
      {
        object: 'block',
        id: 'q1',
        type: 'quote',
        quote: { rich_text: [textoSimples('Citação')], color: 'default' },
        has_children: false,
      } as unknown as BlockObjectResponse,
    ];

    const { markdown } = blocosParaMarkdown(blocos);
    expect(markdown).toBe('Um parágrafo.\n\n## Um título\n\n- Item\n\n> Citação');
  });

  it('converte bloco de código preservando a linguagem', () => {
    const bloco = {
      object: 'block',
      id: 'c1',
      type: 'code',
      code: {
        rich_text: [textoSimples('const x = 1;')],
        language: 'javascript',
        caption: [],
      },
      has_children: false,
    } as unknown as BlockObjectResponse;

    const { markdown } = blocosParaMarkdown([bloco]);
    expect(markdown).toBe('```javascript\nconst x = 1;\n```');
  });

  it('extrai imagens hospedadas no Notion e mantém a URL original no markdown gerado', () => {
    const bloco = {
      object: 'block',
      id: 'img1',
      type: 'image',
      image: {
        type: 'file',
        file: { url: 'https://s3.amazonaws.com/notion/img.png', expiry_time: '2026-01-01' },
        caption: [textoSimples('legenda')],
      },
      has_children: false,
    } as unknown as BlockObjectResponse;

    const { markdown, imagens } = blocosParaMarkdown([bloco]);
    expect(markdown).toBe('![legenda](https://s3.amazonaws.com/notion/img.png)');
    expect(imagens).toEqual([{ url: 'https://s3.amazonaws.com/notion/img.png', alt: 'legenda' }]);
  });

  it('bloco não suportado vira comentário HTML visível, nunca some em silêncio', () => {
    const bloco = {
      object: 'block',
      id: 'tbl1',
      type: 'table',
      table: { table_width: 2, has_column_header: false, has_row_header: false },
      has_children: true,
    } as unknown as BlockObjectResponse;

    const { markdown } = blocosParaMarkdown([bloco]);
    expect(markdown).toContain('<!--');
    expect(markdown).toContain('table');
  });
});
