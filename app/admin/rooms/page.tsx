import type { Metadata } from 'next';
import { getRooms } from '@/lib/services/rooms.service';
import { AdminRoomsClient } from '@/components/admin/AdminRoomsClient';

export const metadata: Metadata = { title: 'Rooms Management' };

export default async function AdminRoomsPage() {
  const rooms = await getRooms();
  return <AdminRoomsClient initialRooms={rooms} />;
}
