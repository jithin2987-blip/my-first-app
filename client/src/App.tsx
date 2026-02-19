import { useEffect, useState } from 'react'
import type { Task, CreateTaskInput, UpdateTaskInput } from './types/task'
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(input: CreateTaskInput) {
    try {
      const task = await createTask(input)
      setTasks(prev => [task, ...prev])
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleUpdate(id: string, input: UpdateTaskInput) {
    try {
      const updated = await updateTask(id, input)
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Manager</h1>

        <TaskForm onSubmit={handleCreate} />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
            <button
              className="ml-2 underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
