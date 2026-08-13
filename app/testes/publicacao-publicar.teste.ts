import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
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
    caminhoDoPost: (slug: string) => joinReal(repo, 'src', 'content', 'posts', `${slug}.md`),
    pastaDeMidiaDoPost: (slug: string) => joinReal(repo, 'src', 'content', 'posts', slug),
  };
});

const { publicarPost } = await import('../src/principal/publicacao/publicar');
const { rodarGate } = await import('../src/principal/publicacao/gate');

async function gitEm(dir: string, args: string[]): Promise<void> {
  await execFileAsync('git', args, { cwd: dir });
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
  it('publica de ponta a ponta: gate -> pull -> add seletivo -> commit -> push', async () => {
    await writeFile(join(repo, 'src', 'content', 'posts', 'meu-post.md'), '---\ntitulo: X\n---\ncorpo');

    const resultado = await publicarPost('meu-post', 'Meu post');

    expect(resultado.sucesso).toBe(true);
    expect(resultado.semMudanca).toBeFalsy();

    // Confere no "remoto" que o commit realmente chegou lá.
    const log = await execFileAsync('git', ['log', '--oneline', 'main'], { cwd: repoOrigem });
    expect(log.stdout).toContain('post: Meu post');
  });

  it('não commita arquivo alheio modificado no mesmo working tree', async () => {
    await writeFile(join(repo, 'edicao-manual.txt'), 'edição solta de outro agente\n');
    await gitEm(repo, ['add', 'edicao-manual.txt']);
    await gitEm(repo, ['commit', '-m', 'arquivo de outro agente, versionado']);
    await gitEm(repo, ['push', 'origin', 'main']);
    await writeFile(join(repo, 'edicao-manual.txt'), 'MUDANÇA NÃO SALVA de outro agente\n');

    await writeFile(join(repo, 'src', 'content', 'posts', 'outro-post.md'), '---\ntitulo: Y\n---\ncorpo');
    await publicarPost('outro-post', 'Outro post');

    const status = await execFileAsync('git', ['status', '--short'], { cwd: repo });
    // A edição do outro arquivo continua modificada e FORA do stage.
    expect(status.stdout).toContain(' M edicao-manual.txt');
  });

  it('devolve semMudanca quando o post já está igual ao commit atual', async () => {
    await writeFile(join(repo, 'src', 'content', 'posts', 'ja-existe.md'), '---\ntitulo: Z\n---\ncorpo');
    await gitEm(repo, ['add', 'src/content/posts/ja-existe.md']);
    await gitEm(repo, ['commit', '-m', 'post: Z']);
    await gitEm(repo, ['push', 'origin', 'main']);

    const resultado = await publicarPost('ja-existe', 'Z');
    expect(resultado.sucesso).toBe(true);
    expect(resultado.semMudanca).toBe(true);
  });

  it('interrompe e reporta a etapa quando o gate de qualidade falha, sem tocar no git', async () => {
    vi.mocked(rodarGate).mockResolvedValue({ sucesso: false, etapa: 'build', saida: 'build quebrou' });
    await writeFile(join(repo, 'src', 'content', 'posts', 'falha.md'), '---\ntitulo: F\n---\ncorpo');

    const resultado = await publicarPost('falha', 'F');
    expect(resultado.sucesso).toBe(false);
    expect(resultado.etapaComFalha).toBe('gate');

    const status = await execFileAsync('git', ['status', '--short'], { cwd: repo });
    expect(status.stdout).toContain('falha.md'); // continua não commitado
  });
});
