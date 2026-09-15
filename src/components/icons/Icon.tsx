/**
 * Icon system — inline SVG icon components (no external assets).
 * All icons are generic glyphs (bus, seat, calendar, etc.); brand marks
 * are intentionally neutral geometric shapes.
 */

import type { CSSProperties, ReactNode } from 'react';

export type IconName =
  | 'bus'
  | 'search'
  | 'calendar'
  | 'swap'
  | 'star'
  | 'star-filled'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'info'
  | 'filter'
  | 'sort'
  | 'wifi'
  | 'charging'
  | 'water'
  | 'blanket'
  | 'movie'
  | 'lightning'
  | 'clock'
  | 'shield'
  | 'home'
  | 'ticket'
  | 'offer'
  | 'help'
  | 'user'
  | 'phone'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'pin'
  | 'notification'
  | 'bell'
  | 'bell-off'
  | 'settings'
  | 'wallet'
  | 'card'
  | 'upi'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'trash'
  | 'edit'
  | 'logout'
  | 'download'
  | 'share'
  | 'moon'
  | 'globe'
  | 'female'
  | 'seater'
  | 'sleeper'
  | 'route'
  | 'grid'
  | 'refresh'
  | 'exclamation'
  | 'video'
  | 'loader';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}

interface GlyphProps {
  size: number;
  strokeWidth: number;
}

type Glyph = (p: GlyphProps) => ReactNode;

/* ------------------------------------------------------------------ glyphs */

const bus = ({ strokeWidth }: GlyphProps) => (
  <g>
    <rect x="1.5" y="4" width="29" height="21" rx="3" strokeWidth={strokeWidth} />
    <path d="M9 25h14M4 12h24" strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="9" cy="9" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="23" cy="9" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="9" cy="29" r="2.4" strokeWidth={strokeWidth} />
    <circle cx="23" cy="29" r="2.4" strokeWidth={strokeWidth} />
  </g>
);

const seatGlyph = ({ strokeWidth }: GlyphProps) => (
  <g>
    <path
      d="M8 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6H8v-6zM6 16h16v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path d="M24 12h2a2 2 0 0 1 2 2v8" strokeWidth={strokeWidth} strokeLinecap="round" />
  </g>
);

const sleeperGlyph = ({ strokeWidth }: GlyphProps) => (
  <g>
    <rect x="5" y="6" width="22" height="20" rx="3" strokeWidth={strokeWidth} />
    <path d="M5 16h22M11 6v10" strokeWidth={strokeWidth} />
  </g>
);

