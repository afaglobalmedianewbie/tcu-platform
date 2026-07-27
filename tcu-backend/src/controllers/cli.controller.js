const cliService = require('../services/cli.service');

exports.deploy = async (req, res) => {
  try {
    const { olt_id, onu_id, uplink } = req.body;
    
    if (!olt_id || !onu_id) {
      return res.status(400).json({ status: 'error', message: 'olt_id and onu_id are required' });
    }

    const data = await cliService.deploy(olt_id, onu_id, uplink);
    res.json(data);
  } catch (error) {
    console.error('Error in deploy:', error);
    res.status(500).json({ status: 'error', message: 'Deployment failed' });
  }
};
