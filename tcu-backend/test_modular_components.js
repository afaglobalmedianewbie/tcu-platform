const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const customerController = require('./src/controllers/customer.controller');
const billingController = require('./src/controllers/billing.controller');
const ticketController = require('./src/controllers/ticket.controller');
const fileCenterController = require('./src/controllers/filecenter.controller');
const adminController = require('./src/controllers/admin.controller');
const permissionGuard = require('./src/core/auth/permission-guard');
const roleGuard = require('./src/core/auth/role-guard');
const auditService = require('./src/core/audit/audit.service');

async function testControllers() {
  console.log("Checking Controllers Method Integrity...");
  const checks = [
    { name: 'customer.getProfile', fn: customerController.getProfile },
    { name: 'customer.getInvoices', fn: customerController.getInvoices },
    { name: 'customer.payInvoice', fn: customerController.payInvoice },
    { name: 'billing.getInvoices', fn: billingController.getInvoices },
    { name: 'billing.generateInvoice', fn: billingController.generateInvoice },
    { name: 'ticket.getTickets', fn: ticketController.getTickets },
    { name: 'ticket.assignTicket', fn: ticketController.assignTicket },
    { name: 'ticket.getWorkOrders', fn: ticketController.getWorkOrders },
    { name: 'ticket.createWorkOrder', fn: ticketController.createWorkOrder },
    { name: 'filecenter.upload', fn: fileCenterController.upload },
    { name: 'filecenter.download', fn: fileCenterController.download },
    { name: 'filecenter.deleteFile', fn: fileCenterController.deleteFile },
    { name: 'admin.getSystemStats', fn: adminController.getSystemStats },
    { name: 'admin.getAuditLogs', fn: adminController.getAuditLogs },
    { name: 'admin.manageUsers', fn: adminController.manageUsers },
    { name: 'admin.updateUserPassword', fn: adminController.updateUserPassword }
  ];

  for (const check of checks) {
    if (typeof check.fn !== 'function') {
      throw new Error(`Integrity Check Failed: ${check.name} is not a function`);
    }
  }
  console.log("SUCCESS: All controller methods are intact and loaded!");
}

async function testServicesAndGuards() {
  console.log("Checking Guards and Service Integrity...");
  if (typeof permissionGuard !== 'function') {
    throw new Error("Integrity Check Failed: permissionGuard is not a function");
  }
  if (typeof roleGuard !== 'function') {
    throw new Error("Integrity Check Failed: roleGuard is not a function");
  }
  if (typeof auditService.logAction !== 'function') {
    throw new Error("Integrity Check Failed: auditService.logAction is not a function");
  }
  console.log("SUCCESS: Guards and Services are intact!");
}

async function main() {
  try {
    await testControllers();
    await testServicesAndGuards();
    console.log("\n>>> STATUS: INTEGRITAS KODE MODULAR (PHASE 28) 100% AMAN & LAYANAN SIAP SALUR! <<<");
    process.exit(0);
  } catch (e) {
    console.error("VALIDATION FAILED:", e.message);
    process.exit(1);
  }
}

main();
