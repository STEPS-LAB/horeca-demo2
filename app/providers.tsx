'use client';

import { useEffect } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { I18nProvider, useLocale } from '@/i18n/context';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

/** Keeps <html lang> in sync when the user switches language without a full reload. */
export function SyncHtmlLang() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale === 'ua' ? 'uk' : 'en';
  }, [locale]);
  return null;
}

export function Providers({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <SyncHtmlLang />
      <ScrollToTop />
      {children}
    </I18nProvider>
  );
}

