/* ============================================================
   Notifications — list with read states + mark-all
   ============================================================ */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { EmptyState, ListSkeleton } from '../components/ui/StateView';
import { Icon, type IconName } from '../components/icons/Icon';
import { fetchNotifications, markAllNotifsRead, markNotifRead, useNotifications } from '../state/notificationStore';
import { showToast } from '../state/toastStore';
import type { AppNotification } from '../types';
import './NotificationsScreen.css';

const KIND_ICON: Record<AppNotification['kind'], IconName> = {
  mentor: 'user',
  journey: 'star',
  session: 'calendar',
  system: 'lightning',
  offer: 'offer',
  booking: 'ticket',
};

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { items, loaded } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function open(n: AppNotification) {
    if (!n.read) {
      await markNotifRead(n.id);
    }
    if (n.kind === 'mentor' || n.kind === 'session') {
      showToast('Opening Google Meet session...', 'success');
      if (n.link) {
        setTimeout(() => window.open(n.link, '_blank'), 500);
      }
    } else if (n.kind === 'journey') {
      navigate('/journey');
    } else if (n.kind === 'offer') {
      navigate('/offers');
    } else if (n.kind === 'booking') {
      navigate('/trips');
    } else {
      showToast(n.title, 'info');
    }
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="notifs">
      <AppBar
        tone="surface"
        onBack={() => navigate(-1)}
        title="Notifications"
        actions={
          unread > 0 ? (
            <button
              className="notifs__markall"
              onClick={async () => {
                await markAllNotifsRead();
                showToast('All marked as read', 'success');
              }}
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="notifs__scroll">
        {!loaded ? (
          <ListSkeleton rows={4} height={84} />
        ) : items.length === 0 ? (
          <EmptyState icon="bell-off" title="No notifications" subtitle="You're all caught up." />
        ) : (
          <ul className="notifs__list">
            {items.map((n) => (
              <li key={n.id}>
                <button className={`notif ${n.read ? '' : 'is-unread'}`} onClick={() => open(n)}>
                  <span className={`notif__icon notif__icon--${n.kind}`}>
                    <Icon name={KIND_ICON[n.kind]} size={19} />
                  </span>
                  <span className="notif__text">
                    <strong>{n.title}</strong>
                    <p>{n.body}</p>
                    <small>{n.time}</small>
                  </span>
                  {!n.read && <span className="notif__dot" aria-label="Unread" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
