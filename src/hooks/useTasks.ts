import { useCallback, useEffect, useState } from 'react'
import type { Task, TaskInput } from '../types'
import { createTask, toggleTask, updateTask } from '../lib/tasks'
import { loadTasks, saveTasks } from '../lib/storage'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    // Syncing with an external system (localStorage) and surfacing write failures.
    // oxlint-disable-next-line react/set-state-in-effect
    setSaveFailed(!saveTasks(tasks))
  }, [tasks])

  const add = useCallback((input: TaskInput) => {
    setTasks((prev) => [createTask(input), ...prev])
  }, [])

  const edit = useCallback((id: string, input: TaskInput) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? updateTask(t, input) : t)))
  }, [])

  const toggle = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? toggleTask(t) : t)))
  }, [])

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }, [])

  return { tasks, saveFailed, add, edit, toggle, remove, clearCompleted }
}
