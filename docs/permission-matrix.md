# Permission Matrix
## TCU Platform — PT Top Class Universal

**Version**: 1.0 | **Date**: 2026-07-14 | **Author**: Security Architect

> Legend: ✅ Allow | ❌ Deny | 🔒 Scoped (own data only) | ⏱ Time-boxed elevation

---

## IAM — Identity & Access Management

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| users : create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🔒 | ❌ |
| users : read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| users : update | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🔒 | 🔒 |
| users : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| users : impersonate | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| roles : create | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| roles : read | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| roles : update | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| roles : delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| sessions : read | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | 🔒 |
| sessions : revoke | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🔒 |

---

## Network — Infrastructure Operations

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| devices : create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| devices : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| devices : update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| devices : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| devices : execute | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| olt : create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| olt : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| olt : update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| olt : execute | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| pppoe-sessions : read | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| pppoe-sessions : execute (disconnect) | ✅ | ✅ | ✅ | ❌ | ❌ | ⏱ | ❌ | ❌ | ❌ |
| ip-pools : create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ip-pools : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ip-pools : update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ip-pools : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| vpn : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| vpn : execute | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Billing — Financial Operations

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| invoices : create | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | 🔒 | ❌ |
| invoices : read | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| invoices : update | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | 🔒 | ❌ |
| invoices : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| invoices : approve | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| invoices : export | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | 🔒 | ❌ |
| payments : create | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | 🔒 | ❌ |
| payments : read | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | 🔒 | 🔒 |
| payments : update | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| payments : approve | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| packages : create | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| packages : read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| packages : update | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| packages : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| promo-codes : create | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| promo-codes : read | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | 🔒 | ✅ |
| promo-codes : update | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Support — Helpdesk Operations

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| tickets : create | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | 🔒 |
| tickets : read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| tickets : update | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | 🔒 | 🔒 |
| tickets : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| tickets : assign | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| comments : create | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | 🔒 |
| comments : read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| comments : delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Reports — Analytics & Business Intelligence

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| revenue : read | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | 🔒 | ❌ |
| revenue : export | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | 🔒 | ❌ |
| traffic : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | 🔒 | 🔒 |
| traffic : export | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| sla : read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 | 🔒 |
| sla : export | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## Audit — Logs & Events

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| logs : read | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| logs : export | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| events : read | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| events : export | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## System — Platform Configuration

| Resource : Action | SUPERADMIN | ADMIN | NOC_ENG | BILLING_MGR | SUPPORT_L1 | SUPPORT_L2 | AUDITOR | RESELLER | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| config : read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| config : update | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| backups : create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| backups : read | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| backups : delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| maintenance : execute | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Scope Notes

| Symbol | Meaning |
|---|---|
| ✅ | Full access to all records in scope |
| ❌ | Access denied; returns HTTP 403 |
| 🔒 | Scoped: own data, own tenant, or own reseller's sub-customers only |
| ⏱ | Time-boxed elevation: requires ADMIN approval, auto-revoked after 2 hours, full audit log generated |
