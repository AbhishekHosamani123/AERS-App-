# BusGo — Complete App Documentation

*Every feature, every screen, every workflow, and how the code is organized.*

---

## 1. What this app is

BusGo is a **bus ticket booking app** — a complete, working clone-style rebuild of the bus-booking app experience (RedBus-class OTA UX patterns). It has 15 screens, a full booking flow, simulated payments, login, cancellations, offers — everything a real bus-booking app has, running on realistic mock data so it works 100% offline without any backend.

- **Tech:** React 19 + TypeScript + Vite (mobile-first web app, ready to wrap into Android via Capacitor)
- **State:** tiny custom stores (`useSyncExternalStore`) — no heavy libraries
- **Data:** deterministic mock data + localStorage persistence
- **Design system:** token-based (all colors/spacing/radius/shadows/motion in 2 files)

---

## 2. Feature list (complete)

### 🏠 Home
- From/To city selectors with debounced search (by city or state name)
- Popular cities grouped at top of the picker
- One-tap **swap** origin/destination button
- Date picker bottom sheet: quick chips (Today/Tomorrow/day-after) + full month calendar with past-date guard
- Auto-rotating **offers carousel** with tappable progress dots
- Popular routes chips → one-tap search
- Notification bell with unread badge
- Demo disclaimer banner

### 🔍 Search results
- Realistic skeleton loading while "searching"
- Bus cards: operator, class, rating badge, departure/arrival/duration, price, seats-left (turns orange when ≤6), amenities icons (wifi/charging/water/blanket/movie/live-tracking), PRIME tag, free-cancellation tag, seat-availability bar
- **Sort sheet:** smart / cheapest / fastest / earliest departure / top rated
- **Filter sheet:** bus type (5 classes), amenities (6), departure window (5 time slots), arrival window, operator rating (3+/3.5+/4+/4.5+), per-operator checkboxes, available-only & single-seats toggles; active-filter count badge; clear-all
- Cheapest-fare insight banner
- Empty state with "clear filters" recovery action
- Error state with retry

### 💺 Seat selection
- Visual seat map: **seater grid** (44 seats) or **sleeper berths** (18×2 decks)
- Lower/upper deck tabs for sleeper buses
- Seat states: available / booked (disabled) / **ladies-only** (pink) / selected (brand color + check)
- **Ladies-seat policy:** male bookings can't select them; toggling "female passenger" unlocks them (and can't be untoggled while ladies seats are selected)
- Max 6 seats per booking
- Boarding-point sheet (name, time, address, landmark) with auto-advance to dropping-point sheet
- Sticky bottom fare bar: live seat count + total
- Selected-seats summary chips

### 🧾 Passenger details
- One validated form per seat (name ≥3 chars letters-only, age 1–110, gender required)
- Contact details (email format, 10-digit Indian mobile starting 6–9)
- Inline red errors + shake-free submit validation with toast
- **Promo code sheet:** type a code or pick from list — validates minimum amount, scope (first-booking/weekend/sleeper/any)
- Live fare breakdown: seat fare → discount line (removable) → 5% GST → total

### 💳 Payment
- 4 methods: **UPI** (VPA validation + popular suffix chips), **Card** (16-digit formatting, name, MM/YY with expiry check, CVV with show/hide), **Wallet** (balance display), **Net banking** (6 banks)
- Test hook: **any card ending 0000 → simulated bank decline**
- Confirm-payment sheet with amount/method/trip/seats summary
- Full-screen processing state (~2.2s)
- Failure banner with dismiss + retry (state preserved)
- Security note

### 🎫 Ticket
- Success animation + "sent to email/phone" confirmation
- Boarding-pass layout: PNR (generated 3-letter+2-digit), CONFIRMED badge, route with day-crossing times, perforation notches, **generated QR pattern** (deterministic from PNR), boarding/dropping points, operator, seat chips, paid amount + method
- Passenger list
- Fare details
- **Cancel flow:** dialog with tiered refund estimate (80% >24h, 60% 12–24h, 30% <12h, minus ₹30 fee) → CANCELLED state with refund-initiated banner
- Share (simulated toast)

