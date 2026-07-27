# TCU Platform - Agent Task Board

## ✅ Completed Tasks (Architecture & Planning Phase)
- [x] **Discovery:** Analyzed legacy `server.js` (2000+ lines) and reverse-engineered business logic (CRM, RADIUS, Auto-Isolir).
- [x] **Schema Design:** Drafted full v2 Prisma Schema (44 models across 11 modules).
- [x] **Schema Review:** Executed Production Safety Review (identified and mitigated 11 critical risks).
- [x] **IAM Design:** Designed Keycloak realm, clients, roles, and groups (`tcu-platform-realm.draft.json`).
- [x] **Phasing Strategy:** Created Phase 1 Implementation Plan (isolating core identity and billing).
- [x] **Staging Setup:** Generated `docker-compose.staging-db.yml` and `.env.staging-db`.
- [x] **Keycloak Staging:** Drafted Keycloak Staging Deployment Plan.

## 🔄 Current / Next Tasks (Implementation Phase 1)
- [ ] **Data Migration Script:** Write Node.js script to map legacy users and profiles to the new Phase 1 schema.
- [ ] **Backend Dual-Auth:** Develop `keycloakAuth.js` middleware for the Express backend.
- [ ] **Frontend NextAuth:** Scaffold Keycloak OIDC integration in the Next.js frontend.
- [ ] **RBAC Seed:** Create `seed-rbac.js` to populate the 69 permissions and system roles into PostgreSQL.
- [ ] **Staging Execution:** Bring up the staging DB and run the dry-run migrations.

## ⏳ Pending (Phase 2 & 3)
- [ ] Phase 2 Schema Extraction (CRM, FTTH, RADIUS tracking).
- [ ] Phase 3 Schema Extraction (VPN, Notifications).
- [ ] Production Cutover (Drop legacy auth).
