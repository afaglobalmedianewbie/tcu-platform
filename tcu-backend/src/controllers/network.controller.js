const networkService = require('../services/network.service');

exports.getOnuList = async (req, res) => {
  try {
    const { olt_id, uplink } = req.query;
    if (!olt_id) return res.status(400).json({ error: 'olt_id is required' });

    const data = await networkService.getOnuList(olt_id, uplink);
    res.json(data);
  } catch (error) {
    console.error('Error in getOnuList:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOnuDetail = async (req, res) => {
  try {
    const { onu_id } = req.query;
    if (!onu_id) return res.status(400).json({ error: 'onu_id is required' });

    const data = await networkService.getOnuDetail(onu_id);
    res.json(data);
  } catch (error) {
    console.error('Error in getOnuDetail:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.applyProfile = async (req, res) => {
  try {
    const { onu_id, tcont, gemport, vlan, wan_ip } = req.body;
    if (!onu_id) return res.status(400).json({ error: 'onu_id is required' });

    const data = await networkService.applyProfile(onu_id, { tcont, gemport, vlan, wan_ip });
    res.json(data);
  } catch (error) {
    console.error('Error in applyProfile:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deployConfig = async (req, res) => {
  try {
    const { olt_id, onu_id, uplink } = req.body;
    if (!olt_id || !onu_id) return res.status(400).json({ error: 'olt_id and onu_id are required' });

    const data = await networkService.deployConfig(olt_id, onu_id, uplink);
    res.json(data);
  } catch (error) {
    console.error('Error in deployConfig:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const data = await networkService.getLogs(limit);
    res.json(data);
  } catch (error) {
    console.error('Error in getLogs:', error);
    res.status(500).json({ error: error.message });
  }
};

// 1. FEATURE 1: Auto-Discovery & 1-Click Provisioning
exports.getUnregisteredOnus = async (req, res) => {
  try {
    const data = await networkService.getUnregisteredOnus();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getUnregisteredOnus:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.provisionUnregisteredOnu = async (req, res) => {
  try {
    const { sn } = req.body;
    if (!sn) return res.status(400).json({ success: false, error: 'sn is required' });

    const result = await networkService.provisionUnregisteredOnu(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in provisionUnregisteredOnu:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.simulateSnmpTrap = async (req, res) => {
  try {
    const result = await networkService.simulateSnmpTrap(req.body || {});
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in simulateSnmpTrap:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. FEATURE 2: Early Warning Telegram Alerts
exports.checkSignalAlerts = async (req, res) => {
  try {
    const data = await networkService.checkSignalAlerts();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in checkSignalAlerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.testTelegramAlert = async (req, res) => {
  try {
    const result = await networkService.testTelegramAlert(req.body || {});
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in testTelegramAlert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. FEATURE 3: GIS Pemetaan ODP & Splitter Heatmap
exports.getGisOdpLocations = async (req, res) => {
  try {
    const data = await networkService.getGisOdpLocations();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getGisOdpLocations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. ARCHITECTURE 1 & 2: OLT 2D Chassis Visualizer
exports.getOltChassisVisualizer = async (req, res) => {
  try {
    const data = await networkService.getOltChassisVisualizer(req.query.olt_id || 'OLT_PADAHERANG');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. ARCHITECTURE 3: Predictive Optical Signal Degradation & OTDR
exports.getPredictiveSignalAlerts = async (req, res) => {
  try {
    const data = await networkService.getPredictiveSignalAlerts();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. ARCHITECTURE 4: Multi-Vendor OLT Backup & Recovery
exports.backupOltConfig = async (req, res) => {
  try {
    const data = await networkService.backupOltConfig(req.body.olt_id || 'OLT_PADAHERANG');
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOltBackupHistory = async (req, res) => {
  try {
    const data = await networkService.getOltBackupHistory();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.restoreOltConfig = async (req, res) => {
  try {
    const data = await networkService.restoreOltConfig(req.body.backup_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 7. ARCHITECTURE 5: WhatsApp & Telegram Field Bot Command Center
exports.handleFieldBotCommand = async (req, res) => {
  try {
    const { platform, commandText } = req.body;
    const data = await networkService.handleFieldBotCommand(platform, commandText);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 8. ARCHITECTURE 6: Enterprise PPP Live Sessions & Billing Isolir
exports.getLivePppSessions = async (req, res) => {
  try {
    const data = await networkService.getLivePppSessions();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.disconnectPppSession = async (req, res) => {
  try {
    const data = await networkService.disconnectPppSession(req.body.username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleCustomerIsolation = async (req, res) => {
  try {
    const { username, isolate } = req.body;
    const data = await networkService.toggleCustomerIsolation(username, isolate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


