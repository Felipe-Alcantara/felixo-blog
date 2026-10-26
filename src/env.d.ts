// O Astro não tipa `rel` no <form>, mas o HTML aceita (`noopener` com `target="_blank"`).
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    rel?: string | undefined | null;
  }
}
