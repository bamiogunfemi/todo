import type { View } from '../types'
import type { TaskStats } from '../lib/tasks'

const VIEWS: { id: View; label: string }[] = [
  { id: 'all', label: 'All tasks' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
]

interface Props {
  view: View
  stats: TaskStats
  onChange: (view: View) => void
}

export function Sidebar({ view, stats, onChange }: Props) {
  return (
    <aside className="md:w-56 md:shrink-0">
      <nav aria-label="Views" className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-col md:px-0">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            aria-current={view === v.id ? 'page' : undefined}
            onClick={() => onChange(v.id)}
            className={`flex shrink-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm ${
              view === v.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {v.label}
            <span
              className={`text-xs tabular-nums ${
                v.id === 'overdue' && stats.counts.overdue > 0 ? 'font-semibold text-red-600' : 'text-slate-400'
              }`}
            >
              {stats.counts[v.id]}
            </span>
          </button>
        ))}
      </nav>

      <section className="mt-6 hidden rounded-lg border border-slate-200 bg-white p-4 md:block">
        <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Progress</h2>
        <p className="mt-2 text-2xl font-semibold tabular-nums">{stats.percent}%</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Completion"
          aria-valuenow={stats.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${stats.percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {stats.completed} of {stats.total} done
        </p>
        <h2 className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Open by priority</h2>
        <dl className="mt-2 space-y-1 text-sm">
          {(['high', 'medium', 'low'] as const).map((p) => (
            <div key={p} className="flex justify-between">
              <dt className="capitalize text-slate-600">{p}</dt>
              <dd className="tabular-nums">{stats.activeByPriority[p]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  )
}
