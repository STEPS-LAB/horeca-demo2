'use client';

import { useTranslations } from '@/i18n/context';
import type { Promotion, Room } from '@/types';
import { RoomsClient } from '@/app/rooms/RoomsClient';

export function RoomsPageClient({ rooms, promotions }: { rooms: Room[]; promotions: Promotion[] }) {
  const t = useTranslations();
  return (
    <>
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
        <div
          className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/70 to-stone-900"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 block mb-3">
            Готель
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{t.rooms.pageTitle}</h1>
          <p className="mt-3 text-stone-400 max-w-lg text-base leading-relaxed">{t.rooms.pageSubtitle}</p>
        </div>
      </div>

      <RoomsClient initialRooms={rooms} promotions={promotions} />
    </>
  );
}

