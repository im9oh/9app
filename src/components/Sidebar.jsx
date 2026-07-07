import {
  LayoutDashboard,
  Disc3,
  Wallet,
  ListChecks,
  Plane,
} from 'lucide-react'

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'catalog', label: 'Catalog', icon: Disc3 },
  { id: 'income', label: 'Income', icon: Wallet },
  { id: 'reminders', label: 'Reminders', icon: ListChecks },
  { id: 'travel', label: 'Travel', icon: Plane },
]

export default function Sidebar({ active, onNavigate, openCount }) {
  return (
    <aside className="surface sticky top-0 z-30 flex h-auto shrink-0 items-center gap-1 overflow-x-auto rounded-none border-x-0 border-t-0 px-3 py-2 md:top-4 md:m-4 md:h-[calc(100vh-2rem)] md:w-60 md:flex-col md:items-stretch md:gap-1 md:rounded-2xl md:border md:px-3 md:py-5">
      <div className="mb-0 hidden items-center gap-2.5 px-2 pb-5 md:flex">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent-500 to-fuchsia-400 text-sm font-black text-white shadow-lg shadow-accent-600/30">
          9
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">Studio Nine</div>
          <div className="text-[11px] text-zinc-500">Production HQ</div>
        </div>
      </div>

      <nav className="flex items-center gap-1 md:flex-col md:items-stretch">
        {NAV.map((item) => {
          const isActive = active === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`btn justify-start whitespace-nowrap px-3 py-2 text-sm ${
                isActive
                  ? 'bg-white/8 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={18}
                strokeWidth={2.1}
                className={isActive ? 'text-accent-300' : ''}
              />
              <span>{item.label}</span>
              {item.id === 'reminders' && openCount > 0 ? (
                <span className="ml-auto hidden rounded-full bg-accent-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-accent-300 md:inline">
                  {openCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto hidden px-2 pt-5 md:block">
        <p className="text-[11px] leading-relaxed text-zinc-600">
          Data is saved locally in this browser.
        </p>
      </div>
    </aside>
  )
}
