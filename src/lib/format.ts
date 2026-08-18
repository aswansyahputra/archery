export type Locale = "id" | "en";

const LOCALE_MAP: Record<Locale, string> = { id: "id-ID", en: "en-US" };

export function formatDate(d: Date | string | number, locale: Locale): string {
  const date = d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function formatDateTime(d: Date | string | number, locale: Locale): string {
  const date = d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatNumber(n: number, locale: Locale, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_MAP[locale], opts).format(n);
}
