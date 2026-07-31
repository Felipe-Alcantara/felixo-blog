/** Formata uma data no padrão brasileiro por extenso (ex.: "31 de julho de 2026"). */
export function formatarDataLonga(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(data);
}

/** Formata uma data como `YYYY-MM-DD`, para o atributo `datetime` do `<time>`. */
export function formatarDataISO(data: Date): string {
  return data.toISOString().slice(0, 10);
}

/** Estima o tempo de leitura em minutos a partir do corpo bruto do post. */
export function tempoDeLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}
