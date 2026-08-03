---
titulo: 'Testando todos os recursos do blog'
descricao: 'Post de verificação: reúne imagem, código com realce de sintaxe, tabela, listas, citação e link, tudo num só lugar para testar o layout.'
publicadoEm: 2026-08-02
tags: ['Meta', 'Teste']
rascunho: true
---

Este post não é conteúdo de verdade — é uma bateria de teste. A ideia é reunir,
num só lugar, cada elemento de Markdown que o blog precisa saber renderizar
bem, para dar uma olhada de uma vez só. Enquanto `rascunho: true` estiver no
frontmatter, ele só aparece em `npm run dev` — nunca no build de produção.

## Texto e ênfase

Um parágrafo normal, com **negrito**, _itálico_ e um `trecho de código inline`.
Também dá pra linkar coisas, como o [portfólio](https://felixo.com.br/) ou o
[repositório do blog](https://github.com/Felipe-Alcantara/felixo-blog).

## Listas

Lista não ordenada:

- Primeiro item
- Segundo item, com **destaque**
- Terceiro item

Lista ordenada:

1. Instalar as dependências
2. Escrever o post
3. Rodar `npm run check`
4. Publicar

## Citação

> Prefira sempre um script a uma mudança manual.

## Código

Bloco de código com realce de sintaxe (tema `night-owl`, configurado no
`astro.config.mjs`):

```python
def saudacao(nome: str) -> str:
    """Retorna uma saudação simples."""
    return f"Olá, {nome}!"


print(saudacao("mundo"))
```

## Imagem

Imagem co-localizada ao lado deste post (`./testando-os-recursos-do-blog/capa.png`),
otimizada automaticamente pelo Astro no build — vira WebP, ganha `width`/`height`
e `loading="lazy"` sem nenhuma configuração extra:

![Gradiente roxo de teste, do tom mais claro da marca ao mais escuro](./testando-os-recursos-do-blog/capa.png)

## Tabela

| Recurso          | Suportado |
| ----------------- | --------- |
| Imagem otimizada   | Sim       |
| Código com realce  | Sim       |
| Tabela             | Sim       |
| Tags               | Sim       |

## Recursos do GitHub-Flavored Markdown

Lista de tarefas:

- [x] Escrever o post de teste
- [ ] Revisar a checklist de tarefas
- [ ] Publicar

Texto ~~riscado~~ e um link automático sem colchetes: https://blog.felixo.com.br

## Lista aninhada

- Item de primeiro nível
  - Sub-item A
  - Sub-item B
    - Sub-sub-item
- Outro item de primeiro nível

## Código sem linguagem declarada

```
sem realce de sintaxe aqui, só texto monoespaçado
```

## Sub-hierarquia de títulos

### H3 — subseção

#### H4 — sub-subseção

##### H5 — ainda mais fundo

###### H6 — o fundo do poço

## Tabela com alinhamento

| Esquerda | Centro | Direita |
| :------- | :----: | ------: |
| a        |   b    |       c |
| linha 2  | linha  |     123 |

---

## Conclusão

Se todos os elementos acima apareceram com a identidade visual do blog —
fundo escuro, roxo de marca, tipografia consistente — o layout está
cobrindo o que os posts de verdade vão precisar.
