/**
 * @file admin.controller.js
 * @description Controller untuk mengelola rute domain Admin (Consolidated)
 */
const adminService = require('../services/admin.service');
const auditService = require('../core/audit/audit.service');

class AdminController {
  // GET /api/admin/system/stats
  async getSystemStats(req, res, next) {
    try {
      const stats = await adminService.getSystemStats();
      await auditService.logAction(req, 'VIEW_STATS', 'ADMIN', 'SUCCESS');
      res.json({ success: true, stats });
    } catch (err) {
      await auditService.logAction(req, 'VIEW_STATS', 'ADMIN', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: 'Gagal mengambil monitoring data: ' + err.message });
    }
  }

  // GET /api/admin/audit
  async getAuditLogs(req, res, next) {
    try {
      const logs = await adminService.getAuditLogs();
      await auditService.logAction(req, 'VIEW_AUDIT_LOGS', 'ADMIN', 'SUCCESS');
      res.json({ success: true, logs });
    } catch (err) {
      await auditService.logAction(req, 'VIEW_AUDIT_LOGS', 'ADMIN', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: 'Gagal mengambil data audit log: ' + err.message });
    }
  }

  // POST /api/admin/users
  async manageUsers(req, res, next) {
    const { username, password, role, full_name, phone, email, address } = req.body;
    try {
      const user = await adminService.manageUsers({ username, password, role, full_name, phone, email, address }, req.user);
      await auditService.logAction(req, 'CREATE_USER', 'ADMIN', 'SUCCESS', { targetId: user.id });
      res.json({ success: true, message: 'User baru berhasil dibuat dan email aktivasi telah dikirim.', user: { id: user.id, username: user.username } });
    } catch (err) {
      await auditService.logAction(req, 'CREATE_USER', 'ADMIN', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // PUT /api/admin/users/:id/password
  async updateUserPassword(req, res, next) {
    const { password } = req.body;
    const { id } = req.params;
    try {
      await adminService.updateUserPassword(id, password, req.user);
      await auditService.logAction(req, 'CHANGE_PASSWORD', 'ADMIN', 'SUCCESS', { targetId: id });
      res.json({ success: true, message: 'Password user berhasil diperbarui.' });
    } catch (err) {
      await auditService.logAction(req, 'CHANGE_PASSWORD', 'ADMIN', 'FAIL', { targetId: id, error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/admin/mail
  async getMailAccounts(req, res, next) {
    try {
      const emails = await adminService.getMailAccounts();
      res.json({ success: true, emails });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/admin/mail
  async createMailAccount(req, res, next) {
    try {
      const result = await adminService.createMailAccount(req.body, req.user);
      res.json({ success: true, message: `Akun email ${result.email} berhasil dibuat.` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // PUT /api/admin/mail/:id
  async updateMailAccount(req, res, next) {
    try {
      const result = await adminService.updateMailAccount(req.params.id, req.body, req.user);
      res.json({ success: true, message: `Akun email ${result.email} berhasil diperbarui.` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // PATCH /api/admin/mail/:id/password
  async updateMailPassword(req, res, next) {
    try {
      const email = await adminService.updateMailPassword(req.params.id, req.body.password, req.user);
      res.json({ success: true, message: `Password untuk ${email} berhasil diperbarui.` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/admin/mail/:id
  async deleteMailAccount(req, res, next) {
    try {
      const email = await adminService.deleteMailAccount(req.params.id, req.user);
      res.json({ success: true, message: `Akun email ${email} berhasil dihapus.` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new AdminController();
