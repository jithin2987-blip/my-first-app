# my-first-app

A sample **Task Manager REST API** built with Node.js, TypeScript, and Express. This project is designed to demonstrate a clean project structure, unit/integration testing, and Docker-based deployment.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **Testing**: Vitest + Supertest
- **Containerization**: Docker / Docker Compose

## Project Structure

```
src/
├── server.ts               # HTTP server entry point
├── app.ts                  # Express app configuration
├── routes/tasks.ts         # Task API routes
├── models/task.ts          # Task data model
├── services/taskService.ts # Business logic
└── middleware/errorHandler.ts

tests/
├── unit/taskService.test.ts    # Unit tests
└── integration/tasks.test.ts   # Integration tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

### Running the App

```bash
# Development (with hot-reload)
npm run dev

# Production
npm run build
npm start
```

The server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Docker

```bash
# Build and run with Docker Compose
docker compose up --build
```

The app will be available at `http://localhost:3000`.

## Linting

```bash
npm run lint
```
