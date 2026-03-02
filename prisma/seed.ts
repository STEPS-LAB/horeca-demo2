import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding LUMINA Hotel database…');

  // ─── Admin user ──────────────────────────────
  const passwordHash = await bcrypt.hash('lumina-admin-2025', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luminahotel.ua' },
    update: {},
    create: {
      email: 'admin@luminahotel.ua',
      passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // Manager user
  const managerHash = await bcrypt.hash('lumina-manager-2025', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@luminahotel.ua' },
    update: {},
    create: {
      email: 'manager@luminahotel.ua',
      passwordHash: managerHash,
      name: 'Hotel Manager',
      role: 'MANAGER',
    },
  });
  console.log('✅ Manager user:', manager.email);

  // ─── Rooms ───────────────────────────────────
  const rooms = [
    {
      slug: 'standard-01',
      nameEn: 'Forest Standard Room',
      nameUa: 'Стандартний Лісовий Номер',
      descriptionEn: 'Immerse yourself in nature from your cozy Forest Standard Room. Featuring warm wood accents, a plush king-size bed with premium linen, and a private balcony overlooking the old-growth pines.',
      descriptionUa: 'Поринайте в природу у затишному Стандартному Лісовому Номері. Теплі дерев\'яні акценти, розкішне ліжко king-size з преміальною білизною та приватний балкон з видом на ліс.',
      basePrice: 149,
      capacity: 2,
      type: 'STANDARD' as const,
      size: 32,
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Minibar', 'Room Service', 'Safe', 'Hair Dryer'],
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560185127-6a4c4ca7c9f8?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'deluxe-01',
      nameEn: 'Deluxe Mountain Room',
      nameUa: 'Гірський Номер Делюкс',
      descriptionEn: 'The Deluxe Mountain Room elevates your stay with sweeping panoramic views of the Carpathian peaks. Features a sitting area, four-poster bed, marble bathroom with deep-soak tub.',
      descriptionUa: 'Гірський Номер Делюкс піднімає ваше перебування на новий рівень з панорамними видами на Карпатські вершини. Зона відпочинку, ліжко з балдахіном, мармурова ванна кімната.',
      basePrice: 229,
      capacity: 2,
      type: 'DELUXE' as const,
      size: 45,
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Minibar', 'Room Service', 'Safe', 'Bathrobe & Slippers', 'Espresso Machine'],
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'junior-suite-01',
      nameEn: 'Junior Mountain Suite',
      nameUa: 'Молодший Гірський Люкс',
      descriptionEn: 'A spacious junior suite offering a seamless blend of alpine elegance and modern luxury, with a dedicated living area and private terrace.',
      descriptionUa: 'Просторий молодший люкс, що поєднує альпійську елегантність і сучасну розкіш, з окремою вітальнею та приватною терасою.',
      basePrice: 349,
      capacity: 3,
      type: 'JUNIOR_SUITE' as const,
      size: 65,
      amenities: ['Free Wi-Fi', 'Air Conditioning', 'Minibar', 'Butler Service', 'Nespresso Machine', 'Smart TV', 'Walk-in Closet'],
      images: [
        'https://images.unsplash.com/photo-1591088398332-8596b069d0b8?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'executive-suite-01',
      nameEn: 'Executive Summit Suite',
      nameUa: 'Представницький Люкс «Вершина»',
      descriptionEn: 'The pinnacle of business luxury. Dual living and dining areas, a home office, private terrace with fire pit, and dedicated butler service.',
      descriptionUa: 'Вершина ділової розкоші. Подвійні вітальня та їдальня, домашній офіс, приватна тераса з багаттям та персональний дворецький.',
      basePrice: 529,
      capacity: 4,
      type: 'EXECUTIVE_SUITE' as const,
      size: 95,
      amenities: ['Free Wi-Fi', '24h Butler', 'Full Bar', 'Meeting Room', 'Private Terrace', 'Fireplace', 'Jacuzzi'],
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'presidential-suite-01',
      nameEn: 'Presidential Suite',
      nameUa: 'Президентський Люкс',
      descriptionEn: 'The most prestigious accommodation at LUMINA. An entire floor of curated luxury, with panoramic mountain views from every room.',
      descriptionUa: 'Найпрестижніше розміщення у LUMINA. Цілий поверх з панорамними видами на гори з кожної кімнати.',
      basePrice: 1299,
      capacity: 6,
      type: 'PRESIDENTIAL_SUITE' as const,
      size: 220,
      amenities: ['Dedicated Butler', 'Private Chef', 'Helipad Access', 'Spa Treatment Room', 'Home Cinema', 'Wine Cellar', 'Pool Access'],
      images: [
        'https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'garden-villa-01',
      nameEn: 'Garden Forest Villa',
      nameUa: 'Садова Лісова Вілла',
      descriptionEn: "A private villa nestled in the hotel's ancient forest. Your own plunge pool, outdoor sauna, and secret garden await.",
      descriptionUa: 'Приватна вілла в старовинному лісі готелю. Власний мінібасейн, сауна та секретний сад.',
      basePrice: 899,
      capacity: 5,
      type: 'GARDEN_VILLA' as const,
      size: 180,
      amenities: ['Private Pool', 'Outdoor Sauna', 'Fireplace', 'Kitchen', 'BBQ', 'Golf Cart', 'Infinity Bath'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: { basePrice: room.basePrice },
      create: room,
    });
    console.log(`✅ Room: ${room.nameEn}`);
  }

  // ─── Sample promotion ──────────────────────
  await prisma.promotion.upsert({
    where: { id: 'promo-early-bird' },
    update: {},
    create: {
      id: 'promo-early-bird',
      name: 'Early Bird — 15% Off',
      description: 'Book 30 days in advance and save 15% on any room.',
      type: 'PERCENTAGE',
      value: 15,
      minNights: 2,
      isActive: true,
    },
  });
  console.log('✅ Promotion: Early Bird');

  console.log('\n🎉 Seeding complete!');
  console.log('\nAdmin access:');
  console.log('  URL:      /admin/login');
  console.log('  Email:    admin@luminahotel.ua');
  console.log('  Password: lumina-admin-2025');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
