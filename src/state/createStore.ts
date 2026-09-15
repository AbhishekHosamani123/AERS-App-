/**
 * Lightweight global state — a tiny store pattern with useSyncExternalStore.
 * Chosen over Redux/Zustand to keep the prototype dependency-free and
 * easy to reason about; each store owns one domain.
 */

import { useSyncExternalStore } from 'react';

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const setState = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
    listeners.forEach((l) => l());
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };

  const useValue = (): T => useSyncExternalStore(subscribe, () => state, () => state);

  return { getState: () => state, setState, subscribe, useValue };
}
