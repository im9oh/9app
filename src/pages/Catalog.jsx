import { useMemo, useState } from 'react'
import { Disc3, Plus, Pencil, Trash2, Play } from 'lucide-react'
import { Card, PageHeader, Badge, EmptyState, Modal, Field } from '../components/ui'
import { formatNumber, formatCompact, formatDate, todayISO, uid } from '../lib/format'

const TYPES = ['Single', 'EP', 'Album', 'Mixtape', 'Beat Pack']
const COLORS = ['#8b5cf6', '#e879f9', '#38bdf8', '#f59e0b', '#34d399', '#f472b6']

const blank = () => ({
  title: '',
  type: 'Single',
  releaseDate: todayISO(),
  streams: 0,
  cover: COLORS[0],
})

export default function Catalog({ store }) {
  const { items, add, update, remove } = store
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())

  const total = useMemo(
    () => items.reduce((sum, r) => sum + (Number(r.streams) || 0), 0),
    [items],
  )
  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.streams || 0) - (a.streams || 0)),
    [items],
  )

  function openAdd() {
    setEditing(null)
    setForm(blank())
    setOpen(true)
  }
  function openEdit(r) {
    setEditing(r.id)
    setForm({ ...r })
    setOpen(true)
  }
  function save(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const record = { ...form, streams: Number(form.streams) || 0 }
    if (editing) update(editing, record)
    else add({ ...record, id: uid() })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Catalog"
        subtitle={`${items.length} releases · ${formatNumber(total)} total streams`}
        action={
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add release
          </button>
        }
      />

      <Card className="mb-6 overflow-hidden p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent-500/25 to-fuchsia-400/10 text-accent-300">
            <Play size={20} />
          </div>
          <div>
            <div className="text-sm text-zinc-400">Total streams across catalog</div>
            <div className="text-3xl font-bold tracking-tight text-white tabular-nums">
              {formatNumber(total)}
            </div>
          </div>
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={Disc3}
          title="No releases yet"
          hint="Add your singles, EPs, and albums to track streams across your whole catalog."
          action={
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Add your first release
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((r) => (
            <Card key={r.id} hover className="group p-4 animate-rise-in">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${r.cover}, ${r.cover}99)`,
                  }}
                >
                  <Disc3 size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-white">{r.title}</h3>
                    <Badge tone="neutral">{r.type}</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    Released {formatDate(r.releaseDate)}
                  </div>
                  <div className="mt-2 text-lg font-bold tabular-nums text-accent-300">
                    {formatCompact(r.streams)}
                    <span className="ml-1 text-xs font-normal text-zinc-500">
                      streams
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    className="btn p-1.5 text-zinc-400 hover:bg-white/8 hover:text-white"
                    onClick={() => openEdit(r)}
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="btn p-1.5 text-zinc-400 hover:bg-rose-500/15 hover:text-rose-300"
                    onClick={() => remove(r.id)}
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit release' : 'Add release'}
      >
        <form onSubmit={save} className="space-y-4">
          <Field label="Title">
            <input
              className="field"
              value={form.title}
              autoFocus
              placeholder="e.g. Midnight Frequencies"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select
                className="field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-ink-800">
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Release date">
              <input
                type="date"
                className="field"
                value={form.releaseDate}
                onChange={(e) =>
                  setForm({ ...form, releaseDate: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Total streams">
            <input
              type="number"
              min="0"
              className="field"
              value={form.streams}
              onChange={(e) => setForm({ ...form, streams: e.target.value })}
            />
          </Field>
          <Field label="Cover colour">
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, cover: c })}
                  className="h-8 w-8 rounded-lg transition-transform hover:scale-110"
                  style={{
                    background: c,
                    boxShadow:
                      form.cover === c
                        ? `0 0 0 2px var(--color-ink-800), 0 0 0 4px ${c}`
                        : 'none',
                  }}
                  aria-label={`Colour ${c}`}
                />
              ))}
            </div>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Save changes' : 'Add release'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
