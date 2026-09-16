/* ============================================================
   App shell: phone-frame on desktop, full-bleed on mobile.
   Owns routing + persistent chrome (bottom nav, toasts).
   ============================================================ */

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../components/ui/BottomNav';
import { Toaster } from '../components/ui/Toaster';
import { useSearchState } from '../state/searchStore';
import { cityById } from '../mock';
import { timeTo12h } from '../utils/datetime';
import './AppShell.css';

/** Screens that participate in the tab bar. */
const TAB_ROUTES = ['/home', '/trips', '/journey', '/offers', '/help', '/account'];

export function AppShell() {
  const location = useLocation();
  const { pathname } = location;

  const isTabRoute = TAB_ROUTES.some((r) => pathname.startsWith(r));
  const isBookingFlow = pathname.startsWith('/booking') || pathname.startsWith('/search');

  /* Scroll to top on route change (Android-style new-screen behavior) */
  useEffect(() => {
    document.getElementById('app-scroll')?.scrollTo({ top: 0 });
  }, [pathname]);

  /* Live route context for the Android-style soft back bar */
  const search = useSearchState();
  const from = search.fromCityId ? cityById(search.fromCityId)?.name : '';
  const to = search.toCityId ? cityById(search.toCityId)?.name : '';
  const routeLabel = from && to ? `${from} → ${to}` : '';

  return (
    <div className={`phonescreen ${isTabRoute ? 'has-tabnav' : ''}`}>
      {/* Preview-only status bar (desktop phone frame). Hidden on real mobile. */}
      <div className="statusbar" aria-hidden="true">
        <span>9:41</span>
        <span className="statusbar__icons">
          <span className="statusbar__battery" />
        </span>
      </div>

      <main id="app-scroll" className="app-scroll">
        <div key={pathname} className="screen-enter">
          <Outlet />
        </div>
      </main>

      {isTabRoute && <BottomNav />}

      {/* Booking-flow route chip overlay (outside scroll, above content) */}
      {isBookingFlow && routeLabel && (
        <div className="routechip" aria-hidden="true">
          {routeLabel} · {timeTo12h('22:30')}
        </div>
      )}

      <Toaster />
    </div>
  );
}
