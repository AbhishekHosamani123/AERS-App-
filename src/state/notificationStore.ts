/**
 * Notification state store with reactive subscriptions.
 * Keeps unread counts synchronized in real-time across Home, Notifications, and other screens.
 */

import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import type { AppNotification } from '../types';
import { createStore } from './createStore';

interface NotificationState {
  items: AppNotification[];
  loaded: boolean;
}

export const notificationStore = createStore<NotificationState>({
  items: [],
  loaded: false,
});

export async function fetchNotifications(): Promise<AppNotification[]> {
  const items = await listNotifications();
  notificationStore.setState({ items, loaded: true });
  return items;
}

export async function markNotifRead(id: string): Promise<AppNotification[]> {
  const items = await markNotificationRead(id);
  notificationStore.setState({ items, loaded: true });
  return items;
}

export async function markAllNotifsRead(): Promise<AppNotification[]> {
  const items = await markAllNotificationsRead();
  notificationStore.setState({ items, loaded: true });
  return items;
}

export function useNotifications() {
  return notificationStore.useValue();
}

export function useUnreadNotificationsCount(): number {
  const { items } = notificationStore.useValue();
  return items.filter((n) => !n.read).length;
}
