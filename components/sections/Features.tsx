'use client';

import { motion, useAnimationControls, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  Waves,
  UtensilsCrossed,
  Dumbbell,
  TreePine,
  Wifi,
  Car,
  Sparkles,
  Wine,
} from 'lucide-react';
import { useTranslations } from '@/i18n/context';

const features = [
  {
    Icon: Sparkles,
    key: 'spa',
  },
  {
    Icon: UtensilsCrossed,
    key: 'dining',
  },
  {
    Icon: Waves,
    key: 'pool',
  },
  {
    Icon: TreePine,
    key: 'hikes',
  },
  {
    Icon: Dumbbell,
    key: 'fitness',
  },
  {
    Icon: Wine,
    key: 'wine',
  },
  {
    Icon: Wifi,
    key: 'wifi',
  },
  {
    Icon: Car,
    key: 'concierge',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

export function Features() {
  const t = useTranslations();
  const controls = useAnimationControls();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  return (
    <section
      ref={sectionRef}
      id="lumina-experience"
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="max-w-2xl mx-auto text-center mb-14"
          initial="hidden"
          animate={controls}
          variants={cardVariants}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-600 mb-3 block">
            {t.sections.features.eyebrow}
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight text-balance"
          >
            {t.sections.features.title}
          </h2>
          <p className="mt-4 text-stone-500 text-base leading-relaxed text-pretty">
            {t.sections.features.subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {features.map(({ Icon, key }) => (
            <motion.div
              key={key}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-gold-300/60 hover:bg-stone-25 hover:shadow-card transition-colors duration-250"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-stone-200 shadow-sm mb-4 transition-colors duration-250 group-hover:border-gold-300/50 group-hover:bg-gold-300/10">
                <Icon
                  size={20}
                  className="text-stone-500 transition-colors duration-250 group-hover:text-gold-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-sm font-semibold text-stone-800 mb-1.5">
                {t.sections.features.items[key as keyof typeof t.sections.features.items].title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {t.sections.features.items[key as keyof typeof t.sections.features.items].description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
