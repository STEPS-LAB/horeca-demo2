import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';
import enSource from './dictionaries/en';

// Each locale module is loaded dynamically; cast to Dictionary at call time.
const loaders: Record<Locale, () => Promise<unknown>> = {
  en: () => import('./dictionaries/en'),
  ua: () => import('./dictionaries/ua'),
};

function mergeDictionary(raw: Dictionary): Dictionary {
  return {
    ...raw,
    aiConcierge: {
      ...enSource.aiConcierge,
      ...(raw.aiConcierge ?? {}),
    },
  };
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const mod = (await loaders[locale]()) as { default: Dictionary };
  return mergeDictionary(mod.default);
}
