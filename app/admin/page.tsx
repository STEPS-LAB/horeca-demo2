import type { Metadata } from 'next';
import { getBookings } from '@/lib/services/bookings.service';
import { getRooms } from '@/lib/services/rooms.service';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [{ bookings, total: totalBookings }, rooms] = await Promise.all([
    getBookings({ limit: 5 }),
    getRooms(),
  ]);

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const revenue = confirmedBookings.reduce((sum, b) => sum + b.total, 0);

  return (
    <AdminDashboard
      stats={{
        totalRooms: rooms.length,
        activeRooms: rooms.length,
        totalBookings,
        revenue,
      }}
      recentBookings={bookings}
    />
  );
}
