import { getRooms } from '@/lib/services/rooms.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';
import { RoomsPageClient } from '@/app/rooms/RoomsPageClient';

export default async function RoomsPage() {
  const [rooms, promotions] = await Promise.all([getRooms(), getActivePublicPromotions()]);
  return <RoomsPageClient rooms={rooms} promotions={promotions} />;
}

