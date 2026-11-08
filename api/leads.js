import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { verifyRecaptcha } = require('../tools/recaptcha-verify.js');
const crm = require('../tools/crm-backend.js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://anxehjlbdpzxthpmacjt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const ADMIN_TOKEN = process.env.CRM_ADMIN_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN || 'salowtech_crm_token_2026';

// In-memory sliding window rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, firstSeen: now };
  if (now - record.firstSeen > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.firstSeen = now;
    rateLimitMap.set(ip, record);
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count += 1;
  rateLimitMap.set(ip, record);
  return true;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://salowtech.com', 'https://www.salowtech.com'];
  if (allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://salowtech.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token, apikey');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization || '';
  const tokenHeader = req.headers['x-admin-token'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : tokenHeader.trim();

  // SEC-FIX: Do NOT rely on req.headers.host for localhost bypass (prevents Host Header Injection).
  // In development, only allow unauthenticated access if explicitly in non-production AND local loopback IP.
  const remoteIp = (req.socket && req.socket.remoteAddress) || '';
  const isLocalDev = process.env.NODE_ENV === 'development' && (remoteIp === '127.0.0.1' || remoteIp === '::1');
  if (isLocalDev && !ADMIN_TOKEN) {
    return true;
  }

  // Enforce secure token match
  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN);
}

function sanitizeText(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().slice(0, maxLength);
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // Reject repeated digits like 0000000000
  return true;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email) && email.length <= 100;
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. GET /api/leads — Protected Admin Endpoint
  if (req.method === 'GET') {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized: Administrative access token required' });
    }

    try {
      if (SUPABASE_KEY) {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        if (resp.ok) {
          const leads = await resp.json();
          const normalizedLeads = leads.map(l => ({
            id: l.id,
            createdAt: l.created_at,
            name: l.name,
            phone: l.phone,
            email: l.email,
            service: l.service,
            sourcePage: l.source_page || l.sourcePage,
            message: l.message,
            status: l.status,
            recaptchaVerified: l.recaptcha_verified,
            recaptchaScore: l.recaptcha_score,
            notes: l.notes || [],
            adminWhatsAppUrl: l.admin_whatsapp_url,
            clientChatUrl: l.client_chat_url
          }));

          const total = normalizedLeads.length;
          const newCount = normalizedLeads.filter(l => l.status === 'New').length;
          const contacted = normalizedLeads.filter(l => l.status === 'Contacted').length;
          const inDiscussion = normalizedLeads.filter(l => l.status === 'In Discussion').length;
          const closedWon = normalizedLeads.filter(l => l.status === 'Closed Won').length;
          const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : '0';

          return res.status(200).json({
            leads: normalizedLeads,
            stats: {
              total,
              newCount,
              contacted,
              inDiscussion,
              closedWon,
              conversionRate: `${conversionRate}%`
            },
            settings: crm.getSettings()
          });
        }
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local CRM:', e.message);
    }

    return res.status(200).json({
      leads: crm.getLeads(),
      stats: crm.getStats(),
      settings: crm.getSettings()
    });
  }

  // 2. POST /api/leads — Public Intake with Anti-Spam & Rate Limiting
  if (req.method === 'POST') {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few minutes before submitting another inquiry.' });
    }

    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

      // Honeypot Trap Defense: Silently drop bot submissions
      const honeypot = data._gotcha || data.website_hp || data.company_url || data.bot_field;
      if (honeypot && String(honeypot).trim().length > 0) {
        return res.status(200).json({ success: true, message: 'Inquiry received' });
      }

      // Input Validation
      const rawName = sanitizeText(data.name, 100);
      const rawPhone = String(data.phone || '').trim();
      const rawEmail = String(data.email || '').trim().toLowerCase();
      const rawMessage = sanitizeText(data.message, 2000);
      const rawService = sanitizeText(data.service, 100) || 'Enterprise Consultation';
      const rawSource = sanitizeText(data.sourcePage || data.source_page, 100) || 'website';

      if (!rawName || rawName.length < 2) {
        return res.status(400).json({ error: 'Valid Name is required (minimum 2 characters)' });
      }
      if (!isValidPhone(rawPhone)) {
        return res.status(400).json({ error: 'Valid Phone Number is required (10-15 digits)' });
      }
      if (rawEmail && !isValidEmail(rawEmail)) {
        return res.status(400).json({ error: 'Valid Email Address format is required' });
      }

      let recaptchaVerified = true;
      let recaptchaScore = 0.9;
      if (data.recaptchaToken) {
        try {
          const verification = await verifyRecaptcha(data.recaptchaToken, clientIp);
          recaptchaVerified = verification.verified;
          recaptchaScore = verification.score;
        } catch (_) {}
      }

      const payload = {
        name: rawName,
        phone: rawPhone,
        email: rawEmail,
        message: rawMessage,
        service: rawService,
        sourcePage: rawSource,
        recaptchaVerified,
        recaptchaScore
      };

      const localResult = crm.createLead(payload);
      const lead = localResult.lead;

      // Write to Supabase securely via Service Role Key
      if (SUPABASE_KEY) {
        try {
          const supabasePayload = {
            id: lead.id,
            created_at: lead.createdAt,
            name: lead.name,
            phone: lead.phone,
            email: lead.email || '',
            service: lead.service || 'Enterprise Consultation',
            source_page: lead.sourcePage || 'website',
            message: lead.message || '',
            status: 'New',
            recaptcha_verified: lead.recaptchaVerified,
            recaptcha_score: lead.recaptchaScore,
            notes: lead.notes || [],
            admin_whatsapp_url: lead.adminWhatsAppUrl || '',
            client_chat_url: lead.clientChatUrl || ''
          };

          const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(supabasePayload)
          });

          if (!supaRes.ok) {
            console.error('Supabase write error:', await supaRes.text());
          }
        } catch (supaErr) {
          console.error('Failed to insert into Supabase:', supaErr.message);
        }
      }

      return res.status(201).json({
        success: true,
        recaptcha: { verified: recaptchaVerified, score: recaptchaScore },
        ...localResult
      });
    } catch (err) {
      console.error('Create lead error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // 3. PATCH /api/leads — Protected Admin Endpoint
  if (req.method === 'PATCH') {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized: Administrative access token required' });
    }

    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const rawId = req.query.id || data.id;
      if (!rawId || !/^[a-zA-Z0-9_-]+$/.test(rawId)) {
        return res.status(400).json({ error: 'Valid Lead ID required' });
      }

      const leadId = String(rawId).trim();

      if (SUPABASE_KEY) {
        const patchData = {};
        if (data.status) patchData.status = sanitizeText(data.status, 50);
        if (data.name) patchData.name = sanitizeText(data.name, 100);
        if (data.phone && isValidPhone(data.phone)) patchData.phone = String(data.phone).trim();
        if (data.email && isValidEmail(data.email)) patchData.email = String(data.email).trim().toLowerCase();
        if (data.note) {
          try {
            const getRes = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}&select=notes`, {
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            if (getRes.ok) {
              const rows = await getRes.json();
              const existingNotes = (rows && rows[0] && rows[0].notes) || [];
              existingNotes.push({ date: new Date().toISOString(), text: sanitizeText(data.note, 500) });
              patchData.notes = existingNotes;
            }
          } catch (_) {}
        }

        await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchData)
        });
      }

      const updated = crm.updateLead(leadId, data);
      return res.status(200).json({ success: true, lead: updated });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 4. DELETE /api/leads — Protected Admin Endpoint
  if (req.method === 'DELETE') {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized: Administrative access token required' });
    }

    try {
      const rawId = req.query.id;
      if (!rawId || !/^[a-zA-Z0-9_-]+$/.test(rawId)) {
        return res.status(400).json({ error: 'Valid Lead ID required' });
      }

      const leadId = String(rawId).trim();

      if (SUPABASE_KEY) {
        await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
      }

      crm.deleteLead(leadId);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export { handler };
