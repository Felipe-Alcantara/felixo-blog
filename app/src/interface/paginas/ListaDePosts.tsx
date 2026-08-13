import { useEffect, useState } from 'react';
import { mensagemDeErro } from '../erros';
import type { ResumoDePost } from '../../ponte/contrato';

interface Props {
  aoAbrir: (slug: string) => void;
}

const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

export function ListaDePosts({ aoAbrir }: Props): JSX.Element {
  const [posts, setPosts] = useState<ResumoDePost[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    function carregar(): void {
      window.felixoEditor
        .listarPosts()
        .then(setPosts)
        .catch((e: unknown) => setErro(mensagemDeErro(e)));
    }

    carregar();

    // Sem observador de arquivo: recarrega sempre que a janela ganha foco,
    // que é quando um post editado por fora (outro editor, importação
    // manual) tem chance real de ter mudado. Não pisca a cada troca de
    // aba interna porque este componente já remonta ao voltar pra cá.
    window.addEventListener('focus', carregar);
    return () => window.removeEventListener('focus', carregar);
  }, []);

  if (erro) {
    return <p style={{ color: '#f87171' }}>Erro ao listar posts: {erro}</p>;
  }

  if (!posts) {
    return <p style={{ color: 'var(--cor-texto-fraco)' }}>Carregando posts…</p>;
  }

  if (posts.length === 0) {
    return <p style={{ color: 'var(--cor-texto-fraco)' }}>Nenhum post encontrado ainda.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 640 }}>
      {posts.map((post) => (
        <li key={post.slug}>
          <button
            onClick={() => aoAbrir(post.slug)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'var(--cor-fundo-painel)',
              border: '1px solid rgb(168 85 247 / 0.25)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              color: 'var(--cor-texto)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <strong>{post.frontmatter.titulo}</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--cor-texto-fraco)' }}>
              {formatoData.format(post.frontmatter.publicadoEm)}
              {post.frontmatter.rascunho ? ' · rascunho' : ''}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
