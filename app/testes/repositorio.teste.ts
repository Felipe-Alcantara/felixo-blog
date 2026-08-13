import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// `caminhos.ts` calcula a raiz do blog a partir de `__dirname`. Para testar o
// repositório sem depender do repositório real, mockamos o módulo inteiro
// apontando para um diretório temporário — assim o teste também prova que
// nada aqui vaza para fora da pasta de posts.
let pastaTemp: string;

vi.mock('../src/principal/posts/caminhos', async () => {
  const { join: joinReal } = await import('node:path');
  return {
    get PASTA_DE_POSTS() {
      return joinReal(pastaTemp, 'posts');
    },
    caminhoDoPost: (slug: string) => joinReal(pastaTemp, 'posts', `${slug}.md`),
    pastaDeMidiaDoPost: (slug: string) => joinReal(pastaTemp, 'posts', slug),
  };
});

const { lerPost, listarPosts, salvarPost, PostInvalidoError } = await import(
  '../src/principal/posts/repositorio'
);

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-'));
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
});

describe('salvarPost + lerPost', () => {
  it('grava e relê um post com o mesmo conteúdo', async () => {
    await salvarPost(
      'post-de-teste',
      {
        titulo: 'Post de teste',
        descricao: 'Descrição de teste.',
        publicadoEm: '2026-08-13',
        tags: ['Teste'],
        rascunho: true,
      },
      'Corpo do post.',
    );

    const post = await lerPost('post-de-teste');
    expect(post.frontmatter.titulo).toBe('Post de teste');
    expect(post.frontmatter.tags).toEqual(['Teste']);
    expect(post.frontmatter.rascunho).toBe(true);
    expect(post.corpo).toBe('Corpo do post.');
  });

  it('rejeita frontmatter sem título', async () => {
    await expect(
      salvarPost(
        'sem-titulo',
        { titulo: '', descricao: 'x', publicadoEm: '2026-08-13' },
        'corpo',
      ),
    ).rejects.toThrow();
  });

  it('rejeita descrição vazia (ex.: artigo importado do Notion, ainda sem descrição preenchida) com mensagem legível, não JSON cru do Zod', async () => {
    await expect(
      salvarPost(
        'sem-descricao',
        { titulo: 'Título ok', descricao: '', publicadoEm: '2026-08-13' },
        'corpo',
      ),
    ).rejects.toThrow(/descricao: Descrição não pode ser vazia/);
  });

  it('rejeita slug com maiúscula ou espaço (não vira URL válida)', async () => {
    await expect(
      salvarPost(
        'Post Com Espaço',
        { titulo: 'x', descricao: 'x', publicadoEm: '2026-08-13' },
        'corpo',
      ),
    ).rejects.toThrow(PostInvalidoError);
  });

  it('lerPost lança PostInvalidoError para slug inexistente', async () => {
    await expect(lerPost('nao-existe')).rejects.toThrow(PostInvalidoError);
  });
});

describe('listarPosts', () => {
  it('lista do mais recente para o mais antigo e ignora post com frontmatter quebrado', async () => {
    await salvarPost(
      'mais-antigo',
      { titulo: 'A', descricao: 'a', publicadoEm: '2026-01-01' },
      'a',
    );
    await salvarPost(
      'mais-novo',
      { titulo: 'B', descricao: 'b', publicadoEm: '2026-08-01' },
      'b',
    );

    // post com data de publicação faltando — deve ser ignorado, não derrubar a listagem
    const { mkdir, writeFile } = await import('node:fs/promises');
    await mkdir(join(pastaTemp, 'posts'), { recursive: true });
    await writeFile(
      join(pastaTemp, 'posts', 'quebrado.md'),
      '---\ntitulo: Quebrado\n---\ncorpo',
    );

    const posts = await listarPosts();
    expect(posts.map((p) => p.slug)).toEqual(['mais-novo', 'mais-antigo']);
  });

  it('devolve lista vazia quando a pasta de posts não existe', async () => {
    expect(await listarPosts()).toEqual([]);
  });
});

describe('conteúdo gravado em disco', () => {
  it('o arquivo .md gerado tem frontmatter YAML legível', async () => {
    await salvarPost(
      'formato',
      { titulo: 'Formato', descricao: 'd', publicadoEm: '2026-08-13', tags: ['a', 'b'] },
      'corpo',
    );

    const bruto = await readFile(join(pastaTemp, 'posts', 'formato.md'), 'utf-8');
    expect(bruto).toContain('titulo: Formato');
    expect(bruto).toContain('- a');
    expect(bruto).toContain('- b');
    expect(bruto.trim().startsWith('---')).toBe(true);
  });

  it('salva com sucesso quando um campo opcional chega como undefined explícito (não ausente)', async () => {
    // Reproduz o formato real que a interface envia quando um campo opcional
    // fica vazio: `capa: estado.capa || undefined` cria a chave "capa" com
    // valor undefined, em vez de omiti-la. gray-matter/js-yaml não sabem
    // serializar undefined e lançavam YAMLException antes desta correção.
    await salvarPost(
      'sem-capa',
      {
        titulo: 'Sem capa',
        descricao: 'd',
        publicadoEm: '2026-08-13',
        capa: undefined,
      },
      'corpo',
    );

    const post = await lerPost('sem-capa');
    expect(post.frontmatter.capa).toBeUndefined();

    const bruto = await readFile(join(pastaTemp, 'posts', 'sem-capa.md'), 'utf-8');
    expect(bruto).not.toContain('capa:');
  });
});
