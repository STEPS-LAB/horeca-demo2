'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/i18n/context';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    altKey: 'exterior',
    className: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1620626011761-996317702519?auto=format&fit=crop&w=600&q=80',
    altKey: 'spaRoom',
    className: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    altKey: 'dining',
    className: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=600&q=80',
    altKey: 'pool',
    className: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    altKey: 'spaArea',
    className: 'col-span-1 row-span-1',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export function Gallery() {
  const t = useTranslations();
  return (
    <section
      id="visual-journey"
      className="py-20 sm:py-28 bg-stone-50"
      aria-labelledby="gallery-heading"
    >
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
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-600 mb-2 block">
              {t.sections.gallery.eyebrow}
            </span>
            <h2 id="gallery-heading" className="text-3xl sm:text-4xl font-bold text-stone-900">
              {t.sections.gallery.title}
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

        {/* Mosaic grid */}
        <motion.div
          className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px] sm:h-[600px] lg:h-[700px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              variants={imageVariants}
              className={`relative overflow-hidden rounded-2xl ${img.className}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={img.src}
                alt={t.sections.gallery.images[img.altKey as keyof typeof t.sections.gallery.images]}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
