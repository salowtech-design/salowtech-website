# Frontend Inventory — Astro Codebase (`salowtech-astro`)

## 1. Project Overview & Engine Configuration
- **Framework:** Astro 5.1.0 (`astro: "^5.1.0"`)
- **Node Engine:** `>=18.0.0`
- **Output Mode:** Currently `"static"` in `astro.config.mjs` (will adapt to SSR/hybrid for API endpoints)
- **Site URL:** `https://salowtech.com`
- **Build Format:** `directory`
- **Trailing Slash Policy:** `never`
- **TypeScript:** Strict type checks enabled via Astro CLI
- **Linter & Formatter:** ESLint 10 with `eslint-plugin-astro`, Prettier with `prettier-plugin-astro`

---

## 2. Routes & Pages Architecture

### Static & Dynamic Pages (`src/pages/`)
| Route | Page File | Purpose / Type | In Sitemaps? | Status |
|---|---|---|---|---|
| `/` | `src/pages/index.astro` | Homepage / Core Landing | Yes | Active |
| `/about-us` | `src/pages/about-us.astro` | Company story, culture, leadership | Yes | Active |
| `/ai-voice-assistant` | `src/pages/ai-voice-assistant.astro` | AI conversational bot service page | Yes | Active |
| `/blog` | `src/pages/blog.astro` | Blog index & categories | Yes | Active |
| `/blog/:slug` | `src/pages/blog/[slug].astro` | Dynamic blog post rendering | Yes (all 11) | Active |
| `/blog-post` | `src/pages/blog-post.astro` | Legacy static template | No (To redirect/noindex) | Legacy |
| `/contact-us` | `src/pages/contact-us.astro` | Direct contact coordinates & intake form | Yes | Active |
| `/crm-development` | `src/pages/crm-development.astro` | Custom CRM solutions service page | Yes | Active |
| `/erp-development` | `src/pages/erp-development.astro` | Enterprise ERP solutions service page | Yes | Active |
| `/hrm-payroll` | `src/pages/hrm-payroll.astro` | HRM & Payroll software service page | Yes | Active |
| `/mobile-app-development` | `src/pages/mobile-app-development.astro` | iOS & Android app service page | Yes | Active |
| `/privacy-policy` | `src/pages/privacy-policy.astro` | Legal data privacy statement | Yes | Active |
| `/seo-and-growth` | `src/pages/seo-and-growth.astro` | Technical SEO & search growth service page | Yes | Active |
| `/terms-and-conditions` | `src/pages/terms-and-conditions.astro` | Legal contract & terms | Yes | Active |
| `/testimonials` | `src/pages/testimonials.astro` | Case studies, reviews, impact metrics | Yes | Active |
| `/web-development` | `src/pages/web-development.astro` | High-performance web development service page | Yes | Active |
| `/404` | `src/pages/404.astro` | Custom branded 404 error page | No (404 status) | Active |

### Content Collections (`src/content/blog/`)
11 high-value, technical markdown articles with typed frontmatter:
1. `ai-voice-assistant-customer-support.md`
2. `business-automation-repetitive-tasks.md`
3. `cloud-erp-security-checklist.md`
4. `custom-vs-ready-made-mobile-app.md`
5. `erp-vs-crm-vs-hrm-guide.md`
6. `google-seo-ranking-2026.md`
7. `high-converting-business-website.md`
8. `manage-customers-crm-pipeline.md`
9. `omnichannel-customer-support-hub.md`
10. `postgresql-timescaledb-financial-vault.md`
11. `what-is-hrm-software.md`

---

## 3. UI Components & Layouts
- **Shell Layout:** `src/layouts/Layout.astro` (Standardized document head, fonts, canonical logic, OpenGraph, JSON-LD, Lenis smooth scroll, Chatbot mount).
- **Navbar:** `src/components/Navbar.astro` (Clean top header with desktop dropdown menus, mobile hamburger drawer, Quick Action CTA button).
- **Footer:** `src/components/Footer.astro` (Semantic footer with legal links, service directory, address coordinates, social links).
- **Lead Intake Forms:**
  - `src/components/QuoteForm.astro` (Universal lead capture with reCAPTCHA badge, input validation, and CTA).
  - Inline intake forms in service pages (`web-development.astro`, `crm-development.astro`, etc.).
- **Interactive Chatbot:** `src/components/Chatbot.astro` (Floating interactive mascot assistant with automated prompt trees).
- **FAQ Component:** `src/components/FAQ.astro` (Accordion FAQs with matching `FAQPage` schema serialization).
- **PreFooterCTA:** `src/components/PreFooterCTA.astro` (High-conversion closing banner with mascot visual).
- **RelatedServicesAndGuides:** `src/components/RelatedServicesAndGuides.astro` (Internal linking cross-cluster navigation).

---

## 4. Backend Touchpoints & Data Faking Audit
1. **Lead Intake Form Submissions:**
   - Elements currently call `handleQuoteFormSubmit(this)`.
   - Forms submit asynchronously via client-side fetch, falling back to direct browser alerts.
   - Must be unified with progressive enhancement (`<form action="/api/leads" method="POST">`) with server-side Zod validation and client-side fetch enhancement.
2. **Chatbot Messages:**
   - In `Chatbot.astro`, conversation responses are currently hard-coded state trees in client JavaScript.
3. **Blog Engine:**
   - Powered statically by Astro Content Collections in `src/content/blog/`. No external CMS dependency required.

---

## 5. Design System Tokens (FROZEN — DO NOT REDESIGN)
- **Primary Brand Colors:**
  - Deep Espresso / Dark Text: `#2B231A` / `#1C1917` / `#0A0A0A`
  - Terracotta / Accent Rust: `#7D3024` / `#612319`
  - Warm Sand / Cream Background: `#FAF8F5` / `#FAF9F6` / `#F8FAFC`
  - Accent Amber / Coral: `#F37021` / `#FFF5EE` / `#FFE0CC`
  - Border Cream: `#E8E3D7` / `#E5E7EB`
- **Typography:**
  - Editorial Headings: `Instrument Serif`, `Playfair Display` (Italic emphasis)
  - Body & UI: `Plus Jakarta Sans`, `Inter`, `DM Sans`
- **Mascot & Brand Assets:**
  - 3D Mascot with Headphones: `salowtech_mascot_3d.png`, `chatbot_avatar.png`, `mascot_explaining.png`
  - Official Logo Mark: `salowtech_logo.png`
  - Hero Team Artwork: `salowtech_team_hero.jpg`

