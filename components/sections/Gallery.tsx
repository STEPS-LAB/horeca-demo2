'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from '@/i18n/context';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1757716583277-5ea5f0e73427?auto=format&fit=crop&w=1400&q=80',
    altKey: 'exterior',
    className: 'col-span-2 row-span-2 col-start-1 row-start-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1747948543522-2dea7b685415?auto=format&fit=crop&w=900&q=80',
    altKey: 'spaRoom',
    className: 'col-span-1 row-span-1 col-start-3 row-start-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1652695872063-50a5370d90a5?auto=format&fit=crop&w=900&q=80',
    altKey: 'dining',
    className: 'col-span-1 row-span-1 col-start-3 row-start-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1768931676483-f22777872c23?auto=format&fit=crop&w=900&q=80',
    altKey: 'pool',
    className: 'col-span-1 row-span-1 col-start-1 row-start-3',
  },
  {
    src: 'https://images.unsplash.com/photo-1747948543214-5365a4700d55?auto=format&fit=crop&w=900&q=80',
    altKey: 'spaArea',
    className: 'col-span-1 row-span-1 col-start-2 row-start-3',
  },
  {
    src: 'https://images.unsplash.com/photo-1637614042056-bf414069c311?auto=format&fit=crop&w=900&q=80',
    altKey: 'lobby',
    className: 'col-span-1 row-span-1 col-start-3 row-start-3',
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
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 id="gallery-heading" className="text-3xl sm:text-4xl font-bold text-stone-900">
              {t.sections.gallery.title}
            </h2>
          </div>
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
