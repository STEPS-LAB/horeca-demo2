import { calculateNights, calculateBookingPrice, formatCurrency, getTodayString } from '@/utils/pricing';
import { validateBookingForm, validateContactForm, hasErrors } from '@/utils/validation';

describe('pricing utils', () => {
  describe('calculateNights', () => {
    it('returns correct number of nights', () => {
      expect(calculateNights('2026-03-01', '2026-03-05')).toBe(4);
    });

    it('returns 0 when dates are the same', () => {
      expect(calculateNights('2026-03-01', '2026-03-01')).toBe(0);
    });

    it('returns 0 when check-out is before check-in', () => {
      expect(calculateNights('2026-03-05', '2026-03-01')).toBe(0);
    });

    it('handles empty strings', () => {
      expect(calculateNights('', '')).toBe(0);
    });
  });

  describe('calculateBookingPrice', () => {
    it('calculates total correctly for 3 nights', () => {
      const result = calculateBookingPrice(200, '2026-04-01', '2026-04-04');
      expect(result.nights).toBe(3);
      expect(result.basePrice).toBe(600);
      expect(result.cleaningFee).toBe(35);
      expect(result.taxes).toBeCloseTo((600 + 35) * 0.12, 1);
      expect(result.total).toBe(result.basePrice);
    });

    it('returns zero totals for 0 nights', () => {
      const result = calculateBookingPrice(200, '2026-04-01', '2026-04-01');
      expect(result.nights).toBe(0);
      expect(result.cleaningFee).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('formats UAH correctly', () => {
      expect(formatCurrency(1500)).toBe('67 500 грн');
      expect(formatCurrency(99)).toBe('4 455 грн');
      expect(formatCurrency(0)).toBe('0 грн');
    });
  });

  describe('getTodayString', () => {
    it('returns a valid date string in YYYY-MM-DD format', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

describe('validation utils', () => {
  describe('validateBookingForm', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const checkIn = futureDate.toISOString().split('T')[0];
    const checkOutDate = new Date(futureDate);
    checkOutDate.setDate(checkOutDate.getDate() + 2);
    const checkOut = checkOutDate.toISOString().split('T')[0];

    const validForm = {
      roomId: 'standard-01',
      checkIn,
      checkOut,
      guests: 2,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1 555 123 4567',
    };

    it('returns no errors for a valid form', () => {
      const errors = validateBookingForm(validForm);
      expect(hasErrors(errors)).toBe(false);
    });

    it('requires check-in date', () => {
      const errors = validateBookingForm({ ...validForm, checkIn: '' });
      expect(errors.checkIn).toBeDefined();
    });

    it('requires check-out after check-in', () => {
      const errors = validateBookingForm({ ...validForm, checkOut: checkIn });
      expect(errors.checkOut).toBeDefined();
    });

    it('requires a valid email', () => {
      const errors = validateBookingForm({ ...validForm, email: 'not-an-email' });
      expect(errors.email).toBeDefined();
    });

    it('requires first name', () => {
      const errors = validateBookingForm({ ...validForm, firstName: '' });
      expect(errors.firstName).toBeDefined();
    });
  });

  describe('validateContactForm', () => {
    const validForm = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'General enquiry',
      message: 'This is a test message with enough characters to pass validation.',
    };

    it('returns no errors for a valid form', () => {
      expect(hasErrors(validateContactForm(validForm))).toBe(false);
    });

    it('requires name', () => {
      const errors = validateContactForm({ ...validForm, name: '' });
      expect(errors.name).toBeDefined();
    });

    it('requires a valid email', () => {
      const errors = validateContactForm({ ...validForm, email: 'bad@' });
      expect(errors.email).toBeDefined();
    });

    it('requires message of at least 20 characters', () => {
      const errors = validateContactForm({ ...validForm, message: 'Short msg' });
      expect(errors.message).toBeDefined();
    });
  });

  describe('hasErrors', () => {
    it('returns true when there are errors', () => {
      expect(hasErrors({ name: 'Required' })).toBe(true);
    });

    it('returns false when there are no errors', () => {
      expect(hasErrors({})).toBe(false);
    });
  });
});
