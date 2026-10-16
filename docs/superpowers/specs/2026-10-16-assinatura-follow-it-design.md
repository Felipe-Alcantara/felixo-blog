# Assinatura dos posts novos com follow.it — design

Data: 2026-10-16 · Aprovado pelo dono no chat (parte 1: como funciona; parte 2:
o que muda no blog).

## Objetivo

Quem lê o blog consegue assinar e passar a receber os posts novos por e-mail
(e, se quiser, pelo app do follow.it ou por RSS), sem back-end próprio e sem
custo. Sucesso: um leitor digita o e-mail em qualquer um dos quatro lugares,
confirma no follow.it e recebe o aviso quando sai um post novo.

## Decisões já tomadas (com o dono)

- **Serviço:** follow.it, plano Basic (grátis). Descartados: Kit, Buttondown e
  MailerLite (RSS-to-email pago), OneSignal + GitHub Actions (mais trabalho).
- **O dono aceitou os limites do plano grátis:** anúncios, marca e "artigos
  sugeridos" do follow.it nos e-mails; feed lido a cada 6 h; padrão de e-mail
  "Newspaper" (resumo diário) travado, com cada assinante podendo trocar para
  um e-mail por post; sem redirecionamento de volta ao blog; sem diretório.
- **Notificação no navegador:** fica de fora por enquanto (o follow.it não
  oferece). Melhoria futura.
- **Lugares:** fim de cada post, home, página Sobre e rodapé de todas as
  páginas.
- **Feed já configurado no follow.it:** `blog-do-felixo`, ligado à conta do
  dono, verificação publicada (commit `ebdc9ca`).

## Fora de escopo

Notificação no navegador; tradução da descrição longa do feed no follow.it;
página "obrigado" no blog (o plano grátis não redireciona); qualquer
JavaScript no cliente para a assinatura.

## Arquitetura

### Configuração (`src/config/site.ts`)

`FOLLOWIT` ganha dois campos, ao lado de `verificacao` (que já existe):

```ts
export const FOLLOWIT = {
  verificacao: 'nDnjKRVEAyctn8CkYXUb',
  /** Endereço de envio do formulário gerado pelo follow.it (POST, campo `email`). */
  formulario:
    'https://api.follow.it/subscription-form/Z2NUZVdmSzRYcm90N0tCK0NmMjcwc3JkUHBzcXhDVTJzbEpLMEpodGIvV0dqT1dCeTQ4V2RjU2k0VFAvZlJ3VVRXTFFGb3BncjNKQXBQQzQ4cFJDZ2ExTndqM0xrbjcyTlZraXBsVFJvUCtYT2twN0pvOVhpWVhoM3IycnYwbCt8YXFHSUVGOEdnQmxuV1NCNW1wdXpvMjl1WVI1RlhvMDV6cWM1N2RvWUFWMD0=/8',
  /** Página do feed onde o leitor escolhe o canal; o `?pub` mantém o e-mail na lista do dono. */
  seguir: 'https://follow.it/blog-do-felixo?pub',
};
```

Os três são públicos por natureza (aparecem no HTML de qualquer site que usa
follow.it). `formulario` vazio desliga o componente inteiro, no mesmo padrão
do GoatCounter.

### Componente `src/components/Assinatura.astro`

Props: `idioma: Idioma`, `variante: 'destaque' | 'compacta'`, `id: string`
(prefixo único dos ids, porque a página pode ter dois formulários: o de
destaque e o do rodapé).

Os dois formatos são um `<form>` HTML puro, sem JavaScript:

```html
<form action="{FOLLOWIT.formulario}" method="post" target="_blank" rel="noopener">
  <label for="{`${id}-email`}">…</label>
  <input id="{`${id}-email`}" type="email" name="email" required autocomplete="email" />
  <button type="submit" class="felixo-botao">…</button>
</form>
```

- **Destaque:** `<section aria-labelledby>` com título (`h2`), uma frase, o
  formulário (rótulo visível), a linha de privacidade e o link "Prefere app ou
  RSS?" para `FOLLOWIT.seguir`. Visual: cartão escuro com borda `white/10`,
  como os blocos do blog.
- **Compacta:** uma linha no rodapé: rótulo curto, campo e botão, e o mesmo
  link para outras opções. Sem título nem frase.
- Abre o follow.it **em nova aba** (`target="_blank"`), com o aviso no texto,
  para o blog continuar aberto.
