/**
 * @file filecenter.controller.js
 * @description Controller untuk mengelola rute dinamis domain File Center (Unggah, Unduh, Soft Delete)
 */
const { prisma, generateId } = require('../utils/helpers');
const auditService = require('../core/audit/audit.service');
const fs = require('fs');
const path = require('path');

class FileCenterController {
  // POST /files/upload
  async upload(req, res, next) {
    try {
      if (!req.file) {
        await auditService.auditFileCenterAction(req, 'FILE_UPLOADED', 'FAIL', { reason: 'No file attached' });
        return res.status(400).json({ success: false, message: 'File tidak dilampirkan.' });
      }

      // 1. Create FileAsset record in database
      const fileAsset = await prisma.fileAsset.create({
        data: {
          id: generateId('FILE'),
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          storageDriver: 'LOCAL',
          storagePath: req.file.path,
          ownerId: req.user?.id || 'SYSTEM',
          isPublic: req.body.isPublic === 'true' || false,
          virusScanStatus: 'PENDING'
        }
      });

      // 2. Create initial FileVersion (v1)
      await prisma.fileVersion.create({
        data: {
          assetId: fileAsset.id,
          versionNumber: 1,
          storagePath: req.file.path,
          fileSize: req.file.size,
          createdById: req.user?.id || 'SYSTEM'
        }
      });

      await auditService.auditFileCenterAction(req, 'FILE_UPLOADED', 'SUCCESS', { targetId: fileAsset.id });
      res.status(201).json({ success: true, message: 'File berhasil diunggah.', file: fileAsset });
    } catch (err) {
      await auditService.auditFileCenterAction(req, 'FILE_UPLOADED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /files/download/:id
  async download(req, res, next) {
    const { id } = req.params;
    try {
      const fileAsset = await prisma.fileAsset.findFirst({
        where: { id, deletedAt: null }
      });

      if (!fileAsset) {
        await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'FAIL', { targetId: id, reason: 'File not found' });
        return res.status(404).json({ success: false, message: 'File tidak ditemukan.' });
      }

      // Check visibility & ownership
      if (!fileAsset.isPublic) {
        if (!req.user) {
          await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'FAIL', { targetId: id, reason: 'Anonymous access to private file' });
          return res.status(401).json({ success: false, message: 'Akses ditolak: file bersifat rahasia.' });
        }
        if (req.user.role !== 'ADMIN' && fileAsset.ownerId !== req.user.id) {
          await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'FAIL', { targetId: id, reason: 'Ownership check failed' });
          return res.status(403).json({ success: false, message: 'Akses ditolak: Anda bukan pemilik file.' });
        }
      }

      const filePath = path.resolve(fileAsset.storagePath);
      if (!fs.existsSync(filePath)) {
        await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'FAIL', { targetId: id, reason: 'Physical file missing' });
        return res.status(404).json({ success: false, message: 'File fisik tidak ditemukan di server.' });
      }

      await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'SUCCESS', { targetId: id });
      res.download(filePath, fileAsset.fileName);
    } catch (err) {
      await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'FAIL', { targetId: id, error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE /files/:id
  async deleteFile(req, res, next) {
    const { id } = req.params;
    try {
      const fileAsset = await prisma.fileAsset.findFirst({
        where: { id, deletedAt: null }
      });

      if (!fileAsset) {
        await auditService.auditFileCenterAction(req, 'FILE_DELETED', 'FAIL', { targetId: id, reason: 'File not found' });
        return res.status(404).json({ success: false, message: 'File tidak ditemukan.' });
      }

      if (req.user.role !== 'ADMIN' && fileAsset.ownerId !== req.user.id) {
        await auditService.auditFileCenterAction(req, 'FILE_DELETED', 'FAIL', { targetId: id, reason: 'Ownership check failed' });
        return res.status(403).json({ success: false, message: 'Akses ditolak: Anda bukan pemilik file.' });
      }

      // Soft delete
      await prisma.fileAsset.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      await auditService.auditFileCenterAction(req, 'FILE_DELETED', 'SUCCESS', { targetId: id });
      res.json({ success: true, message: 'File berhasil dihapus (Soft Delete).' });
    } catch (err) {
      await auditService.auditFileCenterAction(req, 'FILE_DELETED', 'FAIL', { targetId: id, error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new FileCenterController();
