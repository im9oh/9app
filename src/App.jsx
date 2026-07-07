import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import Income from './pages/Income'
import Reminders from './pages/Reminders'
import Travel from './pages/Travel'
import { useCollection } from './lib/storage'
import {
  seedReleases,
  seedIncome,
  seedReminders,
  seedTrips,
} from './lib/seed'

export default function App() {
  const [route, setRoute] = useState('dashboard')

  // All data lives here so the Dashboard can summarise across modules.
  const releases = useCollection('releases', seedReleases)
  const income = useCollection('income', seedIncome)
  const reminders = useCollection('reminders', seedReminders)
  const trips = useCollection('trips', seedTrips)

  const openReminders = reminders.items.filter((r) => !r.done).length

  return (
    <div className="min-h-screen md:flex">
      <Sidebar active={route} onNavigate={setRoute} openCount={openReminders} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-10">
        <div key={route} className="animate-fade-in">
          {route === 'dashboard' && (
            <Dashboard
              releases={releases.items}
              income={income.items}
              reminders={reminders.items}
              trips={trips.items}
              onNavigate={setRoute}
            />
          )}
          {route === 'catalog' && <Catalog store={releases} />}
          {route === 'income' && <Income store={income} />}
          {route === 'reminders' && <Reminders store={reminders} />}
          {route === 'travel' && <Travel store={trips} />}
        </div>
      </main>
    </div>
  )
}
