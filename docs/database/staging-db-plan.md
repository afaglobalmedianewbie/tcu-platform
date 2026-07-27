# TCU Platform - Staging Database Plan

> **STATUS:** DRAFT - For Implementation Planning
> **DATE:** 2026-07-14

## 1. Overview
To ensure Prisma schema migrations and data scripts run perfectly on production, they must first be tested against a Staging Database. The staging database will run in isolation using Docker Compose and will contain a sanitized snapshot of the production data.

## 2. Staging Database Architecture
- **Container:** `tcu-db-staging`
- **Engine:** PostgreSQL 15 (matching production)
- **Port Binding:** Localhost only (`127.0.0.1:55432`) to prevent public exposure.
- **Network:** Isolated Docker bridge network `tcu_staging_net`.
- **Volumes:** Local volume `tcu_staging_db_data` for persistence between container restarts.

## 3. Data Population Strategy
1. **Take Production Snapshot:** Use `pg_dump` to extract the current production database.
2. **Data Sanitization (Optional but Recommended):** Run a script to anonymize sensitive customer data (passwords, specific emails) before importing if this DB will be accessed by external developers.
3. **Import to Staging:** Use `pg_restore` or `psql` to load the snapshot into the `tcu-db-staging` container.

## 4. Phase 1 Testing Workflow
1. Apply the Phase 1 schema migration (`npx prisma migrate deploy`) against the staging database.
2. Run the legacy-to-Phase1 data migration script (e.g., `node migrate-phase1.js`) targeting the staging DB.
3. Run integration tests or backend regression tests against the staging DB to confirm legacy routes and new routes both work correctly with the new structure.

## 5. Rollback and Reset
If a test migration corrupts the staging database, simply:
1. `docker-compose -f docker-compose.staging-db.yml down -v` (destroys the volume).
2. `docker-compose -f docker-compose.staging-db.yml up -d` (recreates a fresh DB).
3. Re-import the production snapshot.