### 🎒 MyTrips
- Three tabs with live counts: **Upcoming / Completed / Cancelled** (auto-classified by travel date vs today)
- Trip cards: date tile, route, departure + operator, PNR + seat count, price, status badge
- Tab-through to ticket
- Per-tab empty states with recovery CTA

### 🏷️ Offers
- Coupon cards with color-coded edge, code chip, title/description, minimum & expiry terms
- **Copy** to clipboard + toast
- **Book now** → home
- 4 seeded offers: FIRST100, WEEKEND20, SLEEPER15, UPFRONT50 — all actually applyable at checkout

### ❓ Help
- Searchable FAQ (8 articles in 3 categories: Booking, Payments, Cancellation, General)
- Accordion animation
- Quick actions: **Chat** (simulated support bot), **Call**, **Email**

### 👤 Account
- **Guest state:** login pitch screen
- **Logged in:** avatar initial, name/phone/email, stats row (trips/wallet/tier), menu (My trips, Notifications, Offers, Help, Settings, Clear local data), profile **edit sheet** with validation
- Login: phone validation → **OTP screen** with 6-box UI, 30s resend timer, demo code display (simulated SMS), wrong-code error handling
- Session persists across refresh; logout

### ⚙️ Settings
- Toggle rows (persisted): push notifications, offers alerts, trip alerts
- Language cycler (6 languages), currency cycler
- App info, version
- Log out

### 🔔 Notifications
- Seeded list: offer / booking / system types with colored icons
- Unread dots, **Mark all read**, tap-through routing (offer→Offers tab, booking→Trips)

### ✨ Global behaviors
- Bottom navigation (5 tabs) with active tint + stroke emphasis
- Android-style back stack (browser back walks correctly)
- Bottom sheets: drag-to-dismiss, overlay fade, body scroll-lock, Escape close
- Toasts (info/success/error) with auto-dismiss + tap-to-dismiss
- Screen-enter transition animation
- Skeleton shimmer loaders everywhere data loads
- Sticky action bars with elevation
- Responsive: phone frame ≥721px, full-bleed mobile, no overflow at 320px

---

## 3. The complete booking workflow (primary user journey)

```
Home
 │  pick FROM, TO, date  (or tap a popular-route chip)
 ▼
Search results ── sort / filter ──► pick a bus
 │
 ▼
Seat selection ── tap seats, pick boarding + dropping points
 │  (sticky bar shows live total)
 ▼
Passenger details ── name/age/gender per seat, contact, promo code
 │  (fare breakdown updates live)
 ▼
Payment ── UPI / Card / Wallet / Net banking
 │         └─ card ending 0000 = simulated decline → retry possible
 ▼
[Processing ~2s]
 │
 ├─ success ──► Ticket screen: PNR, QR, boarding pass → stored in MyTrips
 │               └─ cancel anytime → refund estimate → CANCELLED status
 └─ failure ──► error banner → change method → retry
```

**Secondary journeys:**
- Login journey: Account → Login → phone → OTP → Account (profile editable)
- Manage journey: MyTrips → ticket → cancel / share
- Discovery journey: Home → Offers → copy code → book → apply code at checkout

---

## 4. Information architecture / navigation map

```
                    ┌─────────────┐
                    │  Bottom Nav │
                    └──────┬──────┘
      ┌──────────┬──────────┼──────────┬──────────┐
   Home        MyTrips    Offers     Help     Account
      │           │          │         │          │
      ├─ City     ├─ Ticket  └─ used   ├─ Chat   ├─ Login
      │  sheets   │  detail    in       └─ FAQ   ├─ OTP
      ├─ Calendar └─ cancel    checkout            ├─ Settings
      └─ Search                       └───────────┴─ Notifications
         │
         ├─ Sort sheet
         ├─ Filter sheet
         └─ Bus card ─► Seats ─► Points sheets ─► Passengers ─► Offer sheet
                          │                                        │
                          └───────── booking flow ─────────────────┤
                                                                   ▼
                                                        Payment ─► Confirm sheet
                                                                   │
                                                                   ▼
                                                                Ticket ─► Cancel dialog
```

---

## 5. Design system (tokens)

