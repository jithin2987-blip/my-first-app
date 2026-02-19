import type { Task, UpdateTaskInput } from '../types/task'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onUpdate: (id: string, input: UpdateTaskInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function TaskList({ tasks, onUpdate, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-10">
        No tasks yet. Add one above.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
