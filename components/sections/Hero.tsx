'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      aria-label="Hero — Welcome to LUMINA Hotel"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85"
          alt="LUMINA Hotel — Carpathian mountain resort"
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" aria-hidden="true" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        style={{ opacity: overlayOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-white/90 text-xs font-medium tracking-wide">
              <Star size={11} fill="currentColor" className="text-gold-300" />
              <span>Carpathian Mountains, Ukraine</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight text-balance"
          >
            Where Luxury
            <br />
            <span className="text-gold-300">Meets Nature</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-base sm:text-lg text-white/75 max-w-xl leading-relaxed text-pretty"
          >
            An extraordinary sanctuary nestled in ancient forests. Discover rooms crafted
            for those who demand the very finest — at the edge of the Carpathian wilderness.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/booking">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto shadow-[0_8px_30px_rgb(201,169,110,0.35)]"
              >
                Reserve Your Suite
              </Button>
            </Link>
            <Link href="/rooms">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto border border-white/25 text-white hover:bg-white/10"
              >
                Explore Rooms
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-4 text-white/60 text-sm"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" className="text-gold-300" />
              ))}
            </div>
            <span>
              <strong className="text-white/90 font-semibold">4.9/5</strong> from 546 verified reviews
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scroll down"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <span className="text-xs tracking-[0.2em] uppercase">Discover</span>
        <ChevronDown size={18} />
      </motion.button>
    </section>
  );
}
