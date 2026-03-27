import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { getRooms } from '@/lib/services/rooms.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';

const Testimonials = dynamic(() =>
  import('@/components/sections/Testimonials').then((m) => m.Testimonials)
);
const Gallery = dynamic(() =>
  import('@/components/sections/Gallery').then((m) => m.Gallery)
);
const FeaturedRooms = dynamic(() =>
  import('@/app/FeaturedRooms').then((m) => m.FeaturedRooms)
);

export default async function HomePage() {
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

