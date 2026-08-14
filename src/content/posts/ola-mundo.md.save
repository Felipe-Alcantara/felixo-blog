---
titulo: 'Olá, mundo: por que eu finalmente criei este blog!'
descricao: 'Depois de (literalmente) anos adiando, abri um espaço para escrever sobre computação, boas práticas e as ferramentas que ando construindo. E este é o post inaugural.'
publicadoEm: 2026-07-31
tags: ['Meta', 'Boas Práticas']
---

Faz realmente anos que eu planejo criar um blog para colocar minhas ideias em dia. Nunca faltou vontade, mas sempre faltava assunto que eu achasse que valia a pena ser escrito, e um lugar que eu gostasse de olhar todo dia. As duas coisas mudaram este ano.

## O que mudou

Depois de um tempo estudando e, principalmente, **construindo coisas**, comecei a acumular decisões que eu tomo repetidamente sem nunca ter escrito o porquê. Toda vez que eu explicava alguma delas para alguém, percebia que a explicação já estava pronta na minha cabeça — só não estava em lugar nenhum.

Blog é justamente isso: o lugar onde a explicação para de morar só na sua cabeça.

## O que você vai encontrar aqui

- **Programação descomplicada.** Explicação direta, sem enfeite. Se um conceito precisa de três parágrafos para ficar claro, ele leva três parágrafos — não trinta.
- **Boas práticas testadas.** Nada de regra copiada de thread. O que aparece aqui eu uso nos meus próprios projetos e sei onde dói.
- **Automações e ferramentas.** Boa parte do meu tempo vai em construir coisas que fazem o trabalho chato por mim. Vou mostrar como elas funcionam.
- **FelixoVerse.** Bastidores do desenvolvimento, incluindo os ARGs.

## Um princípio que guia quase tudo por aqui

Se eu tivesse que resumir o que aprendi nos últimos anos em uma frase só, seria esta:

> Prefira sempre um script a uma mudança manual.

Parece pequeno, mas muda tudo. Uma mudança manual resolve o problema de hoje e não deixa rastro. Um script resolve o problema de hoje **e** o de daqui a seis meses — e, melhor ainda, pode ser lido, corrigido e estendido depois, por você ou por qualquer ferramenta que você use para te ajudar.

Na prática, isso significa que quando eu preciso mexer em muitos dados, o primeiro instinto não é abrir a interface e clicar: é escrever algo como isto.

```python
def renomear_em_lote(itens: list[str], prefixo: str) -> list[str]:
    """Aplica um prefixo a cada item, preservando a ordem original."""
    return [f"{prefixo}{item}" for item in itens]
```

Trinta segundos a mais para escrever. Reutilizável para sempre.

## E agora?

Este é o post número um, e ele existe principalmente para o número dois ter onde aparecer. Se quiser acompanhar, o [feed RSS](/rss.xml) está no ar.

Até a próxima.
