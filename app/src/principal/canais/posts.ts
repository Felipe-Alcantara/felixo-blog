import { ipcMain } from 'electron';
import { CANAIS } from '../../ponte/contrato';
import { lerPost, listarPosts, salvarPost } from '../posts/repositorio';

export function registrarCanaisPosts(): void {
  ipcMain.handle(CANAIS.postsListar, () => listarPosts());
  ipcMain.handle(CANAIS.postsLer, (_evento, slug: string) => lerPost(slug));
  ipcMain.handle(
    CANAIS.postsSalvar,
    (_evento, slug: string, frontmatter: unknown, corpo: string) =>
      salvarPost(slug, frontmatter, corpo),
  );
}
