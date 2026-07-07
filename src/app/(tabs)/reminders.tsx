import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ListChecks, Plus, Trash2, Check } from 'lucide-react-native'
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
  ChipSelect,
} from '@/components/ui'
import { DateField } from '@/components/DateField'
import { useStore } from '@/lib/store'
import { colors, space, priorityColor } from '@/theme'
import { relativeDay, todayISO, uid } from '@/lib/format'
import type { Reminder } from '@/lib/types'

const PRIORITIES = ['high', 'medium', 'low']
const toneColor = { soon: colors.amber, past: colors.rose, future: colors.textFaint }

export default function Reminders() {
  const { reminders } = useStore()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [due, setDue] = useState(todayISO())
  const [priority, setPriority] = useState('medium')

  const { active, done } = useMemo(() => {
    const rank: Record<string, number> = { high: 0, medium: 1, low: 2 }
    const sortFn = (a: Reminder, b: Reminder) => {
      if ((a.due || '') !== (b.due || '')) return (a.due || '') < (b.due || '') ? -1 : 1
      return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3)
    }
    return {
      active: reminders.items.filter((r) => !r.done).sort(sortFn),
      done: reminders.items.filter((r) => r.done).sort(sortFn),
    }
  }, [reminders.items])

  function openAdd() {
    setText('')
    setDue(todayISO())
    setPriority('medium')
    setOpen(true)
  }
  function save() {
    if (!text.trim()) return
    reminders.add({ id: uid(), text: text.trim(), due, priority, done: false })
    setOpen(false)
  }

  const Row = ({ r }: { r: Reminder }) => {
    const rel = relativeDay(r.due)
    return (
      <View style={styles.row}>
        <Pressable
          onPress={() => reminders.update(r.id, { done: !r.done })}
          style={[styles.check, r.done && styles.checkDone]}
          hitSlop={8}
        >
          {r.done ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}
        </Pressable>
        <Text
          style={[styles.text, r.done && styles.textDone]}
          numberOfLines={2}
        >
          {r.text}
        </Text>
        {!r.done ? (
          <Badge label={r.priority} color={priorityColor[r.priority] || colors.textDim} />
        ) : null}
        {rel && !r.done ? <Badge label={rel.label} color={toneColor[rel.tone]} /> : null}
        <IconButton icon={Trash2} danger onPress={() => reminders.remove(r.id)} />
      </View>
    )
  }

  return (
    <Screen
      title="Reminders"
      subtitle={`${active.length} to do · ${done.length} done`}
      right={<PrimaryButton label="Add" icon={Plus} onPress={openAdd} small />}
    >
      {reminders.items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing to remember yet"
          hint="Add the things you keep forgetting — masters to send, playlists to pitch, subscriptions to renew."
          actionLabel="Add your first reminder"
          onAction={openAdd}
        />
      ) : (
        <View style={{ gap: space(5) }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {active.length === 0 ? (
              <Text style={styles.allClear}>All caught up — nice. 🎧</Text>
            ) : (
              active.map((r, i) => (
                <View key={r.id} style={i > 0 ? styles.rowBorder : undefined}>
                  <Row r={r} />
                </View>
              ))
            )}
          </Card>

          {done.length > 0 && (
            <View>
              <Text style={styles.completedLabel}>COMPLETED</Text>
              <Card style={{ padding: 0, overflow: 'hidden', opacity: 0.7 }}>
                {done.map((r, i) => (
                  <View key={r.id} style={i > 0 ? styles.rowBorder : undefined}>
                    <Row r={r} />
                  </View>
                ))}
              </Card>
            </View>
          )}
        </View>
      )}

      <AppModal visible={open} onClose={() => setOpen(false)} title="Add reminder">
        <TextField
          label="What do you need to remember?"
          value={text}
          onChangeText={setText}
          placeholder="e.g. Send Afterglow master to engineer"
          multiline
        />
        <DateField label="Due date" value={due} onChange={setDue} />
        <ChipSelect label="Priority" options={PRIORITIES} value={priority} onChange={setPriority} />
        <View style={styles.modalActions}>
          <GhostButton label="Cancel" onPress={() => setOpen(false)} />
          <PrimaryButton label="Add reminder" onPress={save} />
        </View>
      </AppModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(2.5),
    paddingHorizontal: space(4),
    paddingVertical: space(3.5),
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.textGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.accent500, borderColor: colors.accent500 },
  text: { color: colors.text, fontSize: 14, flex: 1 },
  textDone: { color: colors.textFaint, textDecorationLine: 'line-through' },
  allClear: { color: colors.textFaint, fontSize: 13, textAlign: 'center', paddingVertical: space(8) },
  completedLabel: {
    color: colors.textGhost,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: space(2),
    marginLeft: space(1),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space(2),
    marginTop: space(2),
  },
})
