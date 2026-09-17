import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../components/icons/Icon';
import { AppHeader } from '../components/ui/AppHeader';
import { LearningPathCTA } from '../components/journey/LearningPathCTA';
import { LeaderboardPodium } from '../components/leaderboard/LeaderboardPodium';
import { useAuth } from '../state/authStore';
import { fetchNotifications, markNotifRead, useNotifications, useUnreadNotificationsCount } from '../state/notificationStore';
import { showToast } from '../state/toastStore';
import type { AppNotification } from '../types';
import './HomeScreen.css';

/** AERS Quick navigation shortcuts */
const SHORTCUT_TABS = [
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    iconImg: '/shortcuts/leaderboard.png',
    action: (navigate: (path: string) => void) => {
      const el = document.querySelector('.leaderboard-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        navigate('/home');
      }
    },
  },
  {
    id: 'progress',
    label: 'My Progress',
    iconImg: '/shortcuts/progress.png',
    action: (navigate: (path: string) => void) => {
      navigate('/journey');
    },
  },
  {
    id: 'passport',
    label: 'Passport',
    iconImg: '/shortcuts/passport.png',
    action: (navigate: (path: string) => void) => {
      navigate('/account?passport=true');
    },
  },
  {
    id: 'schedule',
    label: 'Schedule',
    iconImg: '/shortcuts/schedule.png',
    action: (navigate: (path: string) => void) => {
      navigate('/trips');
    },
  },
] as const;

const KIND_ICON: Record<AppNotification['kind'], IconName> = {
  mentor: 'user',
  journey: 'star',
  session: 'calendar',
  system: 'lightning',
  offer: 'offer',
  booking: 'ticket',
};

export function HomeScreen() {
  const navigate = useNavigate();
  const auth = useAuth();
  const userName = auth?.name || 'Krishna';
  const { items: notifications } = useNotifications();
  const unreadNotifs = useUnreadNotificationsCount();
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; tabId: string } | null>(null);

  /* Fetch unread notifications */
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleShortcutTap = (
    e: React.MouseEvent<HTMLButtonElement>,
    t: (typeof SHORTCUT_TABS)[number]
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    setRipple({ x, y, tabId: t.id });
    setPressedTab(t.id);

    setTimeout(() => {
      setPressedTab(null);
      setRipple(null);
      t.action(navigate);
    }, 110);
  };

  return (
    <div className="home">
      {/* 1. Header: AERS Logo Left, Wallet & Notification Bell Right */}
      <AppHeader unreadNotifs={unreadNotifs} />

      <div className="home__scroll">
        {/* 2. User Greeting */}
        <div className="home__greeting">
          <h1 className="home__greeting-title">
            Good morning, {userName} <span className="home__greeting-wave">👋</span>
          </h1>
          <p className="home__greeting-sub">Where would you like to travel today?</p>
        </div>

        {/* 3. AERS Navigation Shortcuts (Compact, Clean, Minimal) */}
        <div className="home__svctabs" role="tablist" aria-label="AERS Shortcuts">
          {SHORTCUT_TABS.map((t) => {
            const isPressed = pressedTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-label={t.label}
                className={`home__svctab ${t.id === 'leaderboard' ? 'home__svctab--leaderboard' : ''} ${isPressed ? 'is-pressed' : ''}`}
                onClick={(e) => handleShortcutTap(e, t)}
              >
                {ripple && ripple.tabId === t.id && (
                  <span
                    className="shortcut-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                    aria-hidden="true"
                  />
                )}
                <span className={`home__svctab-icon ${t.id === 'leaderboard' ? 'home__svctab-icon--leaderboard' : ''}`}>
                  {t.id === 'leaderboard' && (
                    <>
                      <span className="trophy-glow-aura" aria-hidden="true" />
                      <span className="trophy-sparkle" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                            fill="#FDE047"
                          />
                        </svg>
                      </span>
                    </>
                  )}
                  <img
                    src={t.iconImg}
                    alt={t.label}
                    className={`home__svctab-img ${t.id === 'leaderboard' ? 'home__svctab-img--leaderboard' : ''} ${isPressed ? 'is-popping' : ''}`}
                  />
                </span>
                <span className="home__svctab-label">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Student Leaderboard Podium */}
        <div className="home__section-widget">
          <LeaderboardPodium />
        </div>

        {/* 5. Module 2 Learning Stage Card */}
        <div className="home__section-hero">
          <LearningPathCTA />
        </div>


        {/* 8. TERTIARY: Notifications */}
        <section className="home__section home__section--notifs" aria-label="Notifications">
          <div className="home__section-head">
            <div className="home__section-head-left">
              <h2 className="home__section-title">Notifications</h2>
              <p className="home__section-sub">Live classes, learning milestones & placement updates</p>
            </div>
            <button className="home__link" onClick={() => navigate('/notifications')}>
              View all
            </button>
          </div>
          <div className="home__notifs-list">
            {notifications.length === 0 ? (
              <div className="home__notifs-empty">
                <Icon name="bell-off" size={22} />
                <span>No notifications right now</span>
              </div>
            ) : (
              notifications.slice(0, 3).map((n) => (
                <button
                  key={n.id}
                  className={`home__notif-card ${!n.read ? 'is-unread' : ''}`}
                  onClick={async () => {
                    if (!n.read) await markNotifRead(n.id);
                    if (n.kind === 'mentor' || n.kind === 'session') {
                      showToast('Opening Google Meet session...', 'success');
                      if (n.link) {
                        setTimeout(() => window.open(n.link, '_blank'), 500);
                      }
                    } else if (n.kind === 'journey') {
                      navigate('/journey');
                    } else if (n.kind === 'offer') {
                      navigate('/offers');
                    } else {
                      showToast(n.title, 'info');
                    }
                  }}
                >
                  <span className={`home__notif-card-icon home__notif-card-icon--${n.kind}`}>
                    <Icon name={KIND_ICON[n.kind]} size={16} />
                  </span>
                  <div className="home__notif-card-content">
                    <div className="home__notif-card-header">
                      <strong className="home__notif-card-title">{n.title}</strong>
                      <span className="home__notif-card-time">{n.time}</span>
                    </div>
                    <p className="home__notif-card-body">{n.body}</p>
                  </div>
                  {!n.read && <span className="home__notif-card-dot" aria-label="Unread" />}
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
