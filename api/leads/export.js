import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const crm = require('../../tools/crm-backend.js');

const ADMIN_TOKEN = process.env.CRM_ADMIN_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN || 'salowtech_crm_token_2026';

function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization || '';
  const tokenHeader = req.headers['x-admin-token'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : String(tokenHeader).trim();

  // SEC-FIX: Do NOT trust req.headers.host for auth bypass
  const remoteIp = (req.socket && req.socket.remoteAddress) || '';
  const isLocalDev = process.env.NODE_ENV === 'development' && (remoteIp === '127.0.0.1' || remoteIp === '::1');
  if (isLocalDev && !ADMIN_TOKEN) return true;

  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://salowtech.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required to export leads' });
  }

  const csvData = crm.exportCsv();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="salowtech-leads.csv"');
  return res.status(200).send(csvData);
}
