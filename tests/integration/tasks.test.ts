// ─── Integration Tests ───────────────────────────────────────
// Test the full HTTP layer: routes + middleware + services together.
// Uses supertest to make requests without starting a real server.

import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { clearAllTasks } from "../../src/services/taskService";

describe("Task API", () => {
  beforeEach(() => {
    clearAllTasks();
  });

  describe("GET /health", () => {
    it("returns ok status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /api/tasks", () => {
    it("creates a new task", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Learn testing", description: "With vitest" });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Learn testing");
      expect(res.body.description).toBe("With vitest");
      expect(res.body.id).toBeDefined();
    });

    it("returns 400 for missing title", async () => {
      const res = await request(app).post("/api/tasks").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Title is required");
    });

    it("accepts unicode characters in title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Ação: Réunion à Paris" });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Ação: Réunion à Paris");
    });

    it("accepts symbols in title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Task #1 & #2 — due @ 5pm!" });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Task #1 & #2 — due @ 5pm!");
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("returns 404 for non-existent task", async () => {
      const res = await request(app).get("/api/tasks/fake-id");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });
  });

  describe("GET /api/tasks", () => {
    it("returns all tasks", async () => {
      await request(app).post("/api/tasks").send({ title: "Task A" });
      await request(app).post("/api/tasks").send({ title: "Task B" });

      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("updates an existing task", async () => {
      const created = await request(app)
        .post("/api/tasks")
        .send({ title: "Original" });

      const res = await request(app)
        .patch(`/api/tasks/${created.body.id}`)
        .send({ title: "Updated", completed: true });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated");
      expect(res.body.completed).toBe(true);
    });

    it("returns 404 for non-existent task", async () => {
      const res = await request(app)
        .patch("/api/tasks/fake-id")
        .send({ title: "Nope" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("deletes an existing task", async () => {
      const created = await request(app)
        .post("/api/tasks")
        .send({ title: "Bye" });

      const res = await request(app).delete(
        `/api/tasks/${created.body.id}`
      );

      expect(res.status).toBe(204);
    });

    it("returns 404 for non-existent task", async () => {
      const res = await request(app).delete("/api/tasks/fake-id");

      expect(res.status).toBe(404);
    });
  });
});
