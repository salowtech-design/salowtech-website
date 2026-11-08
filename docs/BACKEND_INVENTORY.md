# Backend Inventory — Old Codebase (`company new`)

## 1. Runtime, Stack & Execution Environment
- **Language / Runtime:** JavaScript (Node.js CommonJS & ESM hybrid), Node engine `>=18.0.0` (Detected active runtime: Node `v24.18.0`).
- **Framework:** Native Node.js `http` module (`server.js`), Vercel Serverless Function (`api/leads.js`), and Cloudflare Pages Functions (`functions/api/leads.js`).
- **Entry Points:**
  - Local Server: `server.js` (starts on port 3000 / `process.env.PORT`)
  - Serverless API (Vercel): `api/leads.js`
  - Internal CLI Tools: `tools/server.js`
- **Scripts (`package.json`):**
  - `start`: `node server.js`
  - `build`: `echo 'Static build ready'`
  - `vercel-build`: `echo 'Static build ready'`

---

## 2. Complete Route Table

| Method | Path | Auth Required? | Roles / Access | Request Schema | Response Shape | Middleware Chain | Handler / Controller | DB Tables Touched |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/leads` | No (Public/Internal) | Any | None | `{ leads: Lead[], stats: Stats, settings: Settings }` | CORS (`*`) | `api/leads.js` / `server.js` | `public.leads` (Supabase) + `data/leads.json` |
| `POST` | `/api/leads` | No (Public with anti-spam) | Public | `{ name: string, phone: string, email?: string, message?: string, service?: string, sourcePage?: string, recaptchaToken?: string }` | `{ success: boolean, recaptcha: { verified: boolean, score: number }, lead: Lead, adminWhatsAppUrl: string, clientChatUrl: string, adminPhone: string }` | CORS, JSON parser, reCAPTCHA v3 verification | `api/leads.js` / `server.js` | `public.leads` (Supabase) + `data/leads.json` |
| `PATCH` | `/api/leads/:id` or `/api/leads?id=` | No | Any | `{ id?: string, status?: string, name?: string, phone?: string, email?: string, note?: string }` | `{ success: boolean, lead: Lead }` | CORS, JSON parser | `api/leads.js` / `server.js` | `public.leads` (Supabase) + `data/leads.json` |
| `DELETE` | `/api/leads/:id` or `/api/leads?id=` | No | Any | None (ID in URL or query) | `{ success: boolean }` | CORS | `api/leads.js` / `server.js` | `public.leads` (Supabase) + `data/leads.json` |
| `GET` | `/api/leads/export` | No | Any | None | CSV binary stream (`attachment; filename="salowtech-leads.csv"`) | CORS | `server.js` (calls `crm.exportCsv()`) | `data/leads.json` |
| `POST` | `/api/crm/settings` | No | Any | `{ adminPhone?: string, adminFormatted?: string, adminName?: string, notificationsEnabled?: boolean, webhookVerifyToken?: string }` | `{ success: boolean, settings: Settings }` | CORS, JSON parser | `server.js` (calls `crm.saveSettings()`) | `data/crm-settings.json` |
| `GET` | `/api/webhook/whatsapp` | Webhook verification | Meta Webhook | Query: `hub.mode`, `hub.verify_token`, `hub.challenge` | String challenge | Token check against `webhookVerifyToken` | `server.js` | None |
| `POST` | `/api/webhook/whatsapp` | Webhook verification | Meta Webhook | Inbound message payload (`payload.entry[0].changes[0].value.messages[0]`) | `{ status: 'EVENT_RECEIVED' }` | JSON parser | `server.js` | `data/leads.json` |
| `GET` | `*.mp4`, `*.webm` | No | Public | Range header (RFC 7233) | Video stream (200 / 206 Partial Content) | Gzip bypass, byte range streaming | `server.js` | File system |

---

## 3. Authentication & Security Model
- **Current Auth Model:** None. All endpoints (`/api/leads`, `/api/crm/settings`) are currently completely unauthenticated.
- **CSRF Protection:** None. Only CORS headers `Access-Control-Allow-Origin: *`.
- **Rate Limiting:** Present only in `salowtech-astro/functions/api/leads.js` (in-memory Map 10 req / 10 min), but missing in `company new/api/leads.js` and `server.js`.
- **Bot Protection:** Google reCAPTCHA v3 verified server-side against `https://www.google.com/recaptcha/api/siteverify`.
- **Anti-spam:** Honeypot traps (`_gotcha`, `website_hp`).

