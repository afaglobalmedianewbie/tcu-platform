# TCU Platform - Keycloak Identity & Access Management Design

> **STATUS:** DRAFT - For Architecture Review
> **DATE:** 2026-07-14
> **NOTE:** This document is for design purposes only. No deployment or modification to production systems has been executed.

---

## 1. Realm Design

The Keycloak Realm serves as the isolated tenant for the TCU Platform.

- **Realm Name:** `tcu-platform`
- **Display Name:** TCU Platform
- **Login Theme:** Custom TCU Branding
- **Token Lifespan:** 
  - Access Token: 5 minutes (300 seconds)
  - Refresh Token: 12 hours
  - SSO Session Idle: 30 minutes
  - SSO Session Max: 24 hours
- **Email/SMTP:** Local Postfix (`172.17.0.1:25`) for sending verification and password reset emails.
- **Required Actions:** Verify Email, Update Password (for migrated users), Configure OTP.

---

## 2. Client Design

Clients represent the applications that will authenticate against the `tcu-platform` realm.

### 2.1 `tcu-admin-portal`
- **Client Type:** Public (SPA - Next.js)
- **Protocol:** OpenID Connect (OIDC)
- **Authentication Flow:** Authorization Code Flow with PKCE
- **Description:** Web portal for internal staff (admins, finance, sales, helpdesk, noc).
- **Web Origins:** `https://admin.topclass.id`, `http://localhost:3001` (Dev)
- **Redirect URIs:** `https://admin.topclass.id/*`, `http://localhost:3001/*`

### 2.2 `tcu-customer-portal`
- **Client Type:** Public (SPA - Next.js)
- **Protocol:** OpenID Connect (OIDC)
- **Authentication Flow:** Authorization Code Flow with PKCE
- **Description:** Self-service portal for end customers.
- **Web Origins:** `https://topclass.id`, `http://localhost:3002` (Dev)
- **Redirect URIs:** `https://topclass.id/*`, `http://localhost:3002/*`

### 2.3 `tcu-technician-app`
- **Client Type:** Public (Mobile/PWA)
- **Protocol:** OpenID Connect (OIDC)
- **Authentication Flow:** Authorization Code Flow with PKCE
- **Description:** App for field technicians managing work orders and FTTH provisioning.
- **Web Origins:** `https://tech.topclass.id`
- **Redirect URIs:** `https://tech.topclass.id/*`, `myapp://auth` (if native)

### 2.4 `tcu-api`
- **Client Type:** Bearer-Only / Confidential
- **Protocol:** OpenID Connect (OIDC)
- **Authentication Flow:** Client Credentials (for M2M if needed), otherwise acts as Resource Server.
- **Description:** The Express.js backend that validates JWT access tokens.
- **Service Accounts Enabled:** Yes (for internal API calls)

---

## 3. Role Design (Realm Roles)

Roles define the core capabilities of users within the platform.

1. **`super_admin`**: Absolute system access, including Keycloak realm management capabilities if federated.
2. **`owner`**: High-level access for company owners/directors (reporting, approvals).
3. **`admin`**: Full operational access across all modules.
4. **`finance`**: Access to billing, payments, reconciliation, and financial reports.
5. **`sales`**: Access to CRM, leads, opportunities, and customer onboarding.
6. **`helpdesk`**: Access to ticketing, customer profiles, and basic network troubleshooting.
7. **`noc`**: Access to FTTH, RADIUS, VPN, and advanced network diagnostics.
8. **`technician`**: Access to work orders, customer addresses, and ONT provisioning.
9. **`viewer`**: Read-only access to specific permitted modules (e.g., for auditors).
10. **`customer`**: End-user access restricted to their own account data.

---

## 4. Group Design

Groups map users to their respective teams and automatically assign the appropriate roles.

| Group Name | Realm Roles Assigned | Target Users |
| :--- | :--- | :--- |
| **`internal-admin`** | `super_admin`, `owner`, `admin` | IT Admins, Directors |
| **`finance-team`** | `finance` | Accounting, Cashiers |
| **`sales-team`** | `sales` | Sales Reps, Marketing |
| **`helpdesk-team`** | `helpdesk` | Customer Support Agents |
| **`noc-team`** | `noc` | Network Engineers, Ops |
| **`technician-team`** | `technician` | Field Technicians |
| **`customers`** | `customer` | End Subscribers |

*Note: A user assigned to `finance-team` automatically inherits the `finance` role.*

---

## 5. Token Claims Mapping

To provide the backend `tcu-api` with enough context to authorize requests without extra database lookups, the JWT Access Token will be enriched with custom claims via Keycloak Protocol Mappers.

**Custom Scope:** `tcu-claims`

