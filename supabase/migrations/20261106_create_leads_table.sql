-- ============================================================================
-- Salowtech CRM Leads Table Migration for Supabase
-- Project Ref: anxehjlbdpzxthpmacjt
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT ('LEAD-' || upper(to_hex(extract(epoch from now())::bigint)) || '-' || upper(substr(md5(random()::text), 1, 4))),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    service TEXT DEFAULT 'Enterprise Consultation',
    source_page TEXT DEFAULT 'website',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'New',
    recaptcha_verified BOOLEAN DEFAULT false,
    recaptcha_score NUMERIC,
    notes JSONB DEFAULT '[]'::jsonb,
    admin_whatsapp_url TEXT DEFAULT '',
    client_chat_url TEXT DEFAULT ''
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 1. Allow public form submissions from website visitors (anon & authenticated)
DROP POLICY IF EXISTS "Allow public lead submission" ON public.leads;
CREATE POLICY "Allow public lead submission" ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 2. Allow CRM dashboard to view leads
DROP POLICY IF EXISTS "Allow reading leads" ON public.leads;
CREATE POLICY "Allow reading leads" ON public.leads
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Allow CRM dashboard to update lead status and notes
DROP POLICY IF EXISTS "Allow updating leads" ON public.leads;
CREATE POLICY "Allow updating leads" ON public.leads
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Allow CRM dashboard to delete leads
DROP POLICY IF EXISTS "Allow deleting leads" ON public.leads;
CREATE POLICY "Allow deleting leads" ON public.leads
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.leads TO anon, authenticated;

-- Enable Supabase Realtime broadcast for leads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'leads'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if publication does not exist or already added
END $$;

