import { describe, expect, it } from 'vitest';
import { interpretarErroDeValidacao, limparMensagemDoIpc } from '../src/interface/erros';

describe('limparMensagemDoIpc', () => {
  it('remove o embrulho padrão do Electron', () => {
    expect(
      limparMensagemDoIpc(
        "Error invoking remote method 'posts:salvar': Error: descricao: Descrição não pode ser vazia",
      ),
    ).toBe('descricao: Descrição não pode ser vazia');
  });

  it('devolve a mensagem original quando não há embrulho', () => {
    expect(limparMensagemDoIpc('falha de rede')).toBe('falha de rede');
  });
});

describe('interpretarErroDeValidacao', () => {
  it('interpreta um único campo inválido, já com o embrulho do Electron', () => {
    const passos = interpretarErroDeValidacao(
      "Error invoking remote method 'posts:salvar': Error: descricao: Descrição não pode ser vazia",
    );
    expect(passos).toEqual([
      { campo: 'descricao', rotulo: 'Descrição', motivo: 'Descrição não pode ser vazia' },
    ]);
  });

  it('interpreta múltiplos campos separados por ponto e vírgula', () => {
    const passos = interpretarErroDeValidacao(
      'titulo: Título não pode ser vazio.; descricao: Descrição não pode ser vazia.',
    );
    expect(passos).toEqual([
      { campo: 'titulo', rotulo: 'Título', motivo: 'Título não pode ser vazio.' },
      { campo: 'descricao', rotulo: 'Descrição', motivo: 'Descrição não pode ser vazia.' },
    ]);
  });

  it('devolve null para erro que não é de validação (ex.: rede, git)', () => {
    expect(interpretarErroDeValidacao('Falha ao conectar: ECONNREFUSED')).toBeNull();
    expect(interpretarErroDeValidacao('git push falhou: stderr real do git')).toBeNull();
  });

  it('devolve null para campo desconhecido (não força interpretação errada)', () => {
    expect(interpretarErroDeValidacao('campoInventado: alguma coisa')).toBeNull();
  });
});
