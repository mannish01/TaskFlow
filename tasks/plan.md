# Implementation Plan: TaskFlow

Source spec: /home/manish/Obsidian/ManishPersonalVault/50 Skills/MERN/00 MERN stack developer start here.md (Project 1, lines 151-161)

## Overview
A focused MERN + TypeScript task manager: JWT in httpOnly cookies, per-user task CRUD, status and due-date filters, protected API routes, responsive React UI, tests, CI and deployment config. No AI, payments, WebSockets or second database.

## Architecture Decisions
- Express 4 + TypeScript strict, Zod at every request boundary, one consistent error envelope.
- Mongoose `User` and `Task` models; `Task.user` is a required ObjectId ref with an index on `(user, status, dueDate)`.
- Auth via bcryptjs password hash + signed JWT in an httpOnly, SameSite=Lax cookie. CSRF risk reduced by SameSite plus JSON-only API; no localStorage token.
- React 18 + Vite + Tailwind + react-router; credentials: 'include' on every API call.
- Tests: Jest + Supertest for API slices with mongodb-memory-server; Vitest + React Testing Library for one UI slice.

## Task List
### Phase 1: Foundation
- [ ] Task 1: Scaffold monorepo, configs, env example, Docker and CI.
- [ ] Task 2: Server foundation: config, DB, models, Zod schemas, error middleware, auth helpers.

### Checkpoint: Foundation
- [ ] Server builds; config loads from .env.example.

### Phase 2: Core Features
- [ ] Task 3: Auth slice — register/login/logout/me + API tests.
- [ ] Task 4: Task CRUD slice — ownership enforcement, filters, pagination + API tests.

### Checkpoint: Core Features
- [ ] All tests pass; a user cannot read another user's tasks.

### Phase 3: UI and Documentation
- [ ] Task 5: Client — API client, auth context, login/register, task dashboard + UI test.
- [ ] Task 6: README with architecture diagram, API table, screenshots section and failure write-up.

### Checkpoint: Complete
- [ ] `npm run build` and `npm test` pass; repo pushed to GitHub.

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| mongodb-memory-server binary download blocked | Med | Fall back to pure unit tests for validation/auth helpers and document it |
| Cookie SameSite blocks localhost cross-origin dev | Low | Vite proxy `/api` to Express; same-origin in dev |
| Time | Med | Keep UI to three screens; no extra features |

## Open Questions
- None; the spec fixes scope.
