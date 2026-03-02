import { NextRequest, NextResponse } from 'next/server';
import { getPromotions, createPromotion } from '@/lib/services/promotions.service';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const promotions = await getPromotions();
  return NextResponse.json(promotions);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const promotion = await createPromotion({
    name: body.name,
    description: body.description,
    type: body.type,
    value: Number(body.value),
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    minNights: body.minNights ? Number(body.minNights) : undefined,
    roomSlugs: body.roomSlugs,
  });
  return NextResponse.json(promotion, { status: 201 });
}
