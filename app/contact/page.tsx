import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the LUMINA Hotel team — enquiries, reservations, events, and special requests.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Page hero */}
        <div className="relative bg-stone-900 pt-32 pb-16 sm:pb-20">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-stone-950/60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
              We&apos;d love to hear from you
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Contact Us
            </h1>
            <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">
              Our concierge team is available 24 hours a day, 7 days a week to assist with any
              enquiry.
            </p>
          </div>
        </div>

        <ContactClient />
      </main>
      <Footer />
    </>
  );
}
