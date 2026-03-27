'use client';

import { useTranslations } from '@/i18n/context';
import { ContactClient } from '@/app/contact/ContactClient';

export function ContactPageShell() {
  const t = useTranslations();
  return (
    <>
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
            {t.contact.pageTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{t.contact.pageTitle}</h1>
          <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">{t.contact.pageSubtitle}</p>
        </div>
      </div>

      <ContactClient />
    </>
  );
}

