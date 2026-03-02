'use client';

import { useState, useCallback, useMemo } from 'react';
import type { BookingFormData, BookingCalculation, BookingStep, Room, Promotion } from '@/types';
import { calculateBookingPrice, getTodayString, getTomorrowString, applyBestPromotion } from '@/utils/pricing';
import { validateBookingForm, hasErrors } from '@/utils/validation';

const defaultForm: BookingFormData = {
  roomId: '',
  checkIn: getTodayString(),
  checkOut: getTomorrowString(),
  guests: 1,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
};

export function useBooking(
  initialRoomId?: string,
  rooms: Room[] = [],
  promotions: Promotion[] = []
) {
  const [form, setForm] = useState<BookingFormData>({
    ...defaultForm,
    roomId: initialRoomId ?? '',
  });
  const [step, setStep] = useState<BookingStep>('form');
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalPricing, setFinalPricing] = useState<BookingCalculation | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === form.roomId) ?? null,
    [rooms, form.roomId]
  );

  // Apply the best active promotion to the room's base price (filtered by room slug)
  const { discountedPrice, promotion: bestPromotion } = useMemo(
    () => applyBestPromotion(selectedRoom?.pricePerNight ?? 0, promotions, selectedRoom?.id),
    [selectedRoom, promotions]
  );

  const effectivePricePerNight = selectedRoom
    ? (bestPromotion ? discountedPrice : selectedRoom.pricePerNight)
    : 0;

  const pricing = useMemo<BookingCalculation | null>(() => {
    if (!selectedRoom || !form.checkIn || !form.checkOut) return null;
    return calculateBookingPrice(effectivePricePerNight, form.checkIn, form.checkOut);
  }, [selectedRoom, form.checkIn, form.checkOut, effectivePricePerNight]);

  const errors = useMemo(() => validateBookingForm(form), [form]);

  const touchedErrors = useMemo(() => {
    const result: Partial<Record<keyof BookingFormData, string>> = {};
    for (const key of Object.keys(touched) as Array<keyof BookingFormData>) {
      if (touched[key] && errors[key]) {
        result[key] = errors[key];
      }
    }
    return result;
  }, [errors, touched]);

  const updateField = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const touchField = useCallback((field: keyof BookingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const touchAll = useCallback(() => {
    const allTouched = Object.keys(defaultForm).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof BookingFormData, boolean>
    );
    setTouched(allTouched);
  }, []);

  const submitBookingForm = useCallback(async (): Promise<boolean> => {
    touchAll();
    if (hasErrors(errors)) return false;
    setStep('payment');
    return true;
  }, [errors, touchAll]);

  const submitPayment = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? 'Booking failed. Please try again.');
      }
      const data = await res.json() as {
        reference: string;
        subtotal: number;
        cleaningFee: number;
        taxes: number;
        total: number;
      };
      setBookingId(data.reference);
      setFinalPricing({
        nights: pricing?.nights ?? 0,
        basePrice: data.subtotal,
        cleaningFee: data.cleaningFee,
        taxes: data.taxes,
        total: data.total,
      });
      setStep('confirmation');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, pricing]);

  const reset = useCallback(() => {
    setForm({ ...defaultForm, roomId: initialRoomId ?? '' });
    setStep('form');
    setTouched({});
    setIsSubmitting(false);
    setBookingId('');
    setSubmitError(null);
    setFinalPricing(null);
  }, [initialRoomId]);

  return {
    form,
    step,
    errors: touchedErrors,
    // After confirmed: use server pricing; before: show live client estimate
    pricing: finalPricing ?? pricing,
    selectedRoom,
    bestPromotion,
    discountedPrice,
    effectivePricePerNight,
    isSubmitting,
    bookingId,
    submitError,
    updateField,
    touchField,
    submitBookingForm,
    submitPayment,
    reset,
  };
}
