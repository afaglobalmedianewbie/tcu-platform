# TCU Platform - Migration Safety Checklist

> **STATUS:** MANDATORY
> **Enforcement:** Every Database Migration to Production must pass this checklist.

## Pre-Migration Approval
- [ ] **Phase Isolation:** The migration SQL applies *only* to the intended Phase (e.g., Phase 1 core models). No accidental tables from future phases are included.
- [ ] **No Destructive Commands:** The generated `migration.sql` file has been manually reviewed and contains exactly zero `DROP TABLE` or `DROP COLUMN` commands.
- [ ] **Foreign Key Safety:** All critical 1-to-many relationships (like `Customer` -> `Invoice`) explicitly use `ON DELETE RESTRICT`.
- [ ] **Legacy Preservation:** Legacy tables (`radcheck`, `radacct`, `nas`, etc.) are completely untouched by the migration script.

## Staging Validation
- [ ] **Staging Dry Run:** `npx prisma migrate deploy` completed successfully on `tcu-db-staging`.
- [ ] **Data Seed / Mapping Script:** The legacy-to-new-schema data migration script ran successfully on staging without errors.
- [ ] **Regression Test:** Legacy API endpoints continue to work correctly against the staging DB after the new tables were added (proving no interference).

## Production Execution
- [ ] **Maintenance Window:** Migration is scheduled during off-peak hours (e.g., 02:00 AM - 04:00 AM).
- [ ] **Full Backup:** A `pg_dump` of the production PostgreSQL database has been captured and verified locally *immediately* prior to execution.
- [ ] **Rollback Plan Verified:** The team knows exactly how to revert to the DB snapshot and point NGINX back to the old containers if the migration fails.

## Post-Migration Verification
- [ ] **Sanity Check:** Core API endpoints return expected data.
- [ ] **Network Check:** RADIUS authentication remains online (Mikrotik routers can still connect and authenticate PPPoE users).
- [ ] **Billing Check:** The auto-isolate cron job is functioning correctly without crashing due to schema changes.
