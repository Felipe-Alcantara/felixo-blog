# Notificação no navegador com OneSignal (sob demanda) — design

Data: 2026-10-26 · Decidido pelo dono no chat (três perguntas e um esclarecimento;
ver "Decisões já tomadas"). Especificação escrita antes de implementar, como a
pendência de 2026-10-16 pedia. **A implementação só começa quando houver 3 posts
publicados e a conta no OneSignal existir.**

## Objetivo

Quem lê o blog e quer pode ativar o aviso de post novo no navegador (computador e
Android), sem precisar de e-mail. Sem back-end próprio, sem custo, e **sem peso nenhum
para quem não ativa**: nada do OneSignal carrega até a pessoa clicar no botão.
Sucesso: a pessoa clica em "Avisar no navegador", aceita o pedido do navegador e, no
dia em que sai um post novo, recebe a notificação com o título e o link.

## Decisões já tomadas (com o dono)

- **Continuar sem, ou OneSignal?** OneSignal, **sob demanda**. Descartados: continuar
  sem (com ou sem gatilho para reavaliar) e o OneSignal padrão, com o script em toda
  página.
- **Gatilho:** implementar quando houver **3 posts publicados** (hoje o `rss.xml` tem 1
  item, o post de teste). A conta no OneSignal também precisa existir (ver
  "Pré-requisitos").
- **Nesta task:** só a especificação e o registro no `IA.md`; o código vira uma task
  com o gatilho.
- **No lugar, enquanto isso:** nada muda no site. O dono quer uma task para avaliar
  outros serviços de aviso depois.
- **Convive com o follow.it:** e-mail, app e RSS continuam como estão
  (`docs/superpowers/specs/2026-10-16-assinatura-follow-it-design.md`). O follow.it não
  oferece notificação no navegador.

## Fora de escopo

iPhone e iPad (o Safari do iOS só aceita aviso depois de o site ser adicionado à Tela
de Início, o que pede um manifesto de aplicativo); aviso em inglês (os posts são só em
português); segmentar por tag; agendar envio; avisar de post editado; substituir o
follow.it; painel de análise.

## Medido antes de escrever (2026-10-26)

- **Plano grátis do OneSignal** (página de preços, editada em 2026-09-28): "máx. 10.000
  assinantes por envio" e API de envio ilimitada. A página não deixa claro se os 10.000
  são limite por envio ou total.
- **Peso do script**, com gzip: `OneSignalSDK.page.js` (carregador) 590 B,
  `OneSignalSDK.page.es6.js` 42,6 KB e `OneSignalSDK.sw.js` (service worker) 12,5 KB. Para
  comparar: o CSS inteiro do blog tem 8,7 KB e o `count.js` do GoatCounter, 3,5 KB.
  Por isso o carregamento sob demanda.
- **Bloqueadores:** a lista EasyPrivacy (usada por uBlock e parecidos) barra
  `onesignal.com/api/v*/apps/`, `onesignal.com/api/v1/sync/`,
  `onesignal.com/sdks/OneSignalSDKStyles`, `onesignal.com/sdks/OneSignalSDKWorker` e
  `onesignal.com/webPushAnalytics`. Quem usa essas listas, como o dono no Brave, não
  consegue ativar, igual ao GoatCounter.
- **Requisitos do OneSignal** (documentação): HTTPS válido; o arquivo do service worker
  na mesma origem da página, na raiz, sem redirecionamento; permissão da pessoa; não
  funciona em janela anônima; Chrome, Firefox, Edge e Safari do Mac, e o Safari do
  iPhone só com o site na Tela de Início.
- **Envio:** `POST https://api.onesignal.com/notifications`, cabeçalho
  `Authorization: Key <chave de API>`, com `app_id`, `contents` (por idioma),
  `target_channel` e um método de segmentação (`included_segments`, `include_aliases` ou
  `filters`).

## Arquitetura

### Configuração (`src/config/site.ts`)

