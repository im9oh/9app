import { useMemo, useState } from 'react'
import { Plane, Plus, Trash2, Pencil, MapPin, CalendarDays } from 'lucide-react'
import { Card, PageHeader, Badge, EmptyState, Modal, Field } from '../components/ui'
import { formatDate, relativeDay, todayISO, uid } from '../lib/format'

const blank = () => ({
  destination: '',
  purpose: '',
  start: todayISO(),
  end: todayISO(),
  notes: '',
})

function nights(start, end) {
  if (!start || !end) return null
  const n = Math.round(
    (new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000,
  )
  return n >= 0 ? n : null
}

export default function Travel({ store }) {
  const { items, add, update, remove } = store
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.start < b.start ? -1 : 1)),
    [items],
  )

  function openAdd() {
    setEditing(null)
    setForm(blank())
    setOpen(true)
  }
  function openEdit(t) {
    setEditing(t.id)
    setForm({ ...t })
    setOpen(true)
  }
  function save(e) {
    e.preventDefault()
    if (!form.destination.trim()) return
    if (editing) update(editing, form)
    else add({ ...form, id: uid() })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Travel"
        subtitle="Plan sessions, shows, and licensing trips"
        action={
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Plan a trip
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No trips planned"
          hint="Add studio sessions, tour dates, and meetings so you never double-book or forget the gear."
          action={
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Plan your first trip
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((t) => {
            const rel = relativeDay(t.start)
            const n = nights(t.start, t.end)
            return (
              <Card key={t.id} hover className="group p-5 animate-rise-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin size={16} className="text-accent-300" />
                    <h3 className="font-semibold">{t.destination}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {rel ? <Badge tone={rel.tone}>{rel.label}</Badge> : null}
                    <button
                      className="btn p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-white/8 hover:text-white group-hover:opacity-100"
                      onClick={() => openEdit(t)}
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn p-1.5 text-zinc-500 opacity-0 transition-opacity hover:bg-rose-500/15 hover:text-rose-300 group-hover:opacity-100"
                      onClick={() => remove(t.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {t.purpose ? (
                  <div className="mt-1 text-sm text-accent-200/80">{t.purpose}</div>
                ) : null}
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                  <CalendarDays size={14} />
                  {formatDate(t.start)} → {formatDate(t.end)}
                  {n != null ? (
                    <span className="text-zinc-600">
                      · {n} night{n === 1 ? '' : 's'}
                    </span>
                  ) : null}
                </div>
                {t.notes ? (
                  <p className="mt-3 rounded-lg bg-white/4 px-3 py-2 text-sm text-zinc-400">
                    {t.notes}
                  </p>
                ) : null}
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit trip' : 'Plan a trip'}
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Destination">
            <input
              className="field"
              autoFocus
              placeholder="e.g. Berlin, DE"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
          </Field>
          <Field label="Purpose">
            <input
              className="field"
              placeholder="e.g. Studio session, show, sync meeting"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input
                type="date"
                className="field"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
            </Field>
            <Field label="End">
              <input
                type="date"
                className="field"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea
              className="field min-h-20 resize-y"
              placeholder="Flights, gear to bring, who you're meeting…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
              {editing ? 'Save changes' : 'Add trip'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
