/**
 * @file role-guard.js
 * @description Express middleware untuk validasi otorisasi berbasis Role.
 */

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Session missing' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // --- COMPATIBILITY LAYER ---
    // Cek langsung JWT Payload 'role' statis (Mencegah kerusakan route lama)
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Insufficient role level' 
    });
  };
};

module.exports = requireRole;
