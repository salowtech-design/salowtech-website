-- ============================================================================
-- Salowtech Security Hardening: Row Level Security (RLS) Lock-down
-- Fixes: SEC-006 (Anon Public Read/Update/Delete on Leads Table)
-- ============================================================================

-- Ensure Row Level Security is active on public.leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC INTAKE: Allow anonymous and authenticated visitors ONLY to submit new leads
DROP POLICY IF EXISTS "Allow public lead submission" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous lead insert" ON public.leads;

CREATE POLICY "Allow public lead insertion only" ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(name) > 0 AND length(name) <= 100 AND
        length(phone) >= 10 AND length(phone) <= 20
    );

-- 2. REVOKE UNRESTRICTED READ ACCESS:
-- Remove public select policy. Anonymous internet users can no longer read client leads.
DROP POLICY IF EXISTS "Allow reading leads" ON public.leads;
DROP POLICY IF EXISTS "Allow CRM dashboard to view leads" ON public.leads;

-- Only authenticated administrative staff can view leads via Supabase Auth
CREATE POLICY "Allow authenticated staff to read leads" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. REVOKE UNRESTRICTED UPDATE ACCESS:
-- Anonymous users can no longer update leads.
DROP POLICY IF EXISTS "Allow updating leads" ON public.leads;
DROP POLICY IF EXISTS "Allow CRM dashboard to update leads" ON public.leads;

CREATE POLICY "Allow authenticated staff to update leads" ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. REVOKE UNRESTRICTED DELETE ACCESS:
-- Anonymous users can no longer delete leads.
DROP POLICY IF EXISTS "Allow deleting leads" ON public.leads;
DROP POLICY IF EXISTS "Allow CRM dashboard to delete leads" ON public.leads;

CREATE POLICY "Allow authenticated staff to delete leads" ON public.leads
    FOR DELETE
    TO authenticated
    USING (true);

-- Revoke direct table permissions from anon role except for INSERT
REVOKE SELECT, UPDATE, DELETE ON TABLE public.leads FROM anon;
GRANT INSERT ON TABLE public.leads TO anon;

-- Grant full management permissions to authenticated staff role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.leads TO authenticated;

-- Service role key (used by serverless API backend) retains full administrative bypass

