import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { getRooms } from '@/lib/services/rooms.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';
import type { Locale } from '@/i18n/config';

const Testimonials = dynamic(() =>
  import('@/components/sections/Testimonials').then((m) => m.Testimonials)
);
const Gallery = dynamic(() =>
  import('@/components/sections/Gallery').then((m) => m.Gallery)
);
const FeaturedRooms = dynamic(() =>
  import('@/app/FeaturedRooms').then((m) => m.FeaturedRooms)
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUa = locale === 'ua';
  return {
    title: isUa
      ? 'Готель — Там де Розкіш Зустрічає Природу'
      : 'Готель — Where Luxury Meets Nature',
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params; // locale available via I18nProvider in layout
  const [rooms, promotions] = await Promise.all([getRooms(), getActivePublicPromotions()]);
  return (
    <>
      <Hero />
      <Features />
      <FeaturedRooms rooms={rooms} promotions={promotions} />
      <Gallery />
      <Testimonials />
    </>
  );
}