Mesmo padrão do GoatCounter e do follow.it:

```ts
export const ONESIGNAL = {
  /**
   * App ID do OneSignal. É público por natureza (aparece no HTML de qualquer
   * site que usa o OneSignal). Vazio desliga tudo: nem o botão, nem o script.
   */
  appId: '',
};
```

A chave de API **não** entra no repositório: vai como secret do GitHub
(`ONESIGNAL_REST_API_KEY`) e só o workflow a lê.

### Service worker (`public/OneSignalSDKWorker.js`)

Uma linha, na raiz do site (o blog serve na raiz de `blog.felixo.com.br`; com
`BASE_PATH` o recurso não funciona e precisa ficar desligado):

```js
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
```

Ele só é registrado depois do clique. Na implementação, conferir com `curl -I` que o
GitHub Pages serve o arquivo com `Content-Type` de JavaScript (a documentação do
OneSignal exige) e que não há redirecionamento. Não medido aqui: hoje não existe nenhum
`.js` estático no site.

### Botão na janela de assinatura (`AvisoNoNavegador.astro`)

Componente novo, dentro de `Assinatura.astro`, abaixo do formulário de e-mail. Só é
renderizado com `ONESIGNAL.appId` preenchido; no `BaseLayout`, o script dele só entra
junto. Fica `hidden` até o script confirmar suporte: `'serviceWorker' in navigator`,
`'PushManager' in window` e `'Notification' in window`. Sem JavaScript e sem suporte
(Safari do iPhone fora da Tela de Início), nada aparece.

| Estado     | Quando                                                              | O que aparece                                                             |
| ---------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Desligado  | sem suporte do navegador, sem JavaScript ou sem `appId`             | nada                                                                      |
| Pronto     | com suporte e sem ter ativado                                       | linha de privacidade e o botão "Avisar no navegador"                      |
| Carregando | depois do clique, até 10 s                                          | botão desativado "Carregando…" (`aria-busy`)                              |
| Ativo      | `Notification.permission === 'granted'` e a marca local de ativação | "Avisos ativados neste navegador." e o botão "Desativar avisos"           |
| Bloqueado  | `Notification.permission === 'denied'`                              | o navegador bloqueou; como liberar nas configurações do site              |
| Falhou     | o script não carregou, deu erro no `init` ou passou de 10 s         | "Não deu para ativar", com a causa provável (bloqueador) e tentar de novo |

O estado "Ativo" é lido sem carregar o OneSignal: a marca local
`felixo-blog:aviso-navegador` = `ativo` no `localStorage`, junto com
`Notification.permission`. "Desativar avisos" é o único jeito de carregar o script de
novo para quem já ativou.

Fluxo do clique, com as chamadas conferidas na referência do SDK v16 (nomes e
assinaturas; o valor de retorno de `requestPermission()` não é documentado, então o
estado final vem de `optedIn` e de `Notification.permission`, nunca do retorno):

```ts
const carregar = () =>
  new Promise<OneSignalApi>((ok, erro) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    const s = document.createElement('script');
    s.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    s.defer = true;
    s.onerror = erro;
    document.head.append(s);
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({ appId, serviceWorkerPath: '/OneSignalSDKWorker.js' });
      ok(OneSignal);
    });
  });

// ativar:    const OneSignal = await carregar(); await OneSignal.Notifications.requestPermission();
//            ativo = OneSignal.User.PushSubscription.optedIn;
// desativar: await OneSignal.User.PushSubscription.optOut();
```

O caminho do service worker passa por `caminho()` de `src/utils/rotas.ts`, como todo
link interno do projeto. Nada do OneSignal roda antes do clique: nem o script, nem o
registro do service worker, nem requisição. O clique é o consentimento, e a linha de
privacidade fica antes do botão.

### Textos (`TEXTOS.<idioma>.avisoNavegador`, em `src/config/idiomas.ts`)

