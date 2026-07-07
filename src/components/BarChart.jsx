import { formatCompact } from '../lib/format'

// Minimal horizontal bar chart — no chart library, just flex + gradient bars.
export default function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="w-32 shrink-0 truncate text-sm text-zinc-400" title={d.label}>
            {d.label}
          </div>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-500 to-fuchsia-400"
              style={{
                width: `${(d.value / max) * 100}%`,
                animation: `grow-bar 500ms var(--ease-out) ${i * 60}ms both`,
              }}
            />
          </div>
          <div className="w-16 shrink-0 text-right text-sm font-medium tabular-nums text-zinc-300">
            {formatCompact(d.value)}
          </div>
        </div>
      ))}
      <style>{`@keyframes grow-bar { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }`}</style>
    </div>
  )
}
