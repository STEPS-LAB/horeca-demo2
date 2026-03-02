export const LOCALES = ['en', 'ua'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  ua: 'UA',
};

export const localeFull: Record<Locale, string> = {
  en: 'English',
  ua: 'Українська',
};