const glyphs: Record<IconName, Glyph> = {
  bus,
  seater: seatGlyph,
  sleeper: sleeperGlyph,
  search: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="14" cy="14" r="9" strokeWidth={strokeWidth} />
      <path d="m21 21 6.5 6.5" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  calendar: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="4" y="7" width="24" height="21" rx="3" strokeWidth={strokeWidth} />
      <path d="M4 13h24M11 4v5M21 4v5" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  swap: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M7 10h18l-4-4M25 22H7l4 4" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  star: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M16 4.5 19.6 12l8.4 1.2-6 5.9 1.4 8.4L16 23.7 8.6 27.5 10 19.1 4 13.2 12.4 12z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  'star-filled': () => (
    <path
      d="M16 4.5 19.6 12l8.4 1.2-6 5.9 1.4 8.4L16 23.7 8.6 27.5 10 19.1 4 13.2 12.4 12z"
      fill="currentColor"
      stroke="none"
    />
  ),
  'chevron-down': ({ strokeWidth }: GlyphProps) => (
    <path d="m8 13 8 8 8-8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-up': ({ strokeWidth }: GlyphProps) => (
    <path d="m8 19 8-8 8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-left': ({ strokeWidth }: GlyphProps) => (
    <path d="m19 8-8 8 8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-right': ({ strokeWidth }: GlyphProps) => (
    <path d="m13 8 8 8-8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
  close: ({ strokeWidth }: GlyphProps) => (
    <path d="m8 8 16 16M24 8 8 24" strokeWidth={strokeWidth} strokeLinecap="round" />
  ),
  check: ({ strokeWidth }: GlyphProps) => (
    <path d="m6 17 7 7L26 9" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'check-circle': ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="12" strokeWidth={strokeWidth} />
      <path d="m10.5 16.5 4 4L22 13" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  info: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="12" strokeWidth={strokeWidth} />
      <path d="M16 14v9" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="16" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  filter: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M5 7h22l-9 10v7l-4 2v-9z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  sort: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M7 8h13M7 16h9M7 24h5" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m23 12 4 4 4-4" transform="rotate(180 26 14)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  wifi: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path
        d="M4 12a19 19 0 0 1 24 0M8 16.5a13 13 0 0 1 16 0M12 21a7 7 0 0 1 8 0"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="16" cy="26" r="1.5" fill="currentColor" stroke="none" />
    </g>
  ),
  charging: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M17 4 8 18h7l-1 10 10-15h-7z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  water: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M16 4s7 7.5 7 12.5a7 7 0 0 1-14 0C9 11.5 16 4 16 4z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  blanket: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M6 8c5-3 15-3 20 0v16c-5 3-15 3-20 0z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M6 16c5-3 15-3 20 0" strokeWidth={strokeWidth} />
    </g>
  ),
  movie: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="4" y="7" width="24" height="18" rx="3" strokeWidth={strokeWidth} />
      <path d="M4 12h24M4 20h24M12 7v18M20 7v18" strokeWidth={strokeWidth} />
    </g>
  ),
  video: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="3" y="8" width="18" height="16" rx="3" strokeWidth={strokeWidth} />
      <path d="m21 13 8-5v16l-8-5v-6z" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  ),
  lightning: ({ strokeWidth }: GlyphProps) => (
    <path d="M18 3 7 17h7l-2 12L25 14h-8z" strokeWidth={strokeWidth} strokeLinejoin="round" />
  ),
  clock: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="12" strokeWidth={strokeWidth} />
      <path d="M16 9.5V16l4.5 3" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  shield: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M16 4 6 8v8c0 6 4.2 10.4 10 12 5.8-1.6 10-6 10-12V8z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  home: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="m5 15 11-9 11 9" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14v12h16V14" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M14 26v-7h4v7" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  ),
  ticket: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path
        d="M4 10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6z"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path d="M19 8v3m0 4v3m0 4v2" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray="0.5 3.4" />
    </g>
  ),
  offer: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path
        d="M15 4h5v4a3 3 0 0 0 6 0v3.5L26 13a3 3 0 1 1-1.4 5.7L21 27l-6-3-6 3-3.6-8.3A3 3 0 1 1 4 13l1-1.5V8a3 3 0 0 0 6 0V4h4z"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </g>
  ),
  help: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="12" strokeWidth={strokeWidth} />
      <path
        d="M12 12.5a4 4 0 1 1 5.3 3.8c-1 .4-1.3 1-1.3 2v.7"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="16" cy="22.8" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  user: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="11" r="5.5" strokeWidth={strokeWidth} />
      <path d="M6 27c1.5-5 5.5-7 10-7s8.5 2 10 7" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  phone: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M10 4h4l2 6-3 2a14 14 0 0 0 7 7l2-3 6 2v4a2 2 0 0 1-2 2C13.6 24 4 14.4 4 6a2 2 0 0 1 2-2z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  mail: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="4" y="7" width="24" height="18" rx="3" strokeWidth={strokeWidth} />
      <path d="m5 9 11 8 11-8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  lock: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="6" y="14" width="20" height="13" rx="3" strokeWidth={strokeWidth} />
      <path d="M11 14v-4a5 5 0 0 1 10 0v4" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  eye: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M4 16s4.5-8 12-8 12 8 12 8-4.5 8-12 8S4 16 4 16z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3.4" strokeWidth={strokeWidth} />
    </g>
  ),
  'eye-off': ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M4 16s4.5-8 12-8c2 0 3.8.6 5.3 1.4M28 16s-4.5 8-12 8c-2 0-3.8-.6-5.3-1.4" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m6 26 20-20" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.4" strokeWidth={strokeWidth} />
    </g>
  ),
  pin: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M16 28s10-9.6 10-16a10 10 0 1 0-20 0c0 6.4 10 16 10 16z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="16" cy="12" r="3.6" strokeWidth={strokeWidth} />
    </g>
  ),
  notification: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M7 22a8 8 0 0 1-1.5-8.6C7.5 8.4 11.5 6 16 6s8.5 2.4 10.5 7.4A8 8 0 0 1 25 22H7z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M12.5 25.5a3.5 3.5 0 0 0 7 0" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  bell: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M8 23c-1.5-2-2-4-2-7 0-5.5 4.5-10 10-10s10 4.5 10 10c0 3-.5 5-2 7" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M11 23h10l1.5 4.5c-4 2-9 2-13 0z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="16" cy="13" r="4" strokeWidth={strokeWidth} />
    </g>
  ),
  'bell-off': ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M8 23c-1.5-2-2-4-2-7 0-5.5 4.5-10 10-10 1.6 0 3.2.4 4.6 1M25 13c0 3-.5 5-2 7" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M11 23h10l1.5 4.5c-4 2-9 2-13 0z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="m5 5 22 22" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  settings: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="4" strokeWidth={strokeWidth} />
      <path
        d="M14 3.5h4l.6 3.2 2.5 1.5 3-1.3 2 3.4-2.4 2.3v2.8l2.4 2.3-2 3.4-3-1.3-2.5 1.5-.6 3.2h-4l-.6-3.2-2.5-1.5-3 1.3-2-3.4 2.4-2.3v-2.8L5.9 11.8l2-3.4 3 1.3 2.5-1.5z"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </g>
  ),
  wallet: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M6 10a3 3 0 0 1 3-3h13v3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <rect x="6" y="10" width="20" height="15" rx="3" strokeWidth={strokeWidth} />
      <circle cx="20" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  card: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="3.5" y="7" width="25" height="18" rx="3" strokeWidth={strokeWidth} />
      <path d="M3.5 12.5h25M8 19.5h6" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  upi: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M5 10h22v4l-6 5H5z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M5 21h9l5 5" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  'arrow-right': ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M5 16h21m-8-8 8 8-8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  'arrow-left': ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M27 16H6m8-8-8 8 8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  'arrow-up': ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M16 27V6m-8 8 8-8 8 8" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  trash: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M6 9h20M12 9V6a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 20 6v3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8.5 9 10 26a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1.5-17" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  ),
  edit: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M19 5.5 26.5 13 12 27.5H4.5V20z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="m16 8.5 7.5 7.5" strokeWidth={strokeWidth} />
    </g>
  ),
  logout: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M14 5H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h7" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M21 10l6 6-6 6M12 16h15" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  download: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M16 4v16m-7-7 7 7 7-7" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 24v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  share: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="8" r="3.5" strokeWidth={strokeWidth} />
      <circle cx="8" cy="22" r="3.5" strokeWidth={strokeWidth} />
      <circle cx="24" cy="22" r="3.5" strokeWidth={strokeWidth} />
      <path d="m13 10.5-5 8m10-8 5 8" strokeWidth={strokeWidth} />
    </g>
  ),
  moon: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M24 16a10 10 0 0 1-12-12 12 12 0 1 0 12 12 10 10 0 0 1 0 0z"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  ),
  globe: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="16" r="12" strokeWidth={strokeWidth} />
      <path d="M4 16h24M16 4c3.5 3.5 5 7.5 5 12s-1.5 8.5-5 12c-3.5-3.5-5-7.5-5-12s1.5-8.5 5-12z" strokeWidth={strokeWidth} />
    </g>
  ),
  female: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="16" cy="12" r="7" strokeWidth={strokeWidth} />
      <path d="M16 19v9m-4.5-4.5h9" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  route: ({ strokeWidth }: GlyphProps) => (
    <g>
      <circle cx="8" cy="8" r="3.5" strokeWidth={strokeWidth} />
      <circle cx="24" cy="24" r="3.5" strokeWidth={strokeWidth} />
      <path d="M8 11.5V16a5 5 0 0 0 5 5h6a5 5 0 0 1 5 5" strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  ),
  grid: ({ strokeWidth }: GlyphProps) => (
    <g>
      <rect x="5" y="5" width="8" height="8" rx="2" strokeWidth={strokeWidth} />
      <rect x="19" y="5" width="8" height="8" rx="2" strokeWidth={strokeWidth} />
      <rect x="5" y="19" width="8" height="8" rx="2" strokeWidth={strokeWidth} />
      <rect x="19" y="19" width="8" height="8" rx="2" strokeWidth={strokeWidth} />
    </g>
  ),
  refresh: ({ strokeWidth }: GlyphProps) => (
    <path
      d="M26 6v6h-6M6 26v-6h6m-6 0a11 11 0 0 0 18.4 4.4M26 12A11 11 0 0 0 7.6 7.6"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  exclamation: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M16 5v14" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="16" cy="24.5" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  loader: ({ strokeWidth }: GlyphProps) => (
    <g>
      <path d="M16 4v6" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 22v6M4 16h6M22 16h6" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.55" />
      <path d="M8 8l4 4M20 20l4 4M24 8l-4 4M8 24l4-4" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.3" />
    </g>
  ),
};

/* ------------------------------------------------------------------ Icon */

export function Icon({ name, size = 20, className, style, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]({ size, strokeWidth })}
    </svg>
  );
}
