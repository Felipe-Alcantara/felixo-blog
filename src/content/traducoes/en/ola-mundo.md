---
titulo: 'Hello, world: why I finally created this blog!'
descricao: "After (literally) years of putting it off, I opened up a space to write about computing, good practices and the tools I've been building. And this is the inaugural post."
tags: ['Meta', 'Best Practices']
revisado: false
---

It really has been years since I started planning to create a blog to get my ideas in order. I never lacked the will, but I always lacked a subject I thought was worth writing about, and a place I'd like to look at every day. Both things changed this year.

![The blog's cat peeking over a desk full of papers, sticky notes, lists, a calendar and drafts, with a pencil in its paw, organizing everything to write the blog.](../../posts/ola-mundo/organizando-o-blog.webp)

## What changed

After a while studying and, mainly, **building things**, I started to accumulate decisions that I make over and over without ever having written down why. Every time I explained one of them to someone, I realized the explanation was already ready in my head. It just wasn't anywhere.

A blog is exactly that: the place where the explanation stops living only in my head.

![The blog's cat sitting with raised eyebrows, a sideways glance and a drop of sweat on its forehead, looking toward a huge pile of books, like in the SpongeBob meme.](../../posts/ola-mundo/gatinho-e-os-livros.webp)

## What you'll find here

- **Uncomplicated computing.** In a way that even your aunt will understand. Linking concepts in an interesting way for those who are just starting out.
- **Tested best practices.** I've always cared about being organized and meticulous, given my limits. In programming the care is redoubled and many things can go unnoticed, so I'll try to gather everything I've learned about best practices, from the beginning up to where I've got to.
- **Automations and tools.** A good part of my time goes into building things that do the boring work for me. Problems I created myself and solve myself, and that's what makes me grow. And I'll show how they work.
- **FelixoVerse.** My biggest personal project, a bit too ambitious, but with years of planning.

![The blog's cat, wearing glasses and studying at a desk in front of four monitors filled with code.](../../posts/ola-mundo/gatinho-estudando-cena-invertida.webp)

## A principle that guides almost everything here

If I had to sum up what I've learned in the last few years in a single sentence, it would be this:

> In the age of AI, always prefer a script to a manual change. Code is cheap, so use it to your advantage!

It seems small, but it changes the whole way of thinking. A manual change, besides being slower, solves today's problem and leaves no trace. A script solves the problem of today, of tomorrow, and the one six months from now, and, even better, it can be read, fixed and extended later, by you or by any tool you use to help you. With AI, your code repertoire says who you are! Code, tokens, time, all of this is money, and when you understand the importance of writing good, reusable code, you will be saving these 4 pillars.

In practice, this means that when I need to change a lot of data, or perform any manual action, my first instinct is not to open the interface and click: it's to write (or ask for) something like this.

<div
  class="animacao-renomear-lote"
  role="group"
  aria-label="Interactive demonstration of the renomear_em_lote function."
>
  <input
    class="animacao-renomear-lote__estado"
    id="renomear-lote-en"
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
        """Applies a prefix to each item, preserving the original order."""
      </code>
      <code class="animacao-renomear-lote__linha animacao-renomear-lote__retorno">
        <span>return [f"</span><span class="animacao-renomear-lote__string">{prefixo}</span><span>{item}" for item in itens]</span>
      </code>
    </div>
  </div>

  <div class="animacao-renomear-lote__lista" aria-live="polite">
    <div class="animacao-renomear-lote__cabecalho">
      <span>items</span>
      <span></span>
      <span>result</span>
      <label class="animacao-renomear-lote__executar" for="renomear-lote-en">
        <span class="animacao-renomear-lote__icone-executar" aria-hidden="true">▶</span>
        <span class="animacao-renomear-lote__rotulo-executar">run</span>
        <span class="animacao-renomear-lote__icone-reiniciar" aria-hidden="true">↻</span>
        <span class="animacao-renomear-lote__rotulo-reiniciar">reset</span>
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

Thirty seconds more to write. Reusable forever, and very useful later.

## What now?

This is post number one, and it exists mainly so that number two has somewhere to show up. If you want to follow along, the [RSS feed](/rss.xml) is live.

Until next time.
