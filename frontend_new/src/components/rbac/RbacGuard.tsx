import React, { ReactNode } from 'react';

// This matches the backend RBAC Matrix
const RolePermissions = {
  SUPERADMIN: ['ALL'],
  ADMIN: ['ALL'],
  NOC_ENGINEER: ['OLT', 'VPN', 'SNMP', 'Networking', 'Ticketing', 'TechnicianApp'],
  BILLING_MANAGER: ['Billing', 'TariffPlans', 'CustomerOnboarding', 'CRM'],
  SUPPORT_L1: ['Ticketing', 'CustomerOnboarding', 'Knowledgebase'],
  SUPPORT_L2: ['Ticketing', 'OLT', 'VPN', 'CustomerOnboarding', 'Knowledgebase'],
  READONLY_AUDITOR: ['ALL_READONLY'],
  RESELLER: ['CRM', 'Billing', 'CustomerOnboarding'],
  CUSTOMER: ['Dashboard', 'Billing', 'Ticket']
};

interface RbacGuardProps {
  children: ReactNode;
  userRole?: string;
  requiredModule?: string;
  requiredRoles?: string[];
  fallback?: ReactNode;
  action?: 'hide' | 'disable';
}

export const RbacGuard: React.FC<RbacGuardProps> = ({ 
  children, 
  userRole, 
  requiredModule, 
  requiredRoles, 
  fallback = null, 
  action = 'hide' 
}) => {
  if (!userRole) return <>{fallback}</>;

  const isSuperAdmin = userRole === 'SUPERADMIN' || userRole === 'ADMIN';
  let hasAccess = isSuperAdmin;

  if (!isSuperAdmin) {
    // Check by role array if provided
    if (requiredRoles && requiredRoles.length > 0) {
      hasAccess = requiredRoles.includes(userRole);
    } 
    // Check by module permission if provided
    else if (requiredModule) {
      const allowedModules = (RolePermissions as any)[userRole] || [];
      hasAccess = allowedModules.includes('ALL') || allowedModules.includes(requiredModule);
    }
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (action === 'disable') {
    // Clone the child element and append 'disabled' prop
    if (React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        disabled: true,
        style: { ...((children.props as any).style || {}), opacity: 0.5, cursor: 'not-allowed' },
        title: 'Anda tidak memiliki akses untuk tindakan ini.'
      });
    }
  }

  return <>{fallback}</>;
};

/**
 * Hook to filter menu items based on user role
 */
export const useMenuRbac = (userRole: string) => {
  return (menuItems: { name: string; modulePath: string }[]) => {
    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') return menuItems;
    
    const allowedModules = (RolePermissions as any)[userRole] || [];
    return menuItems.filter(item => 
      allowedModules.includes('ALL') || allowedModules.includes(item.modulePath)
    );
  };
};
