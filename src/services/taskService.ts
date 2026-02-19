// ─── Service Layer (Business Logic) ──────────────────────────
// Services contain the core logic, separated from HTTP concerns.
// This makes the logic testable without spinning up a server.

import { v4 as uuidv4 } from "uuid";
import { Task, CreateTaskInput, UpdateTaskInput } from "../models/task";

// In-memory store. Replace with a real DB in production.
let tasks: Map<string, Task> = new Map();

export function getAllTasks(): Task[] {
  return Array.from(tasks.values());
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(input: CreateTaskInput): Task {
  if (!input.title || input.title.trim() === "") {
    throw new Error("Title is required");
  }

  if (input.description && input.description.length > 500) {
    throw new Error("Description must not exceed 500 characters");
  }

  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task {
  const task = tasks.get(id);
  if (!task) {
    throw new Error("Task not found");
  }

  const updated: Task = {
    ...task,
    ...(input.title !== undefined && { title: input.title.trim() }),
    ...(input.description !== undefined && {
      description: input.description.trim(),
    }),
    ...(input.completed !== undefined && { completed: input.completed }),
    updatedAt: new Date().toISOString(),
  };

  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}

// Useful for tests — resets the in-memory store.
export function clearAllTasks(): void {
  tasks = new Map();
}
