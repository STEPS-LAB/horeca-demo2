'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Calendar, Users, Home, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/pricing';
import { useLocale, useTranslations } from '@/i18n/context';
import type { BookingFormData, BookingCalculation, Room } from '@/types';

interface BookingConfirmationProps {
  bookingId: string;
  form: BookingFormData;
  room: Room | null;
  pricing: BookingCalculation | null;
  onClose: () => void;
}

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 20, delay: 0.1 },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function BookingConfirmation({
  bookingId,
  form,
  room,
  pricing,
  onClose,
}: BookingConfirmationProps) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formatDate = (date: string) => {
    if (!date) return '—';
    const [year, month, day] = date.split('-');
    if (!year || !month || !day) return date;
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Success icon */}
      <motion.div
        variants={checkVariants}
        className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 mb-5"
      >
        <Check size={28} className="text-emerald-600" strokeWidth={2.5} />
      </motion.div>

      <motion.h2
        ref={headingRef}
        variants={itemVariants}
        className="text-xl font-bold text-stone-900 focus:outline-none"
        tabIndex={-1}
      >
        {t.booking.receiptTitle}
      </motion.h2>

      <motion.p variants={itemVariants} className="text-stone-500 text-sm mt-2 mb-6 max-w-xs">
        {t.booking.receiptMessage
          .replace('{name}', form.firstName)
          .replace('{email}', form.email)}
      </motion.p>

      {/* Booking reference */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 mb-5"
      >
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">{t.booking.referenceLabel}</p>
        <p className="text-2xl font-bold text-stone-900 font-mono tracking-wider">{bookingId}</p>
      </motion.div>

      {/* Details grid */}
      <motion.div
        variants={itemVariants}
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
      >
        {[
          {
            Icon: Home,
            label: t.booking.details.room,
            value: room ? (locale === 'ua' && room.nameUa ? room.nameUa : room.name) : '—',
          },
          {
            Icon: Calendar,
            label: t.booking.details.dates,
            value: `${formatDate(form.checkIn)} → ${formatDate(form.checkOut)}`,
          },
          {
            Icon: Users,
            label: t.booking.details.guests,
            value: `${form.guests} ${form.guests === 1 ? t.common.guest : t.common.guests}`,
          },
          {
            Icon: Check,
            label: t.booking.details.totalPaid,
            value: pricing ? formatCurrency(pricing.total) : '—',
          },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-stone-100 text-left">
            <Icon size={15} className="text-gold-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-stone-400">{label}</p>
              <p className="text-sm font-semibold text-stone-800 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Special requests */}
      {form.specialRequests && (
        <motion.div
          variants={itemVariants}
          className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left"
        >
          <p className="text-xs font-medium text-amber-700 mb-1">{t.booking.details.specialRequests}</p>
          <p className="text-sm text-amber-600">{form.specialRequests}</p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="md"
          className="sm:flex-1"
          onClick={() => window.print()}
          leftIcon={<Printer size={15} />}
        >
          {t.booking.printReceipt}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="sm:flex-1"
          onClick={() => {
            onClose();
            router.push('/');
          }}
        >
          {t.booking.backToHome}
        </Button>
      </motion.div>
    </motion.div>
  );
}
