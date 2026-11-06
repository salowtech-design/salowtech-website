const { verifyRecaptcha } = require('../js/recaptcha-verify');
const crm = require('../js/crm-backend');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://anxehjlbdpzxthpmacjt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. GET /api/leads
  if (req.method === 'GET') {
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
          // Normalize field names
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

  // 2. POST /api/leads - Create new lead
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data || !data.name || !data.phone) {
        return res.status(400).json({ error: 'Name and Phone are required' });
      }

      const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const verification = await verifyRecaptcha(data.recaptchaToken, clientIp);

      data.recaptchaVerified = verification.verified;
      data.recaptchaScore = verification.score;

      const localResult = crm.createLead(data);
      const lead = localResult.lead;

      // Attempt write to Supabase if key is present
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
        recaptcha: verification,
        ...localResult
      });
    } catch (err) {
      console.error('Create lead error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // 3. PATCH /api/leads - Update lead
  if (req.method === 'PATCH') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const leadId = req.query.id || data.id;
      if (!leadId) {
        return res.status(400).json({ error: 'Lead ID required' });
      }

      if (SUPABASE_KEY) {
        const patchData = {};
        if (data.status) patchData.status = data.status;
        if (data.name) patchData.name = data.name;
        if (data.phone) patchData.phone = data.phone;
        if (data.email) patchData.email = data.email;

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

  // 4. DELETE /api/leads - Delete lead
  if (req.method === 'DELETE') {
    try {
      const leadId = req.query.id;
      if (!leadId) {
        return res.status(400).json({ error: 'Lead ID required' });
      }

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
};
