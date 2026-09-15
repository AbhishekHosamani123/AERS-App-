/** Settings store, persisted. */

import { defaultSettings, persistence } from '../services/api';
import { createStore } from './createStore';

const KEY = persistence.settingsKey;

export const settingsStore = createStore(persistence.read(KEY, defaultSettings));

export function updateSetting<K extends keyof typeof defaultSettings>(key: K, value: (typeof defaultSettings)[K]) {
  settingsStore.setState((s) => ({ ...s, [key]: value }));
  persistence.write(KEY, settingsStore.getState());
}

export function useSettings() {
  return settingsStore.useValue();
}
