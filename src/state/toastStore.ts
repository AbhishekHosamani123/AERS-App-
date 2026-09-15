/** Toast notification store + hook. */

import { useSyncExternalStore } from 'react';

export interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'success' | 'error';
}

let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

let nextId = 1;

export function showToast(message: string, kind: Toast['kind'] = 'info') {
  const id = nextId++;
  toasts = [...toasts, { id, message, kind }];
  emit();
  setTimeout(() => dismissToast(id), 2600);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts, () => toasts);
}
