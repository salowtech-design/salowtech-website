# Gap & Overlap Analysis — Frontend vs Backend

## 1. Frontend-to-Backend Wiring Matrix

| Frontend Page / Form / Feature | Required Backend Endpoint | Required DB Table | Provided in Old Backend? | Current Status / Gap | Resolution in Merged App |
|---|---|---|---|---|---|
| Universal Quote Form (`QuoteForm.astro`) | `POST /api/leads` | `public.leads` | Yes (`api/leads.js`) | Gap: Currently relies on client-side global `handleQuoteFormSubmit()` and unauthenticated client Supabase key. | Port `POST /api/leads` into Astro API endpoint with server-side Zod validation, Supabase service-role insertion, email notification, and non-JS fallback. |
| Service Page Quick Forms (e.g., `web-development.astro`, `crm-development.astro`) | `POST /api/leads` | `public.leads` | Yes | Gap: Inline forms have disparate input IDs and handlers. | Standardize action targeting `/api/leads` with hidden `sourcePage` and `service` inputs. |
| Contact Us Intake Form (`contact-us.astro`) | `POST /api/leads` | `public.leads` | Yes | Gap: Same as above. | Wire directly to unified `/api/leads` endpoint with auto-confirmation. |
| Chatbot Contact Capture (`Chatbot.astro`) | `POST /api/leads` | `public.leads` | Partial | Gap: Chatbot answers locally; lead collection calls ad-hoc webhook. | Hook chatbot lead capture modal to `/api/leads` with `sourcePage: 'ai_chatbot'`. |
| CRM Admin Dashboard (`crm-dashboard.html`) | `GET /api/leads`, `PATCH /api/leads/:id`, `DELETE /api/leads/:id` | `public.leads` | Yes | Gap: Dashboard exists as a standalone HTML file in legacy root / tools folder. No authentication gate. | Keep internal CRM tool secure under `tools/` or add password-protected route `/admin/leads` (marked strictly `noindex, nofollow`). |
| Leads CSV Export | `GET /api/leads/export` | `public.leads` / local JSON | Yes | Gap: Export only read from local JSON in `server.js`, not Supabase. | Implement `/api/leads/export` to stream CSV directly from PostgreSQL/Supabase. |
| Meta WhatsApp Webhook | `GET/POST /api/webhook/whatsapp` | `public.leads` | Yes | Gap: Exists only in legacy `server.js`. | Port to Astro endpoint `src/pages/api/webhook/whatsapp.ts`. |
| Service Showcase Videos (`SalowTech_video1.mp4` to `video6.mp4`) | Static / Byte-range HTTP Stream | N/A | In old `assets/` | Gap: Present in `company new/assets/` (100MB+ total) but missing from `salowtech-astro/public/assets/`. | Copy video files to merged `public/assets/` and configure streaming headers. |

---

## 2. Backend Features with No Frontend (Orphan Backend Features)
1. **CRM Admin Dashboard (`crm-dashboard.html`):**
   - The old codebase has an entire admin single-page application (`crm-dashboard.html`) with lead status management, notes, conversion rate tracking, and WhatsApp direct links.
   - *Proposal:* Keep this available as an internal admin route (e.g. `src/pages/admin/crm.astro` or static authenticated panel), guarded by environment variable auth token and strictly excluded from robots/sitemaps (`noindex, nofollow`, `X-Robots-Tag`).
2. **CRM Settings API (`POST /api/crm/settings`):**
   - Updates administrator WhatsApp phone number and notification preferences.
   - *Proposal:* Integrate into admin panel.
3. **WhatsApp Inbound Webhook (`/api/webhook/whatsapp`):**
   - Handles automatic inbound lead creation when users message Salowtech on WhatsApp Cloud API.
   - *Proposal:* Keep as a headless background webhook endpoint `src/pages/api/webhook/whatsapp.ts`.

---

## 3. SEO, Sitemaps & robots.txt Alignment
- Old project had a static `sitemap.xml` with hard-coded URLs and flat `robots.txt`.
- Astro project has a modern blog collection with 11 articles.
- *Gap:* Sitemaps must be dynamic, modular (sitemap-index, sitemap-pages, sitemap-blog), with accurate `lastmod` dates and zero 404/redirected URLs.
- *Gap:* `blog-post.astro` (the old static template) must be marked `noindex` or permanently redirected (301) to the real dynamic blog collection at `/blog/`.

