'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Home, ChevronRight, Info } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatCurrency, calculateBookingPrice, applyBestPromotion } from '@/utils/pricing';
import { useTranslations } from '@/i18n/context';
import type { BookingFormData, ValidationErrors, Room, Promotion } from '@/types';

interface BookingFormProps {
  form: BookingFormData;
  errors: ValidationErrors<BookingFormData>;
  rooms: Room[];
  promotions?: Promotion[];
  onUpdateField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
  onTouchField: (field: keyof BookingFormData) => void;
  onSubmit: () => Promise<boolean>;
  isLoading?: boolean;
  compact?: boolean;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export function BookingForm({
  form,
  errors,
  rooms,
  promotions = [],
  onUpdateField,
  onTouchField,
  onSubmit,
  isLoading,
  compact = false,
}: BookingFormProps) {
  const t = useTranslations();
  const selectedRoom = useMemo(() => rooms.find((r) => r.id === form.roomId) ?? null, [rooms, form.roomId]);

  const { discountedPrice, promotion: bestPromotion } = useMemo(
    () => applyBestPromotion(selectedRoom?.pricePerNight ?? 0, promotions, selectedRoom?.id ?? undefined),
    [selectedRoom, promotions]
  );

  const effectivePrice = selectedRoom
    ? (bestPromotion ? discountedPrice : selectedRoom.pricePerNight)
    : 0;

  const guestOptions = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} ${i === 0 ? t.common.guest : t.common.guests}`,
      })),
    [t.common.guest, t.common.guests]
  );

  const roomOptions = useMemo(
    () => [
      { value: '', label: '—' },
      ...rooms.map((r) => {
        const { discountedPrice: dp, promotion: promo } = applyBestPromotion(r.pricePerNight, promotions, r.id);
        const price = promo ? dp : r.pricePerNight;
        return { value: r.id, label: `${r.name} — ${formatCurrency(price)}${t.common.perNight}` };
      }),
    ],
    [rooms, promotions, t.common.perNight]
  );

  const pricing = useMemo(() => {
    if (!selectedRoom || !form.checkIn || !form.checkOut) return null;
    return calculateBookingPrice(effectivePrice, form.checkIn, form.checkOut);
  }, [selectedRoom, form.checkIn, form.checkOut, effectivePrice]);

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      noValidate
      aria-label={t.booking.reserveRoom}
      className="flex flex-col gap-5"
    >
      {/* Section: Booking details */}
      <div>
        {!compact && (
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Home size={15} className="text-stone-400" />
            {t.booking.step1}
          </h3>
        )}

        <div className="flex flex-col gap-4">
          <motion.div custom={0} variants={fieldVariants}>
            <Select
              label={t.rooms.pageTitle}
              required
              options={roomOptions}
              value={form.roomId}
              onChange={(e) => onUpdateField('roomId', e.target.value)}
              onBlur={() => onTouchField('roomId')}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div custom={1} variants={fieldVariants}>
              <Input
                label={t.booking.fields.checkIn}
                type="date"
                required
                value={form.checkIn}
                error={errors.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => onUpdateField('checkIn', e.target.value)}
                onBlur={() => onTouchField('checkIn')}
                leftIcon={<Calendar size={14} />}
              />
            </motion.div>
            <motion.div custom={2} variants={fieldVariants}>
              <Input
                label={t.booking.fields.checkOut}
                type="date"
                required
                value={form.checkOut}
                error={errors.checkOut}
                min={form.checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => onUpdateField('checkOut', e.target.value)}
                onBlur={() => onTouchField('checkOut')}
                leftIcon={<Calendar size={14} />}
              />
            </motion.div>
          </div>

          <motion.div custom={3} variants={fieldVariants}>
            <Select
              label={t.booking.fields.guests}
              required
              options={guestOptions}
              value={form.guests}
              error={errors.guests}
              onChange={(e) => onUpdateField('guests', +e.target.value as BookingFormData['guests'])}
              onBlur={() => onTouchField('guests')}
            />
          </motion.div>
        </div>
      </div>

      {/* Live price summary */}
      {pricing && pricing.nights > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-stone-50 rounded-xl p-4 border border-stone-100"
        >
          <div className="flex flex-col gap-2 text-sm">
            {bestPromotion && (
              <div className="flex justify-between text-emerald-600 text-xs font-medium pb-1 border-b border-stone-200">
                <span>🏷 {bestPromotion.name}</span>
                <span>
                  −{bestPromotion.type === 'PERCENTAGE'
                    ? `${bestPromotion.value}%`
                    : formatCurrency(bestPromotion.value)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>
                {formatCurrency(effectivePrice)} × {pricing.nights} {pricing.nights === 1 ? t.common.night : t.common.nights}
                {bestPromotion && (
                  <span className="text-stone-400 line-through ml-1 text-xs">
                    ({formatCurrency(selectedRoom?.pricePerNight ?? 0)})
                  </span>
                )}
              </span>
              <span>{formatCurrency(pricing.basePrice)}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-xs">
              <span className="flex items-center gap-1">
                {t.booking.summary.cleaningFee}
                <Tooltip content={t.booking.summary.cleaningFeeHint}>
                  <button type="button" aria-label={t.booking.summary.cleaningFee}>
                    <Info size={12} className="text-stone-400" />
                  </button>
                </Tooltip>
              </span>
              <span>{formatCurrency(pricing.cleaningFee)}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-xs">
              <span className="flex items-center gap-1">
                {t.booking.summary.taxes}
                <Tooltip content={t.booking.summary.taxesHint}>
                  <button type="button" aria-label={t.booking.summary.taxes}>
                    <Info size={12} className="text-stone-400" />
                  </button>
                </Tooltip>
              </span>
              <span>{formatCurrency(pricing.taxes)}</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 mt-1">
              <span>{t.booking.summary.total}</span>
              <span>{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section: Guest info */}
      <div>
        {!compact && (
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Users size={15} className="text-stone-400" />
            {t.booking.guestInfoTitle}
          </h3>
        )}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div custom={4} variants={fieldVariants}>
              <Input
                label={t.booking.fields.firstName}
                required
                autoComplete="given-name"
                value={form.firstName}
                error={errors.firstName}
                placeholder="—"
                onChange={(e) => onUpdateField('firstName', e.target.value)}
                onBlur={() => onTouchField('firstName')}
              />
            </motion.div>
            <motion.div custom={5} variants={fieldVariants}>
              <Input
                label={t.booking.fields.lastName}
                required
                autoComplete="family-name"
                value={form.lastName}
                error={errors.lastName}
                placeholder="—"
                onChange={(e) => onUpdateField('lastName', e.target.value)}
                onBlur={() => onTouchField('lastName')}
              />
            </motion.div>
          </div>

          <motion.div custom={6} variants={fieldVariants}>
            <Input
              label={t.booking.fields.email}
              type="email"
              required
              autoComplete="email"
              value={form.email}
              error={errors.email}
              placeholder="—"
              onChange={(e) => onUpdateField('email', e.target.value)}
              onBlur={() => onTouchField('email')}
              hint={t.booking.fields.emailHint}
            />
          </motion.div>

          <motion.div custom={7} variants={fieldVariants}>
            <Input
              label={t.booking.fields.phone}
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              error={errors.phone}
              placeholder="—"
              onChange={(e) => onUpdateField('phone', e.target.value)}
              onBlur={() => onTouchField('phone')}
            />
          </motion.div>

          <motion.div custom={8} variants={fieldVariants}>
            <Input
              label={t.booking.fields.specialRequests}
              value={form.specialRequests ?? ''}
              placeholder={t.booking.placeholders.specialRequests}
              onChange={(e) => onUpdateField('specialRequests', e.target.value)}
              hint={t.booking.fields.specialRequestsHint}
            />
          </motion.div>
        </div>
      </div>

      <motion.div custom={9} variants={fieldVariants}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ChevronRight size={16} />}
        >
          {t.booking.continueToPayment}
        </Button>
      </motion.div>
    </motion.form>
  );
}
