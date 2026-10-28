# Gatinho dando tchau

Composição Remotion que anima a pata do gatinho do post inicial. O site usa os
49 quadros renderizados em uma grade PNG 7 × 7, animada com CSS para manter cada
dimensão do sprite abaixo dos limites de textura dos navegadores.

## Gerar o sprite

```bash
npm ci
npm run gerar
```

O comando salva o resultado em
`src/content/posts/ola-mundo/gatinho-tchau-sprite.png`. Se a arte-base do
gatinho mudar, atualize também `public/gatinho-base-sentado.png`.
