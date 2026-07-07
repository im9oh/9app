import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Disc3, Plus, Pencil, Trash2, Play } from 'lucide-react-native'
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
import { colors, space } from '@/theme'
import { formatNumber, formatCompact, formatDate, todayISO, uid } from '@/lib/format'
import type { Release } from '@/lib/types'

const TYPES = ['Single', 'EP', 'Album', 'Mixtape', 'Beat Pack']
const COLORS = ['#8b5cf6', '#e879f9', '#38bdf8', '#f59e0b', '#34d399', '#f472b6']

const blank = (): Omit<Release, 'id'> => ({
  title: '',
  type: 'Single',
  releaseDate: todayISO(),
  streams: 0,
  cover: COLORS[0],
})

export default function Catalog() {
  const { releases } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(blank())
  const [streamsText, setStreamsText] = useState('0')

  const total = useMemo(
    () => releases.items.reduce((s, r) => s + (Number(r.streams) || 0), 0),
    [releases.items],
  )
  const sorted = useMemo(
    () => [...releases.items].sort((a, b) => (b.streams || 0) - (a.streams || 0)),
    [releases.items],
  )

  function openAdd() {
    setEditing(null)
    setForm(blank())
    setStreamsText('0')
    setOpen(true)
  }
  function openEdit(r: Release) {
    setEditing(r.id)
    setForm({ ...r })
    setStreamsText(String(r.streams))
    setOpen(true)
  }
  function save() {
    if (!form.title.trim()) return
    const record = { ...form, streams: Number(streamsText) || 0 }
    if (editing) releases.update(editing, record)
    else releases.add({ ...record, id: uid() })
    setOpen(false)
  }

  return (
    <Screen
      title="Catalog"
      subtitle={`${releases.items.length} releases · ${formatNumber(total)} streams`}
      right={<PrimaryButton label="Add" icon={Plus} onPress={openAdd} small />}
    >
      {/* Total streams hero */}
      <Card style={styles.hero}>
        <View style={styles.heroIcon}>
          <Play size={20} color={colors.accent300} />
        </View>
        <View>
          <Text style={styles.heroLabel}>Total streams across catalog</Text>
          <Text style={styles.heroValue}>{formatNumber(total)}</Text>
        </View>
      </Card>

      {releases.items.length === 0 ? (
        <EmptyState
          icon={Disc3}
          title="No releases yet"
          hint="Add your singles, EPs, and albums to track streams across your whole catalog."
          actionLabel="Add your first release"
          onAction={openAdd}
        />
      ) : (
        <View style={{ gap: space(3) }}>
          {sorted.map((r) => (
            <Card key={r.id} style={styles.releaseCard}>
              <View style={[styles.cover, { backgroundColor: r.cover }]}>
                <Disc3 size={22} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Badge label={r.type} />
                </View>
                <Text style={styles.releaseDate}>Released {formatDate(r.releaseDate)}</Text>
                <Text style={styles.streams}>
                  {formatCompact(r.streams)} <Text style={styles.streamsUnit}>streams</Text>
                </Text>
              </View>
              <View style={{ gap: space(1) }}>
                <IconButton icon={Pencil} onPress={() => openEdit(r)} />
                <IconButton icon={Trash2} danger onPress={() => releases.remove(r.id)} />
              </View>
            </Card>
          ))}
        </View>
      )}

      <AppModal
        visible={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit release' : 'Add release'}
      >
        <TextField
          label="Title"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="e.g. Midnight Frequencies"
        />
        <ChipSelect
          label="Type"
          options={TYPES}
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
        />
        <DateField
          label="Release date"
          value={form.releaseDate}
          onChange={(v) => setForm({ ...form, releaseDate: v })}
        />
        <TextField
          label="Total streams"
          value={streamsText}
          onChangeText={setStreamsText}
          keyboardType="number-pad"
          placeholder="0"
        />
        <Text style={styles.fieldLabel}>Cover colour</Text>
        <View style={styles.swatchRow}>
          {COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setForm({ ...form, cover: c })}
              style={[
                styles.swatch,
                { backgroundColor: c },
                form.cover === c && styles.swatchActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.modalActions}>
          <GhostButton label="Cancel" onPress={() => setOpen(false)} />
          <PrimaryButton label={editing ? 'Save' : 'Add release'} onPress={save} />
        </View>
      </AppModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    marginBottom: space(4),
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accent500 + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: { color: colors.textDim, fontSize: 13 },
  heroValue: { color: colors.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },

  releaseCard: { flexDirection: 'row', alignItems: 'center', gap: space(3) },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space(2) },
  title: { color: colors.white, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  releaseDate: { color: colors.textFaint, fontSize: 12, marginTop: space(0.5) },
  streams: { color: colors.accent300, fontSize: 17, fontWeight: '800', marginTop: space(1.5) },
  streamsUnit: { color: colors.textFaint, fontSize: 12, fontWeight: '400' },

  fieldLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: space(1.5),
  },
  swatchRow: { flexDirection: 'row', gap: space(2.5), marginBottom: space(5) },
  swatch: { width: 34, height: 34, borderRadius: 10 },
  swatchActive: { borderWidth: 3, borderColor: colors.white },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space(2),
    marginTop: space(2),
  },
})
