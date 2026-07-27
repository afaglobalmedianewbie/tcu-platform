const express = require('express');
const router = express.Router();
const controller = require('./notifications.controller');
const { asyncHandler } = require('../../core/http/async-handler');
const { validateRequest } = require('../../core/validation/validate-request');
const validator = require('./notifications.validator');

const requireAuth = (req, res, next) => next(); 
const requirePermission = (permission) => (req, res, next) => next();

router.use(requireAuth);

// [Internal] Endpoin paksa pemicu notifikasi dari admin/layanan lain
router.post('/trigger', 
  requirePermission('notification.create'), 
  validateRequest(validator.sendNotificationSchema), 
  asyncHandler(controller.triggerNotification)
);

// [Eksternal] Rute penarikan pesan/lonceng oleh aplikasi Pengguna
router.get('/my', 
  asyncHandler(controller.getMyNotifications)
);

module.exports = router;
