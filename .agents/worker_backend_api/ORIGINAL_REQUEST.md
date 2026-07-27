## 2026-07-05T20:10:10Z
Implement the backend API in `/home/tcu/airo-backend`.

Your working directory is `/home/tcu/.agents/worker_backend_api`.

Please implement the following:
1. Initialize `/home/tcu/airo-backend/package.json` with the required scripts and dependencies: `express`, `cors`, `dotenv`, `mysql2`.
2. Create `/home/tcu/airo-backend/.env` with:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=topclass_portal
   ```
3. Implement `/home/tcu/airo-backend/server.js`:
   - It should use `express`, `cors`, and `dotenv`.
   - Configure a connection pool to the MySQL database `topclass_portal` using the environment variables.
   - Implement the following REST API endpoints:
     - `POST /api/auth/register`:
       - Accepts: `email`, `password`, `full_name`, `whatsapp`, and optionally `package_id`.
       - Inserts a customer into the `customers` table (generates a UUID for `id`, sets status to `'pending'`).
       - Inserts a user into the `users` table (generates a UUID for `id`, sets role to `'customer'`, saves the password hash, links it to the `customer_id` of the created customer).
       - Returns a success response with user info and a mock session token.
     - `POST /api/auth/login`:
       - Accepts: `email` and `password`.
       - Queries the `users` table for the matching email.
       - Validates credentials (comparing password hashes or simple verify).
       - Updates the `last_login` timestamp.
       - Returns a success response with the user info and a mock session token.
     - `POST /api/tickets` / `POST /api/installation`:
       - Inserts a request into `installation_requests` table or returns a success response.
     - `GET /api/customers`:
       - Retrieves a list of all customers from the `customers` table.
     - `GET /api/status`:
       - Returns status success and database connectivity status.
   - Set up the server to listen on port 3000.
4. Ensure the backend can start properly.
5. Deliver a handoff report at `/home/tcu/.agents/worker_backend_api/handoff.md` and send a message back to the orchestrator (conversation ID: 793a8de7-4803-406f-96e5-a9e4376cbecf) when done.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
