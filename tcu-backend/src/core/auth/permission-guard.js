/**
 * @file permission-guard.js
 * @description Express middleware untuk validasi otorisasi RBAC (Sadar-RBAC) tingkat Izin.
 * Menyediakan dukungan transisi lunak (soft-mode) ke keras (hard-mode) secara bertahap.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../../config/features');

// Ekstraksi nama modul dari izin (misal: 'customer.read' -> 'customer')
const getModuleName = (permission) => {
  const parts = permission.split('.');
  return parts[0];
};

/**
 * requirePermission (Dynamic Guard):
 * Mengevaluasi izin berdasarkan konfigurasi feature flags (mengikuti soft/hard mode per modul).
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized: User session missing' });
      }

      // Bypass Legacy ADMIN / SUPERADMIN
      if (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN') {
        req.resolvedPermissions = new Set(['*']);
        return next();
      }

      // Bypass Customer for customer module
      if (req.user.role === 'CUSTOMER' && requiredPermission.startsWith('customer.')) {
        req.resolvedPermissions = new Set(['customer.read', 'customer.update']);
        return next();
      }

      // Resolusi Izin dari DB
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

      const userPermissions = new Set();
      for (const ur of userRoles) {
        if (ur.role && ur.role.permissions) {
          for (const rp of ur.role.permissions) {
            if (rp.permission && rp.permission.key) {
              userPermissions.add(rp.permission.key);
            }
          }
        }
      }

      req.resolvedPermissions = userPermissions;
      const hasAccess = userPermissions.has(requiredPermission) || userPermissions.has('*') || userPermissions.has('admin.manage');

      if (hasAccess) {
        return next();
      }

      // Periksa apakah modul ini berjalan di Mode Lunak (Soft Mode)
      const moduleName = getModuleName(requiredPermission);
      const isSoftMode = config.features.useModularRoutes.overrides[moduleName] !== false 
        && config.features.useModularRoutes.softModeRBAC;

      if (isSoftMode) {
        console.warn(`[RBAC_SOFT_MODE_WARNING] Access granted in soft mode. User '${req.user.id}' lacks permission '${requiredPermission}'`);
        return next();
      }

      // Hard Mode block
      console.error(`[RBAC_HARD_DENY] Access blocked. User '${req.user.id}' lacks permission '${requiredPermission}'`);
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Requires permission '${requiredPermission}'` 
      });
    } catch (error) {
      console.error('RBAC Permission Guard Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error during authorization' });
    }
  };
};

/**
 * hardPermission (Strict Guard):
 * Secara sepihak menolak akses jika izin tidak sah, tidak memedulikan status softMode global.
 */
const hardPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized: User session missing' });
      }

      if (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN') {
        req.resolvedPermissions = new Set(['*']);
        return next();
      }

      // Bypass Customer for customer module
      if (req.user.role === 'CUSTOMER' && requiredPermission.startsWith('customer.')) {
        req.resolvedPermissions = new Set(['customer.read', 'customer.update']);
        return next();
      }

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

      const userPermissions = new Set();
      for (const ur of userRoles) {
        if (ur.role && ur.role.permissions) {
          for (const rp of ur.role.permissions) {
            if (rp.permission && rp.permission.key) {
              userPermissions.add(rp.permission.key);
            }
          }
        }
      }

      req.resolvedPermissions = userPermissions;
      const hasAccess = userPermissions.has(requiredPermission) || userPermissions.has('*') || userPermissions.has('admin.manage');

      if (hasAccess) {
        return next();
      }

      // Selalu lakukan penolakan keras (Hard Deny)
      console.error(`[RBAC_HARD_DENY_STRICT] Access blocked. User '${req.user.id}' lacks permission '${requiredPermission}'`);
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Requires permission '${requiredPermission}'` 
      });
    } catch (error) {
      console.error('RBAC Hard Permission Guard Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error during authorization' });
    }
  };
};

// Dukungan ekspor ganda untuk menjaga kompatibilitas ke belakang
requirePermission.requirePermission = requirePermission;
requirePermission.hardPermission = hardPermission;

module.exports = requirePermission;
