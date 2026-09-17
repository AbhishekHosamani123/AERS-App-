/**
 * PortalIcon — thin-stroke inline SVG icon set for the faculty/college portal.
 *
 * Rationale: the portal previously used OS emoji (🎓 🚨 📊 …) as interface
 * icons. Emoji render differently on every machine, cannot inherit colour or
 * stroke weight, and read as decorative rather than functional. These glyphs
 * are single-weight (1.75px) 24×24 strokes that inherit `currentColor`, so the
 * console keeps a consistent, instrument-panel tone.
 */

import type { CSSProperties, ReactNode } from 'react';

export type PortalIconName =
  | 'cap'
  | 'target'
  | 'star'
  | 'alert'
  | 'activity'
  | 'users'
  | 'download'
  | 'send'
  | 'search'
  | 'bars'
  | 'building'
  | 'layers'
  | 'compass'
  | 'file-text'
  | 'message'
  | 'briefcase'
  | 'phone'
  | 'calendar'
  | 'clock'
  | 'flame'
  | 'check'
  | 'check-circle'
  | 'close'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'refresh'
  | 'list-check'
  | 'shield'
  | 'info';

export interface PortalIconProps {
  name: PortalIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  /** Provide a title only when the icon carries meaning on its own. */
  title?: string;
}

