'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { useBooking } from '@/hooks/useBooking';
import { formatCurrency } from '@/utils/pricing';
import type { Room, Promotion } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: Room;
  rooms?: Room[];
  promotions?: Promotion[];
}

const stepTitles = {
  form: 'Reserve Your Room',
  payment: 'Secure Payment',
  confirmation: 'Booking Confirmed!',
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function BookingModal({ isOpen, onClose, initialRoom, rooms = [], promotions = [] }: BookingModalProps) {
  const booking = useBooking(initialRoom?.id, rooms, promotions);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const stepDir = booking.step === 'payment' ? 1 : booking.step === 'confirmation' ? 1 : -1;

  const handleClose = () => {
    onClose();
    setTimeout(() => booking.reset(), 300);
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16)
      errs.cardNumber = 'Enter a valid 16-digit card number';
    if (!paymentData.cardHolder.trim()) errs.cardHolder = 'Cardholder name is required';
    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry))
      errs.expiry = 'Enter expiry as MM/YY';
    if (!paymentData.cvv || paymentData.cvv.length < 3) errs.cvv = 'Enter a valid CVV';
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={stepTitles[booking.step]}
      size="md"
    >
      {/* Step indicator */}
      {booking.step !== 'confirmation' && (
        <div className="-mt-2 mb-6">
          <div className="flex items-center gap-2">
            {['form', 'payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
                    booking.step === s
                      ? 'bg-stone-900 text-white'
                      : i < ['form', 'payment'].indexOf(booking.step)
                      ? 'bg-gold-500 text-white'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs ${
                    booking.step === s ? 'text-stone-700 font-medium' : 'text-stone-400'
                  }`}
                >
                  {s === 'form' ? 'Details' : 'Payment'}
                </span>
                {i < 1 && <div className="flex-1 h-px bg-stone-200 w-8" />}
              </div>
            ))}
          </div>
        </div>
      )}

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
          >
            <BookingForm
              form={booking.form}
              errors={booking.errors}
              rooms={rooms}
              promotions={promotions}
              onUpdateField={booking.updateField}
              onTouchField={booking.touchField}
              onSubmit={booking.submitBookingForm}
              compact
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
          >
            {/* Security badge */}
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-lg mb-5 border border-emerald-200">
              <Lock size={13} />
              <span>Your payment is secured with 256-bit TLS encryption</span>
            </div>

            {/* Price summary */}
            {booking.pricing && (
              <div className="bg-stone-50 rounded-xl p-4 mb-5 border border-stone-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {booking.selectedRoom?.name}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {booking.form.checkIn} → {booking.form.checkOut} · {booking.pricing.nights} nights
                    </p>
                  </div>
                  <span className="text-lg font-bold text-stone-900">
                    {formatCurrency(booking.pricing.total)}
                  </span>
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
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={15} className="text-stone-400" />
                  <span className="text-sm font-semibold text-stone-700">Card Details</span>
                  <span className="text-xs text-stone-400">(demo — no real charge)</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Card number"
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
                    label="Cardholder name"
                    required
                    placeholder="John Smith"
                    autoComplete="cc-name"
                    value={paymentData.cardHolder}
                    error={paymentErrors.cardHolder}
                    onChange={(e) =>
                      setPaymentData((p) => ({ ...p, cardHolder: e.target.value }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry"
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
                      label="CVV"
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
                </div>
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
                  size="md"
                  onClick={() => booking.reset()}
                  leftIcon={<ArrowLeft size={15} />}
                  className="shrink-0"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  fullWidth
                  isLoading={booking.isSubmitting}
                  rightIcon={<ChevronRight size={16} />}
                >
                  Confirm Booking
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
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <BookingConfirmation
              bookingId={booking.bookingId}
              form={booking.form}
              room={booking.selectedRoom}
              pricing={booking.pricing}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
