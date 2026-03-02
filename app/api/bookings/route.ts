import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookings } from '@/lib/services/bookings.service';
import { getRoomRecord } from '@/lib/services/rooms.service';
import { getSession } from '@/lib/auth';
import { validateBookingForm, hasErrors } from '@/utils/validation';
import { calculateBookingPrice, applyBestPromotion } from '@/utils/pricing';
import { checkAvailability } from '@/lib/services/availability.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '20');
  const status = searchParams.get('status') as 'CONFIRMED' | 'PENDING' | 'CANCELLED' | null;
  const email = searchParams.get('email') ?? undefined;

  const result = await getBookings({ page, limit, status: status ?? undefined, email });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const form = body.form;

  const errors = validateBookingForm(form);
  if (hasErrors(errors)) {
    return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }

  // Resolve room slug → DB id + base price
  const roomRecord = await getRoomRecord(form.roomId);
  if (!roomRecord) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Check availability using the DB room id (cuid)
  const availability = await checkAvailability(
    roomRecord.id,
    new Date(form.checkIn),
    new Date(form.checkOut)
  );
  if (!availability.available) {
    return NextResponse.json(
      { error: 'Room is not available for the selected dates' },
      { status: 409 }
    );
  }

  // Apply active promotions (server-side — client pricing is for display only)
  const promotions = await getActivePublicPromotions();
  const { discountedPrice } = applyBestPromotion(roomRecord.basePrice, promotions);

  const pricing = calculateBookingPrice(discountedPrice, form.checkIn, form.checkOut);

  const booking = await createBooking(form, pricing);
  return NextResponse.json(booking, { status: 201 });
}
