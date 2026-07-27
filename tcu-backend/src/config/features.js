/**
 * @file features.js
 * @description Config-driven feature flags and routing controls for TCU Platform migration.
 */

module.exports = {
  features: {
    useModularRoutes: {
      enabled: true,            // Set true to activate the v2 modular endpoints globally (dual-serving)
      softModeRBAC: false,      // Global RBAC mode: false = ENFORCED (Hard Mode)
      softModeAudit: false,     // Global AuditLog mode: false = ENFORCED (Write to DB)
      testPrefix: '/api/v2',    // Endpoint path prefix for dual-serving/testing
      allowedTestEmails: [
        'admin@topclassuniversal.co.id'
      ],
      // Individual Module Activation Flags (PHASE 27 - Safe Cutover)
      enableAdminRoutes: true,
      enableFileCenterRoutes: true,
      enableBillingRoutes: true,
      enableCustomerRoutes: true,
      enableTicketRoutes: true,

      // Staged enforcement overrides: false means HARD MODE (enforced)
      overrides: {
        admin: false,
        file: false,
        billing: false,
        customer: false,
        ticket: false,
        kb: false,
        cms: false
      },
      // AuditLog staged enforcement: false means MANDATORY (written to DB)
      auditOverrides: {
        admin: false,
        file: false,
        billing: false,
        customer: false,
        ticket: false,
        kb: false,
        cms: false,
        autopost: false
      }
    }
  }
};
