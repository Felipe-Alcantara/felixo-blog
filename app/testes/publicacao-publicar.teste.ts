import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execFileAsync = promisify(execFile);

let repoOrigem: string; // "remoto" — para o push ter aonde ir
let repo: string; // clone local, onde o app "publica"
let pastaTemp: string;

vi.mock('../src/principal/publicacao/gate', () => ({
  rodarGate: vi.fn().mockResolvedValue({ sucesso: true, saida: 'ok' }),
}));

vi.mock('../src/principal/posts/caminhos', async () => {
  const { join: joinReal } = await import('node:path');
  return {
    get RAIZ_DO_BLOG() {
      return repo;
    },
    get PASTA_DE_POSTS() {
      return joinReal(repo, 'src', 'content', 'posts');
    },
    get PASTA_DE_RASCUNHOS() {
      return joinReal(repo, 'app', 'rascunhos');
    },
    caminhoDoPost: (slug: string) => joinReal(repo, 'src', 'content', 'posts', `${slug}.md`),
    pastaDeMidiaDoPost: (slug: string) => joinReal(repo, 'src', 'content', 'posts', slug),
    caminhoDoRascunho: (slug: string) => joinReal(repo, 'app', 'rascunhos', `${slug}.md`),
    pastaDeMidiaDoRascunho: (slug: string) => joinReal(repo, 'app', 'rascunhos', slug),
  };
});

const { publicarPost } = await import('../src/principal/publicacao/publicar');
const { rodarGate } = await import('../src/principal/publicacao/gate');

async function gitEm(dir: string, args: string[]): Promise<void> {
  await execFileAsync('git', args, { cwd: dir });
}

const posts = (...partes: string[]) => join(repo, 'src', 'content', 'posts', ...partes);
const rascunhos = (...partes: string[]) => join(repo, 'app', 'rascunhos', ...partes);

async function escrever(caminho: string, conteudo: string): Promise<void> {
  await mkdir(join(caminho, '..'), { recursive: true });
  await writeFile(caminho, conteudo);
}

/** Arquivos do último commit da branch main do "remoto". */
async function arquivosDoUltimoCommit(): Promise<string[]> {
  const { stdout } = await execFileAsync('git', ['show', '--name-only', '--format=', 'main'], {
    cwd: repoOrigem,
  });
  return stdout.split('\n').filter(Boolean).sort();
}

beforeEach(async () => {
  pastaTemp = await mkdtemp(join(tmpdir(), 'felixo-editor-publicar-'));
  repoOrigem = join(pastaTemp, 'origem.git');
  repo = join(pastaTemp, 'clone');

  await gitEm(pastaTemp, ['init', '--bare', '--initial-branch=main', repoOrigem]);
  await execFileAsync('git', ['clone', repoOrigem, repo]);
  await gitEm(repo, ['config', 'user.email', 'teste@felixo.local']);
  await gitEm(repo, ['config', 'user.name', 'Teste']);

  await mkdir(join(repo, 'src', 'content', 'posts'), { recursive: true });
  await writeFile(join(repo, 'src', 'content', 'posts', '.gitkeep'), '');
  // Como no repositório real: a pasta de rascunhos é ignorada pelo git.
  await writeFile(join(repo, '.gitignore'), 'app/rascunhos/\n');
  await gitEm(repo, ['add', '.']);
  await gitEm(repo, ['commit', '-m', 'inicial']);
  await gitEm(repo, ['push', 'origin', 'main']);

  vi.mocked(rodarGate).mockResolvedValue({ sucesso: true, saida: 'ok' });
});

afterEach(async () => {
  await rm(pastaTemp, { recursive: true, force: true });
  vi.clearAllMocks();
});

