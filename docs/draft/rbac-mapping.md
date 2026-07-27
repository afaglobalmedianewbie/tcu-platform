# TCU Platform — RBAC Mapping DRAFT
# File: /home/tcu/docs/draft/rbac-mapping.md
# STATUS: DRAFT — FOR REVIEW ONLY.
# Architecture: Identity Architect — 2026-07-14
#
# Legend:
#   ✅  Full access
#   👁️  Read only
#   ✏️  Create / Edit own records
#   🚫  No access
#   (A) = Action requires approval from higher role

---

## 1. Roles Overview

| Role | Code | Description | Keycloak Group |
|---|---|---|---|
| **Administrator** | `ADMIN` | Full system access, all modules | `/TCU Admins` |
| **Staff Operasional** | `STAFF` | CRM, billing, ticketing, customer management | `/TCU Staff` |
| **Teknisi Lapangan** | `TECHNICIAN` | Work orders, FTTH device, ONT status | `/TCU Technicians` |
| **Pelanggan** | `CUSTOMER` | Self-service portal only — own data | `/TCU Customers` |

---

## 2. Permission Matrix — Per Module

### 2.1 Users & IAM

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua user | ✅ | 👁️ | 🚫 | 🚫 |
| Buat user staff/teknisi | ✅ | 🚫 | 🚫 | 🚫 |
| Edit user mana saja | ✅ | 🚫 | 🚫 | 🚫 |
| Hapus user | ✅ | 🚫 | 🚫 | 🚫 |
| Reset password user lain | ✅ | 🚫 | 🚫 | 🚫 |
| Edit profil sendiri | ✅ | ✅ | ✅ | ✅ |
| Ganti password sendiri | ✅ | ✅ | ✅ | ✅ |
| Kelola 2FA sendiri | ✅ | ✅ | ✅ | ✅ |
| Lihat login logs sendiri | ✅ | ✅ | ✅ | ✅ |
| Lihat login logs semua user | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions (action codes):**
```
users:read_all        users:read_self
users:create          users:update_all
users:update_self     users:delete
users:reset_password  users:impersonate
```

---

### 2.2 Roles & Permissions (RBAC Management)

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat roles & permissions | ✅ | 🚫 | 🚫 | 🚫 |
| Buat / edit role | ✅ | 🚫 | 🚫 | 🚫 |
| Assign role ke user | ✅ | 🚫 | 🚫 | 🚫 |
| Edit permissions per role | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
roles:read   roles:create   roles:update   roles:delete
roles:assign permissions:read   permissions:update
```

---

### 2.3 Audit Logs

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua audit log | ✅ | 👁️ | 🚫 | 🚫 |
| Filter & export audit log | ✅ | 👁️ | 🚫 | 🚫 |
| Hapus audit log | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
audit_logs:read   audit_logs:export   audit_logs:delete
```

---

### 2.4 CRM — Leads & Opportunities

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua lead | ✅ | ✅ | 🚫 | 🚫 |
| Buat lead baru | ✅ | ✅ | 🚫 | 🚫 |
| Edit lead | ✅ | ✅ | 🚫 | 🚫 |
| Hapus lead | ✅ | (A) | 🚫 | 🚫 |
| Assign lead ke staff | ✅ | ✅ | 🚫 | 🚫 |
| Konversi lead ke pelanggan | ✅ | ✅ | 🚫 | 🚫 |
| Kelola opportunity | ✅ | ✅ | 🚫 | 🚫 |

**Permissions:**
```
leads:read      leads:create    leads:update
leads:delete    leads:assign    leads:convert
opportunities:read   opportunities:create   opportunities:update
```

---

### 2.5 Customers

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua pelanggan | ✅ | ✅ | 👁️ | 🚫 |
| Lihat profil sendiri | ✅ | ✅ | ✅ | ✅ |
| Edit data pelanggan | ✅ | ✅ | 🚫 | 🚫 |
| Edit profil sendiri | ✅ | ✅ | ✅ | ✅ |
| Hapus pelanggan | ✅ | 🚫 | 🚫 | 🚫 |
| Isolir pelanggan (block PPPoE) | ✅ | ✅ | 🚫 | 🚫 |
| Aktifkan pelanggan | ✅ | ✅ | 🚫 | 🚫 |
| Ganti paket pelanggan | ✅ | ✅ | 🚫 | 🚫 |
| Lihat data PPPoE | ✅ | ✅ | 🚫 | 🚫 |

**Permissions:**
```
customers:read_all   customers:read_self
customers:create     customers:update_all
customers:update_self customers:delete
customers:isolate    customers:activate
customers:view_pppoe
```

---

