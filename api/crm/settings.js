const crm = require('../../js/crm-backend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json(crm.getSettings());
  }

  if (req.method === 'POST') {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const updated = crm.saveSettings(data);
    return res.status(200).json({ success: true, settings: updated });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
