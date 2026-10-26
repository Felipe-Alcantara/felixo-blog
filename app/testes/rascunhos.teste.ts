import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execFileAsync = promisify(execFile);

// Raiz temporária no lugar do repositório real: o teste prova que a cópia e a
// limpeza só mexem nas pastas de rascunhos e de posts apontadas pelo mock.
let raiz: string;

vi.mock('../src/principal/posts/caminhos', async () => {
  const { join: joinReal } = await import('node:path');
  return {
    get PASTA_DE_POSTS() {
      return joinReal(raiz, 'src', 'content', 'posts');
    },
    get PASTA_DE_RASCUNHOS() {
      return joinReal(raiz, 'app', 'rascunhos');
    },
    caminhoDoPost: (slug: string) => joinReal(raiz, 'src', 'content', 'posts', `${slug}.md`),
    pastaDeMidiaDoPost: (slug: string) => joinReal(raiz, 'src', 'content', 'posts', slug),
    caminhoDoRascunho: (slug: string) => joinReal(raiz, 'app', 'rascunhos', `${slug}.md`),
    pastaDeMidiaDoRascunho: (slug: string) => joinReal(raiz, 'app', 'rascunhos', slug),
  };
});

const { copiarRascunhoParaOsPosts, existeRascunho, removerRascunho } = await import(
  '../src/principal/posts/rascunhos'
);

const posts = (...partes: string[]) => join(raiz, 'src', 'content', 'posts', ...partes);
const rascunhos = (...partes: string[]) => join(raiz, 'app', 'rascunhos', ...partes);

async function escrever(caminho: string, conteudo: string): Promise<void> {
  await mkdir(join(caminho, '..'), { recursive: true });
  await writeFile(caminho, conteudo);
}

beforeEach(async () => {
  raiz = await mkdtemp(join(tmpdir(), 'felixo-editor-rascunhos-'));
});

afterEach(async () => {
  await rm(raiz, { recursive: true, force: true });
});

describe('existeRascunho', () => {
  it('é falso sem o arquivo e verdadeiro com ele', async () => {
    expect(existeRascunho('meu-post')).toBe(false);
    await escrever(rascunhos('meu-post.md'), 'x');
    expect(existeRascunho('meu-post')).toBe(true);
  });
});

describe('copiarRascunhoParaOsPosts', () => {
  it('copia o .md e a pasta de imagens para src/content/posts, mantendo o rascunho', async () => {
    await escrever(rascunhos('meu-post.md'), 'texto');
    await escrever(rascunhos('meu-post', 'imagem-01.webp'), 'bytes-da-imagem');

    await copiarRascunhoParaOsPosts('meu-post');

    expect(await readFile(posts('meu-post.md'), 'utf-8')).toBe('texto');
    expect(await readFile(posts('meu-post', 'imagem-01.webp'), 'utf-8')).toBe('bytes-da-imagem');
    expect(existeRascunho('meu-post')).toBe(true); // só some depois de publicar
  });

  it('funciona sem pasta de imagens', async () => {
    await escrever(rascunhos('so-texto.md'), 'texto');

    await copiarRascunhoParaOsPosts('so-texto');

    expect(existsSync(posts('so-texto.md'))).toBe(true);
    expect(existsSync(posts('so-texto'))).toBe(false);
  });

  it('desfazer apaga o que foi criado e devolve o que foi sobrescrito', async () => {
    await escrever(posts('ja-publicado.md'), 'versão publicada');
    await escrever(posts('ja-publicado', 'imagem-01.webp'), 'imagem publicada');
    await escrever(rascunhos('ja-publicado.md'), 'versão nova');
    await escrever(rascunhos('ja-publicado', 'imagem-01.webp'), 'imagem nova');
    await escrever(rascunhos('ja-publicado', 'imagem-02.webp'), 'imagem só do rascunho');

    const copia = await copiarRascunhoParaOsPosts('ja-publicado');
    expect(await readFile(posts('ja-publicado.md'), 'utf-8')).toBe('versão nova');

    await copia.desfazer();

    expect(await readFile(posts('ja-publicado.md'), 'utf-8')).toBe('versão publicada');
    expect(await readFile(posts('ja-publicado', 'imagem-01.webp'), 'utf-8')).toBe('imagem publicada');
    expect(existsSync(posts('ja-publicado', 'imagem-02.webp'))).toBe(false);
    expect(existeRascunho('ja-publicado')).toBe(true);
  });

  it('desfazer num post novo não deixa nem a pasta de imagens criada', async () => {
    await escrever(rascunhos('novo.md'), 'texto');
    await escrever(rascunhos('novo', 'imagem-01.webp'), 'bytes');

    const copia = await copiarRascunhoParaOsPosts('novo');
    await copia.desfazer();

    expect(existsSync(posts('novo.md'))).toBe(false);
    expect(existsSync(posts('novo'))).toBe(false);
  });

  it('falha com mensagem clara quando não há rascunho', async () => {
    await expect(copiarRascunhoParaOsPosts('nao-existe')).rejects.toThrow(/rascunho/i);
  });
});

describe('removerRascunho', () => {
  it('apaga o .md e a pasta de imagens do rascunho, sem tocar nos posts', async () => {
    await escrever(rascunhos('meu-post.md'), 'texto');
    await escrever(rascunhos('meu-post', 'imagem-01.webp'), 'bytes');
    await escrever(rascunhos('outro.md'), 'de outro post');
    await escrever(posts('meu-post.md'), 'publicado');

    await removerRascunho('meu-post');

    expect(existsSync(rascunhos('meu-post.md'))).toBe(false);
    expect(existsSync(rascunhos('meu-post'))).toBe(false);
    expect(existsSync(rascunhos('outro.md'))).toBe(true);
    expect(existsSync(posts('meu-post.md'))).toBe(true);
  });

  it('não falha quando não há nada para apagar', async () => {
    await expect(removerRascunho('nada')).resolves.toBeUndefined();
  });
});

describe('.gitignore do repositório real', () => {
  const RAIZ_REAL = fileURLToPath(new URL('../..', import.meta.url));

  async function ignorado(caminho: string): Promise<boolean> {
    try {
      await execFileAsync('git', ['check-ignore', '-q', caminho], { cwd: RAIZ_REAL });
      return true; // código 0: o git ignora esse caminho
    } catch {
      return false; // código 1: não é ignorado
    }
  }

  it('ignora app/rascunhos/ (o rascunho nunca entra num commit automático)', async () => {
    expect(await ignorado('app/rascunhos/qualquer-post.md')).toBe(true);
    expect(await ignorado('app/rascunhos/qualquer-post/imagem-01.webp')).toBe(true);
  });

  it('continua versionando src/content/posts/ (onde o post publicado entra)', async () => {
    expect(await ignorado('src/content/posts/qualquer-post.md')).toBe(false);
  });
});
