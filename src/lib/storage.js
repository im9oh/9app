import { useCallback, useEffect, useState } from 'react'

// Persist a piece of state to localStorage under a namespaced key.
const PREFIX = 'studio9:'

export function useLocalStorage(key, initial) {
  const fullKey = PREFIX + key

  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(fullKey)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value))
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [fullKey, value])

  return [value, setValue]
}

// A small CRUD helper over an array of records kept in localStorage.
export function useCollection(key, seed = []) {
  const [items, setItems] = useLocalStorage(key, seed)

  const add = useCallback(
    (record) => setItems((prev) => [record, ...prev]),
    [setItems],
  )

  const update = useCallback(
    (id, patch) =>
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      ),
    [setItems],
  )

  const remove = useCallback(
    (id) => setItems((prev) => prev.filter((it) => it.id !== id)),
    [setItems],
  )

  return { items, setItems, add, update, remove }
}
