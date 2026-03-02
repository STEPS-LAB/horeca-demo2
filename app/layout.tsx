import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'LUMINA Hotel — Where Luxury Meets Nature',
    template: '%s | LUMINA Hotel',
  },
  description:
    'Experience unparalleled luxury in the heart of the Carpathian Mountains. LUMINA Hotel offers breathtaking mountain views, world-class amenities, and bespoke hospitality.',
  keywords: [
    'luxury hotel',
    'Carpathian Mountains',
    'boutique hotel',
    'mountain resort',
    'spa hotel',
    'Ukraine hotel',
  ],
  authors: [{ name: 'LUMINA Hotel' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'LUMINA Hotel',
    title: 'LUMINA Hotel — Where Luxury Meets Nature',
    description:
      'Experience unparalleled luxury in the heart of the Carpathian Mountains.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'LUMINA Hotel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMINA Hotel — Where Luxury Meets Nature',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={inter.variable}>
      <body className="bg-stone-25 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
