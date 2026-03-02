import { prisma } from '@/lib/prisma';
import type { BookingFormData, BookingCalculation } from '@/types';

export interface BookingRecord {
  id: string;
  reference: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  subtotal: number;
  cleaningFee: number;
  taxes: number;
  total: number;
  createdAt: Date;
}

export async function createBooking(
  form: BookingFormData,
  pricing: BookingCalculation
): Promise<BookingRecord> {
  const reference = `LMN-${Date.now()}`;

  if (!process.env.DATABASE_URL) {
    // Demo mode: return a synthetic record
    return {
      id: crypto.randomUUID(),
      reference,
      roomId: form.roomId,
      checkIn: new Date(form.checkIn),
      checkOut: new Date(form.checkOut),
      guests: form.guests,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      specialRequests: form.specialRequests || null,
      status: 'CONFIRMED',
      subtotal: pricing.basePrice,
      cleaningFee: pricing.cleaningFee,
      taxes: pricing.taxes,
      total: pricing.total,
      createdAt: new Date(),
    };
  }

  // form.roomId is the slug — resolve to DB cuid
  const dbRoom = await prisma.room.findUnique({
    where: { slug: form.roomId },
    select: { id: true },
  });
  if (!dbRoom) throw new Error(`Room not found: ${form.roomId}`);

  const booking = await prisma.booking.create({
    data: {
      reference,
      roomId: dbRoom.id,
      checkIn: new Date(form.checkIn),
      checkOut: new Date(form.checkOut),
      guests: form.guests,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      specialRequests: form.specialRequests || null,
      status: 'CONFIRMED',
      subtotal: pricing.basePrice,
      cleaningFee: pricing.cleaningFee,
      taxes: pricing.taxes,
      total: pricing.total,
    },
  });

  return booking as BookingRecord;
}

export async function getBookings(opts?: {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  email?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: BookingRecord[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;
  const skip = (page - 1) * limit;

  if (!process.env.DATABASE_URL) {
    return { bookings: [], total: 0 };
  }

  const where = {
    ...(opts?.status ? { status: opts.status } : {}),
    ...(opts?.email ? { email: opts.email } : {}),
  };

  try {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);
    return { bookings: bookings as BookingRecord[], total };
  } catch {
    return { bookings: [], total: 0 };
  }
}

export async function updateBookingStatus(
  id: string,
  status: 'CONFIRMED' | 'CANCELLED'
): Promise<BookingRecord> {
  const booking = await prisma.booking.update({ where: { id }, data: { status } });
  return booking as BookingRecord;
}
