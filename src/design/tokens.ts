/**
 * Design tokens — Phase 6.
 *
 * Single source of truth for every visual constant. Components must
 * reference these (via the CSS custom properties in tokens.css) instead
 * of scattering raw values.
 */

import { BRAND } from '../branding/brand';

/* ---------------------------------- Color --------------------------------- */

export const colors = {
  primary: BRAND.PRIMARY_COLOR,
  primaryDark: BRAND.PRIMARY_COLOR_DARK,
  primarySoft: hexToRgba(BRAND.PRIMARY_COLOR, 0.08),
  secondary: BRAND.SECONDARY_COLOR,
  accent: BRAND.ACCENT_COLOR,

  text: BRAND.TEXT_COLOR,
  textSecondary: '#4A4A4A',
  textTertiary: 'rgba(29, 29, 29, 0.64)',
  textInverse: '#FDFDFD',

  background: BRAND.BACKGROUND_COLOR,
  surface: '#FDFDFD',
  surfaceMuted: '#F3F3F3',
  border: '#E6E6E6',
  borderStrong: '#4B4B4B',

  success: BRAND.SUCCESS_COLOR,
  successSoft: hexToRgba(BRAND.SUCCESS_COLOR, 0.12),
  danger: BRAND.DANGER_COLOR,
  dangerSoft: hexToRgba(BRAND.DANGER_COLOR, 0.1),
  info: BRAND.INFO_COLOR,
  infoSoft: hexToRgba(BRAND.INFO_COLOR, 0.12),
  warning: '#B7791F',
  warningSoft: '#FDF3E3',
  warningText: '#8A5A0D',
  ladies: '#D6336C',
  ladiesSoft: hexToRgba('#D6336C', 0.12),
  gold: '#B7791F',

  overlay: 'rgba(9, 20, 30, 0.55)',
  skeleton: 'linear-gradient(90deg, #E8ECEF 25%, #F4F7F8 50%, #E8ECEF 75%)',
} as const;

/* ------------------------------- Typography ------------------------------- */

export const typography = {
  fontFamily:
    'Inter, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif',
  scale: {
    display: { size: '24px', weight: 700, lineHeight: 1.25 },
    title: { size: '18px', weight: 700, lineHeight: 1.35 },
    heading: { size: '16px', weight: 700, lineHeight: 1.4 },
    body: { size: '14px', weight: 400, lineHeight: 1.5 },
    bodyStrong: { size: '14px', weight: 600, lineHeight: 1.5 },
    label: { size: '12px', weight: 600, lineHeight: 1.35 },
    caption: { size: '11px', weight: 500, lineHeight: 1.35 },
  },
} as const;

/* -------------------------------- Spacing -------------------------------- */

/** 4pt base grid: 1 unit = 4px */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/* ------------------------------- Geometry --------------------------------- */

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(16, 24, 40, 0.06)',
  md: '0 4px 12px rgba(16, 24, 40, 0.08)',
  lg: '0 12px 32px rgba(16, 24, 40, 0.16)',
  primary: `0 8px 20px ${hexToRgba(BRAND.PRIMARY_COLOR, 0.28)}`,
  none: 'none',
} as const;

/* ----------------------------- Component sizes ---------------------------- */

export const sizes = {
  appBarHeight: 56,
  bottomNavHeight: 62,
  buttonHeight: 48,
  buttonHeightSm: 40,
  buttonHeightLg: 54,
  inputHeight: 48,
  touchTarget: 44,
  iconSm: 14,
  iconMd: 20,
  iconLg: 24,
  busCardMinHeight: 128,
  screenPadding: spacing.lg,
  seatSize: 36,
} as const;

/* -------------------------------- Motion ---------------------------------- */

export const motion = {
  instant: 100,
  fast: 160,
  normal: 240,
  slow: 380,
  sheet: 280,
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  },
} as const;

export const zIndex = {
  base: 0,
  stickyBar: 10,
  appBar: 20,
  bottomNav: 20,
  sheet: 30,
  overlay: 29,
  dialog: 40,
  toast: 50,
} as const;

/* ------------------------------- Utilities -------------------------------- */

/** Convert #RRGGBB + alpha to an rgba() string. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const currency = {
  code: '₹',
  format(n: number): string {
    return `${this.code}${n.toLocaleString('en-IN')}`;
  },
} as const;
