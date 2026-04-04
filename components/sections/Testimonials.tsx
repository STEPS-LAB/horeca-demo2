'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/rooms';
import { useTranslations } from '@/i18n/context';
import { useLocale } from '@/i18n/context';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function Testimonials() {
  const tr = useTranslations();
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const handleSwipeEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 48;
    const vx = info.velocity.x;
    if (info.offset.x > threshold || vx > 420) {
      paginate(-1);
    } else if (info.offset.x < -threshold || vx < -420) {
      paginate(1);
    }
  };

  const t = testimonials[index];
  const display = {
    name: locale === 'ua' && t.nameUa ? t.nameUa : t.name,
    location: locale === 'ua' && t.locationUa ? t.locationUa : t.location,
    text: locale === 'ua' && t.textUa ? t.textUa : t.text,
    date: locale === 'ua' && t.dateUa ? t.dateUa : t.date,
    roomStayed: locale === 'ua' && t.roomStayedUa ? t.roomStayedUa : t.roomStayed,
  };

  return (
    <section className="py-20 sm:py-28 bg-stone-50 overflow-hidden" aria-label={tr.sections.testimonials.title}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">{tr.sections.testimonials.title}</h2>
        </div>

        {/* Testimonial slider */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="touch-manipulation select-none bg-white rounded-2xl p-8 sm:p-10 border border-stone-200 shadow-sm"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragDirectionLock
              onDragEnd={handleSwipeEnd}
              style={{ cursor: 'grab' }}
            >
              {/* Quote icon */}
              <Quote
                size={36}
                className="text-gold-500/40 mb-6"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              {/* Text */}
              <blockquote>
                <p className="text-lg sm:text-xl text-stone-700 leading-relaxed font-light italic text-pretty">
                  &ldquo;{display.text}&rdquo;
                </p>

                <footer className="mt-8 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-stone-200 shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-stone-900 text-base">
                      {display.name}
                    </cite>
                    <p className="text-stone-600 text-sm">{display.location}</p>
                    <p className="text-stone-500 text-xs mt-0.5">
                      {tr.sections.testimonials.stayedIn
                        .replace('{room}', display.roomStayed)
                        .replace('{date}', display.date)}
                    </p>
                  </div>
                  <div
                    className="ml-auto flex items-center gap-0.5"
                    aria-label={tr.sections.testimonials.ratingAria.replace('{rating}', String(t.rating))}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < t.rating ? 'text-gold-400' : 'text-stone-300'}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {/* Dots */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label={tr.sections.testimonials.nav}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={tr.sections.testimonials.itemAria.replace('{index}', String(i + 1))}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-full"
                >
                  <motion.div
                    animate={{
                      width: i === index ? 24 : 8,
                      backgroundColor: i === index ? '#c9a96e' : '#d6d3d1',
                    }}
                    transition={{ duration: 0.25 }}
                    className="h-2 rounded-full"
                  />
                </button>
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label={tr.sections.testimonials.previous}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => paginate(1)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label={tr.sections.testimonials.next}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
