# AERS App — Bus Ticket Booking (RedBus-style UX Clone)

A fully working, mobile-first **bus ticket booking application** rebuilt as clean, maintainable source code. Built as an educational prototype reproducing the UX patterns, layouts, and design language of India's leading bus-booking app — with **zero proprietary assets** (no RedBus logo, name, trademarks, or copyrighted images). All operators, offers, prices, and copy are fictional placeholders, easy to rebrand.

> ⚠️ **Legal note:** This project reproduces *interaction patterns and visual style* (colors, layouts, components) for educational purposes. It intentionally excludes all RedBus trademarks and copyrighted material. Rebrand via `src/branding/brand.ts` before any commercial use.

---

## 🚀 Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build → dist/
```

- **Desktop:** the app renders inside a phone frame (preview mode)
- **Mobile / narrow window:** full-bleed, feels like a native app
- **On your phone:** `npm run dev -- --host` → open the printed Network URL

---

## 📱 What's implemented

### Screens (15)
| Screen | Route |
|---|---|
| Home (search widget, offers carousel, popular routes) | `/home` |
| Search results (sort, filters, bus cards) | `/search` |
| Seat selection (seater/sleeper map, decks, ladies seats) | `/booking/seats` |
| Boarding & dropping points | (sheets in seat flow) |
| Passenger details (per-seat validation, promo codes) | `/booking/passengers` |
| Payment (UPI / Card / Wallet / NetBanking, success & failure paths) | `/booking/payment` |
| Ticket confirmation (PNR, QR, boarding pass, cancel + refund) | `/ticket/:id` |
| MyTrips (Upcoming / Completed / Cancelled tabs) | `/trips` |
| Offers (coupon cards, copy-to-clipboard) | `/offers` |
| Help (searchable FAQ, support chat) | `/help` |
| Account (profile, edit, stats, menu) | `/account` |
| Login → OTP (simulated) | `/account/login`, `/account/otp` |
| Settings (toggles, language, logout) | `/account/settings` |
| Notifications (read/unread, mark-all) | `/notifications` |
| AERS Institution Dashboard (Principal, HOD, Placement analytics) | `/dashboard` |

### Design system (extracted from the reference app)
- Brand red `#D63941`, Inter font, white background
- Pill buttons (999px radius), 20px-radius cards, layered soft shadows
- Gray filter chips with dark borders, 52×32 pill switches
- 4pt spacing grid, tokenized colors/radius/shadows/motion in `src/design/`

### Booking flow
```
Home → From/To/Date → Search → Sort/Filter → Bus card → Seat map
     → Boarding/Dropping points → Passenger forms (+promo) → Payment
     → Processing → Ticket (PNR/QR) → MyTrips → Cancel (refund tiers)
```

**Test hooks:** card number ending `0000` = simulated payment decline; OTP code is displayed on screen (simulated SMS).

---

## 🏗️ Architecture

```
src/
├── app/            AppShell (phone frame, routing, transitions)
├── branding/       brand.ts — APP_NAME, colors, copy (REBRAND HERE)
├── components/
│   ├── ui/         AppBar, Button, TextField, Sheet, Dialog, Toast,
│   │               BottomNav, StateView (empty/error/skeleton)
│   ├── booking/    BusCard, SeatMap, StepIndicator
│   ├── brand/      Logo (neutral geometric mark)
│   └── icons/      60+ inline SVG icons
├── design/         tokens.ts + tokens.css (all visual constants)
├── mock/           deterministic data: cities, operators, services, offers
├── screens/        15 screens, one .tsx + .css each
├── services/api.ts simulated API with latency (swap for real HTTP)
├── state/          5 lightweight stores (search, draft, auth, settings, toast)
├── types/          domain types
└── utils/          datetime, form validators
```

- **Deterministic mock inventory** — seeded by route+date, same search → same buses
- **localStorage persistence** — bookings, session, settings survive refresh
- **No dead UI** — every interactive element performs a real action

---

## 📦 Make it a real Android app

```bash
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init AERSApp com.yourname.aers --web-dir=dist
npx cap add android && npx cap sync
# open ./android in Android Studio → Run
```

---

## 📚 Docs
- `docs/APK_ANALYSIS.md` — Phase-1 analysis of the reference APK
- `docs/HOW_TO_RUN_AND_TEST.md` — beginner's testing walkthrough
- `docs/APP_DOCUMENTATION.md` — complete feature & architecture reference
