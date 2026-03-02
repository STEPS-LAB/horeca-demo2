import type { Metadata } from 'next';
import { getBookings } from '@/lib/services/bookings.service';
import { AdminBookingsClient } from '@/components/admin/AdminBookingsClient';

export const metadata: Metadata = { title: 'Bookings' };

export default async function AdminBookingsPage() {
  const { bookings, total } = await getBookings({ limit: 50 });
  return <AdminBookingsClient bookings={bookings} total={total} />;
}
