// Studio Nine design tokens — dark studio aesthetic, shared across all screens.

export const colors = {
  ink950: '#08080d',
  ink900: '#0b0b12',
  ink850: '#101019',
  ink800: '#16161f',
  ink700: '#20202c',

  surface: 'rgba(255,255,255,0.04)',
  surfaceStrong: 'rgba(255,255,255,0.065)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(167,139,250,0.35)',

  accent300: '#c4b5fd',
  accent400: '#a78bfa',
  accent500: '#8b5cf6',
  accent600: '#7c3aed',
  fuchsia400: '#e879f9',

  emerald: '#34d399',
  amber: '#fbbf24',
  sky: '#38bdf8',
  rose: '#fb7185',

  text: '#e4e4e7', // zinc-200
  textDim: '#a1a1aa', // zinc-400
  textFaint: '#71717a', // zinc-500
  textGhost: '#52525b', // zinc-600
  white: '#ffffff',
} as const

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
}

export const space = (n: number) => n * 4

// Category → colour, used for badges and accents.
export const sourceColor: Record<string, string> = {
  Streaming: colors.accent400,
  Gig: colors.amber,
  Beats: colors.sky,
  Sync: colors.rose,
  Merch: colors.emerald,
  Other: colors.textFaint,
}

export const priorityColor: Record<string, string> = {
  high: colors.rose,
  medium: colors.amber,
  low: colors.sky,
}
