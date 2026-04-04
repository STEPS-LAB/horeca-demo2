import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { Providers } from '@/app/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBookingBar } from '@/components/layout/MobileBookingBar';
import { getDictionary } from '@/i18n/get-dictionary';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'HOTEL — Where Luxury Meets Nature',
    template: '%s | HOTEL',
  },
  description:
    'Experience unparalleled luxury in the heart of the Carpathian Mountains. HOTEL offers breathtaking mountain views, world-class amenities, and bespoke hospitality.',
  keywords: [
    'luxury hotel',
    'Carpathian Mountains',
    'boutique hotel',
    'mountain resort',
    'spa hotel',
    'Ukraine hotel',
  ],
  authors: [{ name: 'HOTEL' }],
  // horeca-demo1-style SVG + .ico for clients that always request /favicon.ico
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'HOTEL',
    title: 'HOTEL — Where Luxury Meets Nature',
    description:
      'Experience unparalleled luxury in the heart of the Carpathian Mountains.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'HOTEL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOTEL — Where Luxury Meets Nature',
    description:
      'Experience unparalleled luxury in the heart of the Carpathian Mountains.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#1c1917',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a Server Component; read locale cookie and pass it into client Providers.
  // Note: language switching is handled client-side without URL changes.
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('lumina_locale')?.value as Locale | undefined;
  const locale: Locale = rawLocale && LOCALES.includes(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dictionary = await getDictionary(locale);
  const htmlLang = locale === 'ua' ? 'uk' : 'en';

  return (
    <html lang={htmlLang} suppressHydrationWarning className={inter.variable}>
      <body className="bg-stone-25 text-stone-900 antialiased">
        <Providers locale={locale} dictionary={dictionary}>
          <Header />
          {children}
          <MobileBookingBar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
