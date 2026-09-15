/**
 * In-progress booking state (the "cart"): search → seats → passengers →
 * payment → confirmation. Reset after ticket creation or on new search.
 */

import type { BoardingPoint, BusService, ContactInfo, Passenger, Seat } from '../types';

export interface BookingDraft {
  bus: BusService | null;
  dateISO: string;
  seats: Seat[];
  passengers: Passenger[];
  boardingPoint: BoardingPoint | null;
  droppingPoint: BoardingPoint | null;
  contact: ContactInfo;
  offerCode: string | null;
}

const initial: BookingDraft = {
  bus: null,
  dateISO: '',
  seats: [],
  passengers: [],
  boardingPoint: null,
  droppingPoint: null,
  contact: { email: '', phone: '' },
  offerCode: null,
};

import { createStore } from './createStore';

export const draftStore = createStore<BookingDraft>(initial);

export function startDraft(bus: BusService, dateISO: string) {
  draftStore.setState({
    ...initial,
    bus,
    dateISO,
    seats: [],
    passengers: [],
  });
}

export function toggleSeat(seat: Seat, isLadiesRestricted: boolean) {
  draftStore.setState((d) => {
    const exists = d.seats.find((s) => s.id === seat.id && s.deck === seat.deck);
    if (exists) {
      return {
        ...d,
        seats: d.seats.filter((s) => !(s.id === seat.id && s.deck === seat.deck)),
        passengers: d.passengers.filter((p) => p.seatId !== seatIdKey(seat)),
      };
    }
    if (isLadiesRestricted || d.seats.length >= 6) return d;
    return {
      ...d,
      seats: [...d.seats, seat],
      passengers: [
        ...d.passengers,
        { seatId: seatIdKey(seat), name: '', age: null, gender: null },
      ],
    };
  });
}

export function setBoarding(bp: BoardingPoint | null) {
  draftStore.setState((d) => ({ ...d, boardingPoint: bp }));
}

export function setDropping(dp: BoardingPoint | null) {
  draftStore.setState((d) => ({ ...d, droppingPoint: dp }));
}

export function setContact(c: ContactInfo) {
  draftStore.setState((d) => ({ ...d, contact: c }));
}

export function updatePassenger(seatId: string, patch: Partial<Passenger>) {
  draftStore.setState((d) => ({
    ...d,
    passengers: d.passengers.map((p) => (p.seatId === seatId ? { ...p, ...patch } : p)),
  }));
}

export function setOffer(code: string | null) {
  draftStore.setState((d) => ({ ...d, offerCode: code }));
}

export function resetDraft() {
  draftStore.setState(initial);
}

export function seatIdKey(seat: Seat): string {
  return `${seat.deck}:${seat.id}`;
}

export function useDraft() {
  return draftStore.useValue();
}
