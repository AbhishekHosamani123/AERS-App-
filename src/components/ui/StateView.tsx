/* ============================================================
   StateView — unified Loading / Empty / Error presentations
   ============================================================ */

import type { ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { Button } from './Button';
import './StateView.css';

export interface StateViewProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({ icon = 'search', title, subtitle, actionLabel, onAction, compact }: StateViewProps) {
  return (
    <div className={`stateview ${compact ? 'stateview--compact' : ''}`}>
      <div className="stateview__icon stateview__icon--empty">
        <Icon name={icon} size={34} strokeWidth={1.6} />
      </div>
      <h3 className="stateview__title">{title}</h3>
      {subtitle && <p className="stateview__subtitle">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', subtitle, actionLabel = 'Retry', onAction, compact }: StateViewProps) {
  return (
    <div className={`stateview ${compact ? 'stateview--compact' : ''}`}>
      <div className="stateview__icon stateview__icon--error">
        <Icon name="exclamation" size={34} strokeWidth={1.6} />
      </div>
      <h3 className="stateview__title">{title}</h3>
      {subtitle && <p className="stateview__subtitle">{subtitle}</p>}
      {onAction && (
        <Button variant="ghost" size="sm" icon="refresh" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function InlineSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="inline-spinner" role="status" aria-live="polite">
      <span className="inline-spinner__ring" />
      <span>{label}</span>
    </div>
  );
}

export function ScreenLoader() {
  return (
    <div className="screen-loader" role="status" aria-label="Loading">
      <span className="screen-loader__ring" />
    </div>
  );
}

/* ------------------------------- Skeletons -------------------------------- */

export function CardSkeleton({ height = 128 }: { height?: number }) {
  return <div className="app-skeleton" style={{ height, borderRadius: 'var(--r-lg)' }} />;
}

export function ListSkeleton({ rows = 4, height = 128 }: { rows?: number; height?: number }) {
  return (
    <div className="list-skeleton" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="list-skeleton__item">
          <div className="app-skeleton" style={{ height, borderRadius: 'var(--r-lg)' }} />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton({ height = 56 }: { height?: number }) {
  return <div className="app-skeleton" style={{ height, borderRadius: 'var(--r-md)' }} />;
}

export function TicketSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="app-skeleton" style={{ height: 22, width: '40%', marginBottom: 12, borderRadius: 6 }} />
      <div className="app-skeleton" style={{ height: 170, borderRadius: 'var(--r-lg)', marginBottom: 10 }} />
      <div className="app-skeleton" style={{ height: 60, borderRadius: 'var(--r-lg)' }} />
    </div>
  );
}

export type { ReactNode };
