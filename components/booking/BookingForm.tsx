'use client';

import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, ChevronRight, Info } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatCurrency, calculateBookingPrice, applyBestPromotion } from '@/utils/pricing';
import { useLocale, useTranslations } from '@/i18n/context';
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

/** Stops WebKit date inputs from sizing the row by min-content; matches full-width selects. */
const fieldWrapCls = 'w-full min-w-0 max-w-full self-stretch';

const PHONE_MASK_PLACEHOLDER = '+38 (0__)-___-__-__';
const PHONE_DIGIT_SLOTS = [7, 8, 11, 12, 13, 15, 16, 18, 19];

function normalizePhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('380')) digits = digits.slice(3);
  else if (digits.startsWith('80')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 9);
}

function formatUaPhone(digits: string): string {
  if (!digits) return '';
  const a = digits.slice(0, 2);
  const b = digits.slice(2, 5);
  const c = digits.slice(5, 7);
  const d = digits.slice(7, 9);

  let out = '+38 (0';
  out += a;
  if (digits.length >= 2) out += ')';
  if (digits.length >= 3) out += `-${b}`;
  if (digits.length >= 6) out += `-${c}`;
  if (digits.length >= 8) out += `-${d}`;
  return out;
}

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
  const locale = useLocale();
  const includedLabel = locale === 'ua' ? 'Включено' : 'Included';
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const selectedRoom = useMemo(() => rooms.find((r) => r.id === form.roomId) ?? null, [rooms, form.roomId]);
  const sanitizeName = (value: string) => value.replace(/[^\p{L}\s'’-]/gu, '');
  const sanitizePhone = (value: string) => formatUaPhone(normalizePhoneDigits(value));

  const handlePhoneKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;

    const input = e.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (start !== end) return;

    const digits = normalizePhoneDigits(form.phone);
    if (!digits.length) return;

    const slotIndex = e.key === 'Backspace'
      ? [...PHONE_DIGIT_SLOTS].reverse().findIndex((slot) => slot < start)
      : PHONE_DIGIT_SLOTS.findIndex((slot) => slot >= start);

    const removeAt = e.key === 'Backspace'
      ? (slotIndex === -1 ? -1 : PHONE_DIGIT_SLOTS.length - 1 - slotIndex)
      : slotIndex;

    if (removeAt < 0 || removeAt >= digits.length) return;

    e.preventDefault();
    const nextDigits = `${digits.slice(0, removeAt)}${digits.slice(removeAt + 1)}`;
    const nextValue = formatUaPhone(nextDigits);
    onUpdateField('phone', nextValue);

    const caretSlot = PHONE_DIGIT_SLOTS[Math.max(removeAt, 0)] ?? nextValue.length;
    requestAnimationFrame(() => {
      const node = phoneInputRef.current;
      if (!node) return;
      const pos = Math.min(caretSlot, nextValue.length);
      node.setSelectionRange(pos, pos);
    });
  };

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
      { value: '', label: t.booking.selectRoom },
      ...rooms.map((r) => {
        const { discountedPrice: dp, promotion: promo } = applyBestPromotion(r.pricePerNight, promotions, r.id);
        const price = promo ? dp : r.pricePerNight;
        const roomName = locale === 'ua' ? (r.nameUa ?? r.name) : r.name;
        return { value: r.id, label: `${roomName} — ${formatCurrency(price)}${t.common.perNight}` };
      }),
    ],
    [rooms, promotions, t.common.perNight, locale]
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
      className="flex min-w-0 w-full max-w-full flex-col gap-5"
    >
      {/* Section: Booking details */}
      <div>
        {!compact && (
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Home size={15} className="text-stone-400" />
            {t.booking.step1}
          </h3>
        )}

        <div className="flex min-w-0 flex-col gap-4">
          <motion.div custom={0} variants={fieldVariants} className={fieldWrapCls}>
            <Select
              label={t.booking.selectRoom}
              required
              options={roomOptions}
              value={form.roomId}
              onChange={(e) => onUpdateField('roomId', e.target.value)}
              onBlur={() => onTouchField('roomId')}
            />
          </motion.div>

          <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
            <motion.div custom={1} variants={fieldVariants} className={fieldWrapCls}>
              <Input
                label={t.booking.fields.checkIn}
                type="date"
                required
                value={form.checkIn}
                error={errors.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => onUpdateField('checkIn', e.target.value)}
                onBlur={() => onTouchField('checkIn')}
              />
            </motion.div>
            <motion.div custom={2} variants={fieldVariants} className={fieldWrapCls}>
              <Input
                label={t.booking.fields.checkOut}
                type="date"
                required
                value={form.checkOut}
                error={errors.checkOut}
                min={form.checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => onUpdateField('checkOut', e.target.value)}
                onBlur={() => onTouchField('checkOut')}
              />
            </motion.div>
          </div>

          <motion.div custom={3} variants={fieldVariants} className={fieldWrapCls}>
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
              <span>{includedLabel}</span>
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
              <span>{includedLabel}</span>
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
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 [&>*]:min-w-0 [&>*]:w-full [&>*]:max-w-full">
            <motion.div custom={4} variants={fieldVariants} className={fieldWrapCls}>
              <Input
                label={t.booking.fields.firstName}
                required
                autoComplete="given-name"
                value={form.firstName}
                error={errors.firstName}
                placeholder="—"
                onChange={(e) => onUpdateField('firstName', sanitizeName(e.target.value))}
                onBlur={() => onTouchField('firstName')}
              />
            </motion.div>
            <motion.div custom={5} variants={fieldVariants} className={fieldWrapCls}>
              <Input
                label={t.booking.fields.lastName}
                required
                autoComplete="family-name"
                value={form.lastName}
                error={errors.lastName}
                placeholder="—"
                onChange={(e) => onUpdateField('lastName', sanitizeName(e.target.value))}
                onBlur={() => onTouchField('lastName')}
              />
            </motion.div>
          </div>

          <motion.div custom={6} variants={fieldVariants} className={fieldWrapCls}>
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

          <motion.div custom={7} variants={fieldVariants} className={fieldWrapCls}>
            <Input
              ref={phoneInputRef}
              label={t.booking.fields.phone}
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              error={errors.phone}
              placeholder={PHONE_MASK_PLACEHOLDER}
              onChange={(e) => onUpdateField('phone', sanitizePhone(e.target.value))}
              onKeyDown={handlePhoneKeyDown}
              onBlur={() => onTouchField('phone')}
            />
          </motion.div>

          <motion.div custom={8} variants={fieldVariants} className={fieldWrapCls}>
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
