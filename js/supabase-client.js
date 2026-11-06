/**
 * Salowtech Supabase Client Integration
 * Project Ref: anxehjlbdpzxthpmacjt
 */

(function () {
  const SUPABASE_PROJECT_REF = 'anxehjlbdpzxthpmacjt';
  const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
  
  // Storage key for client-side persistence
  const STORAGE_KEY = 'salowtech_supabase_anon_key';
  
  function getAnonKey() {
    return window.SUPABASE_ANON_KEY || localStorage.getItem(STORAGE_KEY) || '';
  }

  function setAnonKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key.trim());
      window.SUPABASE_ANON_KEY = key.trim();
    }
  }

  // Initialize Supabase JS Client if library is available
  function getSupabaseClient() {
    const key = getAnonKey();
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function' && key) {
      if (!window._salowtechSupabaseInstance) {
        window._salowtechSupabaseInstance = window.supabase.createClient(SUPABASE_URL, key);
      }
      return window._salowtechSupabaseInstance;
    }
    return null;
  }

  // Insert lead directly into Supabase table 'leads'
  async function submitLeadToSupabase(lead) {
    const client = getSupabaseClient();
    const key = getAnonKey();

    const payload = {
      id: lead.id || `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      created_at: lead.createdAt || new Date().toISOString(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      service: lead.service || 'Enterprise Consultation',
      source_page: lead.sourcePage || window.location.pathname.split('/').pop() || 'website',
      message: lead.message || '',
      status: lead.status || 'New',
      recaptcha_verified: !!lead.recaptchaVerified,
      recaptcha_score: typeof lead.recaptchaScore === 'number' ? lead.recaptchaScore : null,
      notes: lead.notes || [],
      admin_whatsapp_url: lead.adminWhatsAppUrl || '',
      client_chat_url: lead.clientChatUrl || ''
    };

    if (client) {
      const { data, error } = await client.from('leads').insert([payload]).select();
      if (error) throw error;
      return data;
    } else if (key) {
      // Direct REST fallback if CDN library hasn't initialized
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      return await res.json();
    }

    return null;
  }

  window.SalowtechSupabase = {
    projectRef: SUPABASE_PROJECT_REF,
    url: SUPABASE_URL,
    getAnonKey,
    setAnonKey,
    getClient: getSupabaseClient,
    submitLead: submitLeadToSupabase
  };
})();
