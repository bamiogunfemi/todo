import type { Priority, Task, TaskInput, TaskQuery, View } from '../types'

export const PRIORITIES: Priority[] = ['high', 'medium', 'low']

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

/** Today's date in the user's local time zone as `YYYY-MM-DD`. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseTags(raw: string): string[] {
  const seen = new Set<string>()
  for (const part of raw.split(',')) {
    const tag = part.trim().toLowerCase()
    if (tag) seen.add(tag)
  }
  return [...seen]
}

export function normalizeInput(input: TaskInput): TaskInput {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    dueDate: input.dueDate || null,
    tags: input.tags,
  }
}

export function validateInput(input: TaskInput): string | null {
  if (!input.title.trim()) return 'Title is required'
  if (input.title.trim().length > 200) return 'Title must be 200 characters or fewer'
  if (input.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) return 'Due date is invalid'
  return null
}

export function createTask(input: TaskInput, now: Date = new Date()): Task {
  const timestamp = now.toISOString()
  return {
    id: crypto.randomUUID(),
    ...normalizeInput(input),
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
  }
}

export function updateTask(task: Task, input: TaskInput, now: Date = new Date()): Task {
  return { ...task, ...normalizeInput(input), updatedAt: now.toISOString() }
}

export function toggleTask(task: Task, now: Date = new Date()): Task {
  const completed = !task.completed
  return {
    ...task,
    completed,
    completedAt: completed ? now.toISOString() : null,
    updatedAt: now.toISOString(),
  }
}

export function isOverdue(task: Task, today: string = todayKey()): boolean {
  return !task.completed && task.dueDate !== null && task.dueDate < today
}

export function matchesView(task: Task, view: View, today: string = todayKey()): boolean {
  switch (view) {
    case 'all':
      return true
    case 'today':
      return !task.completed && task.dueDate === today
    case 'upcoming':
      return !task.completed && task.dueDate !== null && task.dueDate > today
    case 'overdue':
      return isOverdue(task, today)
    case 'completed':
      return task.completed
  }
}

function matchesSearch(task: Task, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q) ||
    task.tags.some((t) => t.includes(q))
  )
}

function compare(a: Task, b: Task, sort: TaskQuery['sort']): number {
  switch (sort) {
    case 'priority':
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    case 'title':
      return a.title.localeCompare(b.title)
    case 'createdAt':
      return b.createdAt.localeCompare(a.createdAt)
    case 'dueDate':
      // Tasks without a due date go last.
      if (a.dueDate === b.dueDate) return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (a.dueDate === null) return 1
      if (b.dueDate === null) return -1
      return a.dueDate.localeCompare(b.dueDate)
  }
}

export function queryTasks(tasks: Task[], query: TaskQuery, today: string = todayKey()): Task[] {
  return tasks
    .filter(
      (t) =>
        matchesView(t, query.view, today) &&
        matchesSearch(t, query.search) &&
        (query.status === 'all' || (query.status === 'completed') === t.completed) &&
        (query.priority === 'all' || t.priority === query.priority),
    )
    .sort((a, b) => compare(a, b, query.sort))
}

export interface TaskStats {
  total: number
  completed: number
  percent: number
  counts: Record<View, number>
  activeByPriority: Record<Priority, number>
}

export function getStats(tasks: Task[], today: string = todayKey()): TaskStats {
  const completed = tasks.filter((t) => t.completed).length
  const views: View[] = ['all', 'today', 'upcoming', 'overdue', 'completed']
  const counts = Object.fromEntries(
    views.map((v) => [v, tasks.filter((t) => matchesView(t, v, today)).length]),
  ) as Record<View, number>
  const activeByPriority = { high: 0, medium: 0, low: 0 }
  for (const t of tasks) if (!t.completed) activeByPriority[t.priority]++
  return {
    total: tasks.length,
    completed,
    percent: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    counts,
    activeByPriority,
  }
}
