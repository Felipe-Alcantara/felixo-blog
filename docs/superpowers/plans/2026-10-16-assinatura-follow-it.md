# Assinatura dos posts novos com follow.it — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formulário de assinatura do follow.it no blog (fim do post, home, Sobre e rodapé), em PT/EN, sem JavaScript.

**Architecture:** Um componente Astro (`Assinatura.astro`) com as variantes `destaque` e `compacta`, alimentado pela constante `FOLLOWIT` (`src/config/site.ts`) e pelos textos de `TEXTOS.<idioma>.assinatura`. É um `<form>` HTML puro que faz POST direto ao follow.it numa aba nova. Com `formulario` vazio, nada é renderizado.

**Tech Stack:** Astro 7, Tailwind 4, TypeScript estrito. O projeto não tem suíte de testes: a prova é `npm run check`, `npm run build` e asserções sobre o HTML gerado em `dist/`.

**Spec:** `docs/superpowers/specs/2026-10-16-assinatura-follow-it-design.md`

## Global Constraints

- Português em código, nomes e commits; Conventional Commits.
- Nenhuma dependência nova e nenhum `<script>` para a assinatura.
- Links internos sempre por `caminho()` (os links desta feature são externos).
- Texto de interface só em `TEXTOS`, nos dois idiomas, com o texto exato da tabela da spec.
- Acessibilidade: rótulo real, foco visível, contraste AA, ids únicos.
- Gate antes de commitar: `npm run check` (0 erros) e `npm run build` (8 páginas); Prettier nos arquivos tocados.

## Review Focus

1. Duas instâncias na mesma página (destaque + rodapé) → ids e `for` não podem repetir.
2. Sem JavaScript → assinatura continua funcionando (nada de script no HTML do componente).
3. Celular 360 px → campo e botão do rodapé não podem causar rolagem horizontal.
4. `/en/` → textos em inglês, incluindo o aviso de que os posts são em português.
5. `FOLLOWIT.formulario` vazio → nenhum formulário nem link do follow.it no `dist/`.

---

### Task 1: Componente, configuração, textos e os 4 lugares

**Files:**

- Modify: `src/config/site.ts` (objeto `FOLLOWIT`)
- Modify: `src/config/idiomas.ts` (`TEXTOS.pt.assinatura`, `TEXTOS.en.assinatura`)
- Create: `src/components/Assinatura.astro`
- Modify: `src/layouts/PostLayout.astro` (entre `</article>` e `<Comentarios />`)
- Modify: `src/components/PaginaInicial.astro` (entre a seção de apresentação e a de posts)
- Modify: `src/pages/sobre.astro` (fim da seção, depois de "Onde mais me encontrar")
- Modify: `src/components/Rodape.astro` (linha nova acima do ©)

**Interfaces:**

- Produces: `FOLLOWIT.formulario: string`, `FOLLOWIT.seguir: string`; `TEXTOS[idioma].assinatura` com as chaves `titulo, texto, rotuloEmail, placeholder, botao, compacto, privacidade, novaAba, outrasOpcoes`; `<Assinatura idioma={Idioma} variante={'destaque' | 'compacta'} id={string} />`.

- [ ] **Step 1: Escrever a asserção que falha** (salvar como script descartável fora do repositório, `verificar-assinatura.sh`, e rodar depois de `npm run build`):

```bash
A='api.follow.it/subscription-form/'
test "$(grep -o "$A" dist/posts/ola-mundo/index.html | wc -l)" -eq 2   # destaque + rodapé
test "$(grep -o "$A" dist/index.html | wc -l)" -eq 2
test "$(grep -o "$A" dist/en/index.html | wc -l)" -eq 2
test "$(grep -o "$A" dist/sobre/index.html | wc -l)" -eq 2
test "$(grep -o "$A" dist/tags/index.html | wc -l)" -eq 1             # só rodapé
grep -q 'Get new posts' dist/en/index.html && grep -q 'Receba os posts novos' dist/index.html
for f in $(find dist -name '*.html'); do                                 # ids únicos
  test -z "$(grep -o 'id="assinatura-[a-z]*-email"' "$f" | sort | uniq -d)"; done
```

- [ ] **Step 2: Rodar e ver falhar** — `npm run build && bash verificar-assinatura.sh`. Esperado: falha na primeira asserção (0 formulários).

- [ ] **Step 3: Implementar.** `FOLLOWIT.formulario` e `FOLLOWIT.seguir` com os valores exatos da spec; textos com a tabela exata da spec; componente com o `<form action method="post" target="_blank" rel="noopener">`, `<label for>`, `input type="email" name="email" required autocomplete="email"`, botão `.felixo-botao`, `aria-describedby` apontando para a linha de privacidade e o aviso de nova aba, link `outrasOpcoes` para `FOLLOWIT.seguir` com `target="_blank" rel="noopener noreferrer"`; campo no visual de `.felixo-busca input`; render condicionado a `FOLLOWIT.formulario !== ''`. Ids: `assinatura-post`, `assinatura-home`, `assinatura-sobre`, `assinatura-rodape`.

- [ ] **Step 4: Rodar e ver passar** — `npm run check` (0 erros), `npm run build` (8 páginas) e o script: sai com código 0. Conferir também que o HTML do componente não tem `<script>`.

- [ ] **Step 5: Desligado** — com `formulario: ''` temporário, `npm run build` e `grep -rl 'follow.it' dist --include=*.html` não lista nenhuma página. Desfazer.

- [ ] **Step 6: Commit** — `feat: assinatura dos posts novos com follow.it no blog`.

### Task 2: Validação visual e documentação

**Files:**

- Modify: `README.md` (seção "Assinatura", depois de "Contagem de acessos")
- Modify: `AGENTS.md` (linha na tabela "Onde mexer", na largura atual da tabela)
- Modify: `IA.md` (registro que fecha o "em andamento" de 2026-10-16 e o item de ESTADO ATUAL)

- [ ] **Step 1: Capturas** do Chrome headless em 1280 e 360 px de largura (home, post e Sobre), com a pergunta de idioma desligada por `localStorage`: visual no tema do blog e `document.documentElement.scrollWidth <= innerWidth` em 360 px.
- [ ] **Step 2: Teclado** — Tab a partir do topo chega ao campo e ao botão do destaque e do rodapé, com foco visível.
- [ ] **Step 3: Documentar** README, AGENTS e IA.md; Prettier limpo nesses arquivos (sem reformatar trechos antigos).
- [ ] **Step 4: Commit** — `docs: registra a assinatura com follow.it`.
- [ ] **Step 5: Publicar** — push na `main`, acompanhar o run do `deploy.yml` até o fim e conferir o `action` nas páginas do site no ar. O teste ponta a ponta (assinar com e-mail real) é do dono.