| Chave         | pt                                                                                                                                  | en                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `botao`       | Avisar no navegador                                                                                                                 | Notify me in the browser                                                                                                            |
| `carregando`  | Carregando…                                                                                                                         | Loading…                                                                                                                            |
| `ativo`       | Avisos ativados neste navegador.                                                                                                    | Notifications are on in this browser.                                                                                               |
| `desativar`   | Desativar avisos                                                                                                                    | Turn off notifications                                                                                                              |
| `bloqueado`   | O navegador bloqueou os avisos deste site. Libere nas configurações do site e tente de novo.                                        | Your browser blocked notifications for this site. Allow them in the site settings and try again.                                    |
| `falhou`      | Não deu para ativar. Bloqueador de anúncios costuma impedir: libere este site e tente de novo.                                      | Couldn't turn it on. Ad blockers often get in the way: allow this site and try again.                                               |
| `privacidade` | Quem envia é o OneSignal, que guarda um identificador do seu navegador para entregar o aviso. Dá para desativar a qualquer momento. | Notifications are sent by OneSignal, which stores an identifier of your browser to deliver them. You can turn them off at any time. |

O texto em inglês é tradução para o dono revisar. "Aviso no navegador" não promete
hora: a entrega depende do navegador estar aberto ou do sistema permitir.

### Aviso de post novo (GitHub Actions)

A notificação sai do deploy, sem servidor nosso.

1. O job `build` baixa o `rss.xml` que está no ar **antes** do deploy (`curl -fsS`); se
   falhar, o arquivo não existe e nada é enviado (para nunca mandar o blog inteiro como
   se fosse novo). Guarda como artefato `aviso` junto com o `rss.xml` e o `index.html`
   recém-construídos.
2. Novo job `avisar`, depois do `deploy`, com `continue-on-error: true` (falha de aviso
   não deixa o `main` vermelho nem desfaz o deploy). Roda
   `node scripts/avisar-posts-novos.mjs`, sem dependência (Node 22, `fetch` nativo).
3. O script:
   - `postsNovos(antes, depois)`: os itens cujo `<guid>` não estava no RSS de antes,
     com `pubDate` de no máximo 7 dias e **no máximo 3 por execução** (cinto e
     suspensório contra uma leitura velha do "antes");
   - lê o App ID do `data-onesignal-app-id` do botão no `index.html` construído, ou
     seja, usa o que foi publicado; sem ele (recurso desligado), sai com 0 sem erro;
   - sem a chave `ONESIGNAL_REST_API_KEY`, avisa com `::notice::` e sai com 0;
   - para cada post novo, envia o `POST` descrito em "Medido": `app_id`, título em
     `headings`, descrição em `contents`, o link do post, `target_channel: "push"` e o
     segmento que reúne todos os inscritos. Os nomes exatos de `headings`, do campo do
     link e do segmento padrão **são conferidos na referência no momento de
     implementar** (não foram verificados hoje; os verificados estão em "Medido");
   - `--simular` imprime os envios sem chamar a API (usado nos testes e numa execução
     manual de conferência);
   - falha da API: `::warning::` e o job termina amarelo.

O RSS de produção não contém rascunho (`rascunho: true` some do build de produção),
então rascunho nunca notifica. O guid do RSS é a URL do post, e a regra do projeto de
nunca renomear post (`AGENTS.md`) evita aviso duplicado.

## Acessibilidade

`<button type="button">` com o texto visível como nome acessível; o estado vai numa
região `aria-live="polite"` para o leitor de tela ouvir "Avisos ativados" ou a causa
da falha; foco visível herdado; `aria-busy` enquanto carrega; nada depende de
movimento (respeita o botão "Pausar animações" e "reduzir movimento"). O contraste
segue o das outras linhas da janela de assinatura (zinc-400 sobre preto, AA).

## Privacidade (LGPD)

- O blog não guarda nada. O OneSignal guarda o identificador da inscrição no navegador
  e dados técnicos que o SDK envia. **A lista exata não foi verificada**: conferir na
  política do OneSignal antes de publicar a linha de privacidade.
