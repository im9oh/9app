import { useMemo } from 'react'
import {
  Play,
  Wallet,
  ListChecks,
  Plane,
  ArrowRight,
  Disc3,
  CalendarDays,
} from 'lucide-react'
import { Card, StatTile, Badge } from '../components/ui'
import BarChart from '../components/BarChart'
import {
  formatNumber,
  formatMoney,
  formatDate,
  relativeDay,
  todayISO,
} from '../lib/format'

export default function Dashboard({ releases, income, reminders, trips, onNavigate }) {
  const totalStreams = useMemo(
    () => releases.reduce((s, r) => s + (Number(r.streams) || 0), 0),
    [releases],
  )
  const monthIncome = useMemo(() => {
    const key = todayISO().slice(0, 7)
    return income
      .filter((i) => (i.date || '').slice(0, 7) === key)
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)
  }, [income])
  const openReminders = reminders.filter((r) => !r.done)
  const upcomingTrips = useMemo(
    () =>
      [...trips]
        .filter((t) => (t.end || t.start) >= todayISO())
        .sort((a, b) => (a.start < b.start ? -1 : 1)),
    [trips],
  )
  const chartData = useMemo(
    () =>
      [...releases]
        .sort((a, b) => (b.streams || 0) - (a.streams || 0))
        .slice(0, 5)
        .map((r) => ({ label: r.title, value: Number(r.streams) || 0 })),
    [releases],
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <div className="mb-8">
        <div className="text-sm text-zinc-500">{greeting} 👋</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Your <span className="accent-text">production HQ</span>
        </h1>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Play}
          label="Total streams"
          value={formatNumber(totalStreams)}
          sub={`Across ${releases.length} releases`}
        />
        <StatTile
          icon={Wallet}
          label="Income this month"
          value={formatMoney(monthIncome)}
          accent="emerald"
          sub={`${income.length} entries logged`}
        />
        <StatTile
          icon={ListChecks}
          label="Open reminders"
          value={openReminders.length}
          sub={openReminders.length ? 'Tap to see what’s due' : 'All caught up'}
        />
        <StatTile
          icon={Plane}
          label="Upcoming trips"
          value={upcomingTrips.length}
          sub={upcomingTrips[0] ? `Next: ${upcomingTrips[0].destination}` : 'None planned'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Streams chart */}
        <Card className="p-5 lg:col-span-2">
          <SectionHead
            icon={Disc3}
            title="Top releases by streams"
            onClick={() => onNavigate('catalog')}
          />
          {chartData.length ? (
            <div className="mt-4">
              <BarChart data={chartData} />
            </div>
          ) : (
            <Empty text="Add releases to see your streams." />
          )}
        </Card>

        {/* Reminders */}
        <Card className="p-5">
          <SectionHead
            icon={ListChecks}
            title="Due soon"
            onClick={() => onNavigate('reminders')}
          />
          <div className="mt-4 space-y-2">
            {openReminders.slice(0, 5).map((r) => {
              const rel = relativeDay(r.due)
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                    {r.text}
                  </span>
                  {rel ? <Badge tone={rel.tone}>{rel.label}</Badge> : null}
                </div>
              )
            })}
            {openReminders.length === 0 && (
              <Empty text="Nothing due. Nice work. 🎧" />
            )}
          </div>
        </Card>

        {/* Upcoming trips */}
        <Card className="p-5 lg:col-span-3">
          <SectionHead
            icon={Plane}
            title="Upcoming travel"
            onClick={() => onNavigate('travel')}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingTrips.slice(0, 3).map((t) => (
              <div key={t.id} className="rounded-xl bg-white/3 p-4">
                <div className="font-medium text-white">{t.destination}</div>
                <div className="mt-0.5 text-sm text-accent-200/80">{t.purpose}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarDays size={13} />
                  {formatDate(t.start)} → {formatDate(t.end)}
                </div>
              </div>
            ))}
            {upcomingTrips.length === 0 && (
              <Empty text="No trips planned yet." />
            )}
          </div>
        </Card>
      </div>
    </>
  )
}

function SectionHead({ icon: Icon, title, onClick }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon size={16} className="text-accent-300" />
        {title}
      </div>
      <button
        onClick={onClick}
        className="btn group -mr-2 px-2 py-1 text-xs text-zinc-400 hover:text-white"
      >
        View all
        <ArrowRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="py-6 text-center text-sm text-zinc-500">{text}</div>
  )
}
