'use client';

import { useLayoutEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/i18n/context';
import { cn } from '@/utils/cn';

function normalizePath(p: string) {
  const trimmed = p.replace(/\/$/, '') || '/';
  return trimmed;
}

export function MobileBookingBar() {
  const pathname = usePathname();
  const t = useTranslations();
  const path = normalizePath(pathname ?? '');
  const isHome = path === '/';
  const hideOnRoute = path === '/booking' || path.startsWith('/admin');

  const [pastHero, setPastHero] = useState(!isHome);

  const syncHero = useCallback(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    const el = document.getElementById('site-hero');
    if (!el) {
      setPastHero(true);
      return;
    }
    setPastHero(el.getBoundingClientRect().bottom <= 1);
  }, [isHome]);

  useLayoutEffect(() => {
    syncHero();
  }, [path, syncHero]);

  useLayoutEffect(() => {
    if (!isHome || hideOnRoute) return;
    window.addEventListener('scroll', syncHero, { passive: true });
    window.addEventListener('resize', syncHero);
    return () => {
      window.removeEventListener('scroll', syncHero);
      window.removeEventListener('resize', syncHero);
    };
  }, [isHome, hideOnRoute, syncHero]);

  const visible = !hideOnRoute && pastHero;

  return (
    <div
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgb(0,0,0,0.08)] transition-transform duration-200 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
      role="navigation"
      aria-label={t.nav.bookNow}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-7xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link
          href="/booking"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 w-full items-center justify-center rounded-xl gradient-gold text-stone-950 text-sm font-semibold shadow-button transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {t.nav.bookNow}
        </Link>
      </div>
    </div>
  );
}
