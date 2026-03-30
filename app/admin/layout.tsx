import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { I18nProvider } from '@/i18n/context';
import { getDictionary } from '@/i18n/get-dictionary';
import type { Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: { default: 'Admin CRM | Готель', template: '%s | Готель Admin' },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lumina_locale')?.value ?? 'en') as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <div className="flex min-h-screen bg-stone-950 text-stone-100">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </I18nProvider>
  );
}
