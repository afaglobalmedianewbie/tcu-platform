const vpnService = require('../services/vpn.service');

exports.createVpn = async (req, res) => {
  try {
    const { username, password, name, server } = req.body;
    
    if (!username || !password || !name || !server) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    const data = await vpnService.createVpnClient({ username, password, name, server });
    res.json(data);
  } catch (error) {
    console.error('Error in createVpn:', error);
    res.status(500).json({ status: 'error', message: error.message || 'VPN creation failed' });
  }
};
