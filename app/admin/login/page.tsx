import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { getDictionary } from '@/i18n/get-dictionary';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';

export const metadata: Metadata = { title: 'Admin Login | Готель' };

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('lumina_locale')?.value as Locale | undefined;
  const locale: Locale = rawLocale && LOCALES.includes(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const t = (await getDictionary(locale)).admin.login;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-[0.15em] text-white">Готель</span>
          <p className="text-stone-400 text-sm mt-1 tracking-widest uppercase">{t.portal}</p>
        </div>

        <AdminLoginForm />

        {/* Demo hint */}
        <p className="text-center text-xs text-stone-600 mt-6">
          {t.demoCredentials
            .replace('{email}', 'admin@luminahotel.ua')
            .replace('{password}', 'lumina-admin-2025')}
        </p>
      </div>
    </div>
  );
}
