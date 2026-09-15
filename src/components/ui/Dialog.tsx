/* ============================================================
   Dialog — centered confirmation dialog
   ============================================================ */

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import './Dialog.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm?: () => void;
  /** When set, confirm button shows a loading spinner. */
  busy?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  busy,
}: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={`dialog-root ${visible ? 'is-open' : ''}`}>
      <div className="dialog-overlay" onClick={onClose} aria-hidden="true" />
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={title}>
        <h2 className="dialog__title">{title}</h2>
        {children && <div className="dialog__body">{children}</div>}
        <div className="dialog__actions">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          {confirmLabel && (
            <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={busy}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
