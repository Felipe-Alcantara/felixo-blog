import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { caminhoDoPost, caminhoDoRascunho, PASTA_DE_POSTS, PASTA_DE_RASCUNHOS } from './caminhos';
import { esquemaFrontmatter, type Frontmatter } from './esquema';
import { slugValido } from './slug';

export class PostInvalidoError extends Error {}

/**
 * `publicado`: só existe em `src/content/posts/`. `so-rascunho`: ainda não foi
 * publicado. `com-alteracoes`: já está publicado e há uma cópia em edição.
 */
export type SituacaoDoPost = 'publicado' | 'so-rascunho' | 'com-alteracoes';

export interface ResumoDePost {
  slug: string;
  frontmatter: Frontmatter;
  situacao: SituacaoDoPost;
}

export interface PostCompleto extends ResumoDePost {
  corpo: string;
}

/** Slugs dos `.md` de uma pasta (vazio se a pasta não existe). */
async function slugsDaPasta(pasta: string): Promise<string[]> {
  if (!existsSync(pasta)) return [];
  const entradas = await readdir(pasta, { withFileTypes: true });
  return entradas
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.replace(/\.md$/, ''));
}

/**
 * Lista os posts publicados (`src/content/posts/`) e os rascunhos
 * (`app/rascunhos/`), do mais recente para o mais antigo. Cada slug aparece
 * uma vez: se há rascunho, ele vence o publicado. Posts com frontmatter inválido
 * são reportados no console em vez de derrubar a listagem inteira — um `.md`
 * quebrado não pode travar o app de ver os outros 20.
 */
export async function listarPosts(): Promise<ResumoDePost[]> {
  const publicados = new Set(await slugsDaPasta(PASTA_DE_POSTS));
  const rascunhos = new Set(await slugsDaPasta(PASTA_DE_RASCUNHOS));

  const resumos: ResumoDePost[] = [];
  for (const slug of new Set([...publicados, ...rascunhos])) {
    try {
      const post = await lerPost(slug);
      resumos.push({ slug: post.slug, frontmatter: post.frontmatter, situacao: post.situacao });
    } catch (erro) {
      console.error(`[felixo-editor] post ignorado na listagem (${slug}.md):`, erro);
    }
  }

  return resumos.sort(
    (a, b) => b.frontmatter.publicadoEm.valueOf() - a.frontmatter.publicadoEm.valueOf(),
  );
}

/**
 * Lê e valida um post pelo slug: o rascunho, se existir, senão o publicado.
 * Lança `PostInvalidoError` se o schema não bater.
 */
export async function lerPost(slug: string): Promise<PostCompleto> {
  if (!slugValido(slug)) {
    throw new PostInvalidoError(`Slug inválido: "${slug}".`);
  }

  const temRascunho = existsSync(caminhoDoRascunho(slug));
  const temPublicado = existsSync(caminhoDoPost(slug));
  if (!temRascunho && !temPublicado) {
    throw new PostInvalidoError(`Post não encontrado: "${slug}".`);
  }

  const bruto = await readFile(temRascunho ? caminhoDoRascunho(slug) : caminhoDoPost(slug), 'utf-8');
  const { data, content } = matter(bruto);

  const validado = esquemaFrontmatter.safeParse(data);
  if (!validado.success) {
    throw new PostInvalidoError(
      `Frontmatter inválido em "${slug}.md": ${validado.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }

  const situacao: SituacaoDoPost = !temRascunho
    ? 'publicado'
    : temPublicado
      ? 'com-alteracoes'
      : 'so-rascunho';
  return { slug, frontmatter: validado.data, corpo: content.trim(), situacao };
}

/**
 * Grava o post como rascunho (`app/rascunhos/`), validando o frontmatter antes
 * de tocar o disco. Nunca grava em `src/content/posts/`: só o "Publicar" leva o
 * post para lá (ver `publicacao/publicar.ts`).
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

  const validado = esquemaFrontmatter.safeParse(frontmatterBruto);
  if (!validado.success) {
    throw new PostInvalidoError(
      validado.error.issues.map((i) => `${i.path.join('.') || 'frontmatter'}: ${i.message}`).join('; '),
    );
  }
  const frontmatter = removerCamposIndefinidos(validado.data);

  await mkdir(PASTA_DE_RASCUNHOS, { recursive: true });
  const arquivo = matter.stringify(`\n${corpo.trim()}\n`, frontmatter);
  await writeFile(caminhoDoRascunho(slug), arquivo, 'utf-8');
}

/**
 * Remove chaves com valor `undefined` de um objeto validado antes de
 * serializar.
 *
 * Campo opcional do schema (ex.: `capa`) pode chegar como `capa: undefined`
 * explícito — não ausente — quando quem chama monta o objeto com
 * `campo || undefined` (é o que a interface faz). Zod aceita `undefined`
 * como valor válido de campo opcional e preserva a chave; o serializador
 * YAML do `gray-matter`, porém, não sabe serializar `undefined` e lança
 * `YAMLException`. Corrige na borda de gravação, protegendo qualquer
 * chamador — não só a tela atual.
 */
function removerCamposIndefinidos<T extends object>(objeto: T): T {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== undefined),
  ) as T;
}
