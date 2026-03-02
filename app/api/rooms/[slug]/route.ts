import { NextRequest, NextResponse } from 'next/server';
import { updateRoom, deleteRoom } from '@/lib/services/rooms.service';
import { getSession } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  const allowed = ['nameEn', 'nameUa', 'descriptionEn', 'descriptionUa', 'basePrice', 'capacity', 'size', 'type', 'amenities', 'images', 'isActive'];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (data.basePrice !== undefined) data.basePrice = Number(data.basePrice);
  if (data.capacity !== undefined) data.capacity = Number(data.capacity);
  if (data.size !== undefined) data.size = Number(data.size);

  try {
    const room = await updateRoom(slug, data as Parameters<typeof updateRoom>[1]);
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await deleteRoom(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
}
