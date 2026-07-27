/**
 * @file customer.controller.js
 * @description Controller untuk mengelola rute domain Customer (Consolidated)
 */
const customerService = require('../services/customer.service');
const auditService = require('../core/audit/audit.service');

class CustomerController {
  // GET /api/customer/profile
  async getProfile(req, res, next) {
    try {
      const profile = await customerService.getProfile(req.user?.id);
      await auditService.auditCustomerAction(req, 'PROFILE_VIEWED', 'SUCCESS');
      res.json({ success: true, profile });
    } catch (err) {
      await auditService.auditCustomerAction(req, 'PROFILE_VIEWED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/customer/invoices
  async getInvoices(req, res, next) {
    try {
      const invoices = await customerService.getInvoices(req.user.custId);
      await auditService.auditCustomerAction(req, 'INVOICES_VIEWED', 'SUCCESS');
      res.json({ success: true, invoices });
    } catch (err) {
      await auditService.auditCustomerAction(req, 'INVOICES_VIEWED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/customer/invoices/:id/pay
  async payInvoice(req, res, next) {
    const { id } = req.params;
    try {
      const result = await customerService.payInvoice(id, req.user.custId);
      await auditService.auditCustomerAction(req, 'INVOICE_PAID', 'SUCCESS', { targetId: id });
      res.json({ success: true, paymentUrl: result.paymentUrl });
    } catch (err) {
      await auditService.auditCustomerAction(req, 'INVOICE_PAID', 'FAIL', { targetId: id, error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // PUT /api/customer/profile
  async updateProfile(req, res, next) {
    try {
      const { address, full_name, email, phone, username } = req.body;
      const profile = await customerService.updateProfile(req.user?.id, { 
        address, full_name, email, phone, username 
      });
      await auditService.auditCustomerAction(req, 'PROFILE_UPDATED', 'SUCCESS');
      res.json({ success: true, message: 'Profil berhasil diperbarui.', profile });
    } catch (err) {
      await auditService.auditCustomerAction(req, 'PROFILE_UPDATED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/customer/reboot-ont
  async rebootOnt(req, res, next) {
    try {
      const result = await customerService.rebootOnt(req.user?.id);
      await auditService.auditCustomerAction(req, 'ONT_REBOOTED', 'SUCCESS');
      res.json(result);
    } catch (err) {
      await auditService.auditCustomerAction(req, 'ONT_REBOOTED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/customer/change-wifi
  async changeWifiPassword(req, res, next) {
    try {
      const { ssid, password } = req.body;
      const result = await customerService.changeWifiPassword(req.user?.id, { ssid, password });
      await auditService.auditCustomerAction(req, 'WIFI_PASSWORD_CHANGED', 'SUCCESS');
      res.json(result);
    } catch (err) {
      await auditService.auditCustomerAction(req, 'WIFI_PASSWORD_CHANGED', 'FAIL', { error: err.message });
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET /api/customer/device-status
  async getDeviceStatus(req, res, next) {
    try {
      const result = await customerService.getDeviceStatus(req.user?.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new CustomerController();

