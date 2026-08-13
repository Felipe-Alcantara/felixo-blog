import { useEffect, useState } from 'react';
import { ListaDePosts } from './paginas/ListaDePosts';
import { EditorDePost } from './paginas/EditorDePost';
import { ConfiguracaoNotion } from './paginas/ConfiguracaoNotion';

type Tela =
  | { nome: 'lista' }
  | { nome: 'editor'; slug: string | null }
  | { nome: 'configuracao' };

const estiloBotaoTopo: React.CSSProperties = {
  background: 'var(--cor-roxo-forte)',
  border: 'none',
  borderRadius: '0.375rem',
  padding: '0.4rem 0.9rem',
  color: '#000',
  fontWeight: 600,
  cursor: 'pointer',
};

const estiloBotaoTopoSecundario: React.CSSProperties = {
  ...estiloBotaoTopo,
  background: 'transparent',
  border: '1px solid var(--cor-roxo)',
  color: 'var(--cor-roxo)',
};

export function App(): JSX.Element {
  const [versao, setVersao] = useState<string | null>(null);
  const [tela, setTela] = useState<Tela>({ nome: 'lista' });

  useEffect(() => {
    window.felixoEditor
      .obterVersaoApp()
      .then(setVersao)
      .catch(() => setVersao('desconhecida'));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        padding: '1.5rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ color: 'var(--cor-roxo)', margin: 0, fontSize: '1.25rem' }}>
          Felixo Editor
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {tela.nome === 'lista' && (
            <>
              <button onClick={() => setTela({ nome: 'configuracao' })} style={estiloBotaoTopoSecundario}>
                Notion
              </button>
              <button onClick={() => setTela({ nome: 'editor', slug: null })} style={estiloBotaoTopo}>
                + Novo post
              </button>
            </>
          )}
          <span style={{ color: 'var(--cor-texto-fraco)', fontSize: '0.75rem' }}>
            versão {versao ?? '…'}
          </span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {tela.nome === 'lista' && (
          <ListaDePosts aoAbrir={(slug) => setTela({ nome: 'editor', slug })} />
        )}
        {tela.nome === 'editor' && (
          <EditorDePost slugInicial={tela.slug} aoVoltar={() => setTela({ nome: 'lista' })} />
        )}
        {tela.nome === 'configuracao' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => setTela({ nome: 'lista' })}
              style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--cor-roxo)', cursor: 'pointer', marginBottom: '0.75rem' }}
            >
              ← Voltar
            </button>
            <ConfiguracaoNotion />
          </div>
        )}
      </main>
    </div>
  );
}
