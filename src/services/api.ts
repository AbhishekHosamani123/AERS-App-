/**
 * Simulated async API layer — Phase 4.
 *
 * Screens never touch mock data directly; they call these promise-based
 * services with realistic latency so loading/skeleton states are exercised.
 * Swapping these for real HTTP calls later requires no UI changes.
 */

import { generateServices, OFFERS, OPERATORS } from '../mock';
import type {
  Amenity,
  AppNotification,
  Booking,
  BusFilters,
  BusService,
  City,
  FareBreakdown,
  Offer,
  Seat,
  SortKey,
} from '../types';
import { CITIES, NOTIFICATIONS } from '../mock';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ------------------------------- City search ------------------------------- */

export async function searchCities(query: string): Promise<City[]> {
  await delay(180);
  const q = query.trim().toLowerCase();
  if (!q) return CITIES.filter((c) => c.popular);
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
  );
}

/* --------------------------------- Search ---------------------------------- */

export interface SearchParams {
  fromCityId: string;
  toCityId: string;
  dateISO: string;
  filters?: BusFilters;
  sort?: SortKey;
}

export interface SearchResult {
  services: BusService[];
  total: number;
}

const SLOT_RANGES: Record<string, [number, number]> = {
  early: [0, 6],
  morning: [6, 12],
  afternoon: [12, 17],
  evening: [17, 21],
  night: [21, 24],
};

function inSlot(hhmm: string, slots: string[]): boolean {
  if (slots.length === 0) return true;
  const h = Number(hhmm.split(':')[0]);
  return slots.some((s) => {
    const [lo, hi] = SLOT_RANGES[s];
    return h >= lo && h < hi;
  });
}

export async function searchBuses(p: SearchParams): Promise<SearchResult> {
  await delay(900 + Math.random() * 500); // realistic network feel
  let services = generateServices(p.fromCityId, p.toCityId, p.dateISO);

  if (p.filters) {
    const f = p.filters;
    if (f.busTypes.length) services = services.filter((s) => f.busTypes.includes(s.busClass));
    if (f.amenities.length)
      services = services.filter((s) => f.amenities.every((a: Amenity) => s.amenities[a]));
    if (f.departureSlots.length) services = services.filter((s) => inSlot(s.departTime, f.departureSlots));
    if (f.arrivalSlots.length)
      services = services.filter((s) => inSlot(s.arriveTime.replace(' (+1d)', ''), f.arrivalSlots));
    if (f.operators.length) services = services.filter((s) => f.operators.includes(s.operatorId));
    if (f.minRating > 0) services = services.filter((s) => s.rating >= f.minRating);
    if (f.priceMin !== undefined) services = services.filter((s) => s.basePrice >= f.priceMin!);
    if (f.priceMax !== undefined) services = services.filter((s) => s.basePrice <= f.priceMax!);
    if (f.onlyAvailable) services = services.filter((s) => s.seatsAvailable > 0);
    if (f.singleSeats) services = services.filter((s) => s.seatsAvailable >= 1);
  }

  switch (p.sort) {
    case 'price':
      services = [...services].sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'duration':
      services = [...services].sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
    case 'departure':
      services = [...services].sort((a, b) => a.departTime.localeCompare(b.departTime));
      break;
    case 'rating':
      services = [...services].sort((a, b) => b.rating - a.rating);
      break;
    case 'smart':
    default:
      services = [...services].sort(
        (a, b) =>
          Number(b.isPrime) - Number(a.isPrime) ||
          b.rating * b.ratingCount - a.rating * a.ratingCount ||
          a.basePrice - b.basePrice
      );
  }

  return { services, total: services.length };
}

export async function getServiceById(id: string, fromCityId: string, toCityId: string, dateISO: string): Promise<BusService | null> {
  await delay(120);
  return generateServices(fromCityId, toCityId, dateISO).find((s) => s.id === id) ?? null;
}

export async function getOperators(): Promise<typeof OPERATORS> {
  await delay(150);
  return OPERATORS;
}

/* ------------------------------ Seat mapping ------------------------------- */

