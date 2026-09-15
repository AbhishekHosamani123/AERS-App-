/** Search state (from/to/date) shared between Home and Search screens. */

import { daysFromToday } from '../utils/datetime';
import { createStore } from './createStore';

export interface SearchState {
  fromCityId: string | null;
  toCityId: string | null;
  dateISO: string;
  /** "Booking for women" home toggle — gates ladies-seat policy in the flow. */
  bookingForWomen: boolean;
}

export const searchStore = createStore<SearchState>({
  fromCityId: null,
  toCityId: null,
  dateISO: daysFromToday(1),
  bookingForWomen: false,
});

export function setSearch(patch: Partial<SearchState>) {
  searchStore.setState((s) => ({ ...s, ...patch }));
}

export function swapCities() {
  searchStore.setState((s) => ({
    ...s,
    fromCityId: s.toCityId,
    toCityId: s.fromCityId,
  }));
}

export function useSearchState() {
  return searchStore.useValue();
}
