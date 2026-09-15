/** Bottom navigation — 5 tabs matching the reference app structure. */

import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../icons/Icon';
import './BottomNav.css';

interface Tab {
  to: string;
  label: string;
  icon: IconName;
  /** Reference shows a green "New" badge on the Offers tab. */
  badge?: boolean;
}

function TabLink({ tab }: { tab: Tab }) {
  return (
    <NavLink
      to={tab.to}
      className={({ isActive }) => `bottomnav__tab ${isActive ? 'is-active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <span className="bottomnav__icon">
            <Icon name={tab.icon} size={22} strokeWidth={isActive ? 2 : 1.6} />
          </span>
          <span className="bottomnav__label">
            {tab.label}
            {tab.badge && <sup className="bottomnav__new">New</sup>}
          </span>
        </>
      )}
    </NavLink>
  );
}

const TABS: Tab[] = [
  { to: '/home', label: 'Home', icon: 'home' },
  { to: '/trips', label: 'Journey', icon: 'ticket' },
  { to: '/offers', label: 'Offers', icon: 'offer', badge: true },
  { to: '/help', label: 'Help', icon: 'help' },
  { to: '/account', label: 'My Account', icon: 'user' },
];

export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Primary">
      {TABS.map((t) => (
        <TabLink key={t.to} tab={t} />
      ))}
    </nav>
  );
}
