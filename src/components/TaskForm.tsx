import { useState, type FormEvent } from 'react'
import type { Priority, Task, TaskInput } from '../types'
import { PRIORITIES, parseTags, validateInput } from '../lib/tasks'

interface Props {
  initial?: Task
  submitLabel: string
  onSubmit: (input: TaskInput) => void
  onCancel?: () => void
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

export function TaskForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [showDetails, setShowDetails] = useState(Boolean(initial))
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const input: TaskInput = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      tags: parseTags(tags),
    }
    const problem = validateInput(input)
    if (problem) {
      setError(problem)
      return
    }
    onSubmit(input)
    if (!initial) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setTags('')
    }
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="flex gap-2">
        <input
          aria-label="Task title"
          className={inputClass}
          placeholder="Add a task…"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {submitLabel}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!initial && (
        <button
          type="button"
          className="text-xs font-medium text-slate-500 hover:text-slate-800"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? 'Hide details' : 'Add details'}
        </button>
      )}
      {showDetails && (
        <div className="grid gap-3 sm:grid-cols-3">
          <textarea
            aria-label="Description"
            className={`${inputClass} sm:col-span-3`}
            placeholder="Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="text-xs font-medium text-slate-600">
            Priority
            <select
              className={`${inputClass} mt-1`}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Due date
            <input
              type="date"
              className={`${inputClass} mt-1`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Tags
            <input
              className={`${inputClass} mt-1`}
              placeholder="work, home"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
        </div>
      )}
      {onCancel && (
        <button type="button" className="text-sm text-slate-500 hover:text-slate-800" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  )
}
