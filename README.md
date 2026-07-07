# Studio Nine 🎛️

Your music production HQ — a personal app to keep up with your production career.

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

- React 18 + Vite 6
- Tailwind CSS v4
- lucide-react icons
- Data persists to the browser's `localStorage` (no accounts, no backend)
- Motion tuned to a high craft bar (ease-out curves, sub-300ms UI, respects
  `prefers-reduced-motion`)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The app ships with example data on first run so you can see how it works — delete
it and add your own. Everything is stored locally in your browser.
