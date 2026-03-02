'use client';

import { useState, useCallback, useMemo } from 'react';
import type { BookingFormData, BookingCalculation, BookingStep } from '@/types';
import { calculateBookingPrice, getTodayString, getTomorrowString } from '@/utils/pricing';
import { validateBookingForm, hasErrors } from '@/utils/validation';
import { rooms } from '@/data/rooms';

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

export function useBooking(initialRoomId?: string) {
  const [form, setForm] = useState<BookingFormData>({
    ...defaultForm,
    roomId: initialRoomId ?? '',
  });
  const [step, setStep] = useState<BookingStep>('form');
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === form.roomId) ?? null,
    [form.roomId]
  );

  const pricing = useMemo<BookingCalculation | null>(() => {
    if (!selectedRoom || !form.checkIn || !form.checkOut) return null;
    return calculateBookingPrice(selectedRoom.pricePerNight, form.checkIn, form.checkOut);
  }, [selectedRoom, form.checkIn, form.checkOut]);

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
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const id = `LMN-${Date.now().toString(36).toUpperCase()}`;
    setBookingId(id);
    setStep('confirmation');
    setIsSubmitting(false);
  }, []);

  const reset = useCallback(() => {
    setForm({ ...defaultForm, roomId: initialRoomId ?? '' });
    setStep('form');
    setTouched({});
    setIsSubmitting(false);
    setBookingId('');
  }, [initialRoomId]);

  return {
    form,
    step,
    errors: touchedErrors,
    pricing,
    selectedRoom,
    isSubmitting,
    bookingId,
    updateField,
    touchField,
    submitBookingForm,
    submitPayment,
    reset,
  };
}
