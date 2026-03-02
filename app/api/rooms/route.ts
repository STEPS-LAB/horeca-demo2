import { NextRequest, NextResponse } from 'next/server';
import { getRooms, createRoom } from '@/lib/services/rooms.service';
import { getSession } from '@/lib/auth';

export async function GET() {
  const rooms = await getRooms();
  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const required = ['slug', 'nameEn', 'nameUa', 'descriptionEn', 'descriptionUa', 'basePrice', 'capacity', 'type', 'size'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const room = await createRoom({
    slug: body.slug,
    nameEn: body.nameEn,
    nameUa: body.nameUa,
    descriptionEn: body.descriptionEn,
    descriptionUa: body.descriptionUa,
    basePrice: Number(body.basePrice),
    capacity: Number(body.capacity),
    type: body.type,
    amenities: body.amenities ?? [],
    images: body.images ?? [],
    size: Number(body.size),
  });

  return NextResponse.json(room, { status: 201 });
}
