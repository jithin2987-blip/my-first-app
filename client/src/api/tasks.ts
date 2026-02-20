import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task'

const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api/tasks`

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const getTasks = (): Promise<Task[]> =>
  request<Task[]>(BASE)

export const getTask = (id: string): Promise<Task> =>
  request<Task>(`${BASE}/${id}`)

export const createTask = (input: CreateTaskInput): Promise<Task> =>
  request<Task>(BASE, { method: 'POST', body: JSON.stringify(input) })

export const updateTask = (id: string, input: UpdateTaskInput): Promise<Task> =>
  request<Task>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteTask = (id: string): Promise<void> =>
  request<void>(`${BASE}/${id}`, { method: 'DELETE' })
