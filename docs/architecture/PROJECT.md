# Project: Airo ISP Migration & Integration

## Architecture
The project workspace contains several modules:
- `airo-backend`: Node.js Express server running on port 3000, acting as the REST API for portal authentication, billing, and customer tickets.
- `frontend`: Legacy static frontend build files for reference.
- `frontend_new`: Next.js 16.2 web application representing the modernized version of the customer and admin portal.
- `todo-app`: Standalone HTML/JS task list with glassmorphism styling.
- `nginx`: Local routing proxy configuration.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Workspace Initialization | Initialize orchestrator configuration, state, and files. | None | DONE |
| M2 | Codebase Exploration | Dispatch Explorer to analyze gap differences between frontend versions. | M1 | DONE |
| M3 | Todo-App Bug Fixes | Resolve scrolling lock on small heights and button style leakages. | M2 | DONE |
| M4 | Frontend Reconstruction | Recreate missing pages (/paket, /coverage, /tentang, /kontak, /blog, /blog/[slug], /login/otp, /login/forgot-password) in `frontend_new` using legacy content. | M2 | DONE |
| M5 | Backend API Implementation | Set up `package.json`, initialize Express, and create database endpoints. | M2 | DONE |
| M6 | Client-Backend Integration | Connect Next.js login/register page and forms to communicate with the real backend. | M4, M5 | DONE |
| M7 | E2E Testing & Audit Verification | Establish verification test suites and run forensic audits. | M6 | DONE |

## Interface Contracts
- **Authentication**:
  - `POST /api/auth/register`: Create a new user account. Returns session token.
  - `POST /api/auth/login`: Verify credentials. Returns session token and user info.
- **Customer Support**:
  - `POST /api/tickets`: Create a new support ticket.
  - `GET /api/tickets`: Retrieve user's support tickets.
- **Client Routing**:
  - Legacy static landing pages will be integrated as native routes in `frontend_new`.

## Code Layout
- `/home/tcu/airo-backend/` - Node.js backend
- `/home/tcu/frontend/tcu.nsku.net/` - Legacy compiled frontend (Read-Only)
- `/home/tcu/frontend_new/` - Next.js App Router codebase
- `/home/tcu/todo-app/` - Standalone Todo App
- `/home/tcu/.agents/` - Coordination metadata
