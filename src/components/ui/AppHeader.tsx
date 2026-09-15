import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { Icon } from '../icons/Icon';
import './AppHeader.css';

export interface AppHeaderProps {
  unreadNotifs?: number;
  rightSlot?: ReactNode;
  subtitle?: string;
}

export function AppHeader({ unreadNotifs = 3, rightSlot, subtitle }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div
        className="app-header__left"
        onClick={() => navigate('/home')}
        role="button"
        tabIndex={0}
        title="AERS Home"
      >
        <Logo withWordmark size={26} />
        {subtitle && <span className="app-header__subtitle">{subtitle}</span>}
      </div>

      <div className="app-header__actions">
        {rightSlot ? (
          rightSlot
        ) : (
          <>
            <button
              className="app-header__walletpill"
              onClick={() => navigate('/account')}
              aria-label="Wallet"
              title="AERS Wallet"
            >
              <Icon name="wallet" size={15} />
              <span>Wallet ₹202</span>
            </button>
            <button
              className="app-header__notifbtn"
              onClick={() => navigate('/notifications')}
              aria-label={`Notifications${unreadNotifs > 0 ? ` (${unreadNotifs} unread)` : ''}`}
              title="Notifications"
            >
              <img src="/bell_icon.png" alt="Notifications" className="app-header__notif-bell-img" />
              {unreadNotifs > 0 && (
                <span className="app-header__notif-count-badge">
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
