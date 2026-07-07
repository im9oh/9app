// Small, single-purpose formatting helpers.

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(Number(n) || 0)
}

// Compact form for big counts: 1.2M, 34.5K
export function formatCompact(n) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(n) || 0)
}

export function formatMoney(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0)
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// Human relative label for a due/target date.
export function relativeDay(iso) {
  if (!iso) return null
  const target = new Date(iso + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((target - now) / 86400000)
  if (days === 0) return { label: 'Today', tone: 'soon' }
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' }
  if (days === -1) return { label: 'Yesterday', tone: 'past' }
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'past' }
  if (days <= 7) return { label: `In ${days}d`, tone: 'soon' }
  return { label: formatDate(iso), tone: 'future' }
}