### 2.6 Service Packages (Subscription Plans)

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat paket (publik) | ✅ | ✅ | ✅ | ✅ |
| Buat paket baru | ✅ | 🚫 | 🚫 | 🚫 |
| Edit paket | ✅ | 🚫 | 🚫 | 🚫 |
| Hapus paket | ✅ | 🚫 | 🚫 | 🚫 |
| Aktifkan / nonaktifkan paket | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
plans:read    plans:create    plans:update    plans:delete
plans:activate
```

---

### 2.7 Billing — Invoices

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua invoice | ✅ | ✅ | 🚫 | 🚫 |
| Lihat invoice sendiri | ✅ | ✅ | 🚫 | ✅ |
| Generate invoice manual | ✅ | ✅ | 🚫 | 🚫 |
| Generate invoice massal (bulk) | ✅ | (A) | 🚫 | 🚫 |
| Edit invoice | ✅ | (A) | 🚫 | 🚫 |
| Waive / cancel invoice | ✅ | 🚫 | 🚫 | 🚫 |
| Export invoice CSV/PDF | ✅ | ✅ | 🚫 | ✅ |

**Permissions:**
```
invoices:read_all    invoices:read_self
invoices:create      invoices:bulk_generate
invoices:update      invoices:cancel
invoices:export
```

---

### 2.8 Payments

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua pembayaran | ✅ | ✅ | 🚫 | 🚫 |
| Lihat pembayaran sendiri | ✅ | ✅ | 🚫 | ✅ |
| Catat pembayaran tunai/manual | ✅ | ✅ | 🚫 | 🚫 |
| Buat link pembayaran Xendit | ✅ | ✅ | 🚫 | ✅ |
| Refund pembayaran | ✅ | 🚫 | 🚫 | 🚫 |
| Lihat laporan rekap pembayaran | ✅ | ✅ | 🚫 | 🚫 |

**Permissions:**
```
payments:read_all    payments:read_self
payments:create_manual  payments:create_gateway
payments:refund      payments:report
```

---

### 2.9 Tickets — Customer Support

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua tiket | ✅ | ✅ | 👁️ | 🚫 |
| Lihat tiket sendiri | ✅ | ✅ | ✅ | ✅ |
| Buat tiket | ✅ | ✅ | 🚫 | ✅ |
| Edit tiket (admin) | ✅ | ✅ | 🚫 | 🚫 |
| Update status tiket | ✅ | ✅ | ✅ | 🚫 |
| Assign tiket ke teknisi | ✅ | ✅ | 🚫 | 🚫 |
| Balas tiket (internal) | ✅ | ✅ | ✅ | 🚫 |
| Balas tiket (pelanggan) | ✅ | ✅ | 🚫 | ✅ |
| Tutup/close tiket | ✅ | ✅ | ✅ | 🚫 |
| Hapus tiket | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
tickets:read_all     tickets:read_self
tickets:create       tickets:update
tickets:reply_staff  tickets:reply_customer
tickets:assign       tickets:close
tickets:delete
```

---

### 2.10 Work Orders

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat semua WO | ✅ | ✅ | 👁️ | 🚫 |
| Lihat WO milik sendiri | ✅ | ✅ | ✅ | 🚫 |
| Buat WO baru | ✅ | ✅ | 🚫 | 🚫 |
| Assign WO ke teknisi | ✅ | ✅ | 🚫 | 🚫 |
| Update status WO (on-site, done) | ✅ | ✅ | ✅ | 🚫 |
| Tambah catatan teknisi | ✅ | ✅ | ✅ | 🚫 |
| Cancel WO | ✅ | (A) | 🚫 | 🚫 |
| Export daftar WO | ✅ | ✅ | 🚫 | 🚫 |

**Permissions:**
```
work_orders:read_all   work_orders:read_own
work_orders:create     work_orders:assign
work_orders:update     work_orders:cancel
work_orders:technician_notes  work_orders:export
```

---

### 2.11 RADIUS

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat daftar PPPoE user | ✅ | ✅ | 🚫 | 🚫 |
| Lihat sesi aktif RADIUS | ✅ | ✅ | 🚫 | 🚫 |
| Suspend PPPoE (isolir) | ✅ | ✅ | 🚫 | 🚫 |
| Aktifkan PPPoE kembali | ✅ | ✅ | 🚫 | 🚫 |
| Reset password PPPoE | ✅ | ✅ | 🚫 | 🚫 |
| Kelola NAS / Mikrotik entry | ✅ | 🚫 | 🚫 | 🚫 |
| Kelola Group / Profile RADIUS | ✅ | 🚫 | 🚫 | 🚫 |
| Lihat RADIUS accounting log | ✅ | 👁️ | 🚫 | 🚫 |

