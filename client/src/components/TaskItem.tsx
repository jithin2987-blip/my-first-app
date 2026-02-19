import { useState } from 'react'
import type { Task, UpdateTaskInput } from '../types/task'

interface Props {
  task: Task
  onUpdate: (id: string, input: UpdateTaskInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [saving, setSaving] = useState(false)

  async function handleToggle() {
    await onUpdate(task.id, { completed: !task.completed })
  }

  async function handleSave() {
    if (!editTitle.trim()) return
    setSaving(true)
    await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    })
    setSaving(false)
    setEditing(false)
  }

  function handleCancel() {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditing(false)
  }

  return (
    <li className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !editTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`mt-0.5 text-xs ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                {task.description}
              </p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-blue-600 text-xs px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-600 text-xs px-2 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
