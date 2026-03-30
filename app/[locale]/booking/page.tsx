import type { Metadata } from 'next';
import { BookingPageClient } from '@/app/booking/BookingPageClient';
import { getRooms } from '@/lib/services/rooms.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ua' ? 'Забронювати Номер' : 'Book a Room',
    description:
      locale === 'ua'
        ? 'Забронюйте ідеальний номер у готелі Готель — швидко, надійно та зручно.'
        : 'Reserve your perfect room at Готель — fast, secure, and effortless.',
  };
}

export default async function LocaleBookingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isUa = locale === 'ua';
  const [rooms, promotions] = await Promise.all([getRooms(), getActivePublicPromotions()]);

  return (
    <>
      {/* Page hero */}
      <div className="relative bg-stone-900 pt-32 pb-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-stone-950/70" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
            {isUa ? 'Бронювання' : 'Reservations'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {isUa ? 'Забронюйте Перебування' : 'Book Your Stay'}
          </h1>
          <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
            {isUa
              ? 'Оформіть бронювання за кілька хвилин. Миттєве підтвердження гарантовано.'
              : 'Complete your reservation in minutes. Instant confirmation guaranteed.'}
          </p>
        </div>
      </div>

      <BookingPageClient rooms={rooms} promotions={promotions} />
    </>
  );
}