| Token group | Values |
|---|---|
| **Colors** | Brand red `#D21044` (+dark `#A80C36`), accent orange, amber secondary, success green, danger red, info blue, ladies pink, gold; semantic soft-tint variants of each |
| **Typography** | System font stack (SF Pro/Segoe/Roboto), 6-step scale: display 24 → title 18 → heading 16 → body 14 → label 12 → caption 11 |
| **Spacing** | 4pt grid: xs 4 → sm 8 → md 12 → lg 16 → xl 20 → xxl 24 → xxxl 32 |
| **Radius** | sm 6, md 10, lg 14, xl 20, pill 999 |
| **Shadows** | 3 elevation levels + brand-colored button glow |
| **Component sizes** | appbar 56, bottomnav 62, button 48/40/54, input 48, touch target 44, seat 36 (seater) / 54×30 (sleeper) |
| **Motion** | instant 100ms → fast 160 → normal 240 → slow 380 → sheet 280, 3 easing curves; reduced-motion media query respected |

All of these live in **`src/branding/brand.ts`** (brand palette) and **`src/design/tokens.ts` + `tokens.css`** (everything else) — re-skin the whole app from those files.

---

## 6. Code architecture

```
busgo-app/src/
├── app/                  AppShell.tsx (phone frame + scroll + transitions), main.tsx (routes)
├── branding/brand.ts     ⭐ APP_NAME + all brand colors + copy → REBRAND HERE
├── components/
│   ├── brand/Logo.tsx    neutral geometric logo (replaceable)
│   ├── icons/Icon.tsx    60+ hand-drawn inline SVG icons (zero external assets)
│   ├── ui/               AppBar, Button(5 variants), TextField, Sheet, Dialog,
│   │                     Toaster, BottomNav, StateView (Empty/Error/Loaders/Skeletons)
│   └── booking/          BusCard, SeatMap, StepIndicator
├── design/               tokens.ts, tokens.css, global.css
├── mock/                 cities(18), operators(8), deterministic service generator,
│                         offers(4), FAQ(8), notifications(3), popular routes(6)
├── screens/              15 screens — each one .tsx + one .css, nothing else
├── services/api.ts       async mock API: search, filters, seat maps, fares+GST,
│                         promo validation, OTP, payments, bookings CRUD (localStorage),
│                         refund estimates, notifications, settings
├── state/                searchStore, draftStore(booking cart), authStore,
│                         settingsStore, toastStore (all ~20-line stores)
├── types/                shared TypeScript domain types
└── utils/                datetime (formatting, calendar, 12h times), validators (all forms)
```

**Key decisions:**
- **Deterministic PRNG** — search results/seat maps derive from a seeded hash of `route+date`, so the same search always shows the same buses (feels like a real inventory, no flicker)
- **Latency simulation** — every API call sleeps realistically (0.2–1.4s) so loading skeletons are genuinely exercised
- **localStorage persistence** — bookings, login session, settings, notification states survive refresh
- **No dead UI** — every visible button performs a real action (worst case a clearly-labeled simulated one)

---

## 7. Mock data reference

- **Cities:** 18 Indian cities (7 flagged popular), searchable by name or state
- **Operators:** 8 fictional operators with ratings/cancellation histories
- **Buses:** generated per route+date — 8–13 services, 5 classes, times, amenities, boarding/dropping points, prices from distance-based formula
- **Offers:** FIRST100 (first booking ≥₹500), WEEKEND20 (20% ≤₹250, Fri–Sun), SLEEPER15 (15% ≤₹300, sleepers), UPFRONT50 (flat ₹50 ≥₹400)

**Test hooks:** card ending `0000` → payment decline; OTP code shown on screen.

---

## 8. What is simulated (honest limits)

| Real apps have | This prototype has |
|---|---|
| Real SMS OTP | Code displayed on screen |
| Payment gateway | Simulated success/failure with processing delay |
| Server database | Browser localStorage |
| Live bus inventory | Deterministic generated inventory |
| Real operators/logos | Fictional names, neutral logo |

Swapping to real: replace the functions in `services/api.ts` with HTTP calls — screens don't change.