---

## 4. Database Architecture & Schema
- **Database Engine:** PostgreSQL hosted on Supabase (Project Ref: `anxehjlbdpzxthpmacjt`).
- **Fallback Storage:** Local JSON files (`data/leads.json`, `data/crm-settings.json`).
- **Migrations History:** `supabase/migrations/20261106_create_leads_table.sql`.
- **Table Schema:** `public.leads`:
  - `id`: `TEXT PRIMARY KEY DEFAULT ('LEAD-' || upper(to_hex(extract(epoch from now())::bigint)) || '-' || upper(substr(md5(random()::text), 1, 4)))`
  - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`
  - `name`: `TEXT NOT NULL`
  - `phone`: `TEXT NOT NULL`
  - `email`: `TEXT DEFAULT ''`
  - `service`: `TEXT DEFAULT 'Enterprise Consultation'`
  - `source_page`: `TEXT DEFAULT 'website'`
  - `message`: `TEXT DEFAULT ''`
  - `status`: `TEXT NOT NULL DEFAULT 'New'`
  - `recaptcha_verified`: `BOOLEAN DEFAULT false`
  - `recaptcha_score`: `NUMERIC`
  - `notes`: `JSONB DEFAULT '[]'::jsonb`
  - `admin_whatsapp_url`: `TEXT DEFAULT ''`
  - `client_chat_url`: `TEXT DEFAULT ''`
- **Indexes:**
  - `idx_leads_created_at ON public.leads (created_at DESC)`
  - `idx_leads_status ON public.leads (status)`
- **Row Level Security (RLS):** Enabled, with public insert/select/update/delete policies for `anon` and `authenticated`.
- **Realtime:** Table added to publication `supabase_realtime`.

---

## 5. Integrations Matrix
- **Database:** Supabase REST API & JavaScript SDK.
- **WhatsApp Automation:**
  - Dynamic `wa.me` URL generation for admin instant dispatch with formatted lead requirements.
  - Client greeting URL generation.
  - Inbound webhook handler for Meta WhatsApp Cloud API (`hub.verify_token`).
- **Spam Filtering:** Google reCAPTCHA v3 siteverify API (`https://www.google.com/recaptcha/api/siteverify`).
- **Email:** Missing in legacy codebase (only WhatsApp URL generation was implemented). Resend/SMTP must be added in merged codebase.
- **Storage:** Local static filesystem.

---

## 6. Environment Variables Matrix
| Variable Name | Used In | Purpose | Status |
|---|---|---|---|
| `SUPABASE_URL` | `api/leads.js`, `.env` | Supabase API URL endpoint | Configured |
| `SUPABASE_SECRET_KEY` | `api/leads.js`, `.env` | Service Role Key for bypass/admin DB operations | Exposed in plaintext (Rotated flag) |
| `SUPABASE_PUBLISHABLE_KEY`| `api/leads.js`, `js/supabase-client.js`, `.env` | Public Anon key for client | Exposed in plaintext |
| `RECAPTCHA_SECRET_KEY` | `js/recaptcha-verify.js`, `.env` | Google reCAPTCHA v3 server secret | Exposed in plaintext |
| `WEBHOOK_VERIFY_TOKEN` | `server.js`, `js/crm-backend.js`, `.env` | Verification token for Meta WhatsApp Webhook | Configured |
| `PORT` | `server.js` | Server port binding (default 3000) | Optional |

---

## 7. Frontend Contamination List (To Be Completely Excluded from Merged Project)
The following 32+ files in `company new` are legacy frontend files and MUST NOT enter `salowtech-merged/`:
1. `404.html`
2. `about-us.html`
3. `ai-voice-assistant.html`
4. `blog-post.html`
5. `blog.html`
6. `contact-us.html`
7. `crm-dashboard.html`
8. `crm-development.html`
9. `erp-development.html`
10. `hrm-payroll.html`
11. `index.html`
12. `mobile-app-development.html`
13. `privacy-policy.html`
14. `Salowtech_promo.html`
15. `seo-and-growth.html`
16. `terms-and-conditions.html`
17. `testimonials.html`
18. `web-development.html`
19. `css/styles.css`
20. `css/lenis.css`
21. `js/blog-engine.js`
22. `js/gsap.min.js`
23. `js/lenis.min.js`
24. `js/main.js`
25. `js/supabase-client.js`
26. Legacy duplicate root images/icons (`apple-touch-icon.png`, `favicon-*.png`, `favicon.ico`)

