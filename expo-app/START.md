# 🚀 AERS Expo App — Expo Go Setup Guide

Your Expo wrapper is ready! This wraps your existing React web app in a WebView so you can open it with **Expo Go** on your phone.

---

## 📱 Step 1: Install Expo Go on Your Phone

- **Android**: [Get it on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [Get it on the App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🌐 Step 2: Start Your Web App (Vite Dev Server)

The Expo app loads your web app via WebView, so **your Vite dev server must be running first**.

```bash
cd "D:/ASV/RedBus Clone"
npm run dev
```

Make sure it starts on `http://localhost:5173` (or note the actual port).

**Important for phone access**: Your phone and laptop must be on the **same Wi-Fi network**. The `config.ts` file is set to use your machine's local IP — Expo will detect this automatically.

---

## 🔥 Step 3: Start the Expo Dev Server

Open a **new terminal** (keep Vite running in the first one):

```bash
cd "D:/ASV/RedBus Clone/expo-app"
npm start
```

This will:
- Bundle your Expo app
- Show a **QR code** in the terminal
- Open a dev tools page in your browser (Metro bundler)

---

## 📲 Step 4: Scan the QR Code with Expo Go

### Android:
1. Open **Expo Go** app
2. Tap **"Scan QR code"**
3. Point your camera at the QR code in the terminal
4. The app will load and open your web app inside the WebView

### iOS:
1. Open the **Camera** app (not Expo Go)
2. Point it at the QR code
3. Tap the notification that appears
4. It will open in Expo Go

---

## ✅ What You'll See

- A native Android/iOS app shell with:
  - **Status bar** styled for your AERS branding
  - **Back button** (appears when navigating inside the WebView)
  - **WebView** loading your full React web app from `localhost:5173`
  - **Loading spinner** while the page loads
  - **Error screen** if the dev server isn't reachable
  - **Help overlay** (press back button on error screen to see connection tips)

---

## 🔧 Configuration Files

### `expo-app/config.ts`
Controls which URL the WebView loads:

```typescript
export const WEB_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:5173'  // Dev server — auto-detected by Expo
  : 'https://aers.in';             // Production fallback
```

**For Expo Go development**, it will use your local dev server.

**For production builds** (standalone APK/IPA), it will use `https://aers.in`.

### `expo-app/app.json`
Expo project configuration — app name, bundle IDs, splash screen, icons.

---

## 🛠️ Troubleshooting

### "Unable to connect" or blank screen?

1. **Check your web app is running**: Open `http://localhost:5173` in your laptop's browser
2. **Same Wi-Fi network**: Phone and laptop must be on the same network
3. **Firewall**: Windows Firewall might block Metro bundler — allow Node.js through it
4. **Check the URL**: The WebView inspector in the error screen shows what URL it tried to load

### Need to change the dev server port?

If your Vite server runs on a different port:

1. Edit `expo-app/config.ts`
2. Change the port number in `WEB_URL`
3. Restart `npm start` in the expo-app folder

### Want to test the production URL instead of localhost?

```bash
cd "D:/ASV/RedBus Clone/expo-app"
# Temporarily force production mode:
NODE_ENV=production npm start
```

This will load `https://aers.in` instead of your local dev server.

---

## 📦 Next Steps

### Add native features (optional):
- **Push notifications**: `expo-notifications`
- **Camera access**: `expo-camera`
- **Native navigation**: Replace WebView with React Navigation for better UX

### Build standalone apps:

When ready to distribute outside Expo Go:

```bash
# Android APK
eas build --platform android --profile preview

# iOS IPA (requires Apple Developer account)
eas build --platform ios --profile preview
```

See [Expo EAS Build docs](https://docs.expo.dev/build/introduction/).

---

## 🎯 Quick Reference

| Action | Command |
|--------|----------|
| Start web app (Vite) | `npm run dev` (in main folder) |
| Start Expo dev server | `npm start` (in expo-app folder) |
| Type-check the Expo app | `npx tsc --noEmit` (in expo-app) |
| Clear Metro cache | `npx expo start -c` |

---

You're all set! 🎉

Run `npm start` in the `expo-app` folder, scan the QR code, and your AERS app will open in Expo Go.
