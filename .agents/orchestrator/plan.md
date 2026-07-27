# Project Plan - Airo ISP Migration & Integration

## Objectives
1. Resolve styling and scrolling issues in the standalone `todo-app`.
2. Reconstruct public landing and auth pages in the new Next.js frontend `frontend_new` using the legacy compiled pages as a reference.
3. Build out the backend REST API in `airo-backend` with Express and SQLite/MySQL connection.
4. Integrate the client frontend pages with the new backend REST API (auth, dashboard data, tickets).
5. Verify and audit the entire system using E2E tests and Forensic Auditor.

## Milestones
| Milestone | Description | Status |
|-----------|-------------|--------|
| M1: Initialization | Create `PROJECT.md`, `plan.md`, `progress.md` and start heartbeat. | Done |
| M2: Exploration | Dispatch Explorer to analyze the codebase for tasks/requirements. | Done |
| M3: Todo-App Fixes | Scope button selector styling and allow body scroll on small viewports. | Done |
| M4: Frontend Reconstruction | Port public landing, auth, and blog pages to Next.js App Router. | Done |
| M5: Backend Express API | Set up Node.js server package.json, Express router, and database schemas. | Done |
| M6: Client-Backend Integration | Update frontend forms to use API auth and ticket submission. | Done |
| M7: Testing & Auditing | Run E2E verification test suite and Forensic Auditor checks. | Done |
