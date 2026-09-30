import type { Task } from '../types'

export const STORAGE_KEY = 'todo.tasks.v1'

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.description === 'string' &&
    (t.priority === 'low' || t.priority === 'medium' || t.priority === 'high') &&
    (t.dueDate === null || typeof t.dueDate === 'string') &&
    Array.isArray(t.tags) &&
    t.tags.every((tag) => typeof tag === 'string') &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'string' &&
    typeof t.updatedAt === 'string' &&
    (t.completedAt === null || typeof t.completedAt === 'string')
  )
}

/** Reads tasks from localStorage, dropping anything malformed instead of crashing. */
export function loadTasks(storage: Storage = localStorage): Task[] {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isTask) : []
  } catch {
    return []
  }
}

/** Returns false when the write fails (e.g. quota exceeded or storage disabled). */
export function saveTasks(tasks: Task[], storage: Storage = localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
