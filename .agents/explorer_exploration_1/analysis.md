# Codebase Gap Analysis Report — Airo ISP Project

## Executive Summary
This report analyzes the gaps, bugs, and integration issues across the codebase components of the Airo ISP project, located in `/home/tcu/`. We compare the static legacy frontend (`/home/tcu/frontend/tcu.nsku.net/`) with the new Next.js 16.2 frontend (`/home/tcu/frontend_new/`), investigate the Node.js backend (`/home/tcu/airo-backend/`), and inspect the standalone To-Do app (`/home/tcu/todo-app/`).

---

## 1. Structure of the Legacy vs. New Frontend

### Legacy Frontend (`/home/tcu/frontend/tcu.nsku.net/`)
The legacy frontend consists of statically exported production files from a Next.js application. 
- **Code Availability**: The original source code for the legacy frontend is **missing** from the workspace. Only the compiled production assets (HTML pages, compiled JavaScript chunks, CSS) are available.
- **Routing & File Mapping**:
  - `index.html`: Main landing page.
  - `paket.html`: Packages page showing Home 20 Mbps, Home 50 Mbps, and Business 100 Mbps.
  - `coverage.html`: Network coverage checking interface.
  - `tentang.html`: About PT Top Class Universal.
  - `blog.html`: Articles and insight page.
  - `kontak.html`: Company contact details.
  - `blog/Kemajuan Digitalisasi.html`: Individual blog article page.
  - `app/login.html`: Portal pelanggan login page.
  - `app/daftar?paket=...html`: Registration form pre-selected by package URL query parameter.
- **API Communication**: The compiled JavaScript files (specifically `/app/_next/static/chunks/898-82ab5d621e232d79.js`) reveal a helper class `hi` routing API requests to `https://tcu.nsku.net/api/` with authentication token management (`tcu_access`, `tcu_refresh`, `tcu_user` in LocalStorage).

### New Next.js Frontend (`/home/tcu/frontend_new/`)
The new frontend is built using Next.js 16.2.10 and React 19.2.4 with App Router (`src/app/`).
- **Layout & CSS**: A custom dark-themed UI with glassmorphic styles is defined in `src/app/globals.css`.
- **Active Routes**:
  - `app/page.js`: A single-page mockup of the landing page. It has sections for pricing, coverage check, and company info but lacks separate page routes.
  - `app/login/page.js`: Simulated tabs for Login and Register.
  - `app/dashboard/`: Customer Portal mockup (includes `tagihan/`, `bantuan/`, `dokumen/`, and `notifikasi/`). All pages contain static mock datasets.
  - `app/admin/`: Admin Panel mockup (includes `pelanggan/` and `billing/`). All pages use static hardcoded values.

---

## 2. Gaps and Missing Features in `frontend_new`

| Component / Page | Legacy Implementation Status | `frontend_new` Implementation Status | Identified Gaps / Missing Items |
| :--- | :--- | :--- | :--- |
| **Landing Pages** | Separate routes (`/paket`, `/coverage`, `/tentang`, `/kontak`) | Inline sections on `/` | Lacks dedicated subpages. Clicking navbar links shifts view via anchor links (`#paket`, `#coverage` etc.) instead of navigation. |
| **Blog System** | Index `/blog` and dynamic page `/blog/[slug]` | None | Missing `/blog` route and dynamic slug `/blog/[slug]`. Legacy blog contains article `Kemajuan Digitalisasi`. |
| **Registration Form** | Pre-fills package select via `?paket=ID` query parameter | Simple text fields, no parameter extraction | Registration in `/login` does not extract packages or initialize default selections. |
| **Secondary Auth Pages** | Links to `/otp`, `/lupa-password`, `/daftar` | None | Clicking `/otp` or `/lupa-password` links leads to missing page errors as these files/routes do not exist. |
| **Customer Portal** | Functional portal integrated with `/api` | Hardcoded Client-side routing mockup | Forms submit with dummy data and use `router.push('/dashboard')` without API handshakes. |
| **Admin Operations** | N/A (Admin panels not exported in legacy static HTML) | Partial mockup | Several sidebar-listed admin pages are **missing from the directory**: `/admin/crm`, `/admin/crm/survey`, `/admin/paket`, `/admin/payment`, `/admin/ticketing`, `/admin/notifikasi`, `/admin/radius`, `/admin/vpn`, `/admin/teknisi`, `/admin/cms`, `/admin/users`, `/admin/audit`. Only dashboard, customers (`pelanggan`), and billing exist. |

