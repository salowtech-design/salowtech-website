import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const crm = require('../../tools/crm-backend.js');

const ADMIN_TOKEN = process.env.CRM_ADMIN_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN || 'salowtech_crm_token_2026';

function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization || '';
  const tokenHeader = req.headers['x-admin-token'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : tokenHeader.trim();

  // SEC-FIX: Do NOT trust req.headers.host for auth bypass
  const remoteIp = (req.socket && req.socket.remoteAddress) || '';
  const isLocalDev = process.env.NODE_ENV === 'development' && (remoteIp === '127.0.0.1' || remoteIp === '::1');
  if (isLocalDev && !ADMIN_TOKEN) {
    return true;
  }

  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://salowtech.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(crm.getSettings());
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const sanitized = {};
      if (data.adminPhone) sanitized.adminPhone = String(data.adminPhone).replace(/[^\d+]/g, '').slice(0, 20);
      if (data.adminFormatted) sanitized.adminFormatted = String(data.adminFormatted).slice(0, 30);
      if (data.adminName) sanitized.adminName = String(data.adminName).replace(/[<>]/g, '').slice(0, 50);
      if (typeof data.notificationsEnabled === 'boolean') sanitized.notificationsEnabled = data.notificationsEnabled;
      if (data.webhookVerifyToken) sanitized.webhookVerifyToken = String(data.webhookVerifyToken).slice(0, 64);

      const updated = crm.saveSettings(sanitized);
      return res.status(200).json({ success: true, settings: updated });
    } catch (err) {
      return res.status(400).json({ error: 'Invalid settings payload' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
