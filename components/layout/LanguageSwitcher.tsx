'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/context';
import { LOCALES, localeNames } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { cn } from '@/utils/cn';

interface LanguageSwitcherProps {
  transparent?: boolean;
}

export function LanguageSwitcher({ transparent }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    // Replace /current-locale/ with /next-locale/ in the path
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  }

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language selector">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          aria-pressed={locale === loc}
          className={cn(
            'px-2 py-1 text-xs font-semibold rounded-md tracking-wide transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
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
