import type { IncomeEntry, Reminder, Release, Trip } from './types'
import { addDaysISO, todayISO } from './format'

// First-run example data so the app feels alive. Dates are anchored to "today"
// so the demo always looks current regardless of when it's opened.
const t = todayISO()

export const seedReleases: Release[] = [
  { id: 'r1', title: 'Midnight Frequencies', type: 'Single', releaseDate: addDaysISO(t, -235), streams: 482300, cover: '#8b5cf6' },
  { id: 'r2', title: 'Neon Tape — EP', type: 'EP', releaseDate: addDaysISO(t, -339), streams: 1240500, cover: '#e879f9' },
  { id: 'r3', title: 'Afterglow', type: 'Single', releaseDate: addDaysISO(t, -109), streams: 96700, cover: '#38bdf8' },
  { id: 'r4', title: 'Basement Sessions Vol. 1', type: 'Album', releaseDate: addDaysISO(t, -579), streams: 2038900, cover: '#f59e0b' },
]

export const seedIncome: IncomeEntry[] = [
  { id: 'i0', date: addDaysISO(t, -4), source: 'Streaming', amount: 2130, note: 'DistroKid payout — last month' },
  { id: 'i0b', date: addDaysISO(t, -5), source: 'Beats', amount: 220, note: 'BeatStars — lease pack' },
  { id: 'i1', date: addDaysISO(t, -9), source: 'Gig', amount: 900, note: 'Warehouse show — support slot' },
  { id: 'i2', date: addDaysISO(t, -22), source: 'Beats', amount: 350, note: 'BeatStars — 2 exclusive licenses' },
  { id: 'i3', date: addDaysISO(t, -38), source: 'Sync', amount: 2500, note: 'Afterglow — indie film placement' },
]

export const seedReminders: Reminder[] = [
  { id: 't1', text: 'Send Afterglow master to mastering engineer', due: addDaysISO(t, 2), priority: 'high', done: false },
  { id: 't2', text: 'Pitch Neon Tape to 5 editorial playlists', due: addDaysISO(t, 5), priority: 'medium', done: false },
  { id: 't3', text: 'Renew DistroKid subscription', due: addDaysISO(t, 13), priority: 'low', done: false },
  { id: 't4', text: 'Back up project files to external drive', due: addDaysISO(t, -2), priority: 'medium', done: true },
]

export const seedTrips: Trip[] = [
  { id: 'v1', destination: 'Berlin, DE', purpose: 'Studio session w/ Kaspar', start: addDaysISO(t, 11), end: addDaysISO(t, 17), notes: 'Flight TXL 8:40am. Bring the MPC + hard drive.' },
  { id: 'v2', destination: 'Los Angeles, US', purpose: 'Sync licensing meetings', start: addDaysISO(t, 35), end: addDaysISO(t, 39), notes: 'Meet with 2 music supervisors. Book AirBnB near Silver Lake.' },
]
