import type { Metadata } from 'next';
import { ContactClient } from '@/app/contact/ContactClient';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ua' ? 'Контакти' : 'Contact Us',
    description:
      locale === 'ua'
        ? "Зв'яжіться з командою готелю Готель — запити, бронювання, заходи та особливі побажання."
        : 'Get in touch with the Готель team — enquiries, reservations, events, and special requests.',
  };
}

export default async function LocaleContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isUa = locale === 'ua';

  return (
    <>
      {/* Page hero */}
      <div className="relative bg-stone-900 pt-32 pb-16 sm:pb-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-stone-950/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
            {isUa ? "Будемо раді почути вас" : "We'd love to hear from you"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {isUa ? 'Контакти' : 'Contact Us'}
          </h1>
          <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
            {isUa
              ? 'Наша команда консьєржів доступна цілодобово та без вихідних для допомоги з будь-яким запитом.'
              : 'Our concierge team is available 24 hours a day, 7 days a week to assist with any enquiry.'}
          </p>
        </div>
      </div>

      <ContactClient />
    </>
  );
}
