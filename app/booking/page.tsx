import { getRooms } from '@/lib/services/rooms.service';
import { getActivePublicPromotions } from '@/lib/services/promotions.service';
import { BookingPageShell } from '@/app/booking/BookingPageShell';

export default async function BookingPage() {
  const [rooms, promotions] = await Promise.all([getRooms(), getActivePublicPromotions()]);
  return <BookingPageShell rooms={rooms} promotions={promotions} />;
}

