import { prisma } from '@/lib/prisma';

export interface AvailabilityResult {
  available: boolean;
  blockedDates: string[]; // ISO date strings
  conflictingBookings: number;
}

/**
 * Checks whether a room is available for the given date range.
 * Falls back to always-available in demo mode (no DB).
 */
export async function checkAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<AvailabilityResult> {
  if (!process.env.DATABASE_URL) {
    return { available: true, blockedDates: [], conflictingBookings: 0 };
  }

  const [blocked, conflicting] = await Promise.all([
    // Blocked dates in range
    prisma.blockedDate.findMany({
      where: {
        roomId,
        date: { gte: checkIn, lt: checkOut },
      },
    }),
    // Confirmed bookings overlapping the requested range
    prisma.booking.count({
      where: {
        roomId,
        status: 'CONFIRMED',
        OR: [
          { checkIn: { gte: checkIn, lt: checkOut } },
          { checkOut: { gt: checkIn, lte: checkOut } },
          { checkIn: { lte: checkIn }, checkOut: { gte: checkOut } },
        ],
      },
    }),
  ]);

  return {
    available: blocked.length === 0 && conflicting === 0,
    blockedDates: blocked.map((b) => b.date.toISOString().split('T')[0]),
    conflictingBookings: conflicting,
  };
}

/**
 * Returns all blocked dates for a room (for calendar display).
 */
export async function getBlockedDates(roomId: string): Promise<string[]> {
  if (!process.env.DATABASE_URL) return [];
  const records = await prisma.blockedDate.findMany({ where: { roomId } });
  return records.map((r) => r.date.toISOString().split('T')[0]);
}

/**
 * Blocks specific dates for a room (maintenance, private events).
 */
export async function blockDates(
  roomId: string,
  dates: Date[],
  reason?: string
): Promise<void> {
  await prisma.blockedDate.createMany({
    data: dates.map((date) => ({ roomId, date, reason: reason ?? null })),
    skipDuplicates: true,
  });
}

/**
 * Returns dates booked by confirmed reservations for a given room.
 */
export async function getBookedDateRanges(
  roomId: string
): Promise<Array<{ checkIn: Date; checkOut: Date }>> {
  if (!process.env.DATABASE_URL) return [];
  const bookings = await prisma.booking.findMany({
    where: { roomId, status: 'CONFIRMED' },
    select: { checkIn: true, checkOut: true },
  });
  return bookings;
}
