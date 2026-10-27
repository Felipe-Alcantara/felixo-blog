---
titulo: 'Olá, mundo: por que eu finalmente criei este blog!'
descricao: 'Depois de (literalmente) anos adiando, abri um espaço para escrever sobre computação, boas práticas e as ferramentas que ando construindo. E este é o post inaugural.'
publicadoEm: 2026-07-31
tags: ['Meta', 'Boas Práticas']
---

Faz realmente anos que eu planejo criar um blog para colocar minhas ideias em dia. Nunca faltou vontade, mas sempre faltava assunto que eu achasse que valia a pena ser escrito, e um lugar que eu gostasse de olhar todo dia. As duas coisas mudaram este ano.

## O que mudou

Depois de um tempo estudando e, principalmente, **construindo coisas**, comecei a acumular decisões que eu tomo repetidamente sem nunca ter escrito o porquê. Toda vez que eu explicava alguma delas para alguém, percebia que a explicação já estava pronta na minha cabeça, só não estava em lugar nenhum.

Blog é justamente isso: o lugar onde a explicação para de morar só na minha cabeça.

## O que você vai encontrar aqui

- **Computação descomplicada.** De um jeito que até a sua tia vai entender. Ligando conceitos de uma forma interessante pra quem tá começando.
- **Boas práticas testadas.** Eu sempre me importei em ser organizado e caprichado, dados os meus limites. Em programação o cuidado é redobrado e muitas coisas podem passar despercebidas, então eu vou tentar reunir tudo que eu aprendi de boas práticas desde o começo até onde cheguei.
- **Automações e ferramentas.** Boa parte do meu tempo vai em construir coisas que fazem o trabalho chato por mim. Problemas que eu mesmo criei e eu mesmo resolvo, e é isso que me faz evoluir. E vou mostrar como elas funcionam.
- **FelixoVerse.** Meu maior projeto pessoal, um pouco ambicioso demais, porém com anos de planejamento.

## Um princípio que guia quase tudo por aqui

Se eu tivesse que resumir o que aprendi nos últimos anos em uma frase só, seria esta:

> Na era da IA, prefira sempre um script a uma mudança manual. Código é barato, e use-o a seu favor!

Parece pequeno, mas muda toda forma de pensar. Uma mudança manual, além de mais lenta, resolve o problema de hoje e não deixa rastro. Um script resolve o problema de hoje, de amanhã, e o de daqui a seis meses, e, melhor ainda, pode ser lido, corrigido e estendido depois, por você ou por qualquer ferramenta que você use para te ajudar. Com IA, o seu repertório de código, diz quem você é! Código, Tokens, Tempo, tudo isso é dinheiro, e quando você entender a importância de escrever um código bom, e reutilizável, estará economizando estes 4 pilares.

Na prática, isso significa que quando eu preciso mexer em muitos dados, ou realizar qualquer ação manual, o primeiro instinto não é abrir a interface e clicar: é escrever (ou pedir) algo como isto.

```python
def renomear_em_lote(itens: list[str], prefixo: str) -> list[str]:
    """Aplica um prefixo a cada item, preservando a ordem original."""
    return [f"{prefixo}{item}" for item in itens]
```

Trinta segundos a mais para escrever. Reutilizável para sempre, e muito útil depois.

## E agora?

Este é o post número um, e ele existe principalmente para o número dois ter onde aparecer. Se quiser acompanhar, o [feed RSS](/rss.xml) está no ar.

Até a próxima.
