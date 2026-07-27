const mikrotikService = require('../services/mikrotik.service');

exports.addNat = async (req, res) => {
  try {
    const { vpn_ip, olt_ip } = req.body;
    if (!vpn_ip || !olt_ip) {
      return res.status(400).json({ status: 'error', message: 'vpn_ip and olt_ip are required' });
    }
    const data = await mikrotikService.addNatRule(vpn_ip, olt_ip);
    res.json(data);
  } catch (error) {
    console.error('Error in addNat:', error);
    res.status(500).json({ status: 'error', message: error.message || 'NAT rule creation failed' });
  }
};

exports.addRoute = async (req, res) => {
  try {
    const { gateway } = req.body;
    if (!gateway) {
      return res.status(400).json({ status: 'error', message: 'gateway is required' });
    }
    const data = await mikrotikService.addRoute(gateway);
    res.json(data);
  } catch (error) {
    console.error('Error in addRoute:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Route creation failed' });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const data = await mikrotikService.getRouterStatus();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.syncConfig = async (req, res) => {
  try {
    const data = await mikrotikService.syncConfig();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBackup = async (req, res) => {
  try {
    const data = await mikrotikService.backupRouter();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBackupHistory = async (req, res) => {
  try {
    const data = await mikrotikService.getBackupHistory();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