---

## 3. Backend (API) Status and Database Setup

### Backend Architecture (`/home/tcu/airo-backend/`)
The backend is a skeletal Node.js server containerized with Docker.
- **Dependency Issues**: The directory has no `package.json`. Only a boilerplate `package-lock.json` with an empty `packages` object exists.
- **Database Status**: No database is configured. No database drivers (such as `pg`, `mysql2`, `sqlite3`, `mongoose`) or ORMs (such as Prisma or Sequelize) are installed or imported.
- **Endpoint Gaps**: The server (`server.js`) utilizes the standard `http` library to listen on port 3000, responding with a static version JSON for every request. There is no routing logic for authentication, customer registration, ticketing, billing, or administration.
- **Reverse Proxy Routing**: The host's Nginx configuration (`/home/tcu/afaglobalmedia_nginx.conf`) routes requests to `/api/` to `http://127.0.0.1:3000/`. Because the backend server has no routing, calling any API endpoint (e.g., `/api/auth/login`) currently yields the generic success response payload.

---

## 4. Inspection of Standalone To-Do App (`/home/tcu/todo-app/`)

### Technical Details
A clean, interactive HTML/JS application displaying glassmorphism design. It saves tasks to browser `localStorage`.

### Identified Issues & Bugs
1. **Scrolling Issue on Small Screens**: 
   `body` is styled with `overflow: hidden; height: 100vh;` and the background shapes use `position: absolute;`. If the viewport height is very small (such as mobile landscape orientation) and the container exceeds this height, the page cannot scroll. The top/bottom contents are cut off.
   *Fix Recommendation*: Set `.background` to `position: fixed;` and remove `overflow: hidden;` from `body` or replace it with `overflow-y: auto;`.
2. **CSS Specifity Overlaps**:
   The general `button` selector applies aggressive styles (background linear gradient, purple shadow, padding) which leak into child components such as `.task-content` and `.delete-btn`. These elements have to manually nullify properties like `background` and `box-shadow`.
   *Fix Recommendation*: Scope the general button rules to specific classes (e.g. `.btn-add`, `.btn-action`) instead of styling the naked `button` tag globally.

---

## 5. Summary of Recommendations

### Frontend Porting & Migrations
1. **Reconstruct Public Landing Pages**: Recreate `/paket`, `/coverage`, `/tentang`, `/kontak`, `/blog`, and `/blog/[slug]` inside the `frontend_new` Next.js App Router structure. Reference the legacy static exported HTML for textual assets.
2. **Re-implement OTP and Forgot Password**: Create `/login/otp` and `/login/forgot-password` pages.
3. **Fix Blog HTML Bug**: The legacy blog article `blog/Kemajuan Digitalisasi.html` contains an escaped HTML page nested as text inside a content div. During porting, this content should be parsed or rewritten as normal markup/markdown.

### Backend and Database Integration
1. **Initialize Backend Workspace**: Create `package.json` in `airo-backend` and install required dependencies (e.g., Express, CORS, Dotenv, and DB drivers).
2. **Configure Database Schema**: Establish a relational database (PostgreSQL/MySQL) to manage schemas for `Users`, `Customers`, `Invoices`, `Tickets`, `Packages`, and `Audit Logs`. Integrate ORM (like Prisma) for migration management.
3. **Implement Key Endpoints**: Build route handlers for:
   - `/auth/login` and `/auth/register` (handling customer onboarding and session keys).
   - `/customers` (Admin CRUD operations).
   - `/invoices` (billing generation and payments).
   - `/tickets` (customer portal ticketing submissions).

### Todo-App UI Polish
- Restructure CSS to use scoped classes, make `.background` a fixed overlay, and allow scrolling on small devices.
