# Merge Report — Astro + Backend Production Unification

## 1. Overview
The workspace root (`salowtech-website`) has been transformed into a clean, modern Astro 5 production architecture. All legacy static HTML files and scripts have been safely backed up to `archive/legacy-site/`.

## 2. Integrity & Snapshots
- Source Checksum Manifest (Legacy): `_snapshots/manifest-old.sha256` (155 files tracked)
- Source Checksum Manifest (Astro): `_snapshots/manifest-astro.sha256` (162 files tracked)
- Legacy Archive Location: `archive/legacy-site/` (39 files & directories)
- Astro Source Backup: `archive/salowtech-astro/`

## 3. Directory Structure
```
salowtech-website/
├── api/             # Vercel Serverless API endpoints (/api/leads, etc.)
├── archive/         # Full backups of legacy site and original astro template
├── data/            # CRM local cache & settings
├── dist/            # Production static build output (27 pages + 30 webp assets)
├── docs/            # Full architecture, API, database, and SEO documentation
├── public/          # Static assets: fonts, videos (all 6 service videos), posters, icons
├── src/
│   ├── assets/      # Astro optimized images & illustrations
│   ├── components/  # Layout components: Navbar, Footer, QuoteForm, FAQ, Chatbot
│   ├── content/     # Content collections: 11 technical blog articles
│   ├── data/        # Centralized site, SEO, schema, and FAQ configurations
│   ├── layouts/     # Layout.astro shell with SEO & schema metadata
│   └── pages/       # 17 Astro pages (Home, Services, Blog, Legal, 404)
├── supabase/        # Database migrations (PostgreSQL `public.leads` schema)
├── tools/           # Internal CRM management dashboard & utilities
├── .env.example     # Environment variable template with documentation
├── astro.config.mjs # Astro 5 production configuration
└── package.json     # Node.js dependencies and build/dev scripts
```

## 4. Build & Parity Verification
- **Build Status:** PASSED (`astro build` generated 27 pages in 4.08s).
- **Security:** Hardcoded Supabase key fallback removed from `api/leads.js`. Documented in `SECURITY_FINDINGS.md`.
- **Media:** All 6 service video files (`SalowTech_video1.mp4` - `video6.mp4`), promo video, and posters synced into `public/assets/`.
