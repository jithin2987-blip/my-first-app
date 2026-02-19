// ─── Unit Tests ──────────────────────────────────────────────
// Test the service layer in isolation (no HTTP, no server).
// Fast, focused, and easy to debug.

import { describe, it, expect, beforeEach } from "vitest";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  clearAllTasks,
} from "../../src/services/taskService";

describe("TaskService", () => {
  beforeEach(() => {
    clearAllTasks(); // Reset state between tests
  });

  describe("createTask", () => {
    it("creates a task with the given title", () => {
      const task = createTask({ title: "Buy groceries" });

      expect(task.title).toBe("Buy groceries");
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
    });

    it("trims whitespace from title", () => {
      const task = createTask({ title: "  Buy groceries  " });
      expect(task.title).toBe("Buy groceries");
    });

    it("throws if title is empty", () => {
      expect(() => createTask({ title: "" })).toThrow("Title is required");
    });

    it("throws if description exceeds 500 characters", () => {
      expect(() =>
        createTask({ title: "Valid title", description: "a".repeat(501) })
      ).toThrow("Description must not exceed 500 characters");
    });

    it("accepts unicode characters in title", () => {
      const task = createTask({ title: "日本語タスク" });
      expect(task.title).toBe("日本語タスク");
    });

    it("accepts symbols in title", () => {
      const task = createTask({ title: "Fix bug #42 @ $100 (urgent)!" });
      expect(task.title).toBe("Fix bug #42 @ $100 (urgent)!");
    });

    it("stores XSS-like title as plain text", () => {
      const task = createTask({ title: "<script>alert('xss')</script>" });
      expect(task.title).toBe("<script>alert('xss')</script>");
    });

    it("stores SQL injection-like title as plain text", () => {
      const task = createTask({ title: "'; DROP TABLE tasks; --" });
      expect(task.title).toBe("'; DROP TABLE tasks; --");
    });

    it("accepts special characters in description", () => {
      const task = createTask({
        title: "My task",
        description: "Use & replace <br> with \n newline",
      });
      expect(task.description).toBe("Use & replace <br> with \n newline");
    });
  });

  describe("getAllTasks", () => {
    it("returns empty array when no tasks exist", () => {
      expect(getAllTasks()).toEqual([]);
    });

    it("returns all created tasks", () => {
      createTask({ title: "Task 1" });
      createTask({ title: "Task 2" });

      expect(getAllTasks()).toHaveLength(2);
    });
  });

  describe("getTaskById", () => {
    it("returns the task if it exists", () => {
      const created = createTask({ title: "Find me" });
      const found = getTaskById(created.id);

      expect(found?.title).toBe("Find me");
    });

    it("returns undefined for non-existent id", () => {
      expect(getTaskById("non-existent")).toBeUndefined();
    });
  });

  describe("updateTask", () => {
    it("updates the title", () => {
      const task = createTask({ title: "Old title" });
      const updated = updateTask(task.id, { title: "New title" });

      expect(updated.title).toBe("New title");
    });

    it("marks task as completed", () => {
      const task = createTask({ title: "Do laundry" });
      const updated = updateTask(task.id, { completed: true });

      expect(updated.completed).toBe(true);
    });

    it("updates the description", () => {
      const task = createTask({ title: "My task", description: "Old description" });
      const updated = updateTask(task.id, { description: "New description" });

      expect(updated.description).toBe("New description");
    });

    it("throws for non-existent task", () => {
      expect(() => updateTask("fake-id", { title: "Nope" })).toThrow(
        "Task not found"
      );
    });
  });

  describe("deleteTask", () => {
    it("deletes an existing task", () => {
      const task = createTask({ title: "Delete me" });

      expect(deleteTask(task.id)).toBe(true);
      expect(getAllTasks()).toHaveLength(0);
    });

    it("returns false for non-existent task", () => {
      expect(deleteTask("fake-id")).toBe(false);
    });
  });
});
