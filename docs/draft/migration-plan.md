# TCU Platform — Migration Plan DRAFT
# File: /home/tcu/docs/draft/migration-plan.md
# STATUS: DRAFT — FOR REVIEW ONLY.
# Architecture: Senior Database Architect & Identity Architect
# Date: 2026-07-14
#
# CRITICAL RULES DURING MIGRATION:
#   ❌ Do NOT run prisma migrate on production database
#   ❌ Do NOT stop, restart, or modify existing production services
#   ❌ Do NOT deploy Keycloak until Phase 3 is fully staged and tested
#   ❌ Do NOT change production Nginx config until Phase 4
#   ✅ All changes must be tested on staging environment first
#   ✅ Always take a full PostgreSQL dump before any schema change

---

## Overview

```
Production State (NOW)         Target State (AFTER MIGRATION)
─────────────────────────      ──────────────────────────────
bcrypt + JWT auth              Keycloak OIDC SSO
Plain string roles (ADMIN)     Keycloak Realm Roles + DB RBAC
12 models in schema.prisma     24 models (schema v2)
No fine-grained permissions    Full permission matrix (69 actions)
No VPN peer tracking           VpnPeer model
No notification model          Notification + Template model
No file attachment model       FileAttachment model
No RADIUS accounting           RadAcct, RadNas, RadGroupCheck/Reply
```

---

## Phase 0 — Staging Setup (Prerequisites)
**Goal:** Safe testing environment. NO production changes.

### 0.1 Create Staging Server / Docker Environment
```bash
# On a staging machine or separate Docker Compose namespace:
docker compose -f docker-compose.staging.yml up -d
# Services: tcu-db-staging (port 5434), tcu-backend-staging (port 3100)
```

### 0.2 Dump Production Database to Staging
```bash
# Run on production server — read only, no changes
docker exec tcu-db pg_dump -U tcu_user tcu_platform > /tmp/prod_backup_$(date +%Y%m%d).sql

# Copy dump to staging machine
scp /tmp/prod_backup_*.sql staging:/tmp/

# Restore to staging DB
psql -h localhost -p 5434 -U tcu_user -d tcu_platform_staging < /tmp/prod_backup_*.sql
```

### 0.3 Pin Staging Backend to Draft Schema
```bash
# On staging machine only:
cp /home/tcu/docs/draft/schema.prisma /home/tcu/tcu-backend/prisma/schema.prisma.draft
# DO NOT overwrite production schema.prisma
```

### 0.4 Validate Draft Schema Syntax (No DB connection required)
```bash
cd /home/tcu/tcu-backend
npx prisma validate --schema ./prisma/schema.prisma.draft
```

**Expected: ✅ Valid schema — no DB touched.**

---

## Phase 1 — Schema Preparation (Staging Only)
**Goal:** Validate v2 schema + generate migration SQL. NO production run.
**Duration:** 1–2 days
**Risk:** Zero — staging only

### 1.1 Replace Staging Schema and Generate Migration

> ⚠️ STAGING ONLY — never run on production

```bash
# On staging machine:
cp /home/tcu/docs/draft/schema.prisma /home/tcu/tcu-backend-staging/prisma/schema.prisma

# Generate migration SQL (--create-only prevents auto-run)
cd /home/tcu/tcu-backend-staging
npx prisma migrate dev --name v2_full_schema --create-only
```

This generates: `prisma/migrations/YYYYMMDD_v2_full_schema/migration.sql`

### 1.2 Review Generated SQL

Inspect the migration file carefully. Key points to verify:
```
✅ No DROP TABLE on existing tables
✅ All new tables are CREATE TABLE IF NOT EXISTS
✅ New columns use ALTER TABLE ... ADD COLUMN ... DEFAULT NULL
✅ Enum types are new CREATE TYPE statements
✅ Existing column renames are safe
✅ Indexes are added WITHOUT LOCK (PostgreSQL 16 supports CREATE INDEX CONCURRENTLY)
```

### 1.3 Apply to Staging DB

```bash
# On staging ONLY:
npx prisma migrate deploy
npx prisma db seed
```

### 1.4 Run Staging Backend + Integration Tests

```bash
# Verify all existing API endpoints still work
curl http://localhost:3100/api/status
curl -X POST http://localhost:3100/api/auth/login -d '{"email":"admin@topclass.id","password":"admin123"}'
# ... test all critical paths
```

**Acceptance Criteria:**
- [ ] All existing API endpoints return expected responses
- [ ] No `undefined` column references in query logs
- [ ] Seed data loads correctly
- [ ] New models (VpnPeer, Notification, FileAttachment) are queryable

---

## Phase 2 — Schema Migration on Production
**Goal:** Apply v2 schema to production database.
**Duration:** 1 maintenance window (~30 min)
**Risk:** Low — additive-only changes, no data loss

> ⚠️ PREREQUISITE: Phase 1 must be fully completed and tested on staging.

