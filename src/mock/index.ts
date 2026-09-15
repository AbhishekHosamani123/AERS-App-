/**
 * Mock data — Phase 4.
 *
 * All content is fictional and locally generated. No real operators,
 * cities are real names only, prices are synthetic.
 */

import type {
  AppNotification,
  BoardingPoint,
  BusClass,
  BusService,
  City,
  Offer,
  Operator,
} from '../types';

/* --------------------------------- Cities --------------------------------- */

export const CITIES: City[] = [
  { id: 'blr', name: 'Bengaluru', state: 'Karnataka', popular: true },
  { id: 'che', name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', popular: true },
  { id: 'mum', name: 'Mumbai', state: 'Maharashtra', popular: true },
  { id: 'del', name: 'Delhi', state: 'NCT of Delhi', popular: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', popular: true },
  { id: 'goa', name: 'Goa', state: 'Goa', popular: true },
  { id: 'cok', name: 'Kochi', state: 'Kerala', popular: true },
  { id: 'mad', name: 'Madurai', state: 'Tamil Nadu', popular: false },
  { id: 'mys', name: 'Mysuru', state: 'Karnataka', popular: false },
  { id: 'coi', name: 'Coimbatore', state: 'Tamil Nadu', popular: false },
  { id: 'tvm', name: 'Thiruvananthapuram', state: 'Kerala', popular: false },
  { id: 'vij', name: 'Vijayawada', state: 'Andhra Pradesh', popular: false },
  { id: 'viz', name: 'Visakhapatnam', state: 'Andhra Pradesh', popular: false },
  { id: 'nag', name: 'Nagpur', state: 'Maharashtra', popular: false },
  { id: 'jai', name: 'Jaipur', state: 'Rajasthan', popular: false },
  { id: 'amd', name: 'Ahmedabad', state: 'Gujarat', popular: false },
  { id: 'luc', name: 'Lucknow', state: 'Uttar Pradesh', popular: false },
];

export const cityById = (id: string): City | undefined => CITIES.find((c) => c.id === id);

/* ------------------------------- Operators -------------------------------- */

export const OPERATORS: Operator[] = [
  { id: 'op1', name: 'GreenLine Travels', rating: 4.5, ratingCount: 12480, fleetSize: 120, cancelledTrips: 2 },
  { id: 'op2', name: 'Sundara Express', rating: 4.2, ratingCount: 8214, fleetSize: 88, cancelledTrips: 5 },
  { id: 'op3', name: 'Kaveri Coach Co.', rating: 3.9, ratingCount: 5120, fleetSize: 64, cancelledTrips: 9 },
  { id: 'op4', name: 'Meridian Volvo', rating: 4.7, ratingCount: 22110, fleetSize: 150, cancelledTrips: 1 },
  { id: 'op5', name: 'Nova Roadways', rating: 4.0, ratingCount: 6640, fleetSize: 42, cancelledTrips: 4 },
  { id: 'op6', name: 'BlueMountain Lines', rating: 4.3, ratingCount: 9870, fleetSize: 70, cancelledTrips: 3 },
  { id: 'op7', name: 'CityLink Sleeper', rating: 3.7, ratingCount: 3480, fleetSize: 30, cancelledTrips: 12 },
  { id: 'op8', name: 'Royal Charter', rating: 4.6, ratingCount: 15320, fleetSize: 96, cancelledTrips: 2 },
];

/* ---------------------------- Boarding points ------------------------------ */

function boardingSet(prefix: string, times: string[]): BoardingPoint[] {
  const places = [
    `${prefix} Central Bus Station`,
    `${prefix} Satellite Terminal`,
    `${prefix} Highway Junction`,
    `${prefix} City Circle`,
    `${prefix} Ring Road Stop`,
    `${prefix} Tech Park Gate`,
  ];
  return places.slice(0, times.length).map((p, i) => ({
    id: `${prefix.toLowerCase().replace(/\s/g, '')}-bp${i}`,
    name: p,
    time: times[i],
    address: `${100 + i * 7} Market Road, ${prefix}`,
    landmark: i === 0 ? 'Near metro exit 2' : undefined,
  }));
}

/* ----------------------------- Bus generation ------------------------------ */

const ALL_CLASSES: BusClass[] = [
  'AC Sleeper',
  'AC Seater',
  'Non-AC Sleeper',
  'Non-AC Seater',
  'Volvo AC Multi-Axle',
];

/** Deterministic PRNG so results are stable across sessions (no flicker). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const DURATIONS: Record<string, number> = {
  'blr-che': 360, 'blr-hyd': 540, 'blr-goa': 570, 'blr-mum': 720, 'blr-pune': 660,
  'che-blr': 360, 'che-hyd': 480, 'che-cok': 420, 'che-mad': 300, 'che-coi': 330,
  'hyd-blr': 540, 'hyd-che': 480, 'hyd-vij': 270, 'hyd-viz': 420, 'hyd-mum': 660,
  'mum-pune': 180, 'mum-goa': 600, 'mum-blr': 720, 'mum-del': 840, 'mum-ahd': 360,
  'del-jai': 300, 'del-luc': 420, 'del-mum': 840, 'pune-mum': 180, 'pune-blr': 660,
  'goa-blr': 570, 'goa-mum': 600, 'cok-che': 420, 'cok-tvm': 180, 'mad-che': 300,
};

function basePriceFor(from: string, to: string, cls: BusClass, rnd: () => number): number {
  const key = [from, to].sort().join('-');
  const dist = DURATIONS[key] ?? 420;
  let perKm = 1.15;
  if (cls === 'AC Sleeper') perKm = 1.9;
  else if (cls === 'Volvo AC Multi-Axle') perKm = 2.3;
  else if (cls === 'AC Seater') perKm = 1.45;
  else if (cls === 'Non-AC Sleeper') perKm = 1.3;
  else perKm = 1.0;
  const raw = (dist / 60) * 34 * perKm * (0.9 + rnd() * 0.25);
  return Math.round(raw / 10) * 10;
}

function amenitiesFor(cls: BusClass, rnd: () => number): BusService['amenities'] {
  const ac = cls !== 'Non-AC Sleeper' && cls !== 'Non-AC Seater';
  return {
    wifi: ac && rnd() > 0.35,
    charging: rnd() > 0.2,
    water: rnd() > 0.25,
    blanket: (ac && rnd() > 0.4) || rnd() > 0.75,
    movie: ac && rnd() > 0.55,
    lightning: ac,
  };
}

function addMinutes(hhmm: string, mins: number): { time: string; nextDay: boolean } {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nextDay = total >= 1440;
  const t = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(t / 60)).padStart(2, '0');
  const mm = String(t % 60).padStart(2, '0');
  return { time: `${hh}:${mm}`, nextDay };
}

/** Generate the deterministic list of services for a route+date. */
export function generateServices(fromCityId: string, toCityId: string, dateISO: string): BusService[] {
  const seed = hashStr(`${fromCityId}>${toCityId}@${dateISO}`);
  const rnd = mulberry32(seed);
  const from = cityById(fromCityId)?.name ?? 'Origin';
  const to = cityById(toCityId)?.name ?? 'Destination';
  const key = [fromCityId, toCityId].sort().join('-');
  const known = DURATIONS[key] !== undefined;
  const count = known ? 8 + Math.floor(rnd() * 6) : 6 + Math.floor(rnd() * 5);
  const departures = known
    ? ['06:00', '07:15', '09:30', '11:45', '14:00', '16:20', '18:30', '20:00', '21:15', '22:30', '23:45', '23:59']
    : ['08:00', '10:30', '13:00', '15:45', '18:00', '20:15', '22:30', '23:30'];

  const services: BusService[] = [];
  const opCount = OPERATORS.length;
  for (let i = 0; i < count; i++) {
    const op = OPERATORS[(seed + i * 3) % opCount];
    const cls = ALL_CLASSES[(seed + i * 5) % ALL_CLASSES.length];
    const depart = departures[i % departures.length];
    const dur = DURATIONS[key] ?? 300 + Math.floor(rnd() * 240);
    const { time: arrive, nextDay } = addMinutes(depart, dur);
    const price = basePriceFor(fromCityId, toCityId, cls, rnd);
    const seatsTotal = cls.includes('Sleeper') ? 36 : 44;
    const seatsAvailable = Math.floor(seatsTotal * (0.1 + rnd() * 0.85));
    const rating = op.rating;
    const ratingCount = op.ratingCount;
    services.push({
      id: `svc-${fromCityId}-${toCityId}-${i}`,
      operatorId: op.id,
      operatorName: op.name,
      busClass: cls,
      amenities: amenitiesFor(cls, rnd),
      departTime: depart,
      arriveTime: nextDay ? `${arrive} (+1d)` : arrive,
      durationMinutes: dur,
      fromCityId,
      toCityId,
      basePrice: price,
      seatsTotal,
      seatsAvailable,
      rating,
      ratingCount,
      liveTracking: rnd() > 0.5,
      freeCancellation: rnd() > 0.45,
      isPrime: op.rating >= 4.4 && rnd() > 0.3,
      boardingPoints: boardingSet(from, ['21:30', '22:05', '22:40', '23:00', '23:20', '23:45'].slice(0, 3 + (i % 4))),
      droppingPoints: boardingSet(to, ['06:10', '06:35', '07:00', '07:25', '07:50', '08:15'].slice(0, 3 + ((i + 1) % 4))),
    });
  }
  // Prime services first, then by departure
  services.sort((a, b) => Number(b.isPrime) - Number(a.isPrime) || a.departTime.localeCompare(b.departTime));
  return services;
}

/* --------------------------------- Offers --------------------------------- */

export const OFFERS: Offer[] = [
  {
    id: 'of1',
    code: 'FIRST100',
    title: 'Flat ₹100 off',
    subtitle: 'on your first booking',
    description: 'New users get a flat ₹100 discount on any route above ₹500.',
    discountPercent: undefined,
    upTo: 100,
    minAmount: 500,
    scope: 'first',
    expiry: '2026-12-31',
    color: 'primary',
  },
  {
    id: 'of2',
    code: 'WEEKEND20',
    title: '20% off weekends',
    subtitle: 'up to ₹250',
    description: 'Save 20% (up to ₹250) on Fri–Sun departures above ₹800.',
    discountPercent: 20,
    upTo: 250,
    minAmount: 800,
    scope: 'weekend',
    expiry: '2026-12-31',
    color: 'secondary',
  },
  {
    id: 'of3',
    code: 'SLEEPER15',
    title: '15% off sleepers',
    subtitle: 'long-route comfort',
    description: '15% off (up to ₹300) on sleeper-class bookings above ₹1000.',
    discountPercent: 15,
    upTo: 300,
    minAmount: 1000,
    scope: 'applies',
    expiry: '2026-10-31',
    color: 'accent',
  },
  {
    id: 'of4',
    code: 'UPFRONT50',
    title: 'Flat ₹50 off',
    subtitle: 'any booking',
    description: 'Flat ₹50 off on every booking above ₹400 — stackable, no limit.',
    upTo: 50,
    minAmount: 400,
    scope: 'any',
    expiry: '2026-12-31',
    color: 'primary',
  },
];

/* ------------------------------ Notifications ----------------------------- */

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Weekend sale is live',
    body: 'Save up to ₹250 on Fri–Sun trips with code WEEKEND20.',
    time: '2h ago',
    read: false,
    kind: 'offer',
  },
  {
    id: 'n2',
    title: 'Trip reminder',
    body: 'Your Bengaluru → Chennai trip departs tomorrow at 22:30. Check in early.',
    time: 'Yesterday',
    read: false,
    kind: 'booking',
  },
  {
    id: 'n3',
    title: 'Welcome to BusGo',
    body: 'Browse routes, compare operators and book seats in a few taps.',
    time: '3d ago',
    read: true,
    kind: 'system',
  },
];

