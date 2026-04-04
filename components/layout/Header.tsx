'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useLocale, useTranslations } from '@/i18n/context';

const SECTION_HASHES = ['#lumina-experience', '#visual-journey'] as const;

function normalizePath(p: string) {
  if (!p || p === '') return '/';
  const trimmed = p.replace(/\/$/, '') || '/';
  return trimmed;
}

function pathOnlyFromHref(href: string) {
  const [path] = href.split('#');
  const [base] = (path ?? '').split('?');
  return normalizePath(base || '/');
}

function subscribeLocationHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener('popstate', onChange);
  };
}

function getLocationHash() {
  return typeof window !== 'undefined' ? window.location.hash : '';
}

/** Slower, ease-in-out scroll to top — feels less abrupt than native `smooth` on some engines. */
function smoothScrollToTop(durationMs = 720) {
  const startY = window.scrollY;
  if (startY <= 0) return;
  const start = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now: number) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const y = Math.round(startY * (1 - ease(t)));
    window.scrollTo(0, y);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function syncUrlPathAndHash(href: string) {
  const url = new URL(href, window.location.origin);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.pushState(window.history.state, '', next);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function isNavLinkActive(pathname: string, href: string, locationHash: string) {
  const path = normalizePath(pathname);
  const hash = locationHash || '';
  const targetPath = pathOnlyFromHref(href);

  if (href.startsWith('/#')) {
    const wanted = `#${href.split('#')[1] ?? ''}`;
    return path === '/' && hash === wanted;
  }

  if (href === '/') {
    if (path !== '/') return false;
    return !SECTION_HASHES.includes(hash as (typeof SECTION_HASHES)[number]);
  }

  return path === targetPath;
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  /* pathname in the snapshot so active section updates after Next.js client navigations (hash may change without hashchange). */
  const locationHash =
    useSyncExternalStore(
      subscribeLocationHash,
      () => `${pathname}|${getLocationHash()}`.split('|')[1] ?? '',
      () => ''
    );

  const isHome = pathname === '/' || pathname === '';

  const navLinks = [
    { href: `/`, label: t.nav.home },
    { href: `/#lumina-experience`, label: t.nav.about },
    { href: `/rooms`, label: t.nav.rooms },
    { href: `/#visual-journey`, label: t.nav.gallery },
    { href: `/contact`, label: t.nav.contact },
  ];

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 48);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      if ((href.startsWith('/#') || href === '/') && (pathname === '/' || pathname === '')) {
        if (href === '/') {
          syncUrlPathAndHash('/');
          smoothScrollToTop();
        } else {
          syncUrlPathAndHash(href);
          const sel = href.replace(/^\/#/, '#');
          const element = document.querySelector(sel);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    },
    [pathname]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target as Node;
      if (mobilePanelRef.current?.contains(node)) return;
      if (menuButtonRef.current?.contains(node)) return;
      setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  const headerTransparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.button
            key="mobile-menu-backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[35] cursor-default border-0 bg-stone-900/25 p-0 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'transition-all duration-300',
        headerTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm'
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-md"
            aria-label={`${t.common.brandName} — ${t.nav.home}`}
          >
            <span
              className={cn(
                'text-xl font-bold tracking-[0.15em] transition-colors duration-300 lg:hidden',
                locale === 'en' && 'uppercase',
                headerTransparent ? 'text-white' : 'text-stone-900'
              )}
            >
              {t.common.brandName}
            </span>
            <span
              className={cn(
                'hidden lg:block text-xl tracking-[0.15em] uppercase font-bold transition-colors duration-300',
                headerTransparent ? 'text-white' : 'text-stone-900'
              )}
            >
              HOTEL
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  if (
                    (href.startsWith('/#') || href === '/') &&
                    (pathname === '/' || pathname === '')
                  ) {
                    e.preventDefault();
                    handleNavClick(href);
                  }
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  isNavLinkActive(pathname, href, locationHash)
                    ? headerTransparent
                      ? 'text-white bg-white/15'
                      : 'text-stone-900 bg-stone-100'
                    : headerTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher transparent={headerTransparent} />
            <a
              href="tel:+380441234567"
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors duration-150',
                headerTransparent ? 'text-white/80 hover:text-white' : 'text-stone-500 hover:text-stone-900'
              )}
            >
              <Phone size={14} />
              <span className="hidden xl:block">{t.nav.phone}</span>
            </a>
            <Button
              href="/booking"
              variant={headerTransparent ? 'ghost' : 'primary'}
              size="sm"
              className={headerTransparent ? 'border border-white/30 text-white hover:bg-white/10' : ''}
            >
              {t.nav.reserve}
            </Button>
          </div>

          {/* Mobile: language + menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher transparent={headerTransparent} />
            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                'flex items-center justify-center min-h-11 min-w-11 rounded-lg transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                headerTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-stone-600 hover:bg-stone-100'
              )}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={mobilePanelRef}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  custom={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.2 }}
                >
                  <Link
                    href={href}
                    onClick={(e) => {
                      // Если это якорная ссылка или главная страница на текущей странице
                      if ((href.startsWith('/#') || href === '/') && (pathname === '/' || pathname === '')) {
                        e.preventDefault();
                        handleNavClick(href);
                      }
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors duration-150',
                      isNavLinkActive(pathname, href, locationHash)
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-stone-100 mt-2">
                <a
                  href="tel:+380441234567"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Phone size={16} />
                  <span className="text-sm">{t.nav.phone}</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
