import { useMemo, useState } from 'react'
import { Wallet, Plus, Trash2, TrendingUp } from 'lucide-react'
import { Card, PageHeader, Badge, EmptyState, Modal, Field } from '../components/ui'
import { formatMoney, formatDate, todayISO, uid } from '../lib/format'

const SOURCES = ['Streaming', 'Gig', 'Beats', 'Sync', 'Merch', 'Other']
const SOURCE_TONE = {
  Streaming: 'accent',
  Gig: 'soon',
  Beats: 'low',
  Sync: 'high',
  Merch: 'medium',
  Other: 'neutral',
}

const blank = () => ({
  date: todayISO(),
  source: 'Streaming',
  amount: '',
  note: '',
})

export default function Income({ store }) {
  const { items, add, remove } = store
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())

  const total = useMemo(
    () => items.reduce((s, i) => s + (Number(i.amount) || 0), 0),
    [items],
  )

  const byMonth = useMemo(() => {
    const key = todayISO().slice(0, 7)
    return items
      .filter((i) => (i.date || '').slice(0, 7) === key)
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)
  }, [items])

  const breakdown = useMemo(() => {
    const map = {}
    for (const i of items) {
      map[i.source] = (map[i.source] || 0) + (Number(i.amount) || 0)
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [items])

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [items],
  )

  function save(e) {
    e.preventDefault()
    if (!form.amount) return
    add({ ...form, id: uid(), amount: Number(form.amount) || 0 })
    setOpen(false)
    setForm(blank())
  }

  return (
    <>
      <PageHeader
        title="Income"
        subtitle="Track royalties, gigs, beat sales, and sync placements"
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Log income
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-5 animate-rise-in">
          <div className="text-sm text-zinc-400">All-time</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-white">
            {formatMoney(total)}
          </div>
        </Card>
        <Card className="p-5 animate-rise-in">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <TrendingUp size={14} /> This month
          </div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-emerald-300">
            {formatMoney(byMonth)}
          </div>
        </Card>
        <Card className="p-5 animate-rise-in">
          <div className="text-sm text-zinc-400">Entries</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-white">
            {items.length}
          </div>
        </Card>
      </div>

      {breakdown.length > 0 && (
        <Card className="mb-6 p-5">
          <div className="mb-3 text-sm font-medium text-zinc-300">
            By source
          </div>
          <div className="flex flex-wrap gap-2">
            {breakdown.map(([source, amount]) => (
              <div
                key={source}
                className="flex items-center gap-2 rounded-xl bg-white/4 px-3 py-2"
              >
                <Badge tone={SOURCE_TONE[source]}>{source}</Badge>
                <span className="text-sm font-semibold tabular-nums text-zinc-200">
                  {formatMoney(amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No income logged yet"
          hint="Log every payout — streaming, shows, beats, and sync — to see where your money actually comes from."
          action={
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Plus size={16} /> Log your first payout
            </button>
          }
        />
      ) : (
        <Card className="divide-y divide-white/6 overflow-hidden">
          {sorted.map((i) => (
            <div
              key={i.id}
              className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/3"
            >
              <div className="w-24 shrink-0 text-xs text-zinc-500">
                {formatDate(i.date)}
              </div>
              <Badge tone={SOURCE_TONE[i.source]}>{i.source}</Badge>
              <div className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                {i.note || <span className="text-zinc-600">—</span>}
              </div>
              <div className="shrink-0 text-sm font-semibold tabular-nums text-emerald-300">
                {formatMoney(i.amount)}
              </div>
              <button
                className="btn shrink-0 p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-rose-500/15 hover:text-rose-300 group-hover:opacity-100"
                onClick={() => remove(i.id)}
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Log income">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                className="field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <select
                className="field"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s} className="bg-ink-800">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Amount (USD)">
            <input
              type="number"
              min="0"
              step="0.01"
              className="field"
              autoFocus
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </Field>
          <Field label="Note (optional)">
            <input
              className="field"
              placeholder="e.g. DistroKid payout — May"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add entry
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
