import type { BookingFormData, ContactFormData, ValidationErrors } from '@/types';

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'Phone number is required';
  if (!/^\+?[\d\s\-()]{8,20}$/.test(phone)) return 'Enter a valid phone number';
  return undefined;
}

export function validateBookingForm(data: Partial<BookingFormData>): ValidationErrors<BookingFormData> {
  const errors: ValidationErrors<BookingFormData> = {};

  if (!data.checkIn) errors.checkIn = 'Check-in date is required';
  if (!data.checkOut) errors.checkOut = 'Check-out date is required';

  if (data.checkIn && data.checkOut) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) errors.checkIn = 'Check-in cannot be in the past';
    else if (checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in';
  }

  if (!data.guests || data.guests < 1) errors.guests = 'At least 1 guest is required';

  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';

  const emailError = validateEmail(data.email ?? '');
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone ?? '');
  if (phoneError) errors.phone = phoneError;

  return errors;
}

export function validateContactForm(data: Partial<ContactFormData>): ValidationErrors<ContactFormData> {
  const errors: ValidationErrors<ContactFormData> = {};

  if (!data.name?.trim()) errors.name = 'Your name is required';

  const emailError = validateEmail(data.email ?? '');
  if (emailError) errors.email = emailError;

  if (!data.subject?.trim()) errors.subject = 'Subject is required';
  if (!data.message?.trim()) errors.message = 'Message is required';
  else if ((data.message ?? '').length < 20) errors.message = 'Message must be at least 20 characters';

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.values(errors).some((v) => v !== undefined);
}
