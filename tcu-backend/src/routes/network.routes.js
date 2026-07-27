const express = require('express');
const router = express.Router();
const networkController = require('../controllers/network.controller');
const vpnController = require('../controllers/vpn.controller');
const mikrotikController = require('../controllers/mikrotik.controller');
const cliController = require('../controllers/cli.controller');

// 1. GET ONU LIST
router.get('/olt/onu', networkController.getOnuList);

// 2. GET ONU DETAIL
router.get('/olt/onu/detail', networkController.getOnuDetail);

// 3. APPLY PROFILE CONFIGURATION
router.post('/olt/profile/apply', networkController.applyProfile);

// 4. SAVE CONFIG (AUTO-DEPLOY CLI)
router.post('/cli/deploy', cliController.deploy);

// 5. GET LOGS
router.get('/logs', networkController.getLogs);

// 6. CREATE VPN
router.post('/vpn/create', vpnController.createVpn);

// 7. MIKROTIK ROUTES
router.post('/mikrotik/nat', mikrotikController.addNat);
router.post('/mikrotik/route', mikrotikController.addRoute);
router.get('/mikrotik/status', mikrotikController.getStatus);
router.post('/mikrotik/sync', mikrotikController.syncConfig);
router.post('/mikrotik/backup', mikrotikController.createBackup);
router.get('/mikrotik/backup/history', mikrotikController.getBackupHistory);


// 8. FEATURE 1: AUTO-DISCOVERY & 1-CLICK PROVISIONING
router.get('/olt/unregistered', networkController.getUnregisteredOnus);
router.post('/olt/provision-onu', networkController.provisionUnregisteredOnu);
router.post('/olt/simulate-trap', networkController.simulateSnmpTrap);

// 9. FEATURE 2: EARLY-WARNING & TELEGRAM ALERTS
router.get('/alerts/active', networkController.checkSignalAlerts);
router.post('/alerts/test-telegram', networkController.testTelegramAlert);

// 10. FEATURE 3: GIS ODP & SPLITTER MAP
router.get('/gis/odp', networkController.getGisOdpLocations);

// 11. ARCHITECTURE 1 & 2: OLT 2D CHASSIS VISUALIZER
router.get('/olt/visualizer', networkController.getOltChassisVisualizer);

// 12. ARCHITECTURE 3: PREDICTIVE SIGNAL DEGRADATION & OTDR ESTIMATOR
router.get('/alerts/predictive', networkController.getPredictiveSignalAlerts);

// 13. ARCHITECTURE 4: MULTI-VENDOR OLT AUTOMATED CONFIG BACKUP & RESTORE RECOVERY
router.post('/olt/backup', networkController.backupOltConfig);
router.get('/olt/backup/history', networkController.getOltBackupHistory);
router.post('/olt/backup/restore', networkController.restoreOltConfig);

// 14. ARCHITECTURE 5: WHATSAPP & TELEGRAM FIELD ENGINEER BOT COMMAND CENTER
router.post('/field-bot/command', networkController.handleFieldBotCommand);

// 15. ARCHITECTURE 6: ENTERPRISE ROUTER SERVER PPP & RADIUS ISOLATION ENGINE
router.get('/ppp/sessions', networkController.getLivePppSessions);
router.post('/ppp/disconnect', networkController.disconnectPppSession);
router.post('/ppp/isolation', networkController.toggleCustomerIsolation);

module.exports = router;


