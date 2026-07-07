import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Wallet, Plus, Trash2, TrendingUp } from 'lucide-react-native'
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
import { colors, space, sourceColor } from '@/theme'
import { formatMoney, formatDate, todayISO, uid } from '@/lib/format'

const SOURCES = ['Streaming', 'Gig', 'Beats', 'Sync', 'Merch', 'Other']

export default function Income() {
  const { income } = useStore()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(todayISO())
  const [source, setSource] = useState('Streaming')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const total = useMemo(
    () => income.items.reduce((s, i) => s + (Number(i.amount) || 0), 0),
    [income.items],
  )
  const byMonth = useMemo(() => {
    const key = todayISO().slice(0, 7)
    return income.items
      .filter((i) => (i.date || '').slice(0, 7) === key)
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)
  }, [income.items])
  const breakdown = useMemo(() => {
    const map: Record<string, number> = {}
    for (const i of income.items) map[i.source] = (map[i.source] || 0) + (Number(i.amount) || 0)
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [income.items])
  const sorted = useMemo(
    () => [...income.items].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [income.items],
  )

  function openAdd() {
    setDate(todayISO())
    setSource('Streaming')
    setAmount('')
    setNote('')
    setOpen(true)
  }
  function save() {
    if (!amount) return
    income.add({ id: uid(), date, source, amount: Number(amount) || 0, note })
    setOpen(false)
  }

  return (
    <Screen
      title="Income"
      subtitle="Royalties, gigs, beats & sync"
      right={<PrimaryButton label="Log" icon={Plus} onPress={openAdd} small />}
    >
      {/* Totals */}
      <View style={{ flexDirection: 'row', gap: space(3) }}>
        <Card style={{ flex: 1 }}>
          <Text style={styles.tileLabel}>All-time</Text>
          <Text style={styles.tileValue}>{formatMoney(total)}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <View style={styles.rowGap}>
            <TrendingUp size={13} color={colors.textDim} />
            <Text style={styles.tileLabel}>This month</Text>
          </View>
          <Text style={[styles.tileValue, { color: colors.emerald }]}>
            {formatMoney(byMonth)}
          </Text>
        </Card>
      </View>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <Card style={{ marginTop: space(4) }}>
          <Text style={styles.blockTitle}>By source</Text>
          <View style={styles.breakdownRow}>
            {breakdown.map(([src, amt]) => (
              <View key={src} style={styles.breakdownItem}>
                <Badge label={src} color={sourceColor[src] || colors.textDim} />
                <Text style={styles.breakdownAmt}>{formatMoney(amt)}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* List */}
      <View style={{ marginTop: space(4) }}>
        {income.items.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No income logged yet"
            hint="Log every payout — streaming, shows, beats, and sync — to see where your money actually comes from."
            actionLabel="Log your first payout"
            onAction={openAdd}
          />
        ) : (
          <Card style={{ padding: 0 }}>
            {sorted.map((i, idx) => (
              <View
                key={i.id}
                style={[styles.entry, idx > 0 && styles.entryBorder]}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.entryTop}>
                    <Badge label={i.source} color={sourceColor[i.source] || colors.textDim} />
                    <Text style={styles.entryDate}>{formatDate(i.date)}</Text>
                  </View>
                  {i.note ? (
                    <Text style={styles.entryNote} numberOfLines={1}>
                      {i.note}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.entryAmount}>{formatMoney(i.amount)}</Text>
                <IconButton icon={Trash2} danger onPress={() => income.remove(i.id)} />
              </View>
            ))}
          </Card>
        )}
      </View>

      <AppModal visible={open} onClose={() => setOpen(false)} title="Log income">
        <DateField label="Date" value={date} onChange={setDate} />
        <ChipSelect label="Source" options={SOURCES} value={source} onChange={setSource} />
        <TextField
          label="Amount (USD)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
        />
        <TextField
          label="Note (optional)"
          value={note}
          onChangeText={setNote}
          placeholder="e.g. DistroKid payout"
        />
        <View style={styles.modalActions}>
          <GhostButton label="Cancel" onPress={() => setOpen(false)} />
          <PrimaryButton label="Add entry" onPress={save} />
        </View>
      </AppModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  tileLabel: { color: colors.textDim, fontSize: 13 },
  tileValue: { color: colors.white, fontSize: 24, fontWeight: '800', marginTop: space(1) },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: space(1.5) },

  blockTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: space(3) },
  breakdownRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(2),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  breakdownAmt: { color: colors.text, fontSize: 13, fontWeight: '700' },

  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingVertical: space(3.5),
  },
  entryBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  entryTop: { flexDirection: 'row', alignItems: 'center', gap: space(2) },
  entryDate: { color: colors.textFaint, fontSize: 12 },
  entryNote: { color: colors.textDim, fontSize: 13, marginTop: space(1) },
  entryAmount: { color: colors.emerald, fontSize: 15, fontWeight: '700' },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space(2),
    marginTop: space(2),
  },
})