| Claim Name | Token Type | Keycloak Mapper Type | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | Access/ID | User Attribute | Internal PostgreSQL User UUID |
| `email` | Access/ID | Built-in | User's email address |
| `full_name` | Access/ID | User Property | User's full name (`firstName` + `lastName`) |
| `roles` | Access | Realm Role | Array of assigned realm roles |
| `permissions` | Access | User Attribute | Array of fine-grained permissions (see Section 6) |
| `branch_id` | Access | User Attribute | ID of the branch the staff belongs to |
| `area_id` | Access | User Attribute | Operating area ID (useful for technicians/sales) |
| `customer_id` | Access/ID | User Attribute | Customer ID (if role is `customer`) |
| `technician_id` | Access/ID | User Attribute | Technician ID (if role is `technician`) |

---

## 6. Permission Mapping

Fine-grained permissions will be injected into the JWT token (or managed via a dedicated policy enforcement point) using the `module.action` format. 

### Examples of Permissions by Module:

**Customer Module**
- `customer.read` (All staff)
- `customer.create` (Sales, Admin)
- `customer.update` (Sales, Admin, Helpdesk)
- `customer.delete` (Super Admin)

**Billing & Payment Module**
- `billing.read` (Finance, Admin, Sales, Customer - self)
- `billing.approve` (Finance, Owner)
- `payment.create` (Finance, Customer - self)
- `payment.reconcile` (Finance, Admin)

**Ticketing & Work Order Module**
- `ticket.read` (Helpdesk, NOC, Admin, Customer - self)
- `ticket.create` (Helpdesk, Customer - self)
- `ticket.assign` (Helpdesk, NOC)
- `workorder.update` (Technician)

**Network Modules (RADIUS, FTTH, VPN)**
- `radius.read` (NOC, Helpdesk)
- `radius.disconnect` (NOC)
- `ftth.provision` (NOC, Technician)
- `ftth.read` (NOC, Helpdesk, Technician)
- `vpn.manage` (NOC, Admin)

**System Module**
- `audit.read` (Super Admin, Owner, Admin)
- `role.manage` (Super Admin)

---

## 7. Integration Strategy

### 7.1 Backend Integration Strategy (`tcu-api`)
1. **Middleware Update:** Implement a new auth middleware (`keycloakAuth.js`) that validates the JWT signature using Keycloak's public keys (JWKS).
2. **Dual-Auth Support:** During migration, the backend must support both the legacy bcrypt-issued JWTs and the new Keycloak OIDC JWTs.
3. **Context Population:** Extract `roles`, `permissions`, and IDs (`user_id`, `customer_id`) from the verified token and attach them to the `req.user` object.
4. **RBAC Enforcement:** Create a `requirePermission('module.action')` middleware that checks against the `permissions` array in the token.

### 7.2 Frontend Integration Strategy (Next.js)
1. **Library:** Integrate `next-auth` (v5) with the `KeycloakProvider`.
2. **Session Management:** Configure NextAuth callbacks to persist necessary token claims (roles, user_id) into the Next.js session object.
3. **Routing:** Update Next.js middleware to protect routes based on the NextAuth session.
4. **UI Adaptation:** Build a generic UI component `<RequireRole roles={['admin', 'finance']}>` to conditionally render UI elements based on the session roles.

---

## 8. Migration & Rollback Plan

### Phase 1: Keep existing JWT auth
- **Action:** No changes to production auth flows.
- **Focus:** Develop the NextAuth integration and Express JWT validation in isolated feature branches. Ensure database schema supports Keycloak ID mapping.

### Phase 2: Add Keycloak staging
- **Action:** Deploy Keycloak container in the staging environment.
- **Focus:** Configure the `tcu-platform` realm, create clients, roles, groups, and mappers. Write scripts to sync test users from PostgreSQL to Keycloak via Keycloak Admin REST API.

### Phase 3: Backend validates Keycloak JWT
- **Action:** Deploy updated backend (`tcu-api`) with dual-auth middleware to production.
- **Focus:** The backend now accepts tokens from both the legacy system and Keycloak. Existing frontend still uses legacy login. No user impact.
- **Rollback:** Revert backend to previous container image if token validation fails unexpectedly.

### Phase 4: Frontend login via Keycloak
- **Action:** Deploy updated frontends (Admin, Customer, Technician) configured to use Keycloak.
- **Focus:** Users are redirected to Keycloak for login.
  - *Data Sync:* Users must exist in Keycloak. A migration script creates users in Keycloak without passwords, forcing a password reset via email on first login (Required Action: UPDATE_PASSWORD).
- **Rollback:** If Keycloak login fails or UX is severely impacted, rollback the frontend deployments to point back to the legacy `/api/auth/login` endpoint. Backend dual-auth ensures legacy tokens are still valid.

### Phase 5: Production cutover
- **Action:** Finalize migration.
- **Focus:** Monitor login logs. Once ~99% of active users have successfully migrated, disable the legacy `/api/auth/login` endpoint in the backend. Remove `password_hash` from the PostgreSQL `users` table to solidify Keycloak as the sole source of truth for credentials.
- **Rollback:** Impossible to rollback easily after `password_hash` is dropped. Ensure Phase 4 has run for an adequate observation period (e.g., 2-4 weeks) before executing Phase 5.
