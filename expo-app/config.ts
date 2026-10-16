/**
 * AERS Expo wrapper config.
 * Change WEB_URL here or set EXPO_PUBLIC_WEB_URL env to point the WebView
 * at a different host (e.g. your Vercel deployment).
 *
 * Local dev:  http://<YOUR_LAPTOP_IP>:5173  (Vite with --host)
 * Production: https://your-vercel-url.vercel.app
 */

// Auto-detected LAN IP at scaffold time — update if your Wi-Fi IP changes.
// Run `ipconfig` (Windows) and copy the Wi-Fi IPv4 address.
export const DEFAULT_DEV_URL = 'http://10.173.14.173:5173';

// Priority: env -> hardcoded default. Edit the value below if needed.
export const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL?.trim() || DEFAULT_DEV_URL;

// How long to wait before showing the "connection help" overlay (ms)
export const LOAD_TIMEOUT_MS = 12000;

// AERS brand (mirrors src/branding/brand.ts)
export const BRAND = {
  primary: '#0066F5',
  primaryDark: '#004EC4',
  bg: '#FCFCFC',
} as const;
