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
  type: RoomType;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  maxGuests: number;
  size: number;
  bedType: string;
  images: string[];
  amenities: string[];
  features: string[];
  available: boolean;
  rating: number;
  reviewCount: number;
  floor?: number;
  view?: string;
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
  location: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  roomStayed: string;
}

export interface HotelFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export type BookingStep = 'form' | 'payment' | 'confirmation';

export interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}
