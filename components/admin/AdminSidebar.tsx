'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Tag,
  LogOut,
  Hotel,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations, useLocale } from '@/i18n/context';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations().admin.sidebar;
  const locale = useLocale();

  const navItems = [
    { href: '/admin', label: t.dashboard, icon: LayoutDashboard, exact: true },
    { href: '/admin/rooms', label: t.rooms, icon: BedDouble, exact: false },
    { href: '/admin/bookings', label: t.bookings, icon: CalendarDays, exact: false },
    { href: '/admin/pricing', label: t.pricing, icon: Tag, exact: false },
  ];

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  function switchLocale(next: 'en' | 'ua') {
    document.cookie = `lumina_locale=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500">
            <Hotel size={16} className="text-stone-950" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">LUMINA</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Admin CRM</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== '/admin/login';
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
              )}
            >
              <Icon size={16} className={active ? 'text-gold-400' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-800 space-y-1">
        {/* Lang switcher */}
        <div className="flex items-center gap-1 px-3 py-2">
          {(['en', 'ua'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors',
                locale === loc
                  ? 'bg-gold-500 text-stone-950'
                  : 'text-stone-500 hover:text-stone-300'
              )}
            >
              {loc}
            </button>
          ))}
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-stone-500 hover:text-stone-300 transition-colors"
        >
          {t.backToSite}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={15} />
          {t.signOut}
        </button>
      </div>
    </aside>
  );
}
