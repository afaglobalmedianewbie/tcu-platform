# Comprehensive Audit Strategy
## TCU Platform — PT Top Class Universal

**Version**: 1.0  
**Author**: Security Architect  
**Date**: 2026-07-14  
**Classification**: Internal — Confidential

---

## 1. Overview

This document outlines the audit and logging strategy for the TCU Platform. The goal is to provide **non-repudiation, traceability, and proactive monitoring** across all platform layers (Identity, Application, Infrastructure, and Network).

---

## 2. Audit Layers & Sources

| Layer | Source | Audit Scope | Format |
|---|---|---|---|
| **Identity** | Keycloak | Logins, token issues, role changes, MFA setup | JSON (via Webhook) |
| **Application** | Node.js (Express) | API access, data mutations, billing events | JSON (Winston/Pino) |
| **Database** | PostgreSQL | DDL changes, slow queries, failed logins | Syslog |
| **Proxy/WAF** | NGINX | Web traffic, rate limit hits, TLS negotiations | Access Log / JSON |
| **Network** | Mikrotik/FreeRADIUS | PPPoE sessions, VPN tunnels, OLT commands | Syslog (Remote) |
| **Host** | Linux VPS (Ubuntu) | SSH logins, sudo executions, cron jobs | Syslog (Auth/Syslog) |

---

## 3. Standardized Event Schema

All application and identity audit events must normalize to the following JSON schema before ingest into the centralized log storage.

```json
{
  "timestamp": "2026-07-14T20:25:00Z",
  "event_id": "uuid-v4",
  "event_type": "USER_LOGIN_SUCCESS",
  "severity": "INFO",
  "actor": {
    "user_id": "uuid-v4",
    "username": "admin@topclass.id",
    "roles": ["ADMIN", "NOC_ENGINEER"],
    "ip_address": "203.0.113.5",
    "user_agent": "Mozilla/5.0..."
  },
  "resource": {
    "type": "Keycloak",
    "id": "tcu-platform"
  },
  "action": {
    "method": "POST",
    "path": "/auth/realms/tcu-platform/protocol/openid-connect/token",
    "status": 200
  },
  "context": {
    "tenant_id": "uuid-v4",
    "message": "User authenticated via OIDC standard flow"
  }
}
```

### 3.1 Severity Levels

| Level | Usage | Action |
|---|---|---|
| `CRITICAL` | Security breach, core system down | PagerDuty/SMS alert immediately |
| `ERROR` | Failed operations, auth failures (brute force) | Alert SOC / Slack channel |
| `WARN` | Suspicious behavior, rate limits hit | Dashboard visibility |
| `INFO` | Normal mutations (CRUD), logins | Indexed for search |
| `DEBUG` | Troubleshooting (disabled in PROD) | Dropped |

---

## 4. Log Storage & Retention Architecture

```mermaid
flowchart TD
    A[Keycloak] -->|HTTP POST| E[Logstash / Fluentd]
    B[Express API] -->|File/TCP| E
    C[NGINX] -->|Syslog| E
    D[Mikrotik/RADIUS] -->|Syslog| E
    
    E -->|Filter & Parse| F[(Elasticsearch / OpenSearch)]
    
    F -->|Hot Tier (14 Days)| G[Kibana / Grafana]
    F -->|Warm Tier (90 Days)| H[Archival Storage]
    F -->|Cold Tier (1 Year)| I[S3 / MinIO (Glacier)]
```

### 4.1 Retention Policy

| Log Type | Hot/Warm Searchable | Cold Archive (S3/Glacier) |
|---|---|---|
| API Access & App Logs | 30 Days | 1 Year |
| Keycloak IAM Events | 90 Days | 3 Years (Compliance) |
| Financial & Billing | 90 Days | 7 Years (Tax/Legal) |
| Network (PPPoE/RADIUS) | 14 Days | 6 Months (ISP requirement) |
| NGINX Web Logs | 7 Days | 3 Months |

---

## 5. High-Value Audit Events (Alert Triggers)

The following events must trigger immediate alerts to the Security Operations Center (SOC) or Admin team:

1. **IAM Anomalies**
   - 5+ consecutive `LOGIN_ERROR` events from the same IP or for the same user.
   - Any `GRANT_ROLE` event assigning `SUPERADMIN` or `ADMIN`.
   - MFA reset or disabled by a privileged user.
2. **Infrastructure**
   - Execution of Mikrotik/OLT reboot commands.
   - NGINX returning `429 Too Many Requests` more than 100 times/minute (DDoS).
3. **Application**
   - Bulk export of customer data (e.g., > 1000 records).
   - Any modification to the `audit_logs` or `invoices` table directly via SQL.

---

## 6. Implementation Strategy

### Phase 1: Application-Level Auditing (Express.js)
Implement an Audit Middleware in Express that intercepts all `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- **Library**: `winston` + `winston-elasticsearch` or `pino`.
- **Database**: Store a copy of critical financial mutations in a PostgreSQL `audit_trails` table (append-only).

### Phase 2: Centralized Collection
Deploy the ELK stack (Elasticsearch, Logstash, Kibana) or Loki+Grafana via Docker.
- Route all Docker container logs (Keycloak, API, Frontend, NGINX) to the collector using Docker's logging driver (e.g., `fluentd` or `journald`).

### Phase 3: Network Integration
- Configure Mikrotik devices to forward logs via Syslog UDP/514 to the central log collector over the VPN.
- Configure FreeRADIUS to log authentication accepts/rejects to Syslog.

---

## 7. PostgreSQL Database Audit

For extreme data integrity, implement triggers on highly sensitive tables (`invoices`, `payments`, `users`):

```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Trigger function attached to critical tables
CREATE OR REPLACE FUNCTION log_audit_event() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (
        TG_TABLE_NAME, 
        NEW.id, 
        TG_OP, 
        row_to_json(OLD), 
        row_to_json(NEW), 
        current_setting('app.current_user_id', true)::uuid
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 8. Compliance & Security

- **Tamper Evidence**: Application databases must not have `UPDATE` or `DELETE` permissions on the `audit_trails` table for any application database user.
- **PII Scrubbing**: Passwords, authorization headers, credit card numbers, and session cookies must be masked or dropped before logs are written to disk.
- **Time Sync**: All servers (VPS, Mikrotik, OLT) MUST be synchronized using NTP to ensure log timestamp correlation.
