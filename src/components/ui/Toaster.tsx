/** Toast host — renders the toast queue at the top of the viewport. */

import { createPortal } from 'react-dom';
import { useToasts, dismissToast } from '../../state/toastStore';
import './Toaster.css';

export function Toaster() {
  const toasts = useToasts();
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.kind}`}
          onClick={() => dismissToast(t.id)}
        >
          <span className="toast__dot" />
          <span className="toast__msg">{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}
