import { useMemo, useState } from 'react'
import type { Task, TaskQuery, View } from './types'
import { getStats, queryTasks } from './lib/tasks'
import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import { Sidebar } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { ConfirmDialog } from './components/ConfirmDialog'

const VIEW_TITLES: Record<View, string> = {
  all: 'All tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  overdue: 'Overdue',
  completed: 'Completed',
}

const EMPTY_MESSAGES: Record<View, string> = {
  all: 'No tasks yet. Add one above to get started.',
  today: 'Nothing due today.',
  upcoming: 'No upcoming tasks with a due date.',
  overdue: 'No overdue tasks. Nice work.',
  completed: 'No completed tasks yet.',
}

export default function App() {
  const { tasks, saveFailed, add, edit, toggle, remove, clearCompleted } = useTasks()
  const [query, setQuery] = useState<TaskQuery>({
    view: 'all',
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'dueDate',
  })
  const [pendingDelete, setPendingDelete] = useState<Task | 'completed' | null>(null)

  const stats = useMemo(() => getStats(tasks), [tasks])
  const visible = useMemo(() => queryTasks(tasks, query), [tasks, query])
  const isFiltered = query.search !== '' || query.status !== 'all' || query.priority !== 'all'

  function confirmDelete() {
    if (pendingDelete === 'completed') clearCompleted()
    else if (pendingDelete) remove(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">Todo</h1>
        <p className="text-sm text-slate-500 md:hidden">
          {stats.percent}% done · {stats.completed}/{stats.total}
        </p>
      </header>

      {saveFailed && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Couldn't save to local storage. Changes will be lost when you close this tab.
        </p>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <Sidebar view={query.view} stats={stats} onChange={(view) => setQuery((q) => ({ ...q, view }))} />

        <main className="min-w-0 flex-1 space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <TaskForm submitLabel="Add" onSubmit={add} />
          </section>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{VIEW_TITLES[query.view]}</h2>
            {query.view === 'completed' && stats.completed > 0 && (
              <button
                className="text-sm text-slate-500 hover:text-red-700"
                onClick={() => setPendingDelete('completed')}
              >
                Clear completed
              </button>
            )}
          </div>

          <Toolbar query={query} onChange={(patch) => setQuery((q) => ({ ...q, ...patch }))} />

          {visible.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
              {isFiltered ? 'No tasks match your filters.' : EMPTY_MESSAGES[query.view]}
            </p>
          ) : (
            <ul className="space-y-2" aria-label="Tasks">
              {visible.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggle} onEdit={edit} onDelete={setPendingDelete} />
              ))}
            </ul>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete === 'completed' ? 'Clear completed tasks?' : 'Delete task?'}
        message={
          pendingDelete === 'completed'
            ? `This permanently removes ${stats.completed} completed task${stats.completed === 1 ? '' : 's'}.`
            : `"${pendingDelete?.title ?? ''}" will be permanently deleted.`
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
