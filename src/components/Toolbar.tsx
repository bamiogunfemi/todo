import type { Priority, SortKey, StatusFilter, TaskQuery } from '../types'

interface Props {
  query: TaskQuery
  onChange: (patch: Partial<TaskQuery>) => void
}

const selectClass =
  'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none'

export function Toolbar({ query, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search title, description or #tag"
        className={`${selectClass} flex-1 px-3`}
        value={query.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />
      <div className="flex gap-2">
        <select
          aria-label="Filter by status"
          className={selectClass}
          value={query.status}
          onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
        >
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select
          aria-label="Filter by priority"
          className={selectClass}
          value={query.priority}
          onChange={(e) => onChange({ priority: e.target.value as Priority | 'all' })}
        >
          <option value="all">Any priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          aria-label="Sort tasks"
          className={selectClass}
          value={query.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortKey })}
        >
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  )
}
