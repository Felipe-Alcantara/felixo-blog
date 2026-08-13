import { useEffect, useRef, useState } from 'react';
import { derivarSlug, slugValido } from '../../principal/posts/slug';

interface Props {
  /** `null` = post novo (ainda sem arquivo). */
  slugInicial: string | null;
  /** Preenche o formulário ao abrir um post novo — usado após importar do Notion. */
  rascunhoInicial?: { slug: string; titulo: string; corpo: string };
  aoVoltar: () => void;
}

interface EstadoDoFormulario {
  slug: string;
  titulo: string;
  descricao: string;
  publicadoEm: string; // yyyy-mm-dd, formato de <input type="date">
  tags: string; // separadas por vírgula na UI, viram array ao salvar
  rascunho: boolean;
  corpo: string;
  capa: string;
}

function paraDataInput(data: Date): string {
  return data.toISOString().slice(0, 10);
}

const ESTADO_VAZIO: EstadoDoFormulario = {
  slug: '',
  titulo: '',
  descricao: '',
  publicadoEm: paraDataInput(new Date()),
  tags: '',
  rascunho: true,
  corpo: '',
  capa: '',
};

const estiloCampo: React.CSSProperties = {
  width: '100%',
  background: 'var(--cor-fundo-painel)',
  border: '1px solid rgb(168 85 247 / 0.25)',
  borderRadius: '0.375rem',
  padding: '0.5rem 0.75rem',
  color: 'var(--cor-texto)',
  fontFamily: 'inherit',
};

let contadorDeImagem = 0;

