export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  /** Local calendar date, `YYYY-MM-DD`, or null when there is no due date. */
  dueDate: string | null
  tags: string[]
  completed: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export type TaskInput = Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>

export type View = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed'

export type StatusFilter = 'all' | 'active' | 'completed'

export type SortKey = 'dueDate' | 'priority' | 'createdAt' | 'title'

export interface TaskQuery {
  view: View
  search: string
  status: StatusFilter
  priority: Priority | 'all'
  sort: SortKey
}
