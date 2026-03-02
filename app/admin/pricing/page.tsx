import type { Metadata } from 'next';
import { getPromotions } from '@/lib/services/promotions.service';
import { getRooms } from '@/lib/services/rooms.service';
import { AdminPricingClient } from '@/components/admin/AdminPricingClient';

export const metadata: Metadata = { title: 'Pricing & Promotions' };

export default async function AdminPricingPage() {
  const [promotions, rooms] = await Promise.all([getPromotions(), getRooms()]);
  return <AdminPricingClient promotions={promotions} rooms={rooms} />;
}
