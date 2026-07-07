// First-run example data so the app feels alive. Users can delete it all.

export const seedReleases = [
  {
    id: 'r1',
    title: 'Midnight Frequencies',
    type: 'Single',
    releaseDate: '2025-11-14',
    streams: 482300,
    cover: '#8b5cf6',
  },
  {
    id: 'r2',
    title: 'Neon Tape — EP',
    type: 'EP',
    releaseDate: '2025-08-02',
    streams: 1240500,
    cover: '#e879f9',
  },
  {
    id: 'r3',
    title: 'Afterglow',
    type: 'Single',
    releaseDate: '2026-03-20',
    streams: 96700,
    cover: '#38bdf8',
  },
  {
    id: 'r4',
    title: 'Basement Sessions Vol. 1',
    type: 'Album',
    releaseDate: '2024-12-06',
    streams: 2038900,
    cover: '#f59e0b',
  },
]

export const seedIncome = [
  {
    id: 'i0',
    date: '2026-07-03',
    source: 'Streaming',
    amount: 2130,
    note: 'DistroKid payout — June',
  },
  {
    id: 'i0b',
    date: '2026-07-02',
    source: 'Beats',
    amount: 220,
    note: 'BeatStars — lease pack',
  },
  {
    id: 'i1',
    date: '2026-06-28',
    source: 'Streaming',
    amount: 1840,
    note: 'DistroKid payout — May',
  },
  {
    id: 'i2',
    date: '2026-06-15',
    source: 'Gig',
    amount: 900,
    note: 'Warehouse show — support slot',
  },
  {
    id: 'i3',
    date: '2026-06-10',
    source: 'Beats',
    amount: 350,
    note: 'BeatStars — 2 exclusive licenses',
  },
  {
    id: 'i4',
    date: '2026-05-30',
    source: 'Sync',
    amount: 2500,
    note: 'Afterglow — indie film placement',
  },
]

export const seedReminders = [
  {
    id: 't1',
    text: 'Send Afterglow master to mastering engineer',
    due: '2026-07-09',
    priority: 'high',
    done: false,
  },
  {
    id: 't2',
    text: 'Pitch Neon Tape to 5 editorial playlists',
    due: '2026-07-12',
    priority: 'medium',
    done: false,
  },
  {
    id: 't3',
    text: 'Renew DistroKid subscription',
    due: '2026-07-20',
    priority: 'low',
    done: false,
  },
  {
    id: 't4',
    text: 'Back up project files to external drive',
    due: '2026-07-05',
    priority: 'medium',
    done: true,
  },
]

export const seedTrips = [
  {
    id: 'v1',
    destination: 'Berlin, DE',
    purpose: 'Studio session w/ Kaspar',
    start: '2026-07-18',
    end: '2026-07-24',
    notes: 'Flight TXL 8:40am. Bring the MPC + hard drive.',
  },
  {
    id: 'v2',
    destination: 'Los Angeles, US',
    purpose: 'Sync licensing meetings',
    start: '2026-08-11',
    end: '2026-08-15',
    notes: 'Meet with 2 music supervisors. Book AirBnB near Silver Lake.',
  },
]
