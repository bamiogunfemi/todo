import { useState } from 'react'
import type { Priority, Task, TaskInput } from '../types'
import { isOverdue } from '../lib/tasks'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  onToggle: (id: string) => void
  onEdit: (id: string, input: TaskInput) => void
  onDelete: (task: Task) => void
}

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-50 text-red-700 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-slate-100 text-slate-600 ring-slate-200',
}

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const overdue = isOverdue(task)

  if (editing) {
    return (
      <li className="rounded-lg border border-indigo-200 bg-white p-4">
        <TaskForm
          initial={task}
          submitLabel="Save"
          onSubmit={(input) => {
            onEdit(task.id, input)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        className="mt-1 size-4 shrink-0 accent-indigo-600"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium break-words ${task.completed ? 'text-slate-400 line-through' : ''}`}>
          {task.title}
        </p>
        {task.description && <p className="mt-1 text-sm break-words text-slate-600">{task.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded px-1.5 py-0.5 font-medium capitalize ring-1 ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={overdue ? 'font-medium text-red-600' : 'text-slate-500'}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.tags.map((tag) => (
            <span key={tag} className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
