import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  Play,
  Wallet,
  ListChecks,
  Plane,
  Disc3,
  CalendarDays,
} from 'lucide-react-native'
import {
  Screen,
  Card,
  StatTile,
  Badge,
  SectionHeader,
  ProgressBar,
} from '@/components/ui'
import { useStore } from '@/lib/store'
import { colors, space } from '@/theme'
import {
  formatNumber,
  formatMoney,
  formatCompact,
  formatDate,
  relativeDay,
  todayISO,
} from '@/lib/format'
import { useRouter } from 'expo-router'

const toneColor = { soon: colors.amber, past: colors.rose, future: colors.textFaint }

export default function Dashboard() {
  const { releases, income, reminders, trips } = useStore()
  const router = useRouter()

  const totalStreams = useMemo(
    () => releases.items.reduce((s, r) => s + (Number(r.streams) || 0), 0),
    [releases.items],
  )
  const monthIncome = useMemo(() => {
    const key = todayISO().slice(0, 7)
    return income.items
      .filter((i) => (i.date || '').slice(0, 7) === key)
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)
  }, [income.items])
  const openReminders = useMemo(
    () => reminders.items.filter((r) => !r.done),
    [reminders.items],
  )
  const upcomingTrips = useMemo(
    () =>
      [...trips.items]
        .filter((t) => (t.end || t.start) >= todayISO())
        .sort((a, b) => (a.start < b.start ? -1 : 1)),
    [trips.items],
  )
  const topReleases = useMemo(
    () => [...releases.items].sort((a, b) => (b.streams || 0) - (a.streams || 0)).slice(0, 5),
    [releases.items],
  )
  const maxStreams = Math.max(1, ...topReleases.map((r) => r.streams))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <Screen title="Your production HQ" subtitle={`${greeting} 👋`}>
      {/* Stat tiles */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space(3) }}>
        <StatTile
          icon={Play}
          label="Total streams"
          value={formatNumber(totalStreams)}
          sub={`Across ${releases.items.length} releases`}
        />
        <StatTile
          icon={Wallet}
          label="Income this month"
          value={formatMoney(monthIncome)}
          tint={colors.emerald}
          sub={`${income.items.length} entries`}
        />
        <StatTile
          icon={ListChecks}
          label="Open reminders"
          value={openReminders.length}
          sub={openReminders.length ? 'Due soon below' : 'All caught up'}
        />
        <StatTile
          icon={Plane}
          label="Upcoming trips"
          value={upcomingTrips.length}
          tint={colors.sky}
          sub={upcomingTrips[0] ? upcomingTrips[0].destination : 'None planned'}
        />
      </View>

      {/* Top releases */}
      <Card style={{ marginTop: space(4) }}>
        <SectionHeader icon={Disc3} title="Top releases by streams" onPress={() => router.push('/catalog')} />
        <View style={{ marginTop: space(4), gap: space(3) }}>
          {topReleases.length === 0 ? (
            <Text style={styles.dim}>Add releases to see your streams.</Text>
          ) : (
            topReleases.map((r) => (
              <View key={r.id} style={{ gap: space(1.5) }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemLabel} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Text style={styles.itemValue}>{formatCompact(r.streams)}</Text>
                </View>
                <ProgressBar value={r.streams} max={maxStreams} />
              </View>
            ))
          )}
        </View>
      </Card>

      {/* Due soon */}
      <Card style={{ marginTop: space(4) }}>
        <SectionHeader icon={ListChecks} title="Due soon" onPress={() => router.push('/reminders')} />
        <View style={{ marginTop: space(3), gap: space(2) }}>
          {openReminders.length === 0 ? (
            <Text style={styles.dim}>Nothing due. Nice work. 🎧</Text>
          ) : (
            openReminders.slice(0, 5).map((r) => {
              const rel = relativeDay(r.due)
              return (
                <View key={r.id} style={styles.reminderRow}>
                  <View style={styles.dot} />
                  <Text style={styles.reminderText} numberOfLines={1}>
                    {r.text}
                  </Text>
                  {rel ? <Badge label={rel.label} color={toneColor[rel.tone]} /> : null}
                </View>
              )
            })
          )}
        </View>
      </Card>

      {/* Upcoming travel */}
      <Card style={{ marginTop: space(4) }}>
        <SectionHeader icon={Plane} title="Upcoming travel" onPress={() => router.push('/travel')} />
        <View style={{ marginTop: space(3), gap: space(2.5) }}>
          {upcomingTrips.length === 0 ? (
            <Text style={styles.dim}>No trips planned yet.</Text>
          ) : (
            upcomingTrips.slice(0, 3).map((t) => (
              <View key={t.id} style={styles.tripRow}>
                <Text style={styles.tripDest}>{t.destination}</Text>
                <Text style={styles.tripPurpose}>{t.purpose}</Text>
                <View style={[styles.row, { marginTop: space(1) }]}>
                  <CalendarDays size={13} color={colors.textFaint} />
                  <Text style={styles.tripDates}>
                    {formatDate(t.start)} → {formatDate(t.end)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  dim: { color: colors.textFaint, fontSize: 13, paddingVertical: space(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space(1.5) },
  itemLabel: { color: colors.textDim, fontSize: 13, flex: 1, marginRight: space(2) },
  itemValue: { color: colors.accent300, fontSize: 13, fontWeight: '700' },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(2),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingHorizontal: space(3),
    paddingVertical: space(2.5),
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent400 },
  reminderText: { color: colors.text, fontSize: 13, flex: 1 },
  tripRow: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: space(3.5),
  },
  tripDest: { color: colors.white, fontSize: 15, fontWeight: '600' },
  tripPurpose: { color: colors.accent300, fontSize: 13, marginTop: space(0.5) },
  tripDates: { color: colors.textFaint, fontSize: 12 },
})
