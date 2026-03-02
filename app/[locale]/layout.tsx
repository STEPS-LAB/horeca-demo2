import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { I18nProvider } from '@/i18n/context';
import { getDictionary } from '@/i18n/get-dictionary';
import { LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { LocaleLang } from '@/components/layout/LocaleLang';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      languages: { en: '/en', uk: '/ua' },
    },
    openGraph: {
      locale: locale === 'ua' ? 'uk_UA' : 'en_US',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);
  const htmlLang = locale === 'ua' ? 'uk' : 'en';

  return (
    <I18nProvider locale={locale as Locale} dictionary={dictionary}>
      {/* Sets document.documentElement.lang client-side */}
      <LocaleLang lang={htmlLang} />
      <Header locale={locale as Locale} />
      {children}
      <Footer />
    </I18nProvider>
  );
}
