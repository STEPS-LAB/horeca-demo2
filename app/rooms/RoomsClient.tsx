'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters } from '@/components/rooms/RoomFilters';
import { RoomModal } from '@/components/rooms/RoomModal';
import { BookingModal } from '@/components/booking/BookingModal';
import { useRoomFilter } from '@/hooks/useRoomFilter';
import { useModal } from '@/hooks/useModal';
import { useLocale, useTranslations } from '@/i18n/context';
import type { Room, Promotion } from '@/types';

export function RoomsClient({ initialRooms, promotions = [] }: { initialRooms: Room[]; promotions?: Promotion[] }) {
  const locale = useLocale();
  const t = useTranslations();
  const filterState = useRoomFilter(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const roomModal = useModal();
  const bookingModal = useModal();

  const count = filterState.filteredRooms.length;
  const pluralEn = count === 1 ? '' : 's';
  const pluralUa = count === 1 ? '' : count >= 2 && count <= 4 ? 'и' : 'ів';
  const plural = locale === 'en' ? pluralEn : pluralUa;
  const resultsLabel = t.rooms.resultsCount
    .replace('{count}', String(count))
    .replace('{plural}', plural);

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    roomModal.open();
  };

  const handleBook = (room: Room) => {
    setBookingRoom(room);
    bookingModal.open();
  };

  return (
    <section className="py-10 sm:py-14 bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between mb-5">
          <p className="text-sm text-stone-500">
            {resultsLabel}
          </p>
          <button
            onClick={() => setMobileFilterOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition-colors"
          >
            {mobileFilterOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
            {mobileFilterOpen ? t.common.close : t.rooms.filters.title}
            {filterState.activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-semibold">
                {filterState.activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filters panel */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden mb-5"
            >
              <RoomFilters state={filterState} totalCount={initialRooms.length} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Room filters">
            <RoomFilters state={filterState} totalCount={initialRooms.length} />
          </aside>

          {/* Room grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="popLayout">
              {filterState.filteredRooms.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="text-5xl mb-4">🏨</div>
                  <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.rooms.noResults}</h2>
                  <p className="text-sm text-stone-400 mb-4">
                    {t.rooms.pageSubtitle}
                  </p>
                  <button
                    onClick={filterState.resetFilters}
                    className="text-sm font-medium text-stone-600 hover:text-stone-900 underline underline-offset-2"
                  >
                    {t.rooms.clearFilters}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filterState.filteredRooms.map((room) => (
                      <motion.div
                        key={room.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                      >
                        <RoomCard
                          room={room}
                          promotions={promotions}
                          onViewDetails={handleViewDetails}
                          onBook={handleBook}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <RoomModal
        room={selectedRoom}
        isOpen={roomModal.isOpen}
        onClose={roomModal.close}
        onBook={(room) => {
          roomModal.close();
          handleBook(room);
        }}
      />
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={bookingModal.close}
        initialRoom={bookingRoom ?? undefined}
        rooms={initialRooms}
        promotions={promotions}
      />
    </section>
  );
}
