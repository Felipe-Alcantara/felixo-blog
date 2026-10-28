---
titulo: 'Olá, mundo: por que eu finalmente criei este blog!'
descricao: 'Depois de (literalmente) anos adiando, abri um espaço para escrever sobre computação, boas práticas e as ferramentas que ando construindo. E este é o post inaugural.'
publicadoEm: 2026-07-31
tags: ['Meta', 'Boas Práticas']
---

Faz realmente anos que eu planejo criar um blog para colocar minhas ideias em dia. Nunca faltou vontade, mas sempre faltava assunto que eu achasse que valia a pena ser escrito, e um lugar que eu gostasse de olhar todo dia. As duas coisas mudaram este ano.

![O gatinho do blog espiando por cima de uma mesa cheia de papéis, post-its, listas, um calendário e rascunhos, com um lápis na pata, organizando tudo para escrever o blog.](./ola-mundo/organizando-o-blog.webp)

## O que mudou

Depois de um tempo estudando e, principalmente, **construindo coisas**, comecei a acumular decisões que eu tomo repetidamente sem nunca ter escrito o porquê. Toda vez que eu explicava alguma delas para alguém, percebia que a explicação já estava pronta na minha cabeça, só não estava em lugar nenhum.

Blog é justamente isso: o lugar onde a explicação para de morar só na minha cabeça.

![O gatinho do blog sentado, de sobrancelhas levantadas, olhar de lado e uma gota de suor na testa, diante de uma pilha enorme de livros, como no meme do Bob Esponja.](./ola-mundo/gatinho-e-os-livros.webp)

## O que você vai encontrar aqui

- **Computação descomplicada.** De um jeito que até a sua tia vai entender. Ligando conceitos de uma forma interessante pra quem tá começando.
- **Boas práticas testadas.** Eu sempre me importei em ser organizado e caprichado, dados os meus limites. Em programação o cuidado é redobrado e muitas coisas podem passar despercebidas, então eu vou tentar reunir tudo que eu aprendi de boas práticas desde o começo até onde cheguei.
- **Automações e ferramentas.** Boa parte do meu tempo vai em construir coisas que fazem o trabalho chato por mim. Problemas que eu mesmo criei e eu mesmo resolvo, e é isso que me faz evoluir. E vou mostrar como elas funcionam.
- **FelixoVerse.** Meu maior projeto pessoal, um pouco ambicioso demais, porém com anos de planejamento.

![O gatinho do blog, de óculos, estudando à mesa diante de quatro monitores cheios de código.](./ola-mundo/gatinho-estudando-cena-invertida.webp)

## Um princípio que guia quase tudo por aqui

Se eu tivesse que resumir o que aprendi nos últimos anos em uma frase só, seria esta:

> Na era da IA, prefira sempre um script a uma mudança manual. Código é barato, e use-o a seu favor!

Parece pequeno, mas muda toda forma de pensar. Uma mudança manual, além de mais lenta, resolve o problema de hoje e não deixa rastro. Um script resolve o problema de hoje, de amanhã, e o de daqui a seis meses, e, melhor ainda, pode ser lido, corrigido e estendido depois, por você ou por qualquer ferramenta que você use para te ajudar. Com IA, o seu repertório de código, diz quem você é! Código, Tokens, Tempo, tudo isso é dinheiro, e quando você entender a importância de escrever um código bom, e reutilizável, estará economizando estes 4 pilares.

Na prática, isso significa que quando eu preciso mexer em muitos dados, ou realizar qualquer ação manual, o primeiro instinto não é abrir a interface e clicar: é escrever (ou pedir) algo como isto.

<div
  class="animacao-renomear-lote"
  role="group"
  aria-label="Demonstração interativa da função renomear_em_lote."
