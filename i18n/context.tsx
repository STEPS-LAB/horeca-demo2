'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';
import { getDictionary } from './get-dictionary';

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (next: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale: initialLocale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [t, setT] = useState<Dictionary>(dictionary);

  const setLocale = useCallback(async (next: Locale) => {
    if (next === locale) return;
    const nextDict = await getDictionary(next);
    setLocaleState(next);
    setT(nextDict);
  }, [locale]);

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export function useTranslations(): Dictionary {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

export function useSetLocale(): (next: Locale) => Promise<void> {
  return useI18n().setLocale;
}
