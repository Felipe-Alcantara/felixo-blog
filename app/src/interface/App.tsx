import { useEffect, useState } from 'react';

/**
 * Casca inicial do Felixo Editor. Ainda não fala com Notion, git nem
 * arquivos — só prova que a janela sobe, o processo principal responde por
 * IPC e o isolamento de segurança (`ponte/`) está de pé. As telas de posts,
 * Notion e publicação chegam nas próximas fatias do plano.
 */
export function App(): JSX.Element {
  const [versao, setVersao] = useState<string | null>(null);

  useEffect(() => {
    window.felixoEditor
      .obterVersaoApp()
      .then(setVersao)
      .catch(() => setVersao('desconhecida'));
  }, []);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '0.75rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'var(--cor-roxo)', margin: 0 }}>Felixo Editor</h1>
      <p style={{ color: 'var(--cor-texto-fraco)', margin: 0 }}>
        Esqueleto do app — Notion, posts e publicação chegam nas próximas fatias.
      </p>
      <p style={{ color: 'var(--cor-texto-fraco)', fontSize: '0.85rem', margin: 0 }}>
        versão {versao ?? '…'}
      </p>
    </main>
  );
}
