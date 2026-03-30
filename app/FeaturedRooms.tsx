'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomModal } from '@/components/rooms/RoomModal';
import { BookingModal } from '@/components/booking/BookingModal';
import { useModal } from '@/hooks/useModal';
import { useTranslations } from '@/i18n/context';
import type { Room, Promotion } from '@/types';

export function FeaturedRooms({ rooms, promotions = [] }: { rooms: Room[]; promotions?: Promotion[] }) {
  const t = useTranslations();
  const featuredRooms = rooms.slice(0, 3);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const roomModal = useModal();
  const bookingModal = useModal();

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    roomModal.open();
  };

  const handleBook = (room: Room) => {
    setBookingRoom(room);
    bookingModal.open();
  };

  return (
    <section className="py-20 sm:py-28 bg-stone-50" aria-labelledby="featured-rooms-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2
              id="featured-rooms-heading"
              className="text-3xl sm:text-4xl font-bold text-stone-900"
            >
              {t.home.featuredTitle}
            </h2>
          </div>
          <Link
            href="/rooms"
            className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors group"
          >
            <span>{t.sections.gallery.viewAllRooms}</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <RoomCard
                room={room}
                promotions={promotions}
                onViewDetails={handleViewDetails}
                onBook={handleBook}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
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
        rooms={rooms}
        promotions={promotions}
      />
    </section>
  );
}
