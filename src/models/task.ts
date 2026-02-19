// ─── Data Model ───────────────────────────────────────────────
// This file defines the shape of our data. In a real app, this
// would map to a database table (e.g. via Prisma or TypeORM).

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