/* ---------------------------------- FAQ ----------------------------------- */

export const FAQ_ITEMS: { category: string; q: string; a: string }[] = [
  {
    category: 'Booking',
    q: 'How do I book a bus ticket?',
    a: 'Enter your origin and destination on the home screen, pick a travel date, then tap Search. Compare services, pick your seats, add passenger details and pay to confirm instantly.',
  },
  {
    category: 'Booking',
    q: 'Can I book for more than one passenger?',
    a: 'Yes. Select multiple seats on the seat-map — a passenger form appears for each selected seat.',
  },
  {
    category: 'Payments',
    q: 'Which payment methods are supported?',
    a: 'This prototype simulates UPI, cards and wallet payments. No real transaction takes place.',
  },
  {
    category: 'Payments',
    q: 'My payment failed but money was deducted. What now?',
    a: 'Failed payments auto-refund to the source account within 5–7 business days. Your ticket is only generated on success.',
  },
  {
    category: 'Cancellation',
    q: 'How do I cancel a ticket?',
    a: 'Open MyTrips, select the booking, and tap Cancel. Refund estimates are shown before you confirm.',
  },
  {
    category: 'Cancellation',
    q: 'How is the refund calculated?',
    a: 'Cancellation up to 24h before departure: 80% refund. 12–24h: 60%. Under 12h: 30%. Service fee is fixed at ₹30.',
  },
  {
    category: 'General',
    q: 'What does a "ladies" seat mean?',
    a: 'Seats marked pink are reserved for female passengers (or female-adjacent). Male passengers cannot select these.',
  },
  {
    category: 'General',
    q: 'Is live tracking available?',
    a: 'Services marked with the live icon share their position once the trip starts.',
  },
];

export const POPULAR_ROUTES: { fromId: string; toId: string; from: string; to: string }[] = [
  { fromId: 'blr', toId: 'che', from: 'Bengaluru', to: 'Chennai' },
  { fromId: 'mum', toId: 'goa', from: 'Mumbai', to: 'Goa' },
  { fromId: 'hyd', toId: 'blr', from: 'Hyderabad', to: 'Bengaluru' },
  { fromId: 'del', toId: 'jai', from: 'Delhi', to: 'Jaipur' },
  { fromId: 'pune', toId: 'mum', from: 'Pune', to: 'Mumbai' },
  { fromId: 'che', toId: 'cok', from: 'Chennai', to: 'Kochi' },
];
