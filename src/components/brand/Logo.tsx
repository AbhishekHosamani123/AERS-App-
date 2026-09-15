/** Official AERS brand logo asset. */

import { BRAND } from '../../branding/brand';
import './Logo.css';

export function Logo({ size = 32, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="logo" style={{ height: size }}>
      <img
        src="/AERS_Officel_Logo.png"
        alt="AERS Logo"
        className="logo__img"
        style={{ width: size, height: size }}
      />
      {withWordmark && <span className="logo__word">{BRAND.APP_NAME}</span>}
    </span>
  );
}