**Permissions:**
```
radius:read          radius:suspend
radius:activate      radius:reset_password
radius:manage_nas    radius:manage_groups
radius:view_acct
```

---

### 2.12 FTTH — OLT & ONT

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat daftar OLT | ✅ | 👁️ | ✅ | 🚫 |
| Tambah / edit OLT | ✅ | 🚫 | 🚫 | 🚫 |
| Hapus OLT | ✅ | 🚫 | 🚫 | 🚫 |
| Lihat daftar ONT | ✅ | 👁️ | ✅ | 🚫 |
| Tambah / edit ONT | ✅ | 🚫 | ✅ | 🚫 |
| Lihat sinyal ONT (rx/tx) | ✅ | 👁️ | ✅ | 🚫 |
| Restart / provision ONT via ACS | ✅ | 🚫 | ✅ | 🚫 |
| Hapus ONT | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
ftth:read            ftth:create_olt
ftth:update_olt      ftth:delete_olt
ftth:create_ont      ftth:update_ont
ftth:delete_ont      ftth:provision_ont
ftth:view_signal
```

---

### 2.13 VPN — WireGuard Peers

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat daftar VPN peer | ✅ | 🚫 | 🚫 | 🚫 |
| Tambah VPN peer | ✅ | 🚫 | 🚫 | 🚫 |
| Edit VPN peer | ✅ | 🚫 | 🚫 | 🚫 |
| Revoke / disable peer | ✅ | 🚫 | 🚫 | 🚫 |
| Lihat status koneksi peer | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
vpn:read    vpn:create    vpn:update    vpn:revoke
```

---

### 2.14 Notifications

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Lihat notifikasi sendiri | ✅ | ✅ | ✅ | ✅ |
| Tandai notifikasi sudah dibaca | ✅ | ✅ | ✅ | ✅ |
| Kirim notifikasi ke user lain | ✅ | ✅ | 🚫 | 🚫 |
| Broadcast notifikasi ke semua | ✅ | 🚫 | 🚫 | 🚫 |
| Kelola template notifikasi | ✅ | 🚫 | 🚫 | 🚫 |

**Permissions:**
```
notifications:read_self    notifications:mark_read
notifications:send         notifications:broadcast
notifications:manage_templates
```

---

### 2.15 Files & Attachments

| Action | ADMIN | STAFF | TECHNICIAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Upload file / attachment | ✅ | ✅ | ✅ | ✅ |
| Download file yang diupload sendiri | ✅ | ✅ | ✅ | ✅ |
| Download semua file | ✅ | ✅ | 🚫 | 🚫 |
| Hapus file | ✅ | (A) | 🚫 | 🚫 |

**Permissions:**
```
files:upload    files:download_own    files:download_all    files:delete
```

---

## 3. Permission Code Registry (Full List)

Daftar lengkap kode permission yang akan dimasukkan ke tabel `permissions` PostgreSQL:

