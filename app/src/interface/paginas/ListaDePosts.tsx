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
    window.felixoEditor
      .listarPosts()
      .then(setPosts)
      .catch((e: unknown) => setErro(mensagemDeErro(e)));
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
