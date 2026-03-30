'use client';

import { useTransition } from 'react';
import { useLocale, useSetLocale } from '@/i18n/context';
import { LOCALES, localeFull, localeNames } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { cn } from '@/utils/cn';

interface LanguageSwitcherProps {
  transparent?: boolean;
}

export function LanguageSwitcher({ transparent }: LanguageSwitcherProps) {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `lumina_locale=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    startTransition(() => {
      void setLocale(next);
    });
  }

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language selector">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          aria-pressed={locale === loc}
          aria-label={localeFull[loc]}
          disabled={isPending}
          className={cn(
            'min-h-11 min-w-11 px-2 text-xs font-semibold rounded-md tracking-wide transition-colors duration-150 inline-flex items-center justify-center',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
            isPending && 'opacity-70 cursor-not-allowed',
            locale === loc
              ? transparent
                ? 'text-white bg-white/20'
                : 'text-stone-900 bg-stone-100'
              : transparent
              ? 'text-white/60 hover:text-white hover:bg-white/10'
              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
          )}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}
