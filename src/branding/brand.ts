/**
 * Central branding configuration — Phase 5.
 *
 * Every brand-specific value in the app lives here. To convert this
 * prototype into your own product, edit this file only.
 */

export const BRAND = {
  APP_NAME: 'AERS',
  APP_TAGLINE: 'Learn • Prepare • Succeed',
  APP_LOGO_MARK: 'aers', // glyph used by the <Logo /> component

  // Brand palette (single source of truth for the design tokens).
  PRIMARY_COLOR: '#0066F5',
  PRIMARY_COLOR_DARK: '#004EC4',
  SECONDARY_COLOR: '#F59E0B',
  TEXT_COLOR: '#181818',
  BACKGROUND_COLOR: '#FCFCFC',
  ACCENT_COLOR: '#00B4D8',
  SUCCESS_COLOR: '#1E9E62',
  DANGER_COLOR: '#E11D48',
  INFO_COLOR: '#0066F5',
} as const;

/** Neutral copy shown across the app — replace with your own voice. */
export const BRAND_COPY = {
  supportPhone: '+91 80 4000 0000',
  supportEmail: 'support@aers.in',
  demoNotice: 'Prototype — payments are simulated, no real money moves.',
  aboutText:
    'AERS is an educational learning and preparation platform.',
} as const;
