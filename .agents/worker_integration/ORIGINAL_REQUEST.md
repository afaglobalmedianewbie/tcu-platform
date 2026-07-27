## 2026-07-05T20:22:05Z
You are the Worker agent. Your task is to integrate the client pages in `frontend_new` with the backend REST API endpoints.

Your working directory is `/home/tcu/.agents/worker_integration`.

Please implement the following changes in `/home/tcu/frontend_new`:

1. Update `src/app/login/page.js`:
   - Implement state hooks for forms:
     - Login: `email`, `password`.
     - Register: `full_name`, `whatsapp`, `email`, `password`, `package_id`. (Extract `paket` from query params as default `package_id`).
   - In the login form submit handler:
     - Make a `POST` request to `/api/auth/login` sending the JSON payload `{ email, password }`.
     - On success: save the `token` and `user` object to `localStorage` (keys: `tcu_token`, `tcu_user`). If user's role is `'admin'`, redirect to `/admin`. Otherwise, redirect to `/dashboard`.
     - On failure: display an error message.
   - In the register form submit handler:
     - Make a `POST` request to `/api/auth/register` sending the JSON payload `{ email, password, full_name, whatsapp, package_id }`.
     - On success: save the `token` and `user` object to `localStorage` (keys: `tcu_token`, `tcu_user`). Redirect to `/dashboard`.
     - On failure: display an error message.

2. Update `src/app/dashboard/layout.js`:
   - Use a `useEffect` hook to read the user details from `localStorage` (key: `tcu_user`).
   - If not logged in, redirect to `/login` or handle gracefully with a mock fallback.
   - Update the user profile section at the bottom of the sidebar and header to dynamically display the logged-in user's initials, name, and ID/customer_id.
   - Implement the "Keluar" (Logout) button to clear `localStorage` and redirect to `/login`.

3. Update `src/app/dashboard/page.js`:
   - Use a `useEffect` hook to read the user details from `localStorage` (key: `tcu_user`) and display their name, customer ID, and package (from `user.package_id` or `'Popular 50 Mbps'`).
   - Retrieve and display the active ticket list from the API `GET /api/tickets?customer_id=[customer_id]` dynamically, or filter the tickets array.

4. Update `src/app/dashboard/bantuan/page.js`:
   - Fetch the list of tickets from `GET /api/tickets?customer_id=[customer_id]` on component mount using the logged-in customer's ID.
   - Add a functional stateful "Buat Tiket Baru" modal or inline form:
     - Form fields: `preferred_date`, `notes`.
     - On submit, make a `POST` request to `/api/tickets` with payload: `{ customer_id: user.customer_id, package_id: user.package_id || '20mbps', preferred_date, notes }`.
     - On success: reload the ticket list.

5. Update `src/app/admin/pelanggan/page.js`:
   - Fetch the list of customers from `GET /api/customers` on component mount.
   - Display these customers in the table. Match database columns: `id`, `full_name`, `email`, `whatsapp`, `status`, `package_id` (package). Add standard styling classes.

Verify that the Next.js frontend builds without syntax or compilation errors.

Deliver a handoff report at `/home/tcu/.agents/worker_integration/handoff.md` and send a message back to the orchestrator (conversation ID: 793a8de7-4803-406f-96e5-a9e4376cbecf) when done.
