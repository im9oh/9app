import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Card({ className = '', children, hover = false, ...props }) {
  return (
    <div
      className={`surface rounded-2xl ${hover ? 'surface-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatTile({ icon: Icon, label, value, sub, accent = 'accent' }) {
  const ring =
    accent === 'accent'
      ? 'from-accent-500/25 to-fuchsia-400/10 text-accent-300'
      : 'from-emerald-500/25 to-teal-400/10 text-emerald-300'
  return (
    <Card hover className="p-5 animate-rise-in">
      <div className="flex items-start justify-between">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${ring}`}
        >
          <Icon size={18} strokeWidth={2.2} />
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight text-white tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-sm text-zinc-400">{label}</div>
      {sub ? <div className="mt-2 text-xs text-zinc-500">{sub}</div> : null}
    </Card>
  )
}

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-white/6 text-zinc-300 border-white/10',
    accent: 'bg-accent-500/15 text-accent-300 border-accent-500/25',
    soon: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
    past: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    future: 'bg-white/6 text-zinc-400 border-white/10',
    high: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    medium: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
    low: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center animate-fade-in">
      {Icon ? (
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-zinc-500">
          <Icon size={22} />
        </div>
      ) : null}
      <p className="font-medium text-zinc-300">{title}</p>
      {hint ? <p className="mt-1 max-w-sm text-sm text-zinc-500">{hint}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

// Lightweight modal. Enters with pop-in (scale 0.96 -> 1), backdrop fades.
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="surface animate-pop-in relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="btn -mr-2 rounded-lg p-1.5 text-zinc-400 hover:bg-white/8 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  )
}
