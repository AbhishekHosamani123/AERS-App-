# How to Open & Test the BusGo App — Beginner's Guide

*You've never built an app before? This guide is for you. Follow it top to bottom.*

---

## The one thing to understand first

This app is a **web app that looks and behaves like an Android app**. It runs in a browser. That's normal and it's actually the easiest way to build your first app — and later the exact same code can be packaged into a real installable Android app (I explain how at the bottom).

When you open it on a **laptop**, it appears inside a phone-shaped frame (that's on purpose — it previews the mobile experience).
When you open it on a **real phone**, it fills the whole screen and feels exactly like a normal app.

---

## Opening the app right now (30 seconds)

The app is **already running** on your computer at this address:

### 👉 http://localhost:5173

Just click that link (or copy-paste it into Chrome/Edge/Firefox). That's it — the app is open.

You'll see the **Home screen** with the BusGo logo, the From/To search box, offers, and 5 tabs at the bottom (Home, MyTrips, Offers, Help, Account) — exactly like a bus-booking app.

---

## Starting the app yourself (if it's not running)

If you restart your computer or close the terminal, the app stops. To start it again:

1. Open a terminal (press **Windows key**, type `cmd` or "Git Bash", press Enter)
2. Type these two lines, pressing Enter after each:

```bash
cd "D:\ASV\Red Bus\busgo-app"
npm run dev
```

3. You'll see something like `Local: http://localhost:5173/` appear.
4. Hold **Ctrl** and click that link, or open your browser and type `http://localhost:5173`.
5. To stop the app later, click inside that terminal and press **Ctrl + C**.

> 💡 `localhost` means "this computer" — the app is running on YOUR machine. Nobody else can see it. It's your private testing copy.

---

## Testing it on your real phone (best experience)

Your phone and computer just need to be on the **same Wi-Fi**:

1. Find your computer's Wi-Fi IP address: in the terminal, run `ipconfig` and look for **IPv4 Address** (e.g. `192.168.1.5`)
2. Start the app with network access:

```bash
cd "D:\ASV\Red Bus\busgo-app"
npm run dev -- --host
```

3. It will print a **Network** URL like `http://192.168.1.5:5173`
4. On your phone's browser, open that address. Bookmark it or "Add to Home screen" — now it opens like an app, full-screen.

---

## The complete testing walkthrough — test like a user

Open http://localhost:5173 and follow this exactly. This exercises **every feature**:

### 1. Home screen
- ✅ Tap **FROM** → a bottom sheet slides up with cities → type "chen" in the search box → tap **Chennai**
- ✅ Tap **TO** → pick **Bengaluru**
- ✅ Tap the **swap button** (⇄ between the two fields) — cities swap places
- ✅ Tap the **date row** (says "Tomorrow") → a calendar sheet opens → try **Today / Tomorrow** quick buttons, tap arrows to change month, tap any future date
- ✅ Watch the **offer banner** change every 4 seconds; tap the dots below it to jump between offers
- ✅ Tap any **popular route chip** (e.g. "Mumbai Goa") → jumps straight to search results

### 2. Search results
- ✅ Notice the **loading skeletons** (grey shimmering cards) while it "searches" — that's realistic network simulation
- ✅ Tap **"Smart sort"** → try **"Cheapest first"** — cards reorder by price
- ✅ Tap **Filters** → tick *AC Sleeper* + *wifi* → **Apply** → list narrows (or shows the friendly **"No buses match"** empty state with a **Clear all filters** button — try it)
- ✅ Note the blue banner "Cheapest fare on this date: ₹XXX"
- ✅ Tap any **bus card** → you're taken to seat selection

### 3. Seat selection (the coolest screen)
- ✅ See the **seat map** — grey = booked, white = available, **pink = ladies only**, green(after tap) = selected
- ✅ **Try tapping a pink seat** — you get an error toast "reserved for female passengers"
- ✅ Scroll down, tick **"Booking for a female passenger?"** → pink seats become selectable
- ✅ Tap **2–3 seats** → the sticky bar at the bottom updates seat count + total price
- ✅ Tap **Boarding** → pick a point; the **Dropping** sheet auto-opens → pick one
- ✅ If the bus is a sleeper, tabs for **Lower deck / Upper deck** appear — switch between them
- ✅ Tap **Continue**

### 4. Passenger details
- ✅ First, tap **Continue to payment** with empty fields → red validation errors appear under each field
- ✅ Fill name, age, tap a **gender** button, enter email + mobile for each passenger
- ✅ Tap **"Apply an offer code"** → type `UPFRONT50` → **Apply** → watch the fare summary drop by ₹50 and GST recalculate
- ✅ Tap the **remove** link next to the discount → it's removed
- ✅ Tap **Continue to payment**

### 5. Payment (test BOTH outcomes!)
**Success path:**
- ✅ Choose **Wallet** → tap **Pay ₹XXX** → a confirmation sheet shows the breakdown → tap **Pay** again
- ✅ A "Processing payment" spinner appears (~2 sec) → then the **ticket screen** with your PNR!

**Failure path (intentional test feature):**
- ✅ Go back (browser back button), book again, choose **Card**
- ✅ Enter card number `1234 5678 9012 0000` (any card **ending in 0000** = simulated failure), any name, expiry `12/28`, CVV `123`
- ✅ Pay → see the red **"Payment failed — declined by bank"** banner → switch to Wallet → pay again → succeeds

### 6. Your ticket
- ✅ See the **boarding-pass design**: PNR code, route with times, perforation notches, QR code, seats, fare
- ✅ Tap **Cancel ticket** → dialog shows the **refund estimate** (80% / 60% / 30% depending on departure time) → confirm → ticket flips to **CANCELLED** state with refund banner
- ✅ Tap the **share icon** (top right) → simulated share toast

### 7. MyTrips tab
- ✅ **Upcoming** tab shows your confirmed bookings as cards
- ✅ **Cancelled** tab shows the cancelled one with red badge
- ✅ Tap any card → reopens that ticket

### 8. Login (simulated)
- ✅ Go to **Account** tab → "Login to continue" → tap the login button
- ✅ Type an invalid number like `123` → see the error → type a real 10-digit number like `9845012345`
- ✅ Tap **Send OTP** → the next screen shows a **demo code** (since there's no real SMS in a prototype) — type those 6 digits → **Verify** → you're logged in
- ✅ Back on Account: tap the **pencil icon** → edit your name/email → **Save**
- ✅ Try **Settings** → toggle switches (they persist even after refresh), tap **Log out**

### 9. Everything else
- ✅ **Offers** tab → coupon cards → **Copy** (code copied to clipboard) → **Book now**
- ✅ **Help** tab → type in the FAQ search box, tap questions to expand answers, try **Chat with us**
- ✅ **Bell icon** on Home → notifications → **Mark all read**

### 10. Back-button behavior (Android-style)
At any point, press your **browser's back button** — you'll walk backwards through the flow exactly like an Android app's back gesture.

---

## Making it a real Android app (later, when you're ready)

The app is already mobile-ready. To package it as an installable APK:

1. Build the production version:

```bash
cd "D:\ASV\Red Bus\busgo-app"
npm run build
```

2. Install Capacitor (the tool that wraps web apps into native Android apps):

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init BusGo com.yourname.busgo --web-dir=dist
npx cap add android
npx cap sync
```

3. That creates a real Android Studio project in `busgo-app/android/`
4. Install **Android Studio** (free, from android.com), open that folder, press the **▶ Run** button — the app installs to your phone via USB.

No code changes needed — the UI is already touch-sized and phone-shaped.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `localhost:5173` won't open | The dev server isn't running — follow "Starting the app yourself" above |
| `npm run dev` says "command not found" | Install Node.js from nodejs.org (LTS version), restart terminal, retry |
| Page is blank/white | Hard-refresh with **Ctrl+Shift+R** |
| Want to reset all test data | Account tab → **Clear local data** (bookings/login are stored in your browser) |
| App looks zoomed out on phone | Make sure you opened the **Network** URL, not localhost, on your phone |
