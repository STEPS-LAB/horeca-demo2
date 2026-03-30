'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, ChevronRight } from 'lucide-react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBooking } from '@/hooks/useBooking';
import { formatCurrency } from '@/utils/pricing';
import { useLocale, useTranslations } from '@/i18n/context';
import type { Room, Promotion } from '@/types';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function BookingPageClient({ rooms, promotions = [] }: { rooms: Room[]; promotions?: Promotion[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const includedLabel = locale === 'ua' ? 'Включено' : 'Included';
  const booking = useBooking(undefined, rooms, promotions);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const stepLabels = [t.booking.step1, t.booking.step2, t.booking.step3];
  const stepIndex = booking.step === 'form' ? 0 : booking.step === 'payment' ? 1 : 2;
  const stepDir = stepIndex;

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16)
      errs.cardNumber = t.booking.paymentErrors.cardNumber;
    if (!paymentData.cardHolder.trim()) errs.cardHolder = t.booking.paymentErrors.cardHolder;
    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry))
      errs.expiry = t.booking.paymentErrors.expiry;
    if (!paymentData.cvv || paymentData.cvv.length < 3) errs.cvv = t.booking.paymentErrors.cvv;
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Step indicator */}
        {booking.step !== 'confirmation' && (
          <div className="flex items-center justify-center mb-10">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                      i === stepIndex
                        ? 'bg-stone-900 text-white'
                        : i < stepIndex
                        ? 'bg-gold-500 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs hidden sm:block transition-colors ${
                      i === stepIndex ? 'text-stone-700 font-medium' : 'text-stone-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 sm:mb-0 transition-colors ${
                      i < stepIndex ? 'bg-gold-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
          <AnimatePresence mode="wait" custom={stepDir}>
            {booking.step === 'form' && (
              <motion.div
                key="form"
                custom={stepDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-6">{t.booking.step1}</h2>
                <BookingForm
                  form={booking.form}
                  errors={booking.errors}
                  rooms={rooms}
                  promotions={promotions}
                  onUpdateField={booking.updateField}
                  onTouchField={booking.touchField}
                  onSubmit={booking.submitBookingForm}
                />
              </motion.div>
            )}

            {booking.step === 'payment' && (
              <motion.div
                key="payment"
                custom={stepDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-5">{t.booking.step2}</h2>

                {/* Security note */}
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-lg mb-5 border border-emerald-200">
                  <Lock size={13} />
                  <span>{t.booking.paymentSecured}</span>
                </div>

                {/* Price summary */}
                {booking.pricing && (
                  <div className="bg-stone-50 rounded-xl p-5 mb-6 border border-stone-100">
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">{t.booking.summary.title}</h3>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between text-stone-600">
                        <span>
                          {formatCurrency(booking.selectedRoom?.pricePerNight ?? 0)} × {booking.pricing.nights}{' '}
                          {booking.pricing.nights === 1 ? t.common.night : t.common.nights}
                        </span>
                        <span>{formatCurrency(booking.pricing.basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-stone-400 text-xs">
                        <span>{t.booking.summary.cleaningFee}</span>
                        <span>{includedLabel}</span>
                      </div>
                      <div className="flex justify-between text-stone-400 text-xs">
                        <span>{t.booking.summary.taxes}</span>
                        <span>{includedLabel}</span>
                      </div>
                      <div className="flex justify-between font-bold text-stone-900 pt-3 border-t border-stone-200 mt-1 text-base">
                        <span>{t.booking.summary.total}</span>
                        <span>{formatCurrency(booking.pricing.total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (validatePayment()) booking.submitPayment();
                  }}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={15} className="text-stone-400" />
                    <span className="text-sm font-semibold text-stone-700">{t.booking.cardDetails}</span>
                  </div>
                  <Input
                    label={t.booking.cardNumber}
                    required
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    error={paymentErrors.cardNumber}
                    onChange={(e) =>
                      setPaymentData((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))
                    }
                    maxLength={19}
                  />
                  <Input
                    label={t.booking.cardholderName}
                    required
                    placeholder="John Smith"
                    autoComplete="cc-name"
                    value={paymentData.cardHolder}
                    error={paymentErrors.cardHolder}
                    onChange={(e) => setPaymentData((p) => ({ ...p, cardHolder: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label={t.booking.expiry}
                      required
                      placeholder="MM/YY"
                      inputMode="numeric"
                      maxLength={5}
                      value={paymentData.expiry}
                      error={paymentErrors.expiry}
                      onChange={(e) =>
                        setPaymentData((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))
                      }
                    />
                    <Input
                      label={t.booking.cvv}
                      required
                      placeholder="123"
                      inputMode="numeric"
                      maxLength={4}
                      type="password"
                      value={paymentData.cvv}
                      error={paymentErrors.cvv}
                      onChange={(e) =>
                        setPaymentData((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))
                      }
                    />
                  </div>
                  {booking.submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {booking.submitError}
                    </p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => booking.reset()}
                      leftIcon={<ArrowLeft size={15} />}
                      className="shrink-0"
                    >
                      {t.common.back}
                    </Button>
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      fullWidth
                      isLoading={booking.isSubmitting}
                      rightIcon={<ChevronRight size={16} />}
                    >
                      {t.booking.confirmBooking}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {booking.step === 'confirmation' && (
              <motion.div
                key="confirmation"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <BookingConfirmation
                  bookingId={booking.bookingId}
                  form={booking.form}
                  room={booking.selectedRoom}
                  pricing={booking.pricing}
                  onClose={booking.reset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
