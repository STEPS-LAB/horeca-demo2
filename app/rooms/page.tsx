import type { Metadata } from 'next';
import { RoomsClient } from './RoomsClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description:
    'Explore all LUMINA Hotel room categories — from cosy Forest Rooms to the Presidential Suite with private butler service.',
};

export default function RoomsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
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
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
              LUMINA Hotel
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Rooms &amp; Suites
            </h1>
            <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
              Every space at LUMINA has been conceived by our designers to be a private sanctuary.
              Choose yours.
            </p>
          </div>
        </div>

        <RoomsClient />
      </main>
      <Footer />
    </>
  );
}
