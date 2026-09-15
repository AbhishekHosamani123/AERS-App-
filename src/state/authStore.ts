/** Auth store: mock login via phone + OTP, persisted in localStorage. */

import { persistence } from '../services/api';
import type { AuthSession, UserProfile } from '../types';
import { createStore } from './createStore';

const KEY = persistence.authKey;

function load(): AuthSession | null {
  return persistence.read<AuthSession | null>(KEY, null);
}

export const authStore = createStore<AuthSession | null>(load());

export function setSession(s: AuthSession | null) {
  authStore.setState(s);
  if (s) persistence.write(KEY, s);
  else localStorage.removeItem(KEY);
}

export function updateProfile(patch: Partial<UserProfile>) {
  const cur = authStore.getState();
  if (!cur) return;
  const next = { ...cur, ...patch };
  authStore.setState(next);
  persistence.write(KEY, next);
}

export function useAuth() {
  return authStore.useValue();
}
