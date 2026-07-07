import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { IncomeEntry, Reminder, Release, Trip } from './types'
import {
  seedIncome,
  seedReminders,
  seedReleases,
  seedTrips,
} from './seed'

type Collection<T> = {
  items: T[]
  add: (record: T) => void
  update: (id: string, patch: Partial<T>) => void
  remove: (id: string) => void
}

type Store = {
  loaded: boolean
  releases: Collection<Release>
  income: Collection<IncomeEntry>
  reminders: Collection<Reminder>
  trips: Collection<Trip>
}

const KEYS = {
  releases: 'studio9:releases',
  income: 'studio9:income',
  reminders: 'studio9:reminders',
  trips: 'studio9:trips',
} as const

const StoreContext = createContext<Store | null>(null)

async function load<T>(key: string, seed: T[]): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
  } catch {
    // fall through to seed
  }
  try {
    await AsyncStorage.setItem(key, JSON.stringify(seed))
  } catch {
    // non-fatal
  }
  return seed
}

function persist<T>(key: string, items: T[]) {
  AsyncStorage.setItem(key, JSON.stringify(items)).catch(() => {})
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [releases, setReleases] = useState<Release[]>([])
  const [income, setIncome] = useState<IncomeEntry[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([
      load<Release>(KEYS.releases, seedReleases),
      load<IncomeEntry>(KEYS.income, seedIncome),
      load<Reminder>(KEYS.reminders, seedReminders),
      load<Trip>(KEYS.trips, seedTrips),
    ]).then(([r, i, rem, tr]) => {
      if (!alive) return
      setReleases(r)
      setIncome(i)
      setReminders(rem)
      setTrips(tr)
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  function makeCollection<T extends { id: string }>(
    key: string,
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
  ): Collection<T> {
    return {
      items,
      add: (record) =>
        setItems((prev) => {
          const next = [record, ...prev]
          persist(key, next)
          return next
        }),
      update: (id, patch) =>
        setItems((prev) => {
          const next = prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
          persist(key, next)
          return next
        }),
      remove: (id) =>
        setItems((prev) => {
          const next = prev.filter((it) => it.id !== id)
          persist(key, next)
          return next
        }),
    }
  }

  const value = useMemo<Store>(
    () => ({
      loaded,
      releases: makeCollection(KEYS.releases, releases, setReleases),
      income: makeCollection(KEYS.income, income, setIncome),
      reminders: makeCollection(KEYS.reminders, reminders, setReminders),
      trips: makeCollection(KEYS.trips, trips, setTrips),
    }),
    [loaded, releases, income, reminders, trips],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