- Nada do OneSignal carrega antes do clique, que é o consentimento. Conferir na
  implementação, com o registro de rede, que zero requisições a `onesignal.com` saem
  antes do clique.
- Documentar o OneSignal como terceiro, ao lado do GoatCounter e do follow.it, no
  `README.md` e no `IA.md`.

## Pré-requisitos (do dono)

1. Criar a conta no OneSignal e um app Web com o modo "Custom Code" e o endereço
   `https://blog.felixo.com.br`.
2. Preencher `ONESIGNAL.appId` (público).
3. Criar a chave de API (REST API key) e guardá-la como secret do GitHub
   `ONESIGNAL_REST_API_KEY`. É segredo: nunca no repositório, no `IA.md`, em teste ou em
   mensagem de commit.
4. Confirmar o nome do segmento padrão que reúne todos os inscritos.

Quem faz os passos 1 a 3 (o dono, ou o agente pelo navegador dele, com o ok explícito,
como foi com o follow.it) é decisão para o momento de implementar.

## Validação (na implementação)

1. `npm run check` (0 erros) e `npm run build`. Com `appId: ''`: nenhum botão, nenhuma
   referência ao OneSignal no HTML do `dist/` e o `BaseLayout` sem o script.
2. Chrome e Firefox sem tela: sem clicar, zero requisições a `onesignal.com`; clicando
   com um App ID falso, o estado "Falhou" em até 10 s; com as requisições ao OneSignal
   bloqueadas por regra (simulando bloqueador), o mesmo estado.
3. Capturas dos seis estados, em português e inglês, em 1280 px e 360 px.
4. Teclado: Tab chega ao botão, Enter ativa, foco visível.
5. O script: testes da função pura com `node --test` (item novo, nenhum novo, item
   antigo, "antes" ausente, quatro novos que viram três) e `--simular` com um RSS
   fabricado.
6. Ensaio do CI com as versões do runner (Node 22.23.x e npm 10.9.9) numa cópia limpa:
   `npm ci`, `astro check` e `astro build`. Não entra dependência nova.
7. Depois do deploy, **o dono**: ativa num Chrome sem bloqueador, recebe uma
   notificação de teste enviada pelo painel do OneSignal e depois uma de post novo
   (publicação de um post de verdade, ou execução manual do workflow).

## Documentação

Seção no `README.md` (como funciona, limites do plano grátis, pré-requisitos), linhas na
tabela "Onde mexer" do `AGENTS.md`, o OneSignal no ESTADO ATUAL do `IA.md` e um
registro datado, que fecha o gatilho.

## Riscos e limites conhecidos

- **Bloqueadores de anúncio barram o OneSignal** (EasyPrivacy lista as chamadas da API
  dele). Não funciona para quem usa; sem contorno, igual ao GoatCounter.
- **iPhone e iPad ficam de fora** na primeira versão (pede manifesto e Tela de Início).
  O botão some por detecção de recurso.
- **Janela anônima não assina** (limite do OneSignal).
- **Plano grátis:** "máx. 10.000 assinantes por envio"; acima disso é plano pago.
- **O pedido de permissão está sujeito ao recuo do navegador** (se a pessoa recusa
  algumas vezes, o navegador para de perguntar); por isso o estado "Bloqueado" explica
  como liberar.
- **Aviso perdido não se repete:** se o envio falhar depois do deploy, o próximo deploy
  já encontra o post no RSS de antes e não reenvia; reenviar pelo painel do OneSignal.
  Reexecutar um deploy também não reenvia.
- **Não verificado:** o comportamento do Brave com notificação push, o `Content-Type` do `.js` no GitHub Pages e a lista de dados que o
  OneSignal guarda.
- **Terceiro:** a URL do SDK é a `v16`; se o OneSignal mudar a versão, atualizar aqui e
  no componente.
