'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from '@/i18n/context';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

export function Hero() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] max-h-[960px] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=85"
          alt={t.home.heroImageAlt}
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 gradient-hero"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" aria-hidden="true" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-white/90 text-xs font-medium tracking-wide">
              <Star size={11} fill="currentColor" className="text-gold-300" />
              <span>{t.home.heroLocation}</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight text-balance"
          >
            {t.home.heroTitle.split('\n')[0]}
            <br />
            <span className="text-gold-300">{t.home.heroTitle.split('\n')[1]}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-base sm:text-lg text-white/90 max-w-xl leading-relaxed text-pretty"
          >
            {t.home.heroSubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              href="/booking"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-[0_8px_30px_rgb(201,169,110,0.35)]"
            >
              {t.home.heroPrimaryCta}
            </Button>
            <Button
              href="/rooms"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto border border-white/25 bg-black/35 text-white hover:bg-white/15"
            >
              {t.home.heroSecondaryCta}
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-4 text-white/80 text-sm"
          >
            <div className="flex items-center gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" className="text-gold-300" />
              ))}
            </div>
            <span>
              <strong className="text-white/90 font-semibold">4.9/5</strong>{' '}
              {t.home.heroReviews.replace('{rating}', '').replace('{count}', '546').trimStart()}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label={`${t.home.heroScrollCta} — ${t.home.heroScrollAria}`}
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <span className="text-xs tracking-[0.2em] uppercase">{t.home.heroScrollCta}</span>
        <ChevronDown size={18} />
      </motion.button>
    </section>
  );
}
