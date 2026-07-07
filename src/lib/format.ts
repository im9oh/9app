// Small formatting helpers, shared across screens.

export function uid(): string {
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Number(n) || 0)
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(n) || 0)
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0)
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date((iso || todayISO()) + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export type Rel = { label: string; tone: 'soon' | 'past' | 'future' }

export function relativeDay(iso: string): Rel | null {
  if (!iso) return null
  const target = new Date(iso + 'T00:00:00')
  if (isNaN(target.getTime())) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((target.getTime() - now.getTime()) / 86400000)
  if (days === 0) return { label: 'Today', tone: 'soon' }
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' }
  if (days === -1) return { label: 'Yesterday', tone: 'past' }
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'past' }
  if (days <= 7) return { label: `In ${days}d`, tone: 'soon' }
  return { label: formatDate(iso), tone: 'future' }
}
