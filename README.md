# Studio Nine 🎛️📱

Your music production HQ — a **mobile-first** app to keep up with your production
career. Built with Expo + React Native, so it runs on iOS, Android, and the web
from one codebase.

Track your catalog and total streams, log income from every source, remember the
things you keep forgetting, and plan your studio/tour/licensing travel — all in one
place.

## Features

- **Dashboard** — total streams, income this month, open reminders, and upcoming
  trips at a glance.
- **Catalog** — your singles, EPs, and albums with per-release streams, auto-summed
  into a catalog-wide total.
- **Income** — log royalties, gigs, beat sales, sync placements, and merch, with
  all-time / this-month totals and a per-source breakdown.
- **Reminders** — a to-do list with due dates and priorities so nothing slips.
- **Travel** — plan sessions, shows, and licensing trips with dates and notes.

## Tech

- Expo SDK 57 + Expo Router (file-based routing, bottom tabs)
- React Native 0.86 (+ React Native Web for the browser target)
- `@react-native-async-storage/async-storage` for local persistence (no backend)
- `lucide-react-native` icons
- Dark "studio" theme via a shared token module (`src/theme.ts`)

Everything used is **Expo Go-compatible** — no custom native build required to
test on a device.

## Getting started

```bash
npm install

# Test on your phone (scan the QR with the Expo Go app):
npx expo start --tunnel     # works from any network; @expo/ngrok is bundled
# or, on the same Wi-Fi as your computer:
npx expo start

# Run in a browser:
npx expo start --web
```

> Note: the `--tunnel` option must be run **on your own machine** — a cloud
> sandbox's egress policy blocks the ngrok connection Expo Go needs.

The app ships with example data on first run so you can see how it works — delete
it and add your own. Data is stored locally on the device.

## Project structure

```
src/
  app/                 # Expo Router routes
    _layout.tsx        # root: providers + stack
    (tabs)/            # bottom-tab screens
      index.tsx        # Dashboard
      catalog.tsx  income.tsx  reminders.tsx  travel.tsx
  components/          # Screen, Card, StatTile, AppModal, fields, …
  lib/                 # store (AsyncStorage), seed data, formatting, types
  theme.ts             # design tokens
```