### 2.1 Maintenance Window — Pre-Steps
```bash
# 1. Full database backup (CRITICAL)
docker exec tcu-db pg_dump -U tcu_user tcu_platform > \
  /home/tcu/backups/pre_v2_migration_$(date +%Y%m%d_%H%M).sql

# 2. Verify backup is complete and readable
wc -l /home/tcu/backups/pre_v2_migration_*.sql

# 3. Production server NOT restarted — just verify containers are healthy
docker ps
```

### 2.2 Apply Migration to Production
```bash
# Copy reviewed migration SQL from staging to production backend:
# (Assuming same file structure)

# Apply ONLY the new migration (not full migrate dev):
docker exec tcu-backend npx prisma migrate deploy
# This runs ONLY the new migration file, nothing else
```

### 2.3 Post-Migration Verification
```bash
# Check all tables exist
docker exec tcu-db psql -U tcu_user -d tcu_platform -c "\dt"

# Check existing data is intact
docker exec tcu-db psql -U tcu_user -d tcu_platform -c \
  "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM customer_profiles; SELECT COUNT(*) FROM invoices;"

# Verify backend still starts cleanly
docker logs tcu-backend --tail 30
```

### 2.4 Rollback Plan (if issues occur)
```bash
# Rollback: Restore from pre-migration backup
docker exec -i tcu-db psql -U tcu_user -d tcu_platform < \
  /home/tcu/backups/pre_v2_migration_*.sql

# Restart backend with OLD schema
docker restart tcu-backend
```

---

## Phase 3 — Keycloak Deployment (Staging First)
**Goal:** Deploy and configure Keycloak. NO production traffic changes.
**Duration:** 2–3 days
**Risk:** Low — isolated new service, not in traffic path yet

### 3.1 Deploy Keycloak on Staging
```bash
# Add Keycloak to docker-compose.staging.yml
# Reference: /home/tcu/docs/draft/keycloak-realm.json for configuration

docker compose -f docker-compose.staging.yml up -d keycloak
```

### 3.2 Configure Keycloak Realm
1. Access http://staging-ip:8080/admin
2. Create realm: `tcu-platform`
3. Create clients: `tcu-frontend`, `tcu-backend`
4. Create realm roles: `admin`, `staff`, `technician`, `customer`
5. Create custom scope: `tcu-claims` with mappers (see keycloak-realm.json)
6. Create groups and assign default group `/TCU Customers`

### 3.3 Seed RBAC Data to PostgreSQL

> Run this seed script on STAGING first, then production after Keycloak is live.

```javascript
// /home/tcu/docs/draft/seed-rbac.js
// Reference implementation — review before running

const permissions = [
  { action: 'users:read_all', module: 'users' },
  { action: 'users:read_self', module: 'users' },
  // ... see rbac-mapping.md Section 3 for full list
];

const roles = [
  { name: 'admin', is_system: true, permissions: 'ALL' },
  { name: 'staff', is_system: true, permissions: [...] },
  { name: 'technician', is_system: true, permissions: [...] },
  { name: 'customer', is_system: true, permissions: [...] },
];
```

### 3.4 Backend Dual-Auth Mode
Add Keycloak token validation to backend WITHOUT removing bcrypt auth:

```javascript
// middleware/dualAuth.js
// Accepts BOTH: legacy bcrypt JWT and Keycloak OIDC tokens
// Strategy: try Keycloak validation first, fall back to legacy JWT
```

### 3.5 Staging End-to-End Test
- [ ] Login via Keycloak returns valid access_token
- [ ] Access token accepted by staging backend
- [ ] Claims (tcu_user_id, tcu_customer_id, roles) populated correctly
- [ ] Legacy JWT login still works during dual-auth mode
- [ ] Role-based access control works for all 4 roles

---

## Phase 4 — Frontend Keycloak Integration (Staging)
**Goal:** Update Next.js frontend to use Keycloak OIDC.
**Duration:** 3–5 days
**Risk:** Medium — UI changes, careful testing needed

### 4.1 Install NextAuth with Keycloak Provider

> Do this on a feature branch, not main.

```bash
cd /home/tcu/frontend_new
npm install next-auth@5
```

### 4.2 Configure Auth Provider
```javascript
// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.tcu_user_id = profile?.tcu_user_id;
        token.tcu_customer_id = profile?.tcu_customer_id;
        token.roles = profile?.roles;
        token.access_token = account.access_token;
      }
      return token;
    }
  }
});
```

### 4.3 Replace Login Flow
```
OLD: POST /api/auth/login → bcrypt verify → JWT issue
NEW: signIn('keycloak') → redirect to Keycloak → callback → session
```

### 4.4 Staging Frontend Integration Test
- [ ] Login redirects to Keycloak login page
- [ ] After login, session contains correct claims
- [ ] Dashboard loads with correct role-based UI
- [ ] Logout clears session and redirects

---