const paths: Partial<Record<PortalIconName, ReactNode>> = {
  cap: (
    <g>
      <path d="M2.5 8.6 12 4.2l9.5 4.4L12 13z" />
      <path d="M6 10.6V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.4" />
      <path d="M20.5 9.4v4.2" />
    </g>
  ),
  target: (
    <g>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  star: <path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z" />,
  alert: (
    <g>
      <path d="M12 4.4 21 19.6H3z" />
      <path d="M12 9.8v4.4" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
  activity: <path d="M3 12h3.6l2.4-6 4 12 2.6-7 1.8 3.4H21" />,
  users: (
    <g>
      <circle cx="9.5" cy="9" r="3.2" />
      <path d="M3.8 19.4c0-3.1 2.6-5.2 5.7-5.2s5.7 2.1 5.7 5.2" />
      <path d="M16.4 6.4a3 3 0 0 1 0 5.6M17.6 14.5c2 .5 3.4 2.2 3.4 4.4" />
    </g>
  ),
  download: (
    <g>
      <path d="M12 3.8v10.4" />
      <path d="m7.8 10.4 4.2 4.2 4.2-4.2" />
      <path d="M4.5 18.6h15" />
    </g>
  ),
  send: (
    <g>
      <path d="M20.6 4.2 3.9 10.6l6.4 2.4 2.5 6.6z" />
      <path d="m10.3 13 3.6-3.5" />
    </g>
  ),
  search: (
    <g>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.4 15.4 4.4 4.4" />
    </g>
  ),
  bars: (
    <g>
      <path d="M4 19.5h16" />
      <path d="M7 19.5v-6.2M12 19.5V7.4M17 19.5v-9" />
    </g>
  ),
  building: (
    <g>
      <path d="M4.5 20V5.2a1.2 1.2 0 0 1 1.2-1.2h7.1a1.2 1.2 0 0 1 1.2 1.2V20" />
      <path d="M14 9.6h4.3a1.2 1.2 0 0 1 1.2 1.2V20" />
      <path d="M3 20h18M7.6 8h3.4M7.6 12h3.4M17 13.4h.01M17 16.8h.01" />
    </g>
  ),
  layers: (
    <g>
      <path d="m12 3.8 8.4 4.3-8.4 4.3L3.6 8.1z" />
      <path d="m4.4 12.6 7.6 3.9 7.6-3.9" />
      <path d="m4.4 16.6 7.6 3.9 7.6-3.9" />
    </g>
  ),
  compass: (
    <g>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.9 9.1-1.7 4.1-4.1 1.7 1.7-4.1z" />
    </g>
  ),
  'file-text': (
    <g>
      <path d="M6.5 3.8h7.2l4.3 4.3v12H6.5z" />
      <path d="M13.4 3.9V8.4h4.5M9.4 12.6h5.2M9.4 16h5.2" />
    </g>
  ),
  message: (
    <path d="M20 12.4c0 3.7-3.6 6.7-8 6.7a9.6 9.6 0 0 1-2.5-.3L5 20.4l1.2-3.2A6.3 6.3 0 0 1 4 12.4c0-3.7 3.6-6.7 8-6.7s8 3 8 6.7z M9.4 12.2h.01M12 12.2h.01M14.6 12.2h.01" />
  ),
  briefcase: (
    <g>
      <rect x="3.6" y="7.6" width="16.8" height="11.6" rx="2" />
      <path d="M9.2 7.6V6.2a1.6 1.6 0 0 1 1.6-1.6h2.4a1.6 1.6 0 0 1 1.6 1.6v1.4" />
      <path d="M3.8 12.6h16.4" />
    </g>
  ),
  phone: (
    <path d="M8.2 3.9 9.9 7l-1.7 1.9c.9 2 2.5 3.6 4.5 4.5l1.9-1.7 3.1 1.7-.9 3.3a1.6 1.6 0 0 1-1.8 1.2C9.7 17.1 6 13.4 4.6 7a1.6 1.6 0 0 1 1.2-1.8z" />
  ),
  calendar: (
    <g>
      <rect x="4" y="5.6" width="16" height="14.4" rx="2" />
      <path d="M4 10.4h16M8.6 3.6v3.6M15.4 3.6v3.6" />
    </g>
  ),
  clock: (
    <g>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.6V12l3 2" />
    </g>
  ),
  flame: (
    <path d="M12 3.6c2.8 3.2 5.4 5.4 5.4 9.1a5.4 5.4 0 0 1-10.8 0c0-1.6.6-2.8 1.6-4 .2 1.2.9 2.1 1.8 2.3-.4-2.9.4-5.3 2-7.4z" />
  ),
  check: <path d="m5.5 12.8 4.2 4.2 8.8-9.6" />,
  'check-circle': (
    <g>
      <circle cx="12" cy="12" r="8.4" />
      <path d="m8.4 12.3 2.6 2.6 4.8-5.4" />
    </g>
  ),
  close: <path d="m6.6 6.6 10.8 10.8M17.4 6.6 6.6 17.4" />,
  'arrow-up-right': (
    <g>
      <path d="M8.2 15.8 15.8 8.2" />
      <path d="M9.6 8.2h6.2v6.2" />
    </g>
  ),
  'chevron-down': <path d="m6.6 9.6 5.4 5.4 5.4-5.4" />,
  refresh: (
    <g>
      <path d="M19.6 12a7.6 7.6 0 0 1-13 5.3" />
      <path d="M4.4 12a7.6 7.6 0 0 1 13-5.3" />
      <path d="M17.4 3.6v3.4h-3.4M6.6 20.4V17h3.4" />
    </g>
  ),
  'list-check': (
    <g>
      <path d="M9.6 6.6h9.8M9.6 12h9.8M9.6 17.4h5.6" />
      <path d="m3.6 6.4 1.6 1.7 2.2-2.7M3.6 16.8l1.6 1.7 2.2-2.7" />
    </g>
  ),
  shield: (
    <g>
      <path d="M12 3.6 5.4 6v5.6c0 4 2.8 7.3 6.6 8.8 3.8-1.5 6.6-4.8 6.6-8.8V6z" />
      <path d="m9.2 11.8 2.1 2.1 4-4.6" />
    </g>
  ),
  info: (
    <g>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11v5.4" />
      <circle cx="12" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
};

export const PortalIcon = ({
  name,
  size = 18,
  strokeWidth = 1.75,
  className,
  style,
  title,
}: PortalIconProps) => {
  const decorative = !title;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0, display: 'block', ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
};

export default PortalIcon;