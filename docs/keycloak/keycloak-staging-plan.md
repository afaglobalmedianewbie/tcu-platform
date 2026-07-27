# TCU Platform - Keycloak Staging Deployment Plan

> **STATUS:** DRAFT - For Implementation Planning
> **DATE:** 2026-07-14
> **NOTE:** No deployment has been executed yet. This plan does not modify existing frontend logic, backend JWT validation, or production NGINX configs.

---

## 1. Keycloak Staging Architecture

To ensure zero impact on production services, the Keycloak staging environment will be deployed as a completely isolated subsystem.

- **Component 1: Keycloak Server** (`tcu-keycloak-staging`)
  - Running Keycloak (latest stable, e.g., v24.x).
  - Port bound securely to localhost `127.0.0.1:8081` to prevent external access until NGINX routes are explicitly configured later.
  - Automatically imports the draft realm on startup.

- **Component 2: Staging Database** (`tcu-db-staging`)
  - Running PostgreSQL 15/16.
  - Isolated from the production database.
  - Stores Keycloak user sessions, tokens, and realm configurations.

- **Networking:**
  - Both containers run on a dedicated Docker bridge network (`keycloak_staging_net`).
  - Completely detached from the production `app_net`.

---

## 2. Docker Compose Draft (`docker-compose.keycloak-staging.yml`)

```yaml
name: tcu-keycloak-staging-stack

services:
  tcu-db-staging:
    image: postgres:15-alpine
    container_name: tcu-db-staging
    restart: unless-stopped
    env_file:
      - .env.keycloak-staging
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-tcu_keycloak_staging}
      POSTGRES_USER: ${POSTGRES_USER:-keycloak}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - tcu_keycloak_db_data:/var/lib/postgresql/data
    networks:
      - keycloak_staging_net

  tcu-keycloak-staging:
    image: quay.io/keycloak/keycloak:latest
    container_name: tcu-keycloak-staging
    restart: unless-stopped
    depends_on:
      - tcu-db-staging
    env_file:
      - .env.keycloak-staging
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://tcu-db-staging:5432/${POSTGRES_DB:-tcu_keycloak_staging}
      KC_DB_USERNAME: ${POSTGRES_USER:-keycloak}
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
      KC_HOSTNAME: localhost
      KC_HOSTNAME_PORT: 8081
      KC_HOSTNAME_STRICT: "false"
      KC_HOSTNAME_STRICT_HTTPS: "false"
      KC_HTTP_ENABLED: "true"
      KC_PROXY: edge
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN_USER:-admin}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
    command: 
      - start-dev
      - --import-realm
    ports:
      - "127.0.0.1:8081:8080"
    volumes:
      # Mount the realm draft directly into the import directory
      - ./infrastructure/keycloak/drafts/tcu-platform-realm.draft.json:/opt/keycloak/data/import/tcu-platform-realm.draft.json:ro
    networks:
      - keycloak_staging_net

volumes:
  tcu_keycloak_db_data:

networks:
  keycloak_staging_net:
    driver: bridge
```

---

## 3. Environment Variables (`.env.keycloak-staging`)

```env
# Database Credentials for Keycloak Staging
POSTGRES_DB=tcu_keycloak_staging
POSTGRES_USER=keycloak
POSTGRES_PASSWORD=CHANGE_ME_SECURE_DB_PASSWORD

# Keycloak Master Admin Credentials
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=CHANGE_ME_SECURE_ADMIN_PASSWORD
```
> **Security Rule:** Replace `CHANGE_ME_*` passwords before actual deployment. No production passwords should be used here.

---

## 4. Realm Import Plan

The realm draft (`infrastructure/keycloak/drafts/tcu-platform-realm.draft.json`) contains our target configuration:
- Realm: `tcu-platform`
- Clients: `tcu-admin-portal`, `tcu-customer-portal`, `tcu-technician-app`, `tcu-api`
- All necessary roles, groups, and permissions.

**Execution Strategy:**
By mapping the JSON file into `/opt/keycloak/data/import/` and passing the `--import-realm` flag in the Docker command, Keycloak will automatically seed the `tcu-platform` realm on its very first boot. No manual clicking through the admin UI is required to set up the baseline.

---

## 5. Backend Integration Plan

**Current State:** The production backend uses a local bcrypt/JWT validation mechanism.
**Target State:** The backend must support both local JWTs and Keycloak OIDC tokens (Dual-Auth).

**Plan (To be executed in isolated branches):**
1. Do NOT modify the production backend container yet.
2. Develop a `keycloakAuth.js` middleware in the Node.js API codebase.
3. Fetch the Keycloak public keys from `http://127.0.0.1:8081/realms/tcu-platform/protocol/openid-connect/certs` (or use a library like `jwks-rsa`).
4. Update API routes to check for a Keycloak token; if invalid or missing, fallback to the legacy JWT checker.
5. Deploy this backend update to staging first to ensure it successfully reads tokens from the `tcu-keycloak-staging` instance without breaking legacy logins.

---

## 6. Frontend Integration Plan

**Current State:** Frontend uses a custom login form hitting `/api/auth/login`.
**Target State:** Frontend redirects to Keycloak's login page, manages session via `next-auth`.

**Plan (To be executed in isolated branches):**
1. Do NOT modify the production frontend container.
2. Branch the Next.js code and install `next-auth` (or equivalent OIDC client).
3. Configure `next-auth` to point to `http://127.0.0.1:8081/realms/tcu-platform`.
4. Run the frontend locally (e.g., `localhost:3001`). It will communicate with the Keycloak staging container via the localhost port bind.
5. Verify login flows, token acquisition, and role-based UI rendering based on the Keycloak JWT claims.

---

## 7. Rollback Plan

Because this deployment is entirely isolated and binds only to localhost, the blast radius to production is **zero**. 

If the staging deployment fails or consumes too many VPS resources:
1. Stop the staging containers: `docker-compose -f docker-compose.keycloak-staging.yml down`
2. Erase the staging data volumes: `docker volume rm <project_name>_tcu_keycloak_db_data`
3. Since production NGINX, Frontend, and Backend were not modified, the primary systems will remain 100% operational and unaware of the staging tear-down.
