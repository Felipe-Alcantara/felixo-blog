import { useEffect, useState } from 'react';
import { mensagemDeErro } from '../erros';
import type { InfoDaDatabase } from '../../ponte/contrato';

const estiloCampo: React.CSSProperties = {
  width: '100%',
  background: 'var(--cor-fundo-painel)',
  border: '1px solid rgb(168 85 247 / 0.25)',
  borderRadius: '0.375rem',
  padding: '0.5rem 0.75rem',
  color: 'var(--cor-texto)',
  fontFamily: 'inherit',
};

export function ConfiguracaoNotion(): JSX.Element {
  const [token, setToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [infoDatabase, setInfoDatabase] = useState<InfoDaDatabase | null>(null);

  useEffect(() => {
    window.felixoEditor
      .obterConfiguracaoNotion()
      .then((config) => {
        setToken(config.notionToken);
        setDatabaseId(config.notionDatabaseId);
      })
      .finally(() => setCarregando(false));
  }, []);

  async function salvar(): Promise<void> {
    setErro(null);
    setMensagem(null);
    setSalvando(true);
    try {
      await window.felixoEditor.salvarConfiguracaoNotion({
        notionToken: token,
        notionDatabaseId: databaseId,
      });
      setMensagem('Configuração salva.');
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  async function testar(): Promise<void> {
    setErro(null);
    setMensagem(null);
    setInfoDatabase(null);
    setTestando(true);
    try {
      const info = await window.felixoEditor.testarConexaoNotion();
      setInfoDatabase(info);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setTestando(false);
    }
  }

  if (carregando) {
    return <p style={{ color: 'var(--cor-texto-fraco)' }}>Carregando…</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 560 }}>
      <p style={{ color: 'var(--cor-texto-fraco)', fontSize: '0.85rem' }}>
        Criado em{' '}
        <a href="https://www.notion.so/my-integrations" style={{ color: 'var(--cor-roxo)' }}>
          notion.so/my-integrations
        </a>
        . Depois de criar, compartilhe a database "Artigos" com a integração.
      </p>

      <label>
        Token de integração
        <input
          style={estiloCampo}
          type="password"
          value={token}
          placeholder="ntn_..."
          onChange={(e) => setToken(e.target.value)}
        />
      </label>

      <label>
        ID da database
        <input
          style={estiloCampo}
          value={databaseId}
          onChange={(e) => setDatabaseId(e.target.value)}
        />
      </label>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={salvar}
          disabled={salvando}
          style={{
            background: 'var(--cor-roxo-forte)',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '0.5rem 1.25rem',
            color: '#000',
            fontWeight: 600,
            cursor: salvando ? 'default' : 'pointer',
          }}
        >
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
        <button
          onClick={testar}
          disabled={testando || !token || !databaseId}
          style={{
            background: 'transparent',
            border: '1px solid var(--cor-roxo)',
            borderRadius: '0.375rem',
            padding: '0.5rem 1.25rem',
            color: 'var(--cor-roxo)',
            cursor: testando ? 'default' : 'pointer',
          }}
        >
          {testando ? 'Testando…' : 'Testar conexão'}
        </button>
      </div>

      {mensagem && <p style={{ color: '#4ade80' }}>{mensagem}</p>}
      {erro && <p style={{ color: '#f87171' }}>{erro}</p>}

      {infoDatabase && (
        <div style={{ background: 'var(--cor-fundo-painel)', borderRadius: '0.5rem', padding: '1rem' }}>
          <strong>{infoDatabase.titulo}</strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', color: 'var(--cor-texto-fraco)' }}>
            {infoDatabase.propriedades.map((p) => (
              <li key={p.nome}>
                {p.nome} <span style={{ opacity: 0.7 }}>({p.tipo})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
