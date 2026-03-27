export type RoomType =
  | 'standard'
  | 'deluxe'
  | 'junior-suite'
  | 'executive-suite'
  | 'presidential-suite'
  | 'garden-villa';

export interface Room {
  id: string;
  name: string;
  nameUa?: string;
  type: RoomType;
  description: string;
  descriptionUa?: string;
  shortDescription: string;
  shortDescriptionUa?: string;
  pricePerNight: number;
  maxGuests: number;
  size: number;
  bedType: string;
  bedTypeUa?: string;
  images: string[];
  amenities: string[];
  amenitiesUa?: string[];
  features: string[];
  featuresUa?: string[];
  available: boolean;
  rating: number;
  reviewCount: number;
  floor?: number;
  view?: string;
  viewUa?: string;
}

export interface BookingFormData {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingCalculation {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  taxes: number;
  total: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'size';

export interface RoomFilter {
  types: RoomType[];
  priceRange: [number, number];
  minGuests: number;
  features: string[];
  sortBy: SortOption;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export interface Testimonial {
  id: string;
  name: string;
  nameUa?: string;
  location: string;
  locationUa?: string;
  avatar: string;
  rating: number;
  text: string;
  textUa?: string;
  date: string;
  dateUa?: string;
  roomStayed: string;
  roomStayedUa?: string;
}

export interface HotelFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export type BookingStep = 'form' | 'payment' | 'confirmation';

export interface Promotion {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED' | 'DATE_RANGE';
  value: number;
  startDate: string | null;
  endDate: string | null;
  minNights: number | null;
  isActive: boolean;
  /** null = applies to all rooms; string[] = only these room slugs */
  roomSlugs: string[] | null;
}

export interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}
