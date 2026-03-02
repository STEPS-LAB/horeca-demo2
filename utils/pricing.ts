import type { BookingCalculation, Promotion } from '@/types';

const TAX_RATE = 0.12;
const CLEANING_FEE = 35;

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calculateBookingPrice(
  pricePerNight: number,
  checkIn: string,
  checkOut: string
): BookingCalculation {
  const nights = calculateNights(checkIn, checkOut);
  const basePrice = pricePerNight * nights;
  const cleaningFee = nights > 0 ? CLEANING_FEE : 0;
  const taxes = Math.round((basePrice + cleaningFee) * TAX_RATE * 100) / 100;
  const total = basePrice + cleaningFee + taxes;

  return {
    nights,
    basePrice,
    cleaningFee,
    taxes,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Finds the best (largest) discount from a list of active promotions
 * and returns the effective price per night and the winning promotion.
 * Pass roomSlug to filter out promotions that only apply to specific rooms.
 */
export function applyBestPromotion(
  pricePerNight: number,
  promotions: Promotion[],
  roomSlug?: string
): { discountedPrice: number; promotion: Promotion | null } {
  const applicable = roomSlug
    ? promotions.filter((p) => !p.roomSlugs || p.roomSlugs.includes(roomSlug))
    : promotions;

  if (!applicable.length) return { discountedPrice: pricePerNight, promotion: null };

  let best: Promotion | null = null;
  let bestPrice = pricePerNight;

  for (const promo of applicable) {
    const discounted =
      promo.type === 'PERCENTAGE'
        ? pricePerNight * (1 - promo.value / 100)
        : Math.max(0, pricePerNight - promo.value);
    if (discounted < bestPrice) {
      bestPrice = discounted;
      best = promo;
    }
  }

  return { discountedPrice: bestPrice, promotion: best };
}
