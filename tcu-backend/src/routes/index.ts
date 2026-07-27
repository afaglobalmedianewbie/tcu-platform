import { Router } from "express";
import { requireRole } from "../middleware/rbac.middleware";

// Import all controllers
import { configRouter } from "../controllers/config.controller";
import { billingRouter } from "../controllers/billing.controller";
import { crmRouter } from "../controllers/crm.controller";
import { ticketRouter } from "../controllers/ticket.controller";
import { technicianRouter } from "../controllers/technician.controller";
import { customerRouter } from "../controllers/customer.controller";
import { monitoringRouter } from "../controllers/monitoring.controller";
import { fileRouter } from "../controllers/file.controller";
import { notificationRouter } from "../controllers/notification.controller";
import { slaRouter } from "../controllers/sla.controller";
import { financeRouter } from "../controllers/finance.controller";
import { inventoryRouter } from "../controllers/inventory.controller";
import { packageRouter } from "../controllers/package.controller";
import { subscriptionRouter } from "../controllers/subscription.controller";
import { aiRouter } from "../controllers/ai.controller";
import { aiTrafficRouter } from "../controllers/ai_traffic.controller";
import { tenantRouter } from "../controllers/tenant.controller";
import { drRouter } from "../controllers/dr.controller";
import { paymentRouter } from "../controllers/payment.controller";
import { fraudRouter } from "../controllers/fraud.controller";
import { provisionRouter } from "../controllers/provision.controller";
import { qosRouter } from "../controllers/qos.controller";
import { clusterRouter } from "../controllers/cluster.controller";
import { securityRouter } from "../controllers/security.controller";
import { autoscaleRouter } from "../controllers/autoscale.controller";
import { nocRouter } from "../controllers/noc.controller";
import { reportingRouter } from "../controllers/reporting.controller";
import { searchRouter } from "../controllers/search.controller";
import { eventBusRouter } from "../controllers/eventbus.controller";
import { topologyRouter } from "../controllers/topology.controller";

const router = Router();

// Core config orchestration (SUPER ADMIN + OPERATOR)
router.use(
  "/config",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  configRouter
);

// Billing (SUPER ADMIN + FINANCE + SALES)
router.use(
  "/billing",
  requireRole(["SUPERADMIN", "FINANCE", "SALES"]),
  billingRouter
);

// CRM (SUPER ADMIN + SALES + OPERATOR)
router.use(
  "/crm",
  requireRole(["SUPERADMIN", "SALES", "OPERATOR", "TEKNISI"]),
  crmRouter
);

// Ticketing (SUPER ADMIN + OPERATOR + CUSTOMER)
router.use(
  "/ticket",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI", "CUSTOMER"]),
  ticketRouter
);

// Technician App
router.use(
  "/technician",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  technicianRouter
);

// Customer Dashboard / Mobile
router.use(
  "/customer",
  requireRole(["SUPERADMIN", "CUSTOMER", "SALES"]),
  customerRouter
);

// Monitoring
router.use(
  "/monitoring",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  monitoringRouter
);

// File Center
router.use(
  "/files",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI", "SALES", "CUSTOMER"]),
  fileRouter
);

// Notification
router.use(
  "/notify",
  requireRole(["SUPERADMIN", "OPERATOR", "FINANCE", "SALES"]),
  notificationRouter
);

// SLA
router.use(
  "/sla",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  slaRouter
);

// Finance & Accounting
router.use(
  "/finance",
  requireRole(["SUPERADMIN", "FINANCE"]),
  financeRouter
);

// Inventory
router.use(
  "/inventory",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  inventoryRouter
);

// Package & Subscription
router.use(
  "/package",
  requireRole(["SUPERADMIN", "SALES"]),
  packageRouter
);
router.use(
  "/subscription",
  requireRole(["SUPERADMIN", "SALES", "OPERATOR", "TEKNISI"]),
  subscriptionRouter
);

// AI Predictive Maintenance
router.use(
  "/ai",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  aiRouter
);

// AI Traffic Optimization
router.use(
  "/ai-traffic",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  aiTrafficRouter
);

// Multi-tenant SaaS
router.use(
  "/tenant",
  requireRole(["SUPERADMIN"]),
  tenantRouter
);

// Disaster Recovery
router.use(
  "/dr",
  requireRole(["SUPERADMIN"]),
  drRouter
);

// Payment Gateway
router.use(
  "/payment",
  requireRole(["SUPERADMIN", "FINANCE", "SALES", "CUSTOMER"]),
  paymentRouter
);

// Fraud Engine
router.use(
  "/fraud",
  requireRole(["SUPERADMIN", "FINANCE", "OPERATOR", "TEKNISI"]),
  fraudRouter
);

// Provisioning (ACS/TR-069)
router.use(
  "/provision",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  provisionRouter
);

// QoS
router.use(
  "/qos",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  qosRouter
);

// Multi-OLT Cluster
router.use(
  "/cluster",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  clusterRouter
);

// Security
router.use(
  "/security",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI", "FINANCE"]),
  securityRouter
);

// Auto-scaling & Load Balancer
router.use(
  "/autoscale",
  requireRole(["SUPERADMIN"]),
  autoscaleRouter
);

// Virtual NOC
router.use(
  "/noc",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  nocRouter
);

// Reporting & Analytics
router.use(
  "/reporting",
  requireRole(["SUPERADMIN", "FINANCE", "SALES", "OPERATOR", "TEKNISI"]),
  reportingRouter
);

// Global Search
router.use(
  "/search",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI", "SALES"]),
  searchRouter
);

// Event Bus
router.use(
  "/events",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  eventBusRouter
);

// Network Topology
router.use(
  "/topology",
  requireRole(["SUPERADMIN", "OPERATOR", "TEKNISI"]),
  topologyRouter
);

export default router;
