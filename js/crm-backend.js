const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'crm-settings.json');

const DEFAULT_SETTINGS = {
  adminPhone: '916351788935',
  adminFormatted: '+91 63517 88935',
  adminName: 'Salowtech Founder',
  notificationsEnabled: true,
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || 'salowtech_crm_token_2026'
};

let inMemorySettings = { ...DEFAULT_SETTINGS };
let inMemoryLeads = [];

function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, '[]', 'utf8');
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    }
  } catch (err) {
    // Read-only filesystem (e.g. Vercel / AWS Lambda), fallback to memory
  }
}

function getSettings() {
  ensureDataFiles();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return inMemorySettings;
}

function saveSettings(settings) {
  ensureDataFiles();
  const current = getSettings();
  const updated = { ...current, ...settings, updatedAt: new Date().toISOString() };
  inMemorySettings = updated;
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch {}
  return updated;
}

function getLeads() {
  ensureDataFiles();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return inMemoryLeads;
}

function saveLeads(leads) {
  ensureDataFiles();
  inMemoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch {}
}

function cleanPhoneNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) return '91' + digits;
  if (digits.length === 11 && digits.startsWith('0')) return '91' + digits.slice(1);
  return digits;
}

function generateWhatsAppAlertUrl(lead, adminPhone) {
  const target = cleanPhoneNumber(adminPhone || getSettings().adminPhone);
  const now = new Date(lead.createdAt || Date.now());
  const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

  const recaptchaBadge = lead.recaptchaVerified ? `🛡️ *reCAPTCHA v3:* Verified Human (Score: ${lead.recaptchaScore ?? '1.0'})` : (lead.recaptchaScore !== null ? `⚠️ *reCAPTCHA v3:* Flagged (${lead.recaptchaScore})` : `🛡️ *reCAPTCHA v3:* Protected Form Submission`);
  const text = 
`🚀 *NEW SALOWTECH INBOUND LEAD*
━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${lead.name || 'Not provided'}
📞 *Phone:* ${lead.phone || 'Not provided'}
📧 *Email:* ${lead.email || 'Not provided'}
💼 *Service:* ${lead.service || 'Enterprise Consultation'}
📄 *Source Page:* ${lead.sourcePage || 'Website'}
${recaptchaBadge}
⏰ *Received:* ${dateStr} at ${timeStr}

💬 *Requirement Message:*
"${lead.message || 'Quick Consultation Request'}"
━━━━━━━━━━━━━━━━━━━━━
👉 *Direct WhatsApp Chat with Client:*
https://wa.me/${cleanPhoneNumber(lead.phone)}?text=${encodeURIComponent('Hi ' + (lead.name || 'there') + ', this is Salowtech. Thank you for your inquiry regarding ' + (lead.service || 'our software services') + '!')}`;

  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

function generateClientGreetingUrl(lead) {
  const clientPhone = cleanPhoneNumber(lead.phone);
  if (!clientPhone) return '';
  const text = `Hi ${lead.name || 'there'}, thank you for contacting Salowtech. We received your request regarding ${lead.service || 'your project'}. When is a good time for a quick 10-minute discovery call?`;
  return `https://wa.me/${clientPhone}?text=${encodeURIComponent(text)}`;
}

function createLead(leadData) {
  const leads = getLeads();
  const settings = getSettings();
  const now = new Date().toISOString();
  const id = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const newLead = {
    id,
    createdAt: now,
    name: (leadData.name || '').trim(),
    phone: (leadData.phone || '').trim(),
    email: (leadData.email || '').trim().toLowerCase(),
    message: (leadData.message || '').trim(),
    service: leadData.service || 'Enterprise Consultation',
    sourcePage: leadData.sourcePage || 'website',
    status: 'New',
    recaptchaVerified: typeof leadData.recaptchaVerified === 'boolean' ? leadData.recaptchaVerified : false,
    recaptchaScore: typeof leadData.recaptchaScore === 'number' ? leadData.recaptchaScore : null,
    notes: []
  };

  const adminWhatsAppUrl = generateWhatsAppAlertUrl(newLead, settings.adminPhone);
  const clientChatUrl = generateClientGreetingUrl(newLead);

  newLead.adminWhatsAppUrl = adminWhatsAppUrl;
  newLead.clientChatUrl = clientChatUrl;

  leads.unshift(newLead);
  saveLeads(leads);

  return {
    lead: newLead,
    adminWhatsAppUrl,
    clientChatUrl,
    adminPhone: settings.adminFormatted
  };
}

function updateLead(id, updates) {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return null;

  if (updates.status) leads[idx].status = updates.status;
  if (updates.note) {
    if (!leads[idx].notes) leads[idx].notes = [];
    leads[idx].notes.push({
      date: new Date().toISOString(),
      text: updates.note.trim()
    });
  }
  if (updates.name) leads[idx].name = updates.name.trim();
  if (updates.phone) {
    leads[idx].phone = updates.phone.trim();
    leads[idx].clientChatUrl = generateClientGreetingUrl(leads[idx]);
  }
  if (updates.email) leads[idx].email = updates.email.trim();

  saveLeads(leads);
  return leads[idx];
}

function deleteLead(id) {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

function getStats() {
  const leads = getLeads();
  const total = leads.length;
  const newCount = leads.filter(l => l.status === 'New').length;
  const contacted = leads.filter(l => l.status === 'Contacted').length;
  const inDiscussion = leads.filter(l => l.status === 'In Discussion').length;
  const closedWon = leads.filter(l => l.status === 'Closed Won').length;
  const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : '0';

  return {
    total,
    newCount,
    contacted,
    inDiscussion,
    closedWon,
    conversionRate: `${conversionRate}%`
  };
}

function exportCsv() {
  const leads = getLeads();
  const headers = ['ID', 'Date (UTC)', 'Name', 'Phone', 'Email', 'Service', 'Source Page', 'Status', 'Message'];
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${l.createdAt}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.service || '').replace(/"/g, '""')}"`,
    `"${(l.sourcePage || '').replace(/"/g, '""')}"`,
    `"${(l.status || '').replace(/"/g, '""')}"`,
    `"${(l.message || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

module.exports = {
  getSettings,
  saveSettings,
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getStats,
  exportCsv,
  generateWhatsAppAlertUrl,
  generateClientGreetingUrl
};