function seatMapFor(cls: string, available: number, basePrice: number, serviceId: string): Seat[] {
  const isSleeper = cls.toLowerCase().includes('sleeper');
  const deckCount = isSleeper ? 2 : 1;
  const seatsPerDeck = isSleeper ? 18 : 44;
  const seats: Seat[] = [];
  let avail = available;
  // deterministic availability layout from service id hash
  let h = 0;
  for (let i = 0; i < serviceId.length; i++) h = (h * 31 + serviceId.charCodeAt(i)) >>> 0;

  for (let d = 0; d < deckCount; d++) {
    const deck = d === 0 ? 'lower' : 'upper';
    for (let i = 0; i < seatsPerDeck; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const idx = d * seatsPerDeck + i;
      const cell = ((h >> (idx % 28)) ^ (idx * 2654435761)) >>> 0;
      let status: Seat['status'];
      const priceMod = idx % 5 === 0 ? 50 : idx % 5 === 1 ? 30 : idx % 5 === 2 ? -20 : 0;
      if (avail <= 0) {
        status = 'unavailable';
      } else if (cell % 10 < 3) {
        status = 'unavailable';
      } else if (cell % 17 === 0) {
        status = 'ladies';
        avail -= 1;
      } else {
        status = 'available';
        avail -= 1;
      }
      seats.push({
        id: `${deck[0]}-${row}-${col}`,
        deck,
        row,
        col,
        type: isSleeper ? 'sleeper' : 'seater',
        status,
        price: basePrice + priceMod,
        ladiesOnly: status === 'ladies',
      });
    }
  }
  return seats;
}

export async function getSeatMap(bus: BusService, dateISO: string): Promise<Seat[]> {
  await delay(700 + Math.random() * 400);
  return seatMapFor(bus.busClass, bus.seatsAvailable, bus.basePrice, `${bus.id}@${dateISO}`);
}

/* --------------------------------- Fares ----------------------------------- */

export interface FareInput {
  seats: Seat[];
  offerCode?: string | null;
  isWeekend: boolean;
  isFirstBooking: boolean;
}

export function computeFare(input: FareInput): FareBreakdown & { offer?: Offer } {
  const base = input.seats.reduce((s, x) => s + x.price, 0);
  let concession = 0;
  let applied: Offer | undefined;

  if (input.offerCode) {
    const offer = OFFERS.find((o) => o.code === input.offerCode!.toUpperCase());
    const eligible =
      offer &&
      base >= (offer.minAmount ?? 0) &&
      (offer.scope !== 'first' || input.isFirstBooking) &&
      (offer.scope !== 'weekend' || input.isWeekend) &&
      (offer.scope !== 'applies' || input.seats.some((s) => s.type === 'sleeper'));
    if (eligible) {
      applied = offer;
      concession = offer.discountPercent
        ? Math.min(Math.round((base * offer.discountPercent) / 100), offer.upTo ?? Infinity)
        : Math.min(offer.upTo ?? 0, base);
    }
  }

  const taxable = Math.max(0, base - concession);
  const gst = Math.round(taxable * 0.05);
  return { base, gst, concession, total: taxable + gst, offer: applied };
}

export async function validateOffer(code: string, amount: number): Promise<{ valid: boolean; offer?: Offer; reason?: string }> {
  await delay(500);
  const offer = OFFERS.find((o) => o.code === code.toUpperCase());
  if (!offer) return { valid: false, reason: 'Invalid code' };
  if (amount < (offer.minAmount ?? 0))
    return { valid: false, offer, reason: `Minimum booking amount ₹${offer.minAmount}` };
  return { valid: true, offer };
}

export async function listOffers(): Promise<Offer[]> {
  await delay(300);
  return OFFERS;
}

/* --------------------------------- Auth ------------------------------------ */

export interface OtpRequestResult {
  requestId: string;
  /** In a real app this goes over SMS; here we surface it for testing. */
  debugCode: string;
}

const OTPS = new Map<string, string>();

export async function requestOtp(_phone: string): Promise<OtpRequestResult> {
  await delay(1000);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const requestId = `otp-req-${Date.now()}`;
  OTPS.set(requestId, code);
  return { requestId, debugCode: code };
}

export async function verifyOtp(requestId: string, code: string): Promise<boolean> {
  await delay(900);
  return OTPS.get(requestId) === code;
}

/* -------------------------------- Payments --------------------------------- */

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  /** Simulated failure injection for testing the failure path. */
  forceFailure?: boolean;
}

export interface PaymentResult {
  ok: boolean;
  txnId?: string;
  error?: string;
}