- Botão: classe existente `.felixo-botao`. Campo: mesmo visual do campo de
  busca da home (`.felixo-busca input`), sem o ícone.

### Textos (`src/config/idiomas.ts`, `TEXTOS.<idioma>.assinatura`)

| Chave          | pt                                                                                                                      | en                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `titulo`       | Receba os posts novos                                                                                                   | Get new posts                                                                                                          |
| `texto`        | Um e-mail no dia em que sair post novo.                                                                                 | An email on the day a new post comes out (posts are in Portuguese for now).                                            |
| `rotuloEmail`  | Seu e-mail                                                                                                              | Your email                                                                                                             |
| `placeholder`  | voce@exemplo.com                                                                                                        | you@example.com                                                                                                        |
| `botao`        | Assinar                                                                                                                 | Subscribe                                                                                                              |
| `compacto`     | Receba os posts novos por e-mail                                                                                        | Get new posts by email                                                                                                 |
| `privacidade`  | Quem envia é o follow.it, que guarda o seu e-mail e coloca anúncios nas mensagens. Dá para cancelar a qualquer momento. | Emails are sent by follow.it, which stores your address and adds ads to its messages. You can unsubscribe at any time. |
| `novaAba`      | Abre o follow.it em nova aba.                                                                                           | Opens follow.it in a new tab.                                                                                          |
| `outrasOpcoes` | Prefere app ou RSS?                                                                                                     | Prefer an app or RSS?                                                                                                  |

"No dia em que sair post novo" é fiel ao padrão travado (resumo diário). Não
prometer "na hora".

### Onde entra

| Lugar          | Arquivo                              | Ponto                                               | Variante / id                  |
| -------------- | ------------------------------------ | --------------------------------------------------- | ------------------------------ |
| Fim do post    | `src/layouts/PostLayout.astro`       | depois do `<article>`, antes de `<Comentarios />`   | destaque / `assinatura-post`   |
| Home (PT e EN) | `src/components/PaginaInicial.astro` | entre a seção de apresentação e a de posts          | destaque / `assinatura-home`   |
| Sobre          | `src/pages/sobre.astro`              | no fim da seção, depois de "Onde mais me encontrar" | destaque / `assinatura-sobre`  |
| Rodapé         | `src/components/Rodape.astro`        | linha nova acima do ©                               | compacta / `assinatura-rodape` |

## Acessibilidade

Rótulo `<label for>` de verdade nos dois formatos (na compacta, pode ser
visualmente curto, mas presente); `type="email"`, `required` e
`autocomplete="email"`; foco visível herdado; o botão `.felixo-botao` tem
texto branco sobre fundo escuro (contraste alto); `aria-describedby` do campo
aponta para a linha de privacidade e o aviso de nova aba; ids únicos por
instância; nada depende de movimento.

## Privacidade (LGPD)

O blog não guarda e-mail nenhum: o formulário envia direto para o follow.it.
A linha de privacidade diz quem guarda o dado e que há anúncios, perto do
campo, antes do envio.

## Validação

1. `npm run check` (0 erros) e `npm run build` (8 páginas).
2. No `dist/`: o `action` certo aparece no post (2 formulários: destaque e
   rodapé), na home PT e EN, no Sobre e no rodapé das demais páginas; ids não
   se repetem em nenhuma página; com `formulario: ''`, nenhum formulário sai.
3. Capturas do Chrome headless em 1280 px e 360 px (home, post, Sobre),
   conferindo o visual no tema do blog e sem rolagem horizontal.
4. Navegação só pelo teclado: Tab chega ao campo e ao botão, foco visível.
5. Prettier limpo nos arquivos tocados.
6. Depois do deploy: **o dono** assina com o próprio e-mail e confirma no
   follow.it (o agente não envia dado pessoal em formulário sem o ok dele).

## Documentação

Seção "Assinatura" no `README.md` (como funciona, limites do plano grátis,
onde mexer), linha na tabela "Onde mexer" do `AGENTS.md` e registro no
`IA.md`, que fecha o "em andamento" do registro de hoje.

## Riscos e limites conhecidos

- Bloqueadores de anúncio ou de rastreio podem barrar o follow.it no envio.
- O e-mail do assinante sai com anúncios e marca do follow.it (plano grátis).
- Até 6 h entre o deploy de um post e a leitura do feed, mais o resumo diário.
- O endereço `formulario` depende do follow.it: se o feed for recriado lá, o
  token muda e precisa ser atualizado em `FOLLOWIT`.
