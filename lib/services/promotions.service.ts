import { prisma } from '@/lib/prisma';
import type { Promotion } from '@/types';

export interface PromotionRecord {
  id: string;
  name: string;
  description: string | null;
  type: 'PERCENTAGE' | 'FIXED' | 'DATE_RANGE';
  value: number;
  startDate: Date | null;
  endDate: Date | null;
  minNights: number | null;
  isActive: boolean;
  createdAt: Date;
  /** empty = applies to all rooms */
  roomSlugs: string[];
  /** room display names, parallel to roomSlugs */
  roomNames: string[];
}

export async function getPromotions(): Promise<PromotionRecord[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const records = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rooms: {
          include: { room: { select: { slug: true, nameEn: true } } },
        },
      },
    });
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      type: r.type as PromotionRecord['type'],
      value: r.value,
      startDate: r.startDate,
      endDate: r.endDate,
      minNights: r.minNights,
      isActive: r.isActive,
      createdAt: r.createdAt,
      roomSlugs: r.rooms.map((rp) => rp.room.slug),
      roomNames: r.rooms.map((rp) => rp.room.nameEn),
    }));
  } catch {
    return [];
  }
}

export async function getActivePromotionsForRoom(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<PromotionRecord[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const records = await prisma.promotion.findMany({
      where: {
        isActive: true,
        rooms: { some: { roomId } },
        OR: [
          { startDate: null },
          { startDate: { lte: checkIn }, endDate: { gte: checkOut } },
        ],
      },
      include: {
        rooms: {
          include: { room: { select: { slug: true, nameEn: true } } },
        },
      },
    });
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      type: r.type as PromotionRecord['type'],
      value: r.value,
      startDate: r.startDate,
      endDate: r.endDate,
      minNights: r.minNights,
      isActive: r.isActive,
      createdAt: r.createdAt,
      roomSlugs: r.rooms.map((rp) => rp.room.slug),
      roomNames: r.rooms.map((rp) => rp.room.nameEn),
    }));
  } catch {
    return [];
  }
}

export async function createPromotion(data: {
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED' | 'DATE_RANGE';
  value: number;
  startDate?: Date;
  endDate?: Date;
  minNights?: number;
  /** room slugs — resolved to cuids internally */
  roomSlugs?: string[];
}): Promise<PromotionRecord> {
  const { roomSlugs, ...rest } = data;

  // Resolve slugs → cuids
  let roomIds: string[] | undefined;
  if (roomSlugs?.length) {
    const rooms = await prisma.room.findMany({
      where: { slug: { in: roomSlugs } },
      select: { id: true },
    });
    roomIds = rooms.map((r) => r.id);
  }

  const record = await prisma.promotion.create({
    data: {
      ...rest,
      ...(roomIds?.length
        ? { rooms: { create: roomIds.map((roomId) => ({ roomId })) } }
        : {}),
    },
    include: {
      rooms: {
        include: { room: { select: { slug: true, nameEn: true } } },
      },
    },
  });

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    type: record.type as PromotionRecord['type'],
    value: record.value,
    startDate: record.startDate,
    endDate: record.endDate,
    minNights: record.minNights,
    isActive: record.isActive,
    createdAt: record.createdAt,
    roomSlugs: record.rooms.map((rp) => rp.room.slug),
    roomNames: record.rooms.map((rp) => rp.room.nameEn),
  };
}

export async function updatePromotion(
  id: string,
  data: Partial<{ name: string; value: number; isActive: boolean }>
): Promise<PromotionRecord> {
  const record = await prisma.promotion.update({
    where: { id },
    data,
    include: {
      rooms: {
        include: { room: { select: { slug: true, nameEn: true } } },
      },
    },
  });
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    type: record.type as PromotionRecord['type'],
    value: record.value,
    startDate: record.startDate,
    endDate: record.endDate,
    minNights: record.minNights,
    isActive: record.isActive,
    createdAt: record.createdAt,
    roomSlugs: record.rooms.map((rp) => rp.room.slug),
    roomNames: record.rooms.map((rp) => rp.room.nameEn),
  };
}

export async function deletePromotion(id: string): Promise<void> {
  await prisma.promotion.delete({ where: { id } });
}

/**
 * Applies the best active promotion to a base price.
 * Returns the discounted price and the applied promotion (if any).
 */
export function applyBestPromotion(
  basePrice: number,
  promotions: PromotionRecord[]
): { price: number; promotion: PromotionRecord | null } {
  if (!promotions.length) return { price: basePrice, promotion: null };

  let best: PromotionRecord | null = null;
  let bestPrice = basePrice;

  for (const promo of promotions) {
    let discounted: number;
    if (promo.type === 'PERCENTAGE') {
      discounted = basePrice * (1 - promo.value / 100);
    } else {
      discounted = Math.max(0, basePrice - promo.value);
    }
    if (discounted < bestPrice) {
      bestPrice = discounted;
      best = promo;
    }
  }

  return { price: bestPrice, promotion: best };
}

/**
 * Returns all promotions that are active RIGHT NOW for the public site.
 * Returns serialisable Promotion objects (dates as ISO strings).
 * Includes roomSlugs so the client can filter per-room.
 */
export async function getActivePublicPromotions(): Promise<Promotion[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const now = new Date();
    const records = await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [
          { type: { in: ['PERCENTAGE', 'FIXED'] } },
          { type: 'DATE_RANGE', startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      include: {
        rooms: {
          include: { room: { select: { slug: true } } },
        },
      },
    });
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type as Promotion['type'],
      value: r.value,
      startDate: r.startDate?.toISOString() ?? null,
      endDate: r.endDate?.toISOString() ?? null,
      minNights: r.minNights,
      isActive: r.isActive,
      roomSlugs: r.rooms.length > 0 ? r.rooms.map((rp) => rp.room.slug) : null,
    }));
  } catch {
    return [];
  }
}