export function EditorDePost({ slugInicial, rascunhoInicial, aoVoltar }: Props): JSX.Element {
  const [estado, setEstado] = useState<EstadoDoFormulario>(
    rascunhoInicial
      ? {
          ...ESTADO_VAZIO,
          slug: rascunhoInicial.slug,
          titulo: rascunhoInicial.titulo,
          corpo: rascunhoInicial.corpo,
        }
      : ESTADO_VAZIO,
  );
  const [carregando, setCarregando] = useState(slugInicial !== null);
  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [gerandoCapa, setGerandoCapa] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!slugInicial) return;
    window.felixoEditor
      .lerPost(slugInicial)
      .then((post) => {
        setEstado({
          slug: post.slug,
          titulo: post.frontmatter.titulo,
          descricao: post.frontmatter.descricao,
          publicadoEm: paraDataInput(post.frontmatter.publicadoEm),
          tags: post.frontmatter.tags.join(', '),
          rascunho: post.frontmatter.rascunho,
          corpo: post.corpo,
          capa: post.frontmatter.capa ?? '',
        });
      })
      .catch((e: unknown) => setErro(e instanceof Error ? e.message : String(e)))
      .finally(() => setCarregando(false));
  }, [slugInicial]);

  const slugFinal = slugInicial ?? (estado.slug || derivarSlug(estado.titulo));

  function inserirNoCorpoNaPosicaoDoCursor(trecho: string): void {
    const area = textareaRef.current;
    if (!area) {
      setEstado((atual) => ({ ...atual, corpo: `${atual.corpo}\n\n${trecho}` }));
      return;
    }
    const inicio = area.selectionStart;
    const fim = area.selectionEnd;
    setEstado((atual) => ({
      ...atual,
      corpo: atual.corpo.slice(0, inicio) + trecho + atual.corpo.slice(fim),
    }));
  }

  async function enviarImagem(arquivo: File): Promise<void> {
    if (!slugValido(slugFinal)) {
      setErro('Defina um título (ou slug) válido antes de inserir imagem.');
      return;
    }
    setErro(null);
    setEnviandoImagem(true);
    try {
      contadorDeImagem += 1;
      const bytes = await arquivo.arrayBuffer();
      const nomeBase = `imagem-${String(contadorDeImagem).padStart(2, '0')}`;
      const caminhoRelativo = await window.felixoEditor.salvarImagemDoPost(slugFinal, nomeBase, bytes);
      inserirNoCorpoNaPosicaoDoCursor(`![](${caminhoRelativo})`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setEnviandoImagem(false);
    }
  }

  function aoColar(evento: React.ClipboardEvent<HTMLTextAreaElement>): void {
    const item = [...evento.clipboardData.items].find((i) => i.type.startsWith('image/'));
    if (!item) return;
    const arquivo = item.getAsFile();
    if (!arquivo) return;
    evento.preventDefault();
    void enviarImagem(arquivo);
  }

  function aoSoltar(evento: React.DragEvent<HTMLTextAreaElement>): void {
    const arquivo = [...evento.dataTransfer.files].find((f) => f.type.startsWith('image/'));
    if (!arquivo) return;
    evento.preventDefault();
    void enviarImagem(arquivo);
  }

  async function gerarCapa(): Promise<void> {
    if (!slugValido(slugFinal)) {
      setErro('Defina um título (ou slug) válido antes de gerar a capa.');
      return;
    }
    if (!estado.titulo) {
      setErro('Preencha o título antes de gerar a capa.');
      return;
    }
    setErro(null);
    setGerandoCapa(true);
    try {
      const caminhoRelativo = await window.felixoEditor.gerarCapaDoPost(
        slugFinal,
        estado.titulo,
        estado.descricao,
      );
      setEstado((atual) => ({ ...atual, capa: caminhoRelativo }));
      setMensagem('Capa gerada.');
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setGerandoCapa(false);
    }
  }

  async function salvar(): Promise<void> {
    setErro(null);
    setMensagem(null);

    if (!slugValido(slugFinal)) {
      setErro('Slug inválido — use apenas letras minúsculas, números e hífen.');
      return;
    }

    setSalvando(true);
    try {
      const tags = estado.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await window.felixoEditor.salvarPost(
        slugFinal,
        {
          titulo: estado.titulo,
          descricao: estado.descricao,
          publicadoEm: estado.publicadoEm,
          tags,
          rascunho: estado.rascunho,
          capa: estado.capa || undefined,
        },
        estado.corpo,
      );
      setMensagem('Salvo.');
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <p style={{ color: 'var(--cor-texto-fraco)' }}>Carregando…</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        maxWidth: 720,
      }}
    >
      <button onClick={aoVoltar} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--cor-roxo)', cursor: 'pointer' }}>
        ← Voltar
      </button>

      {!slugInicial && (
        <label>
          Slug (nome do arquivo — vira a URL pública)
          <input
            style={estiloCampo}
            value={estado.slug}
            placeholder={derivarSlug(estado.titulo) || 'meu-post'}
            onChange={(e) => setEstado({ ...estado, slug: e.target.value })}
          />
        </label>
      )}

      <label>
        Título
        <input
          style={estiloCampo}
          value={estado.titulo}
          onChange={(e) => setEstado({ ...estado, titulo: e.target.value })}
        />
      </label>

      <label>
        Descrição
        <input
          style={estiloCampo}
          value={estado.descricao}
          onChange={(e) => setEstado({ ...estado, descricao: e.target.value })}
        />
      </label>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <label style={{ flex: 1 }}>
          Publicado em
          <input
            type="date"
            style={estiloCampo}
            value={estado.publicadoEm}
            onChange={(e) => setEstado({ ...estado, publicadoEm: e.target.value })}
          />
        </label>
        <label style={{ flex: 2 }}>
          Tags (separadas por vírgula)
          <input
            style={estiloCampo}
            value={estado.tags}
            onChange={(e) => setEstado({ ...estado, tags: e.target.value })}
          />
        </label>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={estado.rascunho}
          onChange={(e) => setEstado({ ...estado, rascunho: e.target.checked })}
        />
        Rascunho (fica fora do build de produção)
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={gerarCapa}
          disabled={gerandoCapa}
          style={{
            background: 'transparent',
            border: '1px solid var(--cor-roxo)',
            borderRadius: '0.375rem',
            padding: '0.4rem 0.9rem',
            color: 'var(--cor-roxo)',
            cursor: gerandoCapa ? 'default' : 'pointer',
          }}
        >
          {gerandoCapa ? 'Gerando capa…' : 'Gerar capa'}
        </button>
        {estado.capa && (
          <span style={{ color: 'var(--cor-texto-fraco)', fontSize: '0.8rem' }}>{estado.capa}</span>
        )}
      </div>

      <label>
        Corpo (Markdown) — cole ou arraste uma imagem aqui para inseri-la
        <textarea
          ref={textareaRef}
          onPaste={aoColar}
          onDrop={aoSoltar}
          onDragOver={(e) => e.preventDefault()}
          style={{ ...estiloCampo, minHeight: 320, resize: 'vertical', fontFamily: 'var(--font-mono, monospace)' }}
          value={estado.corpo}
          onChange={(e) => setEstado({ ...estado, corpo: e.target.value })}
        />
      </label>
      {enviandoImagem && <span style={{ color: 'var(--cor-texto-fraco)', fontSize: '0.8rem' }}>Enviando imagem…</span>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            opacity: salvando ? 0.6 : 1,
          }}
        >
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
        {mensagem && <span style={{ color: '#4ade80' }}>{mensagem}</span>}
        {erro && <span style={{ color: '#f87171' }}>{erro}</span>}
      </div>
    </div>
  );
}
