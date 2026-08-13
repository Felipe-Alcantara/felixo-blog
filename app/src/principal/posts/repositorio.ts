import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { caminhoDoPost, PASTA_DE_POSTS } from './caminhos';
import { esquemaFrontmatter, type Frontmatter } from './esquema';
import { slugValido } from './slug';

export class PostInvalidoError extends Error {}

export interface ResumoDePost {
  slug: string;
  frontmatter: Frontmatter;
}

export interface PostCompleto extends ResumoDePost {
  corpo: string;
}

/**
 * Lista os posts existentes em `src/content/posts/`, do mais recente para o
 * mais antigo. Posts com frontmatter inválido são reportados no console em
 * vez de derrubar a listagem inteira — um `.md` quebrado não pode travar o
 * app de ver os outros 20.
 */
export async function listarPosts(): Promise<ResumoDePost[]> {
  if (!existsSync(PASTA_DE_POSTS)) return [];

  const entradas = await readdir(PASTA_DE_POSTS, { withFileTypes: true });
  const arquivosMd = entradas.filter((e) => e.isFile() && e.name.endsWith('.md'));

  const resumos: ResumoDePost[] = [];
  for (const arquivo of arquivosMd) {
    const slug = arquivo.name.replace(/\.md$/, '');
    try {
      const post = await lerPost(slug);
      resumos.push({ slug: post.slug, frontmatter: post.frontmatter });
    } catch (erro) {
      console.error(`[felixo-editor] post ignorado na listagem (${arquivo.name}):`, erro);
    }
  }

  return resumos.sort(
    (a, b) => b.frontmatter.publicadoEm.valueOf() - a.frontmatter.publicadoEm.valueOf(),
  );
}

/** Lê e valida um post pelo slug. Lança `PostInvalidoError` se o schema não bater. */
export async function lerPost(slug: string): Promise<PostCompleto> {
  if (!slugValido(slug)) {
    throw new PostInvalidoError(`Slug inválido: "${slug}".`);
  }

  const caminho = caminhoDoPost(slug);
  if (!existsSync(caminho)) {
    throw new PostInvalidoError(`Post não encontrado: "${slug}".`);
  }

  const bruto = await readFile(caminho, 'utf-8');
  const { data, content } = matter(bruto);

  const validado = esquemaFrontmatter.safeParse(data);
  if (!validado.success) {
    throw new PostInvalidoError(
      `Frontmatter inválido em "${slug}.md": ${validado.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }

  return { slug, frontmatter: validado.data, corpo: content.trim() };
}

/**
 * Grava um post, validando o frontmatter antes de tocar o disco.
 *
 * Nunca sobrescreve silenciosamente um slug diferente do informado — o nome
 * do arquivo é a URL pública do post (ver AGENTS.md), então trocar o slug é
 * sempre uma ação explícita de quem chama, não um efeito colateral daqui.
 */
export async function salvarPost(
  slug: string,
  frontmatterBruto: unknown,
  corpo: string,
): Promise<void> {
  if (!slugValido(slug)) {
    throw new PostInvalidoError(
      `Slug inválido: "${slug}". Use apenas letras minúsculas, números e hífen.`,
    );
  }

  const frontmatter = esquemaFrontmatter.parse(frontmatterBruto);

  await mkdir(PASTA_DE_POSTS, { recursive: true });
  const arquivo = matter.stringify(`\n${corpo.trim()}\n`, frontmatter);
  await writeFile(caminhoDoPost(slug), arquivo, 'utf-8');
}
