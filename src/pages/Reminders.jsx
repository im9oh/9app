import { useMemo, useState } from 'react'
import { ListChecks, Plus, Trash2, Check } from 'lucide-react'
import { PageHeader, Card, Badge, EmptyState, Modal, Field } from '../components/ui'
import { relativeDay, todayISO, uid } from '../lib/format'

const PRIORITIES = ['high', 'medium', 'low']
const blank = () => ({ text: '', due: todayISO(), priority: 'medium' })

export default function Reminders({ store }) {
  const { items, add, update, remove } = store
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())

  const { active, done } = useMemo(() => {
    const rank = { high: 0, medium: 1, low: 2 }
    const sortFn = (a, b) => {
      if ((a.due || '') !== (b.due || '')) return (a.due || '') < (b.due || '') ? -1 : 1
      return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3)
    }
    return {
      active: items.filter((r) => !r.done).sort(sortFn),
      done: items.filter((r) => r.done).sort(sortFn),
    }
  }, [items])

  function save(e) {
    e.preventDefault()
    if (!form.text.trim()) return
    add({ ...form, id: uid(), done: false })
    setOpen(false)
    setForm(blank())
  }

  const Row = ({ r }) => {
    const rel = relativeDay(r.due)
    return (
      <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/3">
        <button
          onClick={() => update(r.id, { done: !r.done })}
          className={`btn grid h-6 w-6 shrink-0 place-items-center rounded-md border p-0 ${
            r.done
              ? 'border-accent-500 bg-accent-500 text-white'
              : 'border-white/20 text-transparent hover:border-accent-400'
          }`}
          aria-label={r.done ? 'Mark not done' : 'Mark done'}
        >
          <Check size={14} strokeWidth={3} />
        </button>
        <div className="min-w-0 flex-1">
          <div
            className={`truncate text-sm ${
              r.done ? 'text-zinc-500 line-through' : 'text-zinc-200'
            }`}
          >
            {r.text}
          </div>
        </div>
        {!r.done && <Badge tone={r.priority}>{r.priority}</Badge>}
        {rel && !r.done ? <Badge tone={rel.tone}>{rel.label}</Badge> : null}
        <button
          className="btn shrink-0 p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-rose-500/15 hover:text-rose-300 group-hover:opacity-100"
          onClick={() => remove(r.id)}
          aria-label="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Reminders"
        subtitle={`${active.length} to do · ${done.length} done`}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add reminder
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing to remember yet"
          hint="Add the things you keep forgetting — masters to send, playlists to pitch, subscriptions to renew."
          action={
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Plus size={16} /> Add your first reminder
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          <Card className="divide-y divide-white/6 overflow-hidden animate-rise-in">
            {active.length ? (
              active.map((r) => <Row key={r.id} r={r} />)
            ) : (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">
                All caught up — nice. 🎧
              </div>
            )}
          </Card>

          {done.length > 0 && (
            <div>
              <div className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
                Completed
              </div>
              <Card className="divide-y divide-white/6 overflow-hidden opacity-70">
                {done.map((r) => (
                  <Row key={r.id} r={r} />
                ))}
              </Card>
            </div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add reminder">
        <form onSubmit={save} className="space-y-4">
          <Field label="What do you need to remember?">
            <input
              className="field"
              autoFocus
              placeholder="e.g. Send Afterglow master to engineer"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date">
              <input
                type="date"
                className="field"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
              />
            </Field>
            <Field label="Priority">
              <select
                className="field"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="bg-ink-800">
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add reminder
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
