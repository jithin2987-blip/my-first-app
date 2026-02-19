// ─── App Setup ───────────────────────────────────────────────
// Creates and configures the Express app. Separated from server.ts
// so tests can import the app without starting the HTTP server.

import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);

// Error handling (must be registered last)
app.use(errorHandler);

export default app;
