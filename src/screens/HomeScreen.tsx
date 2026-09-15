import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_COPY } from '../branding/brand';
import { Icon, type IconName } from '../components/icons/Icon';
import { AppHeader } from '../components/ui/AppHeader';
import { LearningPathCTA } from '../components/journey/LearningPathCTA';
import { LeaderboardPodium } from '../components/leaderboard/LeaderboardPodium';
import { OFFERS, POPULAR_ROUTES } from '../mock';
import { useAuth } from '../state/authStore';
import { fetchNotifications, markNotifRead, useNotifications, useUnreadNotificationsCount } from '../state/notificationStore';
import { setSearch } from '../state/searchStore';
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
      navigate('/account');
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
  offer: 'offer',
  booking: 'ticket',
  system: 'info',
};

export function HomeScreen() {
  const navigate = useNavigate();
  const auth = useAuth();
  const userName = auth?.name || 'Krishna';
  const [offerIdx, setOfferIdx] = useState(0);
  const { items: notifications } = useNotifications();
  const unreadNotifs = useUnreadNotificationsCount();
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; tabId: string } | null>(null);

  /* Fetch unread notifications */
  useEffect(() => {
    fetchNotifications();
  }, []);

  /* Offers auto-advance */
  useEffect(() => {
    const t = setInterval(() => setOfferIdx((i) => (i + 1) % OFFERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const offer = OFFERS[offerIdx];

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

        {/* 6. SECONDARY: Offers Section */}
        <section className="home__section home__section--offers" aria-label="Offers">
          <div className="home__section-head">
            <div className="home__section-head-left">
              <h2 className="home__section-title">Offers</h2>
              <p className="home__section-sub">Get best deals with great offers</p>
            </div>
            <button className="home__link" onClick={() => navigate('/offers')}>
              View all
            </button>
          </div>

          <div
            className={`offer-slide offer-slide--${offer.color}`}
            onClick={() => navigate('/offers')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/offers')}
          >
            <div className="offer-slide__text">
              <span className="offer-slide__chip">{offer.code}</span>
              <h3 className="offer-slide__heading">{offer.title}</h3>
              <p className="offer-slide__subtext">{offer.subtitle}</p>
            </div>
            <div className="offer-slide__icon-wrap">
              <Icon name="offer" size={38} strokeWidth={1.5} />
            </div>
          </div>

          <div className="carousel-dots" aria-hidden="true">
            {OFFERS.map((_, i) => (
              <button
                key={i}
                className={`carousel-dots__dot ${i === offerIdx ? 'is-active' : ''}`}
                onClick={() => setOfferIdx(i)}
                aria-label={`Offer ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 7. TERTIARY: Popular Routes */}
        <section className="home__section home__section--routes" aria-label="Popular routes">
          <div className="home__section-head">
            <h2 className="home__section-title">Popular routes</h2>
            <button className="home__link" onClick={() => navigate('/search')}>
              View all
            </button>
          </div>
          <div className="home__routes">
            {POPULAR_ROUTES.map((r) => (
              <button
                key={`${r.fromId}-${r.toId}`}
                className="route-chip"
                onClick={() => {
                  setSearch({ fromCityId: r.fromId, toCityId: r.toId });
                  navigate('/search');
                }}
              >
                <span>{r.from}</span>
                <span className="route-chip__arrow">→</span>
                <span>{r.to}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 8. TERTIARY: Notifications */}
        <section className="home__section home__section--notifs" aria-label="Notifications">
          <div className="home__section-head">
            <div className="home__section-head-left">
              <h2 className="home__section-title">Notifications</h2>
              <p className="home__section-sub">Updates, reminders and exclusive offers for you</p>
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
                    if (n.kind === 'offer') navigate('/offers');
                    else if (n.kind === 'booking') navigate('/trips');
                    else showToast(n.title, 'info');
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

        {/* 9. Prototype Info Notice */}
        <section className="home__notice" aria-label="About this prototype">
          <Icon name="info" size={15} />
          <p>{BRAND_COPY.demoNotice}</p>
        </section>
      </div>
    </div>
  );
}
