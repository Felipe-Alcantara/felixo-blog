import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { git, haAlgoEmStage, ComandoGitFalhou } from '../src/principal/publicacao/git';

const execFileAsync = promisify(execFile);

let repo: string;

async function gitAqui(args: string[]): Promise<void> {
  await execFileAsync('git', args, { cwd: repo });
}

beforeEach(async () => {
  repo = await mkdtemp(join(tmpdir(), 'felixo-editor-git-'));
  await gitAqui(['init', '--initial-branch=main']);
  await gitAqui(['config', 'user.email', 'teste@felixo.local']);
  await gitAqui(['config', 'user.name', 'Teste']);
  await writeFile(join(repo, 'arquivo-base.txt'), 'base\n');
  await gitAqui(['add', 'arquivo-base.txt']);
  await gitAqui(['commit', '-m', 'inicial']);
});

afterEach(async () => {
  await rm(repo, { recursive: true, force: true });
});

describe('haAlgoEmStage', () => {
  it('false sem nada em stage', async () => {
    expect(await haAlgoEmStage(repo)).toBe(false);
  });

  it('true depois de um git add', async () => {
    await writeFile(join(repo, 'novo.txt'), 'conteúdo\n');
    await gitAqui(['add', 'novo.txt']);
    expect(await haAlgoEmStage(repo)).toBe(true);
  });
});

describe('git()', () => {
  it('roda um comando real e devolve stdout', async () => {
    const saida = await git(['status', '--short'], repo);
    expect(typeof saida).toBe('string');
  });

  it('lança ComandoGitFalhou com o stderr real em comando inválido', async () => {
    await expect(git(['not-a-real-command'], repo)).rejects.toThrow(ComandoGitFalhou);
  });
});

describe('cenário: add seletivo não pega arquivo alheio', () => {
  it('git add -- <caminho específico> deixa outro arquivo modificado de fora do stage', async () => {
    // Simula exatamente o risco do multi-agente: outro arquivo tem edição
    // solta no working tree (não deve ir no commit do post).
    await writeFile(join(repo, 'arquivo-base.txt'), 'edição de outro agente\n');
    await mkdir(join(repo, 'posts'), { recursive: true });
    await writeFile(join(repo, 'posts', 'meu-post.md'), '# Post\n');

    await git(['add', '--', 'posts/meu-post.md'], repo);

    const status = await git(['status', '--short'], repo);
    expect(status).toContain('A  posts/meu-post.md');
    expect(status).toContain(' M arquivo-base.txt'); // modificado, NÃO em stage (sem 'M ' na coluna de stage)
  });
});
