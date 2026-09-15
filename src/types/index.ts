/** Domain types shared across the app. */

/* ------------------------------- Locations -------------------------------- */

export interface City {
  id: string;
  name: string;
  state: string;
  /** Popular cities are pinned at the top of city pickers. */
  popular: boolean;
}

/* --------------------------------- Buses ---------------------------------- */

export type BusClass = 'AC Sleeper' | 'AC Seater' | 'Non-AC Sleeper' | 'Non-AC Seater' | 'Volvo AC Multi-Axle';

export type Amenity = 'wifi' | 'charging' | 'water' | 'blanket' | 'movie' | 'lightning';

export interface BusAmenities {
  wifi: boolean;
  charging: boolean;
  water: boolean;
  blanket: boolean;
  movie: boolean;
  lightning: boolean;
}

export type SeatType = 'seater' | 'sleeper';
export type SeatStatus = 'available' | 'ladies' | 'unavailable' | 'selected';

export interface Seat {
  id: string;
  deck: 'lower' | 'upper';
  row: number;
  col: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
  /** Ladies-adjacent seats (next to a booked female passenger) in real apps. */
  ladiesOnly?: boolean;
}

export interface BoardingPoint {
  id: string;
  name: string;
  time: string; // "22:30"
  address: string;
  landmark?: string;
}

export interface BusService {
  id: string;
  operatorId: string;
  operatorName: string;
  busClass: BusClass;
  amenities: BusAmenities;
  departTime: string; // "22:30"
  arriveTime: string; // "06:15 (+1d)"
  durationMinutes: number;
  fromCityId: string;
  toCityId: string;
  basePrice: number;
  seatsTotal: number;
  seatsAvailable: number;
  rating: number; // 0–5, 0 = unrated
  ratingCount: number;
  liveTracking: boolean;
  freeCancellation: boolean;
  isPrime: boolean; // premium operator tier
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
}

/* ------------------------------- Operators -------------------------------- */

export interface Operator {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  fleetSize: number;
  cancelledTrips: number;
}

/* --------------------------------- Search --------------------------------- */

export type SortKey = 'smart' | 'price' | 'duration' | 'departure' | 'rating';

export interface BusFilters {
  busTypes: BusClass[];
  amenities: Amenity[];
  departureSlots: DepartureSlot[];
  arrivalSlots: DepartureSlot[];
  operators: string[];
  minRating: number;
  priceMin?: number;
  priceMax?: number;
  onlyAvailable: boolean;
  singleSeats: boolean;
}

export type DepartureSlot = 'early' | 'morning' | 'afternoon' | 'evening' | 'night';

/* -------------------------------- Booking --------------------------------- */

export interface Passenger {
  seatId: string;
  name: string;
  age: number | null;
  gender: 'male' | 'female' | null;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface FareBreakdown {
  base: number;
  gst: number;
  concession: number;
  total: number;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  pnr: string;
  busId: string;
  operatorName: string;
  busClass: string;
  fromCity: string;
  toCity: string;
  travelDate: string; // ISO date "2026-09-15"
  departTime: string;
  arriveTime: string;
  boardingPoint: string;
  droppingPoint: string;
  passengers: Passenger[];
  seats: { id: string; price: number; type: SeatType }[];
  contact: ContactInfo;
  fare: FareBreakdown;
  paymentMethod: string;
  status: BookingStatus;
  bookedAt: string; // ISO datetime
  cancelledAt?: string;
  refundAmount?: number;
}

/* ------------------------------- Offers/Acct ------------------------------- */

export interface Offer {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  discountPercent?: number;
  upTo?: number;
  minAmount?: number;
  scope: 'any' | 'first' | 'weekend' | 'applies';
  expiry: string;
  color: 'primary' | 'secondary' | 'accent';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: 'offer' | 'booking' | 'system';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

/* --------------------------------- Auth ----------------------------------- */

export interface AuthSession {
  phone: string;
  name?: string;
  email?: string;
}

/* ------------------------------ App settings ------------------------------ */

export interface AppSettings {
  notifications: boolean;
  offersAlerts: boolean;
  tripAlerts: boolean;
  darkMode: boolean;
  language: string;
  currency: string;
}
