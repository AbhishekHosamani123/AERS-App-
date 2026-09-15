# APK Analysis Report — Phase 1 Findings

**APK analyzed:** `uptodown-in.redbus.android.apk` (15.5 MB)
**Analysis method:** unzip + androguard manifest/resource/DEX parsing (read-only; the original file was never modified)
**Analysis artifacts:** `apk-analysis/` (a copy + extracted contents + scripts)

---

## 1. Critical Finding

**The provided APK is NOT the RedBus application.** It is the **Uptodown App Store** client:

| Property | Value |
|---|---|
| Package | `com.uptodown` |
| App label | `Uptodown App Store` |
| Version | 7.39 (code 739) |
| Main activity | `com.uptodown.activities.MainActivity` |
| Min SDK / Target | 23 / 36 |

The filename (`uptodown-in.redbus.android.apk`) reflects how Uptodown distributes downloads: it names the file after the target app, but the payload served is Uptodown's own installer/store client. When sideloading, that client then fetches the real target app at runtime from Uptodown servers — which requires their backend and is not embedded in this file.

### Evidence
- Manifest declares **64 activities**, all in `com.uptodown.*` — e.g. `MyDownloads`, `MyApps`, `Updates`, `AppDetailActivity`, `RollbackActivity`, `OldVersionsActivity`, `VirusTotalReport`, `PreregistrationActivity`, `WishlistActivity` — an app-store feature set, with **zero bus/travel screens**.
- Services/receivers are store infrastructure (`SplitApksEventsService`, `DownloadNotificationReceiver`, `MyAppUpdatedReceiver`, `BootDeviceReceiver`).
- Permissions are store permissions: `REQUEST_INSTALL_PACKAGES`, `DELETE_PACKAGES`, `QUERY_ALL_PACKAGES`, `MANAGE_EXTERNAL_STORAGE`.
- No nested APK/XAPK payload exists inside (checked assets, lib, all directories).
- Binary keyword sweep of all 4 DEX files found only incidental matches (`operator` = Kotlin language keyword; `pnr`/`booking` appear as generic identifier fragments in ad/analytics SDKs — no bus-booking domain model).
- Resources are R8/resource-shrunk (obfuscated names like `res/-B.png`, `res/09.xml`), so even Uptodown's own layouts are not directly nameable — irrelevant to our goal anyway.
- Largest images are ~8 KB icons; nothing travel-related.

## 2. What This Means for the Rebuild

Per the project instructions — *"If APK inspection is limited… do NOT stop… reproduce the behavior using your own implementation rather than stopping"* — the RedBus UI cannot be extracted from this file. Therefore the rebuild reconstructs the **well-known, publicly observable interaction model of the RedBus-style bus-booking app** (the same UX pattern family used by every major bus OTA):

1. Home → search widget (From/To with swap, date picker), offers carousel, popular routes
2. Search results → bus cards (operator, depart/arrive, duration, price, seats left, rating), sort + filters, loading skeletons, empty state
3. Seat selection → lower/upper deck seater & sleeper maps, ladies seats, boarding & dropping point selection, sticky fare bar
4. Passenger details → per-seat passenger forms with validation, contact details, promo code, fare breakdown
5. Payment → UPI / card / wallet with simulated processing, success and failure paths
6. Ticket confirmation → PNR, ticket details, cancel flow with refund estimate
7. MyTrips (upcoming/completed), Offers, Help (FAQ), Account (login via phone+OTP, profile edit, settings, notifications)
8. Bottom navigation (Home / MyTrips / Offers / Help / Account), back-stack behavior, toasts, bottom sheets

## 3. Recoverable vs Not Recoverable

| Item | Status |
|---|---|
| Original RedBus screens, layouts, resources | **Not recoverable** — not present in this APK |
| RedBus navigation graph, intents, activities | **Not recoverable** |
| Exact RedBus pixel spacing/typography/radius | **Not recoverable** — reconstructed from standard Android Material Design 3 conventions for OTA apps |
| RedBus proprietary branding/logos/API keys | Intentionally excluded (also required by the brief) |
| Bus-booking interaction patterns listed above | Reconstructed from public, observable, industry-standard UX |

## 4. Analysis Inventory of What the APK Actually Contains (for transparency)

- Uptodown store UI: app detail, screenshots gallery, comments/reviews, old versions, rollback, wishlist, following, preregistration, TV variants
- Account system: login, profile edit, password recovery, user devices, stats
- Downloads manager, installer, XAPK/split-APK handling, virus-scan report viewer
- Preferences: language, mobile-data usage, privacy (GDPR/CMP), security, notifications registry
- Ad/consent SDKs (InMobi CMP TCF vendor lists), Firebase, Play Services auth

None of these contribute to a bus-booking UX reference, and the store's own UI is a delivery client, not the product requested.

## 5. Rebuild Platform Decision

The original is Android, but this environment has no Android SDK/Gradle/emulator, and Phase 7 requires *actually running and testing* the app. The rebuild is therefore built as a **mobile-first web application (Vite + React + TypeScript)** that can be:

- run and fully exercised in a browser (phone-frame on desktop, full-bleed on mobile viewports),
- wrapped later with Capacitor/Bubblewrap into an installable Android app with no UI rewrites.

All architecture, state, mock services, and design tokens are platform-portable concepts.
