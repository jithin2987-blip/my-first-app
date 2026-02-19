// ─── Route Layer (HTTP Interface) ────────────────────────────
// Routes handle HTTP: parse requests, call services, send responses.
// They should be thin — no business logic here.

import { Router, Request, Response } from "express";
import * as taskService from "../services/taskService";

const router = Router();

// GET /api/tasks — list all tasks
router.get("/", (_req: Request, res: Response) => {
  const tasks = taskService.getAllTasks();
  res.json(tasks);
});

// GET /api/tasks/:id — get a single task
router.get("/:id", (req: Request, res: Response) => {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

// POST /api/tasks — create a new task
router.post("/", (req: Request, res: Response) => {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id — update a task
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const task = taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = taskService.deleteTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
});

export default router;
