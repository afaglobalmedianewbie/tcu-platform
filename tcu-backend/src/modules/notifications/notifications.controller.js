const notificationService = require('./notifications.service');
const { sendSuccess } = require('../../core/http/api-response');

const triggerNotification = async (req, res) => {
  const { customerId, type, channels, payload } = req.body;
  // Memindahkan beban penyebaran pesan (Broadcasting) ke latar belakang
  const data = await notificationService.queueNotification(customerId, type, channels, payload);
  return sendSuccess(res, 202, 'Notification queued successfully', data); // 202 Accepted
};

const getMyNotifications = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const customerId = req.user?.id || 'anonymous';
  
  const data = await notificationService.getCustomerNotifications(customerId, skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

module.exports = {
  triggerNotification,
  getMyNotifications
};
