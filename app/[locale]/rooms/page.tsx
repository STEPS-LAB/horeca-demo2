import type { Metadata } from 'next';
import { RoomsClient } from '@/app/rooms/RoomsClient';
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
    title: locale === 'ua' ? 'Наші номери' : 'Rooms & Suites',
    description:
      locale === 'ua'
        ? 'Дослідіть усі категорії номерів готелю Готель — від затишних кімнат до Президентського Люксу.'
        : 'Explore all HOTEL room categories — from cosy Forest Rooms to the Presidential Suite.',
  };
}

export default async function LocaleRoomsPage({
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
      <div className="relative bg-stone-900 pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/70 to-stone-900" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {isUa ? 'Наші номери' : 'Rooms & Suites'}
          </h1>
          <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
            {isUa
              ? 'Кожен простір у Готель був створений нашими дизайнерами як особистий притулок. Оберіть свій.'
              : 'Every space at HOTEL has been conceived by our designers to be a private sanctuary. Choose yours.'}
          </p>
        </div>
      </div>

      <RoomsClient initialRooms={rooms} promotions={promotions} />
    </>
  );
}
