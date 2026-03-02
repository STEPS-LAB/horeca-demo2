import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';

const Testimonials = dynamic(() =>
  import('@/components/sections/Testimonials').then((m) => m.Testimonials)
);
const Gallery = dynamic(() =>
  import('@/components/sections/Gallery').then((m) => m.Gallery)
);
const FeaturedRooms = dynamic(() =>
  import('./FeaturedRooms').then((m) => m.FeaturedRooms)
);

export const metadata: Metadata = {
  title: 'LUMINA Hotel — Where Luxury Meets Nature',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <FeaturedRooms />
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
