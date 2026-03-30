'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useLocale, useTranslations } from '@/i18n/context';

const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
};

const linkVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.2 },
  }),
};

export function Header() {
  const locale = useLocale();
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const headerTransparent = isHome && !scrolled && !menuOpen;

  return (
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
            aria-label="Готель — Home"
          >
            <span
              className={cn(
                'text-xl font-bold tracking-[0.15em] transition-colors duration-300 lg:hidden',
                headerTransparent ? 'text-white' : 'text-stone-900'
              )}
            >
              Готель
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
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  pathname === href
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
            <Link href="/booking">
              <Button
                variant={headerTransparent ? 'ghost' : 'primary'}
                size="sm"
                className={headerTransparent ? 'border border-white/30 text-white hover:bg-white/10' : ''}
              >
                {t.nav.reserve}
              </Button>
            </Link>
          </div>

          {/* Mobile: language + menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher transparent={headerTransparent} />
            <button
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150',
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
            id="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
              {navLinks.map(({ href, label }, i) => (
                <motion.div key={href} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors duration-150',
                      pathname === href
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
  );
}
