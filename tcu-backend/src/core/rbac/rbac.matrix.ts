export const RolePermissions = {
  SUPERADMIN: ['ALL'],
  ADMIN: ['ALL'],
  OPERATOR: ['OLT', 'VPN', 'SNMP', 'Ticketing', 'TechnicianApp'],
  TEKNISI: ['OLT', 'VPN', 'SNMP', 'Ticketing', 'TechnicianApp'],
  SALES: ['CRM', 'Billing', 'CustomerOnboarding'],
  CUSTOMER: ['Dashboard', 'Billing', 'Ticket']
};

export type Role = keyof typeof RolePermissions;
