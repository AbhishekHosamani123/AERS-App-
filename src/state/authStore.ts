/** Auth store: mock login via phone + OTP, persisted in localStorage. */

import { persistence } from '../services/api';
import type { AuthSession, UserProfile } from '../types';
import { createStore } from './createStore';

const KEY = persistence.authKey;

const DEFAULT_SESSION: AuthSession = {
  phone: '9876543210',
  name: 'Krishna',
  email: 'krishna@aers.in',
};

function load(): AuthSession | null {
  const saved = persistence.read<AuthSession | null>(KEY, null);
  if (!saved) {
    persistence.write(KEY, DEFAULT_SESSION);
    return DEFAULT_SESSION;
  }
  return saved;
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
