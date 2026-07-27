const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// 1. Add checkPermission Middleware definition
const checkPermissionMiddleware = `
// ─── Middleware: Check Permission (RBAC) ───
function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Tidak diotentikasi' });
      }

      // Bypass for ADMIN role to ensure backward compatibility during transition
      if (req.user.role === 'ADMIN') {
        return next();
      }

      // Fetch user permissions from DB (User -> UserRole -> Role -> RolePermission -> Permission)
      const userRoles = await prisma.userRole.findMany({
        where: { userId: req.user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      // Flatten and extract permission keys
      const userPermissions = new Set();
      for (const ur of userRoles) {
        if (ur.role && ur.role.permissions) {
          for (const rp of ur.role.permissions) {
            if (rp.permission) {
              userPermissions.add(rp.permission.key);
            }
          }
        }
      }

      if (userPermissions.has(requiredPermission) || userPermissions.has('*')) {
        return next();
      }

      return res.status(403).json({ success: false, message: \`Akses ditolak: Membutuhkan izin '\${requiredPermission}'\` });
    } catch (error) {
      console.error('RBAC Error:', error);
      return res.status(500).json({ success: false, message: 'Gagal memverifikasi izin akses' });
    }
  };
}
`;

// Insert the middleware after adminOnly if it doesn't exist
if (!code.includes('function checkPermission(')) {
  code = code.replace(
    /function adminOnly\(req, res, next\) \{[\s\S]*?\}\n/,
    match => match + '\n' + checkPermissionMiddleware
  );
}

// 2. Replacements mappings
const replacements = [
  // Plans
  { search: /app\.put\('\/api\/plans\/:id', authMiddleware, adminOnly,/g, replace: "app.put('/api/plans/:id', authMiddleware, checkPermission('plan.manage')," },
  { search: /app\.post\('\/api\/plans', authMiddleware, adminOnly,/g, replace: "app.post('/api/plans', authMiddleware, checkPermission('plan.manage')," },
  { search: /app\.delete\('\/api\/plans\/:id', authMiddleware, adminOnly,/g, replace: "app.delete('/api/plans/:id', authMiddleware, checkPermission('plan.manage')," },
  
  { search: /app\.post\('\/api\/admin\/plans', authMiddleware, adminOnly,/g, replace: "app.post('/api/admin/plans', authMiddleware, checkPermission('plan.manage')," },
  { search: /app\.put\('\/api\/admin\/plans\/:id', authMiddleware, adminOnly,/g, replace: "app.put('/api/admin/plans/:id', authMiddleware, checkPermission('plan.manage')," },
  { search: /app\.delete\('\/api\/admin\/plans\/:id', authMiddleware, adminOnly,/g, replace: "app.delete('/api/admin/plans/:id', authMiddleware, checkPermission('plan.manage')," },

  // System & Audit
  { search: /app\.get\('\/api\/admin\/active-emails', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/active-emails', authMiddleware, checkPermission('system.read')," },
  { search: /app\.get\('\/api\/admin\/audit', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/audit', authMiddleware, checkPermission('audit.read')," },
  { search: /app\.get\('\/api\/admin\/system\/stats', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/system/stats', authMiddleware, checkPermission('system.read')," },

  // Customers
  { search: /app\.get\('\/api\/admin\/customers', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/customers', authMiddleware, checkPermission('customer.read')," },
  { search: /app\.patch\('\/api\/admin\/customers\/:id\/isolate', authMiddleware, adminOnly,/g, replace: "app.patch('/api/admin/customers/:id/isolate', authMiddleware, checkPermission('customer.manage')," },
  { search: /app\.patch\('\/api\/admin\/customers\/:id\/activate', authMiddleware, adminOnly,/g, replace: "app.patch('/api/admin/customers/:id/activate', authMiddleware, checkPermission('customer.manage')," },

  // Billing & Invoices
  { search: /app\.get\('\/api\/admin\/invoices', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/invoices', authMiddleware, checkPermission('billing.read')," },
  { search: /app\.post\('\/api\/admin\/invoices\/generate', authMiddleware, adminOnly,/g, replace: "app.post('/api/admin/invoices/generate', authMiddleware, checkPermission('billing.manage')," },

  // Tickets & Work Orders
  { search: /app\.get\('\/api\/admin\/tickets', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/tickets', authMiddleware, checkPermission('ticket.read')," },
  { search: /app\.patch\('\/api\/admin\/tickets\/:id', authMiddleware, adminOnly,/g, replace: "app.patch('/api/admin/tickets/:id', authMiddleware, checkPermission('ticket.assign')," },
  { search: /app\.get\('\/api\/admin\/work-orders', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/work-orders', authMiddleware, checkPermission('ticket.read')," },
  { search: /app\.post\('\/api\/admin\/work-orders', authMiddleware, adminOnly,/g, replace: "app.post('/api/admin/work-orders', authMiddleware, checkPermission('ticket.assign')," },

  // Mail
  { search: /app\.get\('\/api\/admin\/mail', authMiddleware, adminOnly,/g, replace: "app.get('/api/admin/mail', authMiddleware, checkPermission('system.manage')," },
  { search: /app\.patch\('\/api\/admin\/mail\/:id\/password', authMiddleware, adminOnly,/g, replace: "app.patch('/api/admin/mail/:id/password', authMiddleware, checkPermission('system.manage')," },
  { search: /app\.delete\('\/api\/admin\/mail\/:id', authMiddleware, adminOnly,/g, replace: "app.delete('/api/admin/mail/:id', authMiddleware, checkPermission('system.manage')," },

  // Users
  { search: /app\.post\('\/api\/admin\/users', authMiddleware, adminOnly,/g, replace: "app.post('/api/admin/users', authMiddleware, checkPermission('user.manage')," },
  { search: /app\.put\('\/api\/admin\/users\/:id\/password', authMiddleware, adminOnly,/g, replace: "app.put('/api/admin/users/:id/password', authMiddleware, checkPermission('user.manage')," },
];

let replacedCount = 0;
for (const rule of replacements) {
  const matches = code.match(rule.search);
  if (matches) {
    code = code.replace(rule.search, rule.replace);
    replacedCount += matches.length;
  }
}

fs.writeFileSync(serverFile, code);
console.log(`RBAC Refactor complete. Injected middleware and replaced ${replacedCount} endpoints.`);
