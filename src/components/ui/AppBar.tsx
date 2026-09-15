/* ============================================================
   AppBar — top navigation bar (title / back / actions)
   ============================================================ */

import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import './AppBar.css';

export interface AppBarProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  /** Solid brand bar vs. elevated white bar. */
  tone?: 'brand' | 'surface' | 'plain';
  sticky?: boolean;
}

export function AppBar({ title, subtitle, onBack, actions, tone = 'surface', sticky = true }: AppBarProps) {
  return (
    <header className={`appbar appbar--${tone} ${sticky ? 'appbar--sticky' : ''}`}>
      {onBack && (
        <button className="appbar__back" onClick={onBack} aria-label="Go back">
          <Icon name="chevron-left" size={22} />
        </button>
      )}
      <div className="appbar__titles">
        {title && <h1 className="appbar__title">{title}</h1>}
        {subtitle && <p className="appbar__subtitle">{subtitle}</p>}
      </div>
      <div className="appbar__actions">{actions}</div>
    </header>
  );
}

/** Circular icon button used in AppBar actions. */
export function AppBarAction({
  icon,
  label,
  onClick,
  badge,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onClick?: () => void;
  badge?: boolean;
}) {
  return (
    <button className="appbar__action" onClick={onClick} aria-label={label}>
      <Icon name={icon} size={20} />
      {badge && <span className="appbar__badge" />}
    </button>
  );
}