export async function processPayment(req: PaymentRequest): Promise<PaymentResult> {
  await delay(2200);
  if (req.forceFailure) {
    return { ok: false, error: 'Payment declined by issuing bank. No amount was charged.' };
  }
  // Small deterministic-failure chance when card number ends in 0000 (test hook)
  return {
    ok: true,
    txnId: `TXN${Date.now().toString(36).toUpperCase()}`,
  };
}

/* -------------------------------- Bookings --------------------------------- */

const STORE_KEY = 'busgo.bookings.v1';
const SETTINGS_KEY = 'busgo.settings.v1';
const AUTH_KEY = 'busgo.auth.v1';
const NOTIF_KEY = 'busgo.notifications.v1';

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full/unavailable — prototype continues in-memory */
  }
}

export async function createBooking(booking: Omit<Booking, 'id' | 'pnr' | 'bookedAt' | 'status'>): Promise<Booking> {
  await delay(600);
  const all = readStore<Booking[]>(STORE_KEY, []);
  const id = `bk-${Date.now().toString(36)}`;
  const pnr = Array.from({ length: 3 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)]).join('') +
    Math.floor(10 + Math.random() * 90).toString();
  const full: Booking = { ...booking, id, pnr, status: 'confirmed', bookedAt: new Date().toISOString() };
  writeStore(STORE_KEY, [full, ...all]);
  return full;
}

export async function listBookings(): Promise<Booking[]> {
  await delay(350);
  return readStore<Booking[]>(STORE_KEY, []);
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  await delay(150);
  return readStore<Booking[]>(STORE_KEY, []).find((b) => b.id === id);
}

export async function cancelBooking(id: string, refundAmount: number): Promise<Booking> {
  await delay(900);
  const all = readStore<Booking[]>(STORE_KEY, []);
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error('Booking not found');
  const updated: Booking = {
    ...all[idx],
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    refundAmount,
  };
  all[idx] = updated;
  writeStore(STORE_KEY, all);
  return updated;
}

/** Refund estimate: 80% >24h, 60% 12–24h, 30% <12h, minus ₹30 fee. */
export function refundEstimate(departISO: string, departTime: string, paid: number): number {
  const [h, m] = departTime.split(':').map(Number);
  const depart = new Date(`${departISO}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  const hours = (depart.getTime() - Date.now()) / 3.6e6;
  let pct = 0.3;
  if (hours >= 24) pct = 0.8;
  else if (hours >= 12) pct = 0.6;
  return Math.max(0, Math.round(paid * pct - 30)); // fee ₹30
}

/* ------------------------------ Notifications ------------------------------ */

export async function listNotifications(): Promise<AppNotification[]> {
  await delay(250);
  const stored = readStore<AppNotification[]>(NOTIF_KEY, NOTIFICATIONS);
  if (stored.length) return stored;
  writeStore(NOTIF_KEY, NOTIFICATIONS);
  return NOTIFICATIONS;
}

export async function markNotificationRead(id: string): Promise<AppNotification[]> {
  await delay(100);
  const list = readStore<AppNotification[]>(NOTIF_KEY, NOTIFICATIONS).map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  writeStore(NOTIF_KEY, list);
  return list;
}

export async function markAllNotificationsRead(): Promise<AppNotification[]> {
  await delay(100);
  const list = readStore<AppNotification[]>(NOTIF_KEY, NOTIFICATIONS).map((n) => ({ ...n, read: true }));
  writeStore(NOTIF_KEY, list);
  return list;
}

/* -------------------------------- Settings --------------------------------- */

export const defaultSettings = {
  notifications: true,
  offersAlerts: true,
  tripAlerts: true,
  darkMode: false,
  language: 'English',
  currency: 'INR',
};

export async function loadSettings() {
  await delay(100);
  return readStore(AUTH_KEY + '|settings', defaultSettings);
}

export async function saveSettings(s: typeof defaultSettings) {
  await delay(100);
  writeStore(AUTH_KEY + '|settings', s);
}

/* Re-export persistence helpers used by the auth store. */
export const persistence = {
  get bookingsKey() {
    return STORE_KEY;
  },
  get settingsKey() {
    return SETTINGS_KEY;
  },
  get authKey() {
    return AUTH_KEY;
  },
  read: readStore,
  write: writeStore,
};
