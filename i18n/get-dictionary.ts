import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

// Each locale module is loaded dynamically; cast to Dictionary at call time.
const loaders: Record<Locale, () => Promise<unknown>> = {
  en: () => import('./dictionaries/en'),
  ua: () => import('./dictionaries/ua'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const mod = (await loaders[locale]()) as { default: Dictionary };
  return mod.default;
}
