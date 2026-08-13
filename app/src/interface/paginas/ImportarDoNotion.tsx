import { useEffect, useState } from 'react';
import type { ArtigoDoNotion } from '../../ponte/contrato';
import { derivarSlug } from '../../principal/posts/slug';

interface Props {
  aoImportar: (rascunho: { slug: string; titulo: string; corpo: string }) => void;
  aoVoltar: () => void;
}

export function ImportarDoNotion({ aoImportar, aoVoltar }: Props): JSX.Element {
  const [artigos, setArtigos] = useState<ArtigoDoNotion[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [importando, setImportando] = useState<string | null>(null);

  useEffect(() => {
    window.felixoEditor
      .listarArtigosNotion()
      .then(setArtigos)
      .catch((e: unknown) => setErro(e instanceof Error ? e.message : String(e)));
  }, []);

  async function importar(artigo: ArtigoDoNotion): Promise<void> {
    setErro(null);
    setImportando(artigo.id);
    try {
      const slug = derivarSlug(artigo.titulo);
      const resultado = await window.felixoEditor.importarArtigoNotion(artigo.id, slug);
      aoImportar({ slug, titulo: resultado.titulo, corpo: resultado.corpo });
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setImportando(null);
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <button
        onClick={aoVoltar}
        style={{ background: 'none', border: 'none', color: 'var(--cor-roxo)', cursor: 'pointer', marginBottom: '0.75rem' }}
      >
        ← Voltar
      </button>

      {erro && <p style={{ color: '#f87171' }}>{erro}</p>}

      {!artigos && !erro && <p style={{ color: 'var(--cor-texto-fraco)' }}>Buscando artigos…</p>}

      {artigos?.length === 0 && (
        <p style={{ color: 'var(--cor-texto-fraco)' }}>Nenhum artigo encontrado na database.</p>
      )}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {artigos?.map((artigo) => (
          <li key={artigo.id}>
            <button
              onClick={() => importar(artigo)}
              disabled={importando !== null}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'var(--cor-fundo-painel)',
                border: '1px solid rgb(168 85 247 / 0.25)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                color: 'var(--cor-texto)',
                cursor: importando ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {artigo.titulo}
              {importando === artigo.id ? ' — importando…' : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
