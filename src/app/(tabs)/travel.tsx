import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Plane, Plus, Trash2, Pencil, MapPin, CalendarDays } from 'lucide-react-native'
import {
  Screen,
  Card,
  Badge,
  EmptyState,
  PrimaryButton,
  GhostButton,
  IconButton,
  AppModal,
  TextField,
} from '@/components/ui'
import { DateField } from '@/components/DateField'
import { useStore } from '@/lib/store'
import { colors, space } from '@/theme'
import { formatDate, relativeDay, todayISO, uid } from '@/lib/format'
import type { Trip } from '@/lib/types'

const toneColor = { soon: colors.amber, past: colors.rose, future: colors.textFaint }

function nights(start: string, end: string): number | null {
  if (!start || !end) return null
  const n = Math.round(
    (new Date(end + 'T00:00:00').getTime() - new Date(start + 'T00:00:00').getTime()) / 86400000,
  )
  return n >= 0 ? n : null
}

const blank = (): Omit<Trip, 'id'> => ({
  destination: '',
  purpose: '',
  start: todayISO(),
  end: todayISO(),
  notes: '',
})

export default function Travel() {
  const { trips } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(blank())

  const sorted = useMemo(
    () => [...trips.items].sort((a, b) => (a.start < b.start ? -1 : 1)),
    [trips.items],
  )

  function openAdd() {
    setEditing(null)
    setForm(blank())
    setOpen(true)
  }
  function openEdit(t: Trip) {
    setEditing(t.id)
    setForm({ ...t })
    setOpen(true)
  }
  function save() {
    if (!form.destination.trim()) return
    if (editing) trips.update(editing, form)
    else trips.add({ ...form, id: uid() })
    setOpen(false)
  }

  return (
    <Screen
      title="Travel"
      subtitle="Sessions, shows & licensing trips"
      right={<PrimaryButton label="Plan" icon={Plus} onPress={openAdd} small />}
    >
      {trips.items.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No trips planned"
          hint="Add studio sessions, tour dates, and meetings so you never double-book or forget the gear."
          actionLabel="Plan your first trip"
          onAction={openAdd}
        />
      ) : (
        <View style={{ gap: space(3) }}>
          {sorted.map((t) => {
            const rel = relativeDay(t.start)
            const n = nights(t.start, t.end)
            return (
              <Card key={t.id}>
                <View style={styles.top}>
                  <View style={styles.rowGap}>
                    <MapPin size={16} color={colors.accent300} />
                    <Text style={styles.dest}>{t.destination}</Text>
                  </View>
                  <View style={styles.rowGap}>
                    {rel ? <Badge label={rel.label} color={toneColor[rel.tone]} /> : null}
                    <IconButton icon={Pencil} onPress={() => openEdit(t)} />
                    <IconButton icon={Trash2} danger onPress={() => trips.remove(t.id)} />
                  </View>
                </View>
                {t.purpose ? <Text style={styles.purpose}>{t.purpose}</Text> : null}
                <View style={[styles.rowGap, { marginTop: space(2) }]}>
                  <CalendarDays size={14} color={colors.textFaint} />
                  <Text style={styles.dates}>
                    {formatDate(t.start)} → {formatDate(t.end)}
                    {n != null ? `  ·  ${n} night${n === 1 ? '' : 's'}` : ''}
                  </Text>
                </View>
                {t.notes ? (
                  <View style={styles.notes}>
                    <Text style={styles.notesText}>{t.notes}</Text>
                  </View>
                ) : null}
              </Card>
            )
          })}
        </View>
      )}

      <AppModal
        visible={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit trip' : 'Plan a trip'}
      >
        <TextField
          label="Destination"
          value={form.destination}
          onChangeText={(v) => setForm({ ...form, destination: v })}
          placeholder="e.g. Berlin, DE"
        />
        <TextField
          label="Purpose"
          value={form.purpose}
          onChangeText={(v) => setForm({ ...form, purpose: v })}
          placeholder="e.g. Studio session, show, sync meeting"
        />
        <DateField label="Start" value={form.start} onChange={(v) => setForm({ ...form, start: v })} />
        <DateField label="End" value={form.end} onChange={(v) => setForm({ ...form, end: v })} />
        <TextField
          label="Notes (optional)"
          value={form.notes}
          onChangeText={(v) => setForm({ ...form, notes: v })}
          placeholder="Flights, gear to bring, who you're meeting…"
          multiline
        />
        <View style={styles.modalActions}>
          <GhostButton label="Cancel" onPress={() => setOpen(false)} />
          <PrimaryButton label={editing ? 'Save' : 'Add trip'} onPress={save} />
        </View>
      </AppModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: space(1.5) },
  dest: { color: colors.white, fontSize: 16, fontWeight: '700' },
  purpose: { color: colors.accent300, fontSize: 13, marginTop: space(1) },
  dates: { color: colors.textFaint, fontSize: 12 },
  notes: {
    marginTop: space(3),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: space(3),
  },
  notesText: { color: colors.textDim, fontSize: 13, lineHeight: 19 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space(2),
    marginTop: space(2),
  },
})
