'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Users, Maximize2, BedDouble, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, applyBestPromotion } from '@/utils/pricing';
import { cn } from '@/utils/cn';
import type { Room, Promotion } from '@/types';
import { useLocale, useTranslations } from '@/i18n/context';

interface RoomCardProps {
  room: Room;
  promotions?: Promotion[];
  onViewDetails: (room: Room) => void;
  onBook: (room: Room) => void;
}

export function RoomCard({ room, promotions = [], onViewDetails, onBook }: RoomCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const galleryDragRef = useRef({ active: false, pointerId: -1, startX: 0, startScrollLeft: 0 });
  const locale = useLocale();
  const t = useTranslations();
  const displayName = locale === 'ua' && room.nameUa ? room.nameUa : room.name;
  const displayDesc = locale === 'ua' && room.shortDescriptionUa
    ? room.shortDescriptionUa
    : locale === 'ua' && room.descriptionUa
    ? room.descriptionUa.slice(0, 120)
    : room.shortDescription;
  const displayAmenities = locale === 'ua' && room.amenitiesUa ? room.amenitiesUa : room.amenities;
  const { discountedPrice, promotion: bestPromotion } = applyBestPromotion(room.pricePerNight, promotions, room.id);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== imgIndex && newIndex >= 0 && newIndex < room.images.length) {
      setImgIndex(newIndex);
    }
  };

  const scrollToImageIndex = useCallback(
    (i: number) => {
      const el = galleryScrollRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const next = Math.max(0, Math.min(room.images.length - 1, i));
      el.scrollTo({ left: next * w, behavior: 'smooth' });
      setImgIndex(next);
    },
    [room.images.length]
  );

  const onGalleryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || room.images.length <= 1) return;
    const el = galleryScrollRef.current;
    if (!el) return;
    galleryDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onGalleryPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = galleryDragRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const el = galleryScrollRef.current;
    if (!el) return;
    el.scrollLeft = d.startScrollLeft - (e.clientX - d.startX);
  };

  const endGalleryPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = galleryDragRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const el = galleryScrollRef.current;
    try {
      el?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    galleryDragRef.current = { active: false, pointerId: -1, startX: 0, startScrollLeft: 0 };
  };

  return (
    <motion.article
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-card hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${displayName} — ${formatCurrency(room.pricePerNight)} ${t.common.perNight}`}
    >
      {/* Image gallery: scroll layer (z-0) stays under UI overlay (z-10) so dots stay visible while swiping (WebKit compositing). */}
      <div className="relative h-52 sm:h-60">
        <div
          ref={galleryScrollRef}
          className={cn(
            'relative z-0 h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide select-none',
            room.images.length > 1 && 'lg:cursor-grab lg:active:cursor-grabbing'
          )}
          onScroll={handleScroll}
          onPointerDown={onGalleryPointerDown}
          onPointerMove={onGalleryPointerMove}
          onPointerUp={endGalleryPointerDrag}
          onPointerCancel={endGalleryPointerDrag}
          onLostPointerCapture={endGalleryPointerDrag}
        >
          <div className="flex h-full" style={{ width: `${room.images.length * 100}%` }}>
            {room.images.map((img, i) => (
              <div
                key={img}
                className="relative h-full snap-center shrink-0"
                style={{ width: `${100 / room.images.length}%` }}
              >
                <Image
                  src={img}
                  alt={`${displayName} — image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Gradient — must not steal swipes */}
          <div className="absolute inset-0 gradient-dark opacity-60 group-hover:opacity-70 transition-opacity pointer-events-none" />

          {/* Type badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-auto">
            <Badge
              variant="gold"
              className="text-white bg-white/15 backdrop-blur-md border border-white/25 shadow-sm"
            >
              {t.rooms.types[room.type]}
            </Badge>
            {bestPromotion && (
              <span className="self-start text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full tracking-wide uppercase">
                {bestPromotion.type === 'PERCENTAGE'
                  ? `−${bestPromotion.value}%`
                  : `−${formatCurrency(bestPromotion.value)}`}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-stone-800 pointer-events-auto">
            <Star size={11} fill="#c9a96e" className="text-gold-500" />
            <span>{room.rating.toFixed(1)}</span>
            <span className="text-stone-400 font-normal">({room.reviewCount})</span>
          </div>

          {/* Desktop gallery arrows */}
          {room.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label={t.rooms.modal.previousImage}
                className={cn(
                  'pointer-events-auto absolute left-2 top-1/2 z-[11] hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full glass-dark text-white shadow-sm transition-opacity hover:bg-white/20 lg:flex',
                  imgIndex === 0 && 'pointer-events-none opacity-0'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToImageIndex(imgIndex - 1);
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.25} className="shrink-0" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t.rooms.modal.nextImage}
                className={cn(
                  'pointer-events-auto absolute right-2 top-1/2 z-[11] hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full glass-dark text-white shadow-sm transition-opacity hover:bg-white/20 lg:flex',
                  imgIndex >= room.images.length - 1 && 'pointer-events-none opacity-0'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToImageIndex(imgIndex + 1);
                }}
              >
                <ChevronRight size={14} strokeWidth={2.25} className="shrink-0" aria-hidden />
              </button>
            </>
          )}

          {/* Image dots */}
          {room.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 pointer-events-auto">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImageIndex(i);
                  }}
                  aria-label={t.common.viewImage.replace('{index}', String(i + 1))}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white',
                    i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          )}

          {/* Quick view overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center invisible group-hover:visible lg:flex">
            <button
              type="button"
              onClick={() => onViewDetails(room)}
              className="pointer-events-auto flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 transition-colors"
            >
              <Eye size={15} />
              {t.common.quickView}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-stone-900 leading-tight">{displayName}</h3>
          <div className="text-right shrink-0">
            {bestPromotion && (
              <span className="text-xs text-stone-400 line-through block">
                {formatCurrency(room.pricePerNight)}
              </span>
            )}
            <span className={`text-lg font-bold ${bestPromotion ? 'text-red-600' : 'text-stone-900'}`}>
              {formatCurrency(bestPromotion ? discountedPrice : room.pricePerNight)}
            </span>
            <span className="text-xs text-stone-400 block">{t.common.perNight}</span>
          </div>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-2">
          {displayDesc}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-stone-500 mb-5">
          <span className="flex items-center gap-1">
            <Maximize2 size={13} className="text-stone-400" />
            {room.size} m²
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} className="text-stone-400" />
            {t.common.upTo.replace('{count}', String(room.maxGuests))}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={13} className="text-stone-400" />
            {room.bedType}
          </span>
        </div>

        {/* Top amenities */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {displayAmenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-500"
            >
              {a}
            </span>
          ))}
          {displayAmenities.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-400">
              +{t.common.more.replace('{count}', String(displayAmenities.length - 3))}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(room)}
          >
            {t.common.viewDetails}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onBook(room)}
          >
            {t.common.bookNow}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
