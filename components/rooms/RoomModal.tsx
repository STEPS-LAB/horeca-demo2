'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Users,
  Maximize2,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/pricing';
import { cn } from '@/utils/cn';
import type { Room } from '@/types';
import { useLocale, useTranslations } from '@/i18n/context';

interface RoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (room: Room) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 40, scale: 0.97 },
};

export function RoomModal({ room, isOpen, onClose, onBook }: RoomModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    if (!isOpen || !room) return;
    setImgIndex(0);
    requestAnimationFrame(() => {
      const el = galleryScrollRef.current;
      if (el) el.scrollLeft = 0;
    });
  }, [isOpen, room?.id]);

  const handleGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!room || room.images.length < 2) return;
    const container = e.currentTarget;
    const w = container.clientWidth;
    if (w <= 0) return;
    const next = Math.round(container.scrollLeft / w);
    setImgIndex((prev) => {
      if (next !== prev && next >= 0 && next < room.images.length) return next;
      return prev;
    });
  };

  const scrollGalleryToIndex = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = galleryScrollRef.current;
    if (!el || !room) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    el.scrollTo({ left: i * w, behavior });
    setImgIndex(i);
  };

  const navigateImage = (dir: number) => {
    if (!room || room.images.length < 2) return;
    setImgIndex((prev) => {
      const next = (prev + dir + room.images.length) % room.images.length;
      requestAnimationFrame(() => {
        const el = galleryScrollRef.current;
        const cw = el?.clientWidth ?? 0;
        if (el && cw > 0) el.scrollTo({ left: next * cw, behavior: 'smooth' });
      });
      return next;
    });
  };

  // Reset image index when room changes
  if (!isOpen || !room) {
    return (
      <AnimatePresence>
        {isOpen && null}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && room && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={room.name}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-t-3xl md:rounded-3xl shadow-modal max-h-[92dvh] overflow-y-auto modal-scroll"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label={t.common.close}
            >
              <X size={18} />
            </button>

            {/* Image gallery — native horizontal scroll + snap (reliable swipe on mobile, same pattern as RoomCard). */}
            <div className="relative h-60 sm:h-72 md:h-80 overflow-hidden rounded-t-3xl md:rounded-t-3xl">
              <div
                ref={galleryScrollRef}
                className="relative z-0 h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
                onScroll={handleGalleryScroll}
              >
                <div className="flex h-full" style={{ width: `${room.images.length * 100}%` }}>
                  {room.images.map((img, i) => (
                    <div
                      key={img}
                      className="relative h-full shrink-0 snap-center"
                      style={{ width: `${100 / room.images.length}%` }}
                    >
                      <Image
                        src={img}
                        alt={`${locale === 'ua' && room.nameUa ? room.nameUa : room.name} — ${t.common.image.replace('{index}', String(i + 1))}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 896px"
                        priority={i === 0}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 z-10">
                {room.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => navigateImage(-1)}
                      className="pointer-events-auto absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-xl glass-dark text-white transition-colors hover:bg-white/20 min-h-11 min-w-11"
                      aria-label={t.rooms.modal.previousImage}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateImage(1)}
                      className="pointer-events-auto absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-xl glass-dark text-white transition-colors hover:bg-white/20 min-h-11 min-w-11"
                      aria-label={t.rooms.modal.nextImage}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {room.images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => scrollGalleryToIndex(i, 'smooth')}
                          aria-label={t.common.image.replace('{index}', String(i + 1))}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                            i === imgIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="pointer-events-auto absolute top-4 left-4">
                  <Badge variant="gold">{t.rooms.types[room.type]}</Badge>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    {locale === 'ua' && room.nameUa ? room.nameUa : room.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < Math.round(room.rating) ? 'text-gold-500' : 'text-stone-200'}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-stone-700">{room.rating}</span>
                    <span className="text-sm text-stone-400">
                      ({t.rooms.modal.reviews.replace('{count}', String(room.reviewCount))})
                    </span>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-3xl font-bold text-stone-900">{formatCurrency(room.pricePerNight)}</div>
                  <div className="text-sm text-stone-400">{t.common.perNight}</div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { Icon: Maximize2, label: t.rooms.modal.size, value: `${room.size} m²` },
                  { Icon: Users, label: t.rooms.modal.guests, value: t.common.upTo.replace('{count}', String(room.maxGuests)) },
                  { Icon: BedDouble, label: t.rooms.modal.bed, value: locale === 'ua' && room.bedTypeUa ? room.bedTypeUa : room.bedType },
                  { Icon: MapPin, label: t.rooms.modal.view, value: locale === 'ua' && room.viewUa ? room.viewUa : (room.view ?? 'Garden') },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="bg-stone-50 rounded-xl p-3">
                    <Icon size={15} className="text-stone-400 mb-1.5" strokeWidth={1.5} />
                    <div className="text-xs text-stone-400">{label}</div>
                    <div className="text-sm font-semibold text-stone-800 mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-stone-600 leading-relaxed text-sm mb-6">
                {locale === 'ua' && room.descriptionUa ? room.descriptionUa : room.description}
              </p>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-stone-800 mb-3">{t.rooms.modal.amenities}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                  {(locale === 'ua' && room.amenitiesUa ? room.amenitiesUa : room.amenities).map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-stone-600">
                      <Check size={13} className="text-gold-500 shrink-0" strokeWidth={2.5} />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-stone-800 mb-3">{t.rooms.modal.roomFeatures}</h3>
                <div className="flex flex-wrap gap-2">
                  {(locale === 'ua' && room.featuresUa ? room.featuresUa : room.features).map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-stone-100">
                <Button variant="outline" size="lg" className="sm:flex-1" onClick={onClose}>
                  {t.rooms.modal.continueBrowsing}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="sm:flex-1"
                  onClick={() => {
                    onClose();
                    onBook(room);
                  }}
                >
                  {t.rooms.modal.reserveWithPrice
                    .replace('{price}', formatCurrency(room.pricePerNight))
                    .replace('{perNight}', t.common.perNight)}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