## Phase 5 — Production Keycloak Deployment
**Goal:** Deploy Keycloak to production. Migrate existing users.
**Duration:** 1 maintenance window (2–4 hours) + 1 week soft launch
**Risk:** High — requires careful user migration strategy

> ⚠️ DO NOT proceed until Phases 1–4 are fully validated on staging.

### 5.1 Deploy Keycloak to Production
```bash
# Add to production docker-compose.yml
# Behind Nginx at: auth.topclassuniversal.co.id

# Keycloak data volume: /home/tcu/volumes/keycloak/
```

### 5.2 Nginx Configuration (NEW — review before applying)
```nginx
# Add to Nginx config — DO NOT modify existing blocks
server {
    listen 443 ssl;
    server_name auth.topclassuniversal.co.id;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 User Migration to Keycloak

> Users must be migrated to Keycloak. Passwords cannot be migrated (bcrypt hash is one-way).
> Strategy: Forced password reset on first Keycloak login.

```bash
# Export user list from production DB
docker exec tcu-db psql -U tcu_user -d tcu_platform -c \
  "COPY (SELECT id, email, full_name, system_role FROM users WHERE status = 'ACTIVE') TO STDOUT CSV HEADER" > \
  /tmp/users_export.csv

# Use Keycloak Admin API to create users (script):
# /home/tcu/docs/draft/migrate-users-to-keycloak.sh
# - Creates user in Keycloak with email
# - Sets required action: UPDATE_PASSWORD
# - Sets custom attributes: tcu_user_id, tcu_customer_id
# - Does NOT assign temporary password (user must reset via email)

# After Keycloak import, update PostgreSQL keycloak_id column:
# UPDATE users SET keycloak_id = '<kc_uuid>' WHERE email = '<email>';
```

### 5.4 Soft Launch (Dual-Auth Period — 2 weeks)
- Both bcrypt login and Keycloak login work simultaneously
- Monitor login_logs.method to track migration progress
- Support team informs customers to reset passwords via email link
- Target: 100% of staff/admin on Keycloak by day 3; customers by day 14

### 5.5 Phase 5 Acceptance Criteria
- [ ] All staff and admin successfully login via Keycloak
- [ ] All migrated customers can login and access portal
- [ ] No critical errors in backend logs
- [ ] Keycloak admin console shows healthy realm status
- [ ] All tokens validated correctly by backend middleware

---

## Phase 6 — Deprecate Legacy Auth (Final)
**Goal:** Remove bcrypt auth, clean up schema.
**Duration:** 1–2 days
**Risk:** Low — all users already on Keycloak

> ⚠️ DO NOT proceed until 100% of active users confirmed on Keycloak (check login_logs).

### 6.1 Disable Legacy Auth Endpoints
```javascript
// Mark as deprecated, return 410 Gone
app.post('/api/auth/login', (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'Legacy login deprecated. Use Keycloak SSO.' 
  });
});
```

### 6.2 Schema Cleanup Migration (Staging → Production)
```sql
-- STAGING ONLY until verified:
-- Remove legacy auth columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_secret;
-- keycloak_id column remains and becomes NOT NULL:
ALTER TABLE users ALTER COLUMN keycloak_id SET NOT NULL;
```

### 6.3 Remove Legacy Dependencies
```bash
# Remove from package.json after verification:
npm uninstall bcryptjs otplib qrcode
```

---

## Timeline Summary

```
Week 1   [Phase 0] Staging environment setup
Week 1   [Phase 1] Schema v2 on staging — syntax + migration SQL review
Week 2   [Phase 2] Schema migration on PRODUCTION (maintenance window)
Week 2-3 [Phase 3] Keycloak on staging — realm config + RBAC seed + dual-auth backend
Week 3-4 [Phase 4] Frontend Keycloak integration on staging
Week 4   [Phase 5] Keycloak on PRODUCTION + user migration
Week 5-6 [Phase 5] Soft launch — dual auth period, user migration monitoring
Week 6   [Phase 6] Disable legacy auth
Week 7   [Phase 6] Schema cleanup (remove password_hash etc.)
```

---

## Rollback Triggers

| Condition | Rollback Action |
|---|---|
| Phase 2 DB migration errors | Restore from pre_v2_migration backup |
| Phase 3 Keycloak auth failures | Keep dual-auth — disable Keycloak path |
| Phase 5 user login failures > 5% | Extend dual-auth period; do not disable bcrypt |
| Phase 6 breaking changes | Re-add legacy endpoints from git history |

---

## Backup Schedule During Migration

```
Before Phase 2:  Full pg_dump → /home/tcu/backups/pre_v2_*.sql
Before Phase 5:  Full pg_dump → /home/tcu/backups/pre_keycloak_*.sql
Before Phase 6:  Full pg_dump → /home/tcu/backups/pre_legacy_auth_removal_*.sql
```

Existing cron backup (0 2 * * *) continues unchanged throughout.