describe('publicarPost', () => {
  it('publica de ponta a ponta: pull -> copia o rascunho -> gate -> add seletivo -> commit -> push', async () => {
    await escrever(rascunhos('meu-post.md'), '---\ntitulo: X\n---\ncorpo');
    await escrever(rascunhos('meu-post', 'imagem-01.webp'), 'bytes-da-imagem');

    const resultado = await publicarPost('meu-post', 'Meu post');

    expect(resultado.sucesso).toBe(true);
    expect(resultado.semMudanca).toBeFalsy();

    // Confere no "remoto" que o commit realmente chegou lá, só com os arquivos do post.
    const log = await execFileAsync('git', ['log', '--oneline', 'main'], { cwd: repoOrigem });
    expect(log.stdout).toContain('post: Meu post');
    expect(await arquivosDoUltimoCommit()).toEqual([
      'src/content/posts/meu-post.md',
      'src/content/posts/meu-post/imagem-01.webp',
    ]);
  });

  it('depois de publicar, o rascunho some (o arquivo e a pasta de imagens)', async () => {
    await escrever(rascunhos('meu-post.md'), '---\ntitulo: X\n---\ncorpo');
    await escrever(rascunhos('meu-post', 'imagem-01.webp'), 'bytes');
    await escrever(rascunhos('outro-rascunho.md'), 'de outro post, não publicado');

    await publicarPost('meu-post', 'Meu post');

    expect(existsSync(rascunhos('meu-post.md'))).toBe(false);
    expect(existsSync(rascunhos('meu-post'))).toBe(false);
    expect(existsSync(rascunhos('outro-rascunho.md'))).toBe(true); // só o publicado é apagado
  });

  it('o rascunho não aparece no git enquanto não é publicado', async () => {
    await escrever(rascunhos('ainda-nao.md'), '---\ntitulo: Ainda não\n---\ncorpo');
    await escrever(rascunhos('ainda-nao', 'imagem-01.webp'), 'bytes');

    const status = await execFileAsync('git', ['status', '--porcelain'], { cwd: repo });
    expect(status.stdout.trim()).toBe('');
  });

  it('não commita arquivo alheio modificado no mesmo working tree', async () => {
    await writeFile(join(repo, 'edicao-manual.txt'), 'edição solta de outro agente\n');
    await gitEm(repo, ['add', 'edicao-manual.txt']);
    await gitEm(repo, ['commit', '-m', 'arquivo de outro agente, versionado']);
    await gitEm(repo, ['push', 'origin', 'main']);
    await writeFile(join(repo, 'edicao-manual.txt'), 'MUDANÇA NÃO SALVA de outro agente\n');

    await escrever(rascunhos('outro-post.md'), '---\ntitulo: Y\n---\ncorpo');
    await publicarPost('outro-post', 'Outro post');

    const status = await execFileAsync('git', ['status', '--short'], { cwd: repo });
    // A edição do outro arquivo continua modificada e FORA do stage.
    expect(status.stdout).toContain(' M edicao-manual.txt');
  });

  it('publica a edição de um post que já estava publicado', async () => {
    await escrever(posts('no-ar.md'), '---\ntitulo: Z\n---\nversão antiga');
    await gitEm(repo, ['add', 'src/content/posts/no-ar.md']);
    await gitEm(repo, ['commit', '-m', 'post: Z']);
    await gitEm(repo, ['push', 'origin', 'main']);
    await escrever(rascunhos('no-ar.md'), '---\ntitulo: Z\n---\nversão nova');

    const resultado = await publicarPost('no-ar', 'Z');

    expect(resultado.sucesso).toBe(true);
    expect(await readFile(posts('no-ar.md'), 'utf-8')).toContain('versão nova');
    const { stdout } = await execFileAsync('git', ['show', 'main:src/content/posts/no-ar.md'], {
      cwd: repoOrigem,
    });
    expect(stdout).toContain('versão nova');
    expect(existsSync(rascunhos('no-ar.md'))).toBe(false);
  });

  it('devolve semMudanca quando o rascunho já está igual ao commit atual, e apaga o rascunho', async () => {
    await escrever(posts('ja-existe.md'), '---\ntitulo: Z\n---\ncorpo');
    await gitEm(repo, ['add', 'src/content/posts/ja-existe.md']);
    await gitEm(repo, ['commit', '-m', 'post: Z']);
    await gitEm(repo, ['push', 'origin', 'main']);
    await escrever(rascunhos('ja-existe.md'), '---\ntitulo: Z\n---\ncorpo');

    const resultado = await publicarPost('ja-existe', 'Z');

    expect(resultado.sucesso).toBe(true);
    expect(resultado.semMudanca).toBe(true);
    expect(existsSync(rascunhos('ja-existe.md'))).toBe(false);
  });

  it('com o gate falhando: reporta a etapa, desfaz a cópia e mantém o rascunho', async () => {
    vi.mocked(rodarGate).mockResolvedValue({ sucesso: false, etapa: 'build', saida: 'build quebrou' });
    await escrever(rascunhos('falha.md'), '---\ntitulo: F\n---\ncorpo');
    await escrever(rascunhos('falha', 'imagem-01.webp'), 'bytes');

    const resultado = await publicarPost('falha', 'F');

    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapaComFalha).toBe('gate');
    expect(resultado.detalhe).toContain('build quebrou');
    // Nada do post ficou na pasta pública, e o rascunho continua inteiro para tentar de novo.
    expect(existsSync(posts('falha.md'))).toBe(false);
    expect(existsSync(posts('falha'))).toBe(false);
    expect(existsSync(rascunhos('falha.md'))).toBe(true);
    expect(existsSync(rascunhos('falha', 'imagem-01.webp'))).toBe(true);
    const status = await execFileAsync('git', ['status', '--porcelain'], { cwd: repo });
    expect(status.stdout.trim()).toBe('');
  });

  it('com o gate falhando numa edição: o arquivo publicado volta ao que era', async () => {
    vi.mocked(rodarGate).mockResolvedValue({ sucesso: false, etapa: 'check', saida: 'check quebrou' });
    await escrever(posts('no-ar.md'), '---\ntitulo: Z\n---\nversão publicada');
    await gitEm(repo, ['add', 'src/content/posts/no-ar.md']);
    await gitEm(repo, ['commit', '-m', 'post: Z']);
    await gitEm(repo, ['push', 'origin', 'main']);
    await escrever(rascunhos('no-ar.md'), '---\ntitulo: Z\n---\nversão com erro');

    await publicarPost('no-ar', 'Z');

    expect(await readFile(posts('no-ar.md'), 'utf-8')).toContain('versão publicada');
    const status = await execFileAsync('git', ['status', '--porcelain'], { cwd: repo });
    expect(status.stdout.trim()).toBe('');
  });

  it('sem rascunho e sem post publicado: falha na etapa "copiar", sem tocar no git', async () => {
    const resultado = await publicarPost('nao-existe', 'Nada');

    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapaComFalha).toBe('copiar');
    expect(rodarGate).not.toHaveBeenCalled();
  });

  it('se o push falha, o commit fica e o rascunho também (dá para tentar de novo)', async () => {
    await gitEm(repo, ['config', 'remote.origin.pushurl', join(pastaTemp, 'nao-existe.git')]);
    await escrever(rascunhos('sem-push.md'), '---\ntitulo: P\n---\ncorpo');

    const resultado = await publicarPost('sem-push', 'Sem push');

    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapaComFalha).toBe('push');
    expect(existsSync(rascunhos('sem-push.md'))).toBe(true);
    const log = await execFileAsync('git', ['log', '--oneline', '-1'], { cwd: repo });
    expect(log.stdout).toContain('post: Sem push');
  });
});