```sql
-- Module: users
('users:read_all', 'users'), ('users:read_self', 'users'),
('users:create', 'users'), ('users:update_all', 'users'),
('users:update_self', 'users'), ('users:delete', 'users'),
('users:reset_password', 'users'), ('users:impersonate', 'users'),

-- Module: roles
('roles:read', 'roles'), ('roles:create', 'roles'),
('roles:update', 'roles'), ('roles:delete', 'roles'),
('roles:assign', 'roles'), ('permissions:read', 'roles'),
('permissions:update', 'roles'),

-- Module: audit_logs
('audit_logs:read', 'audit_logs'), ('audit_logs:export', 'audit_logs'),
('audit_logs:delete', 'audit_logs'),

-- Module: leads
('leads:read', 'leads'), ('leads:create', 'leads'),
('leads:update', 'leads'), ('leads:delete', 'leads'),
('leads:assign', 'leads'), ('leads:convert', 'leads'),
('opportunities:read', 'leads'), ('opportunities:create', 'leads'),
('opportunities:update', 'leads'),

-- Module: customers
('customers:read_all', 'customers'), ('customers:read_self', 'customers'),
('customers:create', 'customers'), ('customers:update_all', 'customers'),
('customers:update_self', 'customers'), ('customers:delete', 'customers'),
('customers:isolate', 'customers'), ('customers:activate', 'customers'),
('customers:view_pppoe', 'customers'),

-- Module: plans
('plans:read', 'plans'), ('plans:create', 'plans'),
('plans:update', 'plans'), ('plans:delete', 'plans'),
('plans:activate', 'plans'),

-- Module: invoices
('invoices:read_all', 'billing'), ('invoices:read_self', 'billing'),
('invoices:create', 'billing'), ('invoices:bulk_generate', 'billing'),
('invoices:update', 'billing'), ('invoices:cancel', 'billing'),
('invoices:export', 'billing'),

-- Module: payments
('payments:read_all', 'payments'), ('payments:read_self', 'payments'),
('payments:create_manual', 'payments'), ('payments:create_gateway', 'payments'),
('payments:refund', 'payments'), ('payments:report', 'payments'),

-- Module: tickets
('tickets:read_all', 'tickets'), ('tickets:read_self', 'tickets'),
('tickets:create', 'tickets'), ('tickets:update', 'tickets'),
('tickets:reply_staff', 'tickets'), ('tickets:reply_customer', 'tickets'),
('tickets:assign', 'tickets'), ('tickets:close', 'tickets'),
('tickets:delete', 'tickets'),

-- Module: work_orders
('work_orders:read_all', 'work_orders'), ('work_orders:read_own', 'work_orders'),
('work_orders:create', 'work_orders'), ('work_orders:assign', 'work_orders'),
('work_orders:update', 'work_orders'), ('work_orders:cancel', 'work_orders'),
('work_orders:technician_notes', 'work_orders'), ('work_orders:export', 'work_orders'),

-- Module: radius
('radius:read', 'radius'), ('radius:suspend', 'radius'),
('radius:activate', 'radius'), ('radius:reset_password', 'radius'),
('radius:manage_nas', 'radius'), ('radius:manage_groups', 'radius'),
('radius:view_acct', 'radius'),

-- Module: ftth
('ftth:read', 'ftth'), ('ftth:create_olt', 'ftth'),
('ftth:update_olt', 'ftth'), ('ftth:delete_olt', 'ftth'),
('ftth:create_ont', 'ftth'), ('ftth:update_ont', 'ftth'),
('ftth:delete_ont', 'ftth'), ('ftth:provision_ont', 'ftth'),
('ftth:view_signal', 'ftth'),

-- Module: vpn
('vpn:read', 'vpn'), ('vpn:create', 'vpn'),
('vpn:update', 'vpn'), ('vpn:revoke', 'vpn'),

-- Module: notifications
('notifications:read_self', 'notifications'), ('notifications:mark_read', 'notifications'),
('notifications:send', 'notifications'), ('notifications:broadcast', 'notifications'),
('notifications:manage_templates', 'notifications'),

-- Module: files
('files:upload', 'files'), ('files:download_own', 'files'),
('files:download_all', 'files'), ('files:delete', 'files')
```

---

## 4. Default Role → Permission Mapping

### ADMIN → All permissions above ✅

### STAFF
```
users:read_self, users:update_self, users:reset_password (own)
leads:*, opportunities:*
customers:read_all, customers:update_all, customers:isolate, customers:activate
invoices:read_all, invoices:create, invoices:export
payments:read_all, payments:create_manual, payments:create_gateway, payments:report
tickets:*, (except tickets:delete)
work_orders:read_all, work_orders:create, work_orders:assign, work_orders:update, work_orders:export
radius:read, radius:suspend, radius:activate, radius:reset_password
ftth:read
notifications:read_self, notifications:mark_read, notifications:send
files:upload, files:download_own, files:download_all
```

### TECHNICIAN
```
users:read_self, users:update_self
customers:read_all (limited — name, address, plan only)
tickets:read_self, tickets:reply_staff, tickets:close
work_orders:read_own, work_orders:update, work_orders:technician_notes
ftth:read, ftth:update_ont, ftth:view_signal, ftth:provision_ont
notifications:read_self, notifications:mark_read
files:upload, files:download_own
```

### CUSTOMER
```
users:read_self, users:update_self
customers:read_self, customers:update_self
plans:read
invoices:read_self, invoices:export
payments:read_self, payments:create_gateway
tickets:read_self, tickets:create, tickets:reply_customer
notifications:read_self, notifications:mark_read
files:upload, files:download_own
```

---

## 5. Middleware Check Pattern (Express.js Reference)

```javascript
// Middleware untuk cek permission dari Keycloak token
function hasPermission(permission) {
  return async (req, res, next) => {
    const userRole = req.user.role;  // "ADMIN" | "STAFF" | "TECHNICIAN" | "CUSTOMER"
    const userRoleId = await getRoleId(userRole);
    const allowed = await prisma.rolePermission.findFirst({
      where: {
        role_id: userRoleId,
        permission: { action: permission }
      }
    });
    if (!allowed) {
      return res.status(403).json({ success: false, message: `Akses ditolak: ${permission}` });
    }
    next();
  };
}

// Contoh penggunaan di route
app.patch('/api/admin/customers/:id/isolate',
  keycloakAuth,
  hasPermission('customers:isolate'),
  async (req, res) => { /* ... */ }
);
```
