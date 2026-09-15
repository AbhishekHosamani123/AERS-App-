/* ============================================================
   Button — variants, sizes, states (pressed/loading/disabled)
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  iconRight,
  loading = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && <Icon name={icon} size={size === 'sm' ? 14 : 18} />}
      {children && <span className="btn__label">{children}</span>}
      {!loading && iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 18} />}
    </button>
  );
}