>
  <input
    class="animacao-renomear-lote__estado"
    id="renomear-lote-pt"
    type="checkbox"
  />
  <div class="animacao-renomear-lote__codigo">
    <div class="animacao-renomear-lote__barra">
      <span class="animacao-renomear-lote__ponto animacao-renomear-lote__ponto--rosa" aria-hidden="true"></span>
      <span class="animacao-renomear-lote__ponto animacao-renomear-lote__ponto--amarelo" aria-hidden="true"></span>
      <span class="animacao-renomear-lote__ponto animacao-renomear-lote__ponto--verde" aria-hidden="true"></span>
      <span class="animacao-renomear-lote__linguagem">Python</span>
    </div>
    <div class="animacao-renomear-lote__linhas">
      <code class="animacao-renomear-lote__linha">
        <span class="animacao-renomear-lote__palavra-chave">def</span>
        <span class="animacao-renomear-lote__funcao">renomear_em_lote</span>(itens:
        <span class="animacao-renomear-lote__tipo">list[str]</span>, prefixo:
        <span class="animacao-renomear-lote__tipo">str</span>) -&gt;
        <span class="animacao-renomear-lote__tipo">list[str]</span>:
      </code>
      <code class="animacao-renomear-lote__linha animacao-renomear-lote__comentario">
        """Aplica um prefixo a cada item, preservando a ordem original."""
      </code>
      <code class="animacao-renomear-lote__linha animacao-renomear-lote__retorno">
        <span>return [f"</span><span class="animacao-renomear-lote__string">{prefixo}</span><span>{item}" for item in itens]</span>
      </code>
    </div>
  </div>

  <div class="animacao-renomear-lote__lista" aria-live="polite">
    <div class="animacao-renomear-lote__cabecalho">
      <span>itens</span>
      <span></span>
      <span>resultado</span>
      <label class="animacao-renomear-lote__executar" for="renomear-lote-pt">
        <span class="animacao-renomear-lote__icone-executar" aria-hidden="true">▶</span>
        <span class="animacao-renomear-lote__rotulo-executar">executar</span>
        <span class="animacao-renomear-lote__icone-reiniciar" aria-hidden="true">↻</span>
        <span class="animacao-renomear-lote__rotulo-reiniciar">reiniciar</span>
      </label>
    </div>
    <div class="animacao-renomear-lote__linha-lista animacao-renomear-lote__linha-lista--um">
      <span class="animacao-renomear-lote__item">relatorio.pdf</span>
      <span class="animacao-renomear-lote__seta animacao-renomear-lote__animada">→</span>
      <span class="animacao-renomear-lote__resultado animacao-renomear-lote__animada animacao-renomear-lote__resultado--um">
        <span class="animacao-renomear-lote__prefixo">prefixo_</span>relatorio.pdf
      </span>
      <span></span>
    </div>
    <div class="animacao-renomear-lote__linha-lista animacao-renomear-lote__linha-lista--dois">
      <span class="animacao-renomear-lote__item">notas.txt</span>
      <span class="animacao-renomear-lote__seta animacao-renomear-lote__animada">→</span>
      <span class="animacao-renomear-lote__resultado animacao-renomear-lote__animada animacao-renomear-lote__resultado--dois">
        <span class="animacao-renomear-lote__prefixo">prefixo_</span>notas.txt
      </span>
      <span></span>
    </div>
    <div class="animacao-renomear-lote__linha-lista animacao-renomear-lote__linha-lista--tres">
      <span class="animacao-renomear-lote__item">fotos.zip</span>
      <span class="animacao-renomear-lote__seta animacao-renomear-lote__animada">→</span>
      <span class="animacao-renomear-lote__resultado animacao-renomear-lote__animada animacao-renomear-lote__resultado--tres">
        <span class="animacao-renomear-lote__prefixo">prefixo_</span>fotos.zip
      </span>
      <span></span>
    </div>
  </div>
</div>

Trinta segundos a mais para escrever. Reutilizável para sempre, e muito útil depois.

## E agora?

Este é o post número um, e ele existe principalmente para o número dois ter onde aparecer. Se quiser acompanhar, o [feed RSS](/rss.xml) está no ar.

Até a próxima.
