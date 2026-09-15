/* ============================================================
   TextField — labeled input with validation, focus, optional icon
   ============================================================ */

import { useId, useState, type InputHTMLAttributes } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import './TextField.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
  prefix?: string;
  suffix?: string;
  icon?: IconName;
  optional?: boolean;
}

export function TextField({
  label,
  hint,
  error,
  prefix,
  suffix,
  icon,
  optional,
  className = '',
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div className={`tf ${error ? 'tf--error' : ''} ${focused ? 'tf--focused' : ''} ${className}`}>
      {label && (
        <label className="tf__label" htmlFor={id}>
          {label}
          {optional && <span className="tf__optional"> (optional)</span>}
        </label>
      )}
      <div className="tf__box">
        {icon && (
          <span className="tf__icon">
            <Icon name={icon} size={18} />
          </span>
        )}
        {prefix && <span className="tf__prefix">{prefix}</span>}
        <input
          id={id}
          className="tf__input"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          aria-invalid={!!error}
          {...rest}
        />
        {suffix && <span className="tf__suffix">{suffix}</span>}
      </div>
      {error ? (
        <p className="tf__msg tf__msg--error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="tf__msg">{hint}</p>
      ) : null}
    </div>
  );
}
