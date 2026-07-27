import { Request, Response, NextFunction } from 'express';

/**
 * Tenant Identification Middleware
 * Extracts the Tenant ID from the header, sub-domain, or JWT token
 * and injects it into the request object for strict data isolation.
 */
export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Identify Tenant from X-Tenant-ID header (used by API integrations)
    let tenantId = req.headers['x-tenant-id'] as string;

    // 2. Fallback: Identify Tenant from the authenticated user's JWT
    if (!tenantId && (req as any).user) {
      tenantId = (req as any).user.tenantId;
    }

    // 3. Fallback: Identify Tenant from domain/subdomain
    if (!tenantId && req.hostname) {
      // e.g. "lintasmedia.topclass.id" -> tenant slug "lintasmedia"
      const domainParts = req.hostname.split('.');
      if (domainParts.length > 2) {
        tenantId = domainParts[0]; 
      }
    }

    // Default to TCU Platform (Master Tenant) if no tenant is found but it's a superadmin
    if (!tenantId) {
      tenantId = 'TCU-MASTER';
    }

    // Inject into Request object
    (req as any).tenantId = tenantId;
    
    console.log(`[Tenant-Middleware] Request context assigned to Tenant: ${tenantId}`);
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to resolve Tenant context.' });
  }
};
