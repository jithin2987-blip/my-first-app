// ─── Unit Tests: Error Handler Middleware ─────────────────────
// Tests the error handler in isolation using mock Express objects.

import { describe, it, expect, vi } from "vitest";
import { errorHandler } from "../../src/middleware/errorHandler";
import { Request, Response, NextFunction } from "express";

describe("errorHandler", () => {
  it("returns 500 with the error message", () => {
    const err = new Error("Something went wrong");
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
