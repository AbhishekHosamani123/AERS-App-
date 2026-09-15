/* ============================================================
   Sheet — modal bottom sheet with drag-to-dismiss header,
   overlay, and body scroll lock. Mobile-native interaction.
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Sheet.css';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Max height fraction of viewport. */
  maxHeight?: string;
  /** Sticky footer content (e.g. action buttons). */
  footer?: ReactNode;
}

export function Sheet({ open, onClose, title, children, maxHeight = '88vh', footer }: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Animate in after mount for enter transitions
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const handleDragStart = (clientY: number) => {
    dragStart.current = clientY;
  };
  const handleDragMove = (clientY: number) => {
    if (dragStart.current === null) return;
    const dy = clientY - dragStart.current;
    if (dy > 0) setDragY(dy);
  };
  const handleDragEnd = () => {
    if (dragY > 90) onClose();
    setDragY(0);
    dragStart.current = null;
  };

  return createPortal(
    <div className={`sheet-root ${visible ? 'is-open' : ''}`}>
      <div className="sheet-overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={sheetRef}
        style={{
          maxHeight,
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : undefined,
        }}
      >
        <div
          className="sheet__grabber-zone"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          onMouseDown={(e) => handleDragStart(e.clientY)}
        >
          <div className="sheet__grabber" aria-hidden="true" />
        </div>
        {title && (
          <div className="sheet__head">
            <h2 className="sheet__title">{title}</h2>
            <button className="sheet__close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        )}
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
