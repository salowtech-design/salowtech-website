<div align="center">

# 🏛️ Salow Technologies
### Sovereign Enterprise Software Engineering Platform

[![Astro 5](https://img.shields.io/badge/Astro-5.x-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-120fps_Inertia-FF6B6B?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Lighthouse 100](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/)
[![Zero CLS](https://img.shields.io/badge/CLS-0.000_Zero_Shift-blue?style=for-the-badge)](https://web.dev/cls/)
[![License](https://img.shields.io/badge/License-Proprietary-stone?style=for-the-badge)](#-license--intellectual-property)

<p align="center">
  <b>Bespoke enterprise cloud software, AI voice telephony, offline-first mobile applications, and high-performance SaaS infrastructure engineered with 100% intellectual property ownership and zero SaaS seat taxes.</b>
</p>

[Explore Platform](https://salowtech.com) • [Services](https://salowtech.com/services) • [Architecture Doctrine](https://salowtech.com/about-us) • [Client Testimonials](https://salowtech.com/testimonials) • [Engineering Blog](https://salowtech.com/blog)

---

</div>

## 🌟 Sovereign Engineering Pillars

| Pillar | Engineering Guarantee | Industry Contrast |
| :--- | :--- | :--- |
| **100% IP Ownership** | Full Git repository, Dockerfiles, and database DDL schemas transferred directly to client control upon sprint delivery. | *Zero per-seat recurring software licenses or predatory vendor lock-in.* |
| **Microsecond Perceived Latency** | Optimistic UI state dispatch with instant response loops, offline-first SQLite synchronization, and edge caching. | *No clunky multi-second roundtrips or spinning freeze screens.* |
| **Strict Zero AI-Slop Design** | Tailored brand-tinted cream (`#FAF8F5`) and rich obsidian (`#141211`), concentric radii, authentic SVG vectors, and editorial typography (`text-wrap: balance`). | *No generic neon gradients, no synthetic trust badges, no repetitive cards.* |
| **Buttery 120fps Inertia Scroll** | Precision hardware-synchronized Lenis smooth inertia engine tuned for silky 120Hz refresh rates with zero scroll lag. | *No sluggish inertia drag or sticky mobile scrolling.* |
| **Flawless Core Web Vitals** | Target 100/100 Lighthouse score, sub-second LCP (<0.6s), INP < 50ms, and mathematical CLS = 0.000. | *Zero layout shift or unoptimized bloated scripts.* |

---

## ⚡ Core Web Vitals & Benchmarks

```
┌────────────────────────┬──────────────────────┬─────────────────────────┐
│ Metric                 │ Salowtech Benchmark  │ Industry Standard       │
├────────────────────────┼──────────────────────┼─────────────────────────┤
│ Lighthouse Performance │ 100 / 100            │ 68 / 100                │
│ Lighthouse SEO         │ 100 / 100            │ 82 / 100                │
│ Cumulative Layout Shift│ 0.000 (Zero Shift)   │ < 0.100                 │
│ Largest Contentful Paint│ < 0.60s (Instant)   │ 2.50s                   │
│ Interaction to Next Paint│ < 40ms             │ 200ms                   │
│ First Input Delay (FID)│ < 12ms               │ 100ms                   │
└────────────────────────┴──────────────────────┴─────────────────────────┘
```

---

## 🏗️ Technology Architecture Stack

- **Core Framework**: [Astro 5](https://astro.build) — Island architecture for zero-runtime JS static performance.
- **Styling & Design System**: Tailwind CSS v3.4 + Custom sovereign palette (`#7D3024` Tuscan terracotta, `#141211` obsidian, `#FAF8F5` warm cream).
- **Smooth Inertia Engine**: [Lenis](https://lenis.darkroom.engineering/) — Exponential decay (`lerp: 0.1`, `wheelMultiplier: 1.05`) with GSAP ticker synchronization.
- **Image Optimization**: Astro `<Image />` component with build-time WebP/AVIF generation and adaptive eager/lazy loading.
- **Data Collections**: Astro Content Collections with strict Zod type-safe frontmatter validation.
- **Search Engine Optimization**: Complete Schema.org JSON-LD graph (`Organization`, `LocalBusiness`, `Service`, `BlogPosting`, `BreadcrumbList`, `FAQPage`), XML sitemaps, and LLM context files (`llms.txt`, `llms-full.txt`).
- **Security & Hardening**: Strict Content Security Policy (CSP), Google reCAPTCHA v3 score verification (`>= 0.5`), invisible honeypot trap (`_gotcha`), and IP rate limiting.

---

## 📁 Repository Directory Structure

```text
salowtech-platform/
├── api/                           # Vercel / Edge Serverless Functions
│   ├── leads.js                   # Universal lead intake & CRM sync API
│   ├── crm/                       # Internal CRM telemetry endpoints
│   └── leads/                     # Webhook ingress pipelines
├── public/                        # Static edge assets (copied directly to dist/)
│   ├── assets/                    # Optimized SVGs, brand vectors & 3D personas
│   ├── css/                       # Compiled production styles (lenis.css, tailwind.css, styles.css)
│   ├── js/                        # Client-side controllers (main.js, lenis.min.js, gsap.min.js)
│   ├── robots.txt                 # Search engine and AI crawler indexing directives
│   ├── sitemap.xml                # Canonical XML sitemap covering all 27+ live routes
│   ├── llms.txt                   # LLM summary manifest for AI engines
│   └── llms-full.txt              # Complete architectural context for LLM crawlers
├── src/                           # Astro Source Codebase
│   ├── assets/                    # Source artwork processed by Astro Image Pipeline
│   ├── components/                # Modular UI Components
│   │   ├── Chatbot.astro          # 24/7 AI conversational concierge with 3D mascot
│   │   ├── FAQ.astro              # WAI-ARIA accessible interactive FAQ accordion
│   │   ├── Footer.astro           # Global semantic footer with structured navigation
│   │   ├── Navbar.astro           # Dynamic glassmorphic navbar with mobile drawer
│   │   ├── PreFooterCTA.astro     # High-conversion pre-footer hero banner
│   │   ├── QuoteForm.astro        # Anti-spam quote form with optimistic microsecond UI
│   │   └── RelatedServicesAndGuides.astro # High-intent internal link distribution hub
│   ├── content/                   # Structured Markdown Content Collections
│   │   └── blog/                  # Deep technical articles and engineering deep dives
│   ├── content.config.ts          # Zod schema definitions for content validation
│   ├── data/                      # Global single-source-of-truth metadata
│   │   └── site.ts                # Site URLs, telephone, addresses, and navigation trees
│   ├── layouts/
│   │   └── Layout.astro           # Universal layout (Head meta, OpenGraph, JSON-LD, Lenis)
│   └── pages/                     # Route endpoints (Astro file-based routing)
│       ├── index.astro            # Homepage (Hero, Personas, Architecture, Case Studies)
│       ├── about-us.astro         # Company history, doctrines & senior engineers
│       ├── services.astro         # Sovereign software engineering services index
│       ├── crm-development.astro  # Custom omnichannel CRM engineering
│       ├── erp-development.astro  # Multi-warehouse sovereign cloud ERP
│       ├── hrm-payroll.astro      # Biometric attendance & statutory payroll
│       ├── ai-voice-assistant.astro # Sub-400ms SIP AI voice telephony agents
│       ├── web-development.astro  # Ultra-fast bespoke web applications
│       ├── mobile-app-development.astro # Native iOS, Android & Flutter codebases
│       ├── seo-and-growth.astro   # Technical SEO & Generative Engine Optimization
│       ├── testimonials.astro     # Verified client reviews & enterprise telemetry
│       ├── contact-us.astro       # Direct engineering consultation & quote builder
│       ├── blog.astro             # Technical blog index with real-time category filtering
│       ├── blog/[slug].astro      # In-depth static technical articles
│       ├── privacy-policy.astro   # DPDP Act compliant privacy policy
│       ├── terms-and-conditions.astro # Commercial terms of service & IP transfer guarantees
│       └── 404.astro              # Custom accessible 404 error page
├── supabase/                      # Database migrations, RLS policies & SQL schemas
│   └── migrations/                # Versioned SQL migrations for enterprise CRM tables
├── tools/                         # Local developer & CRM dashboard utilities (never bundled)
│   ├── crm-dashboard.html         # Local web UI for managing quote submissions
│   ├── audit-seo.js               # Autonomous SEO crawler and validation auditor
│   └── server.js                  # Standalone local CRM test server
├── astro.config.mjs               # Astro framework configuration
├── eslint.config.js               # Strict ESLint configuration
├── vercel.json                    # Canonical 301 redirects, security headers & routing
├── package.json                   # Dependencies and execution scripts
└── README.md                      # Engineering documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher (Recommended: `v20.x` or `v22.x LTS`)
- **npm**: `v9.x` or higher

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/salowtech-design/salow-tech.git
cd salow-tech
npm install
```

### 2. Local Development

Start the local Astro development server:

```bash
npm run dev
```

Navigate to `http://localhost:4321` in your browser. Hot Module Replacement (HMR) is active.

### 3. Code Quality & Linting

Enforce code quality standards with ESLint and Prettier:

```bash
# Verify code health and Astro template syntax
npm run lint

# Auto-format codebase adhering to craftsmanship guidelines
npm run format
```

### 4. Production Build & Static Verification

Compile all 27+ static routes, optimized WebP images, and content collections into the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔒 Security & Edge Hardening

- **Content Security Policy (CSP)**: Strict resource origin whitelist restricting scripts, styles, frames, and connections.
- **Honeypot Trap**: Invisible `_gotcha` field intercepts automated spam bots silently with zero user disruption.
- **reCAPTCHA v3 Scoring**: Algorithmic bot detection running silently in the background (threshold score `>= 0.5`).
- **Edge Rate Limiting**: Sliding window rate-limiting protecting public endpoints from abusive scraping and DDoS floods.
- **Security Headers**: Standard OWASP-recommended headers preconfigured:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 📜 Git & Engineering Conventions

All team members and agentic contributors must adhere to the engineering standards:

- **Author**: Commit with verified identity:
  ```bash
  git commit --author="salowtech-design <salowtech@gmail.com>" -m "feat: description"
  ```
- **Conventional Commits**: Format commit messages systematically (`feat:`, `fix:`, `refactor:`, `style:`, `perf:`).
- **Zero AI-Slop**: Reject generic templates, unnatural color blobs, and synthetic badge overlays. Maintain editorial hierarchy.

---

## 📄 License & Intellectual Property

© 2026 **Salow Technologies (Salowtech)**. All rights reserved.  
All software architectures, codebases, custom illustrations, and brand vectors are proprietary intellectual property.
