import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookingPageClient } from './BookingPageClient';

export const metadata: Metadata = {
  title: 'Book a Room',
  description: 'Reserve your perfect room at LUMINA Hotel — fast, secure, and effortless.',
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Page hero */}
        <div className="relative bg-stone-900 pt-32 pb-16">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1920&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-stone-950/70" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
              Reservations
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Book Your Stay</h1>
            <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
              Complete your reservation in minutes. Instant confirmation guaranteed.
            </p>
          </div>
        </div>

        <BookingPageClient />
      </main>
      <Footer />
    </>
  );
}
