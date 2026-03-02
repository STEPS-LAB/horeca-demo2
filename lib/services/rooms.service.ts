import { prisma } from '@/lib/prisma';
import { rooms as staticRooms } from '@/data/rooms';
import type { Room } from '@/types';

// Converts a Prisma Room record to the app's Room type
function toRoomDto(r: {
  id: string;
  slug: string;
  nameEn: string;
  nameUa: string;
  descriptionEn: string;
  descriptionUa: string;
  basePrice: number;
  capacity: number;
  type: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  size: number;
  isActive: boolean;
}): Room {
  return {
    id: r.slug,
    name: r.nameEn,
    nameUa: r.nameUa,
    description: r.descriptionEn,
    descriptionUa: r.descriptionUa,
    shortDescription: r.descriptionEn.slice(0, 120),
    type: r.type.toLowerCase().replace('_', '-') as Room['type'],
    pricePerNight: r.basePrice,
    maxGuests: r.capacity,
    size: r.size,
    bedType: 'King',
    amenities: r.amenities,
    features: [],
    images: r.images,
    available: r.isActive,
    rating: r.rating,
    reviewCount: r.reviewCount,
  };
}

export async function getRooms(): Promise<Room[]> {
  if (!process.env.DATABASE_URL) return staticRooms;
  try {
    const dbRooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { basePrice: 'asc' },
    });
    return dbRooms.map(toRoomDto);
  } catch {
    return staticRooms;
  }
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (!process.env.DATABASE_URL) {
    return staticRooms.find((r) => r.id === slug) ?? null;
  }
  try {
    const room = await prisma.room.findUnique({ where: { slug } });
    return room ? toRoomDto(room) : null;
  } catch {
    return staticRooms.find((r) => r.id === slug) ?? null;
  }
}

export async function createRoom(data: {
  slug: string;
  nameEn: string;
  nameUa: string;
  descriptionEn: string;
  descriptionUa: string;
  basePrice: number;
  capacity: number;
  type: string;
  amenities: string[];
  images: string[];
  size: number;
}): Promise<Room> {
  const room = await prisma.room.create({
    data: {
      ...data,
      type: data.type.toUpperCase().replace('-', '_') as 'STANDARD',
    },
  });
  return toRoomDto(room);
}

export async function updateRoom(
  slug: string,
  data: Partial<{
    nameEn: string;
    nameUa: string;
    descriptionEn: string;
    descriptionUa: string;
    basePrice: number;
    capacity: number;
    size: number;
    type: string;
    amenities: string[];
    images: string[];
    isActive: boolean;
  }>
): Promise<Room> {
  const { type, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };
  if (type) updateData.type = type.toUpperCase().replace(/-/g, '_');
  const room = await prisma.room.update({ where: { slug }, data: updateData });
  return toRoomDto(room);
}

export async function deleteRoom(slug: string): Promise<void> {
  await prisma.room.delete({ where: { slug } });
}

/** Returns the raw DB room id (cuid) and basePrice — used for booking creation. */
export async function getRoomRecord(
  slug: string
): Promise<{ id: string; basePrice: number } | null> {
  if (!process.env.DATABASE_URL) {
    const r = staticRooms.find((s) => s.id === slug);
    return r ? { id: slug, basePrice: r.pricePerNight } : null;
  }
  try {
    return await prisma.room.findUnique({
      where: { slug },
      select: { id: true, basePrice: true },
    });
  } catch {
    return null;
  }
}
