/**
 * Centralized SEO & Meta Data Configuration for Salowtech
 * Single source of truth for all page titles, descriptions, canonical paths, and social sharing tags.
 * Follows the pattern: "<Topic> | Salowtech" (strictly <= 60 chars).
 * Meta descriptions are between 70 and 160 characters with clear actions.
 */

export interface PageSEO {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
}

export const pagesSEO: Record<string, PageSEO> = {
  home: {
    title: "Salowtech | Custom Software & SaaS Development",
    description:
      "Salowtech builds sovereign custom ERPs, CRMs, web platforms, and mobile apps with 100% code ownership. Partner with our engineering team today.",
    canonicalPath: "/",
    h1: "Salowtech — Sovereign Enterprise Software Development Company. Your growth, our engineering. Your problem, our solution. Built by real engineers — Salow Technologies."
  },
  crmDevelopment: {
    title: "CRM Development | Salowtech",
    description:
      "Tailored CRM software built for multi-channel sales pipelines, lead tracking, automated quotations, and WhatsApp integration. Scale your sales operations.",
    canonicalPath: "/crm-development",
    h1: "Transform Customer Relationships with Scalable CRM Development"
  },
  erpDevelopment: {
    title: "ERP Development | Salowtech",
    description:
      "Sovereign cloud ERP systems integrating multi-warehouse inventory, double-entry accounting, and procurement. Automate your enterprise workflows.",
    canonicalPath: "/erp-development",
    h1: "Synchronize Operations with Modern ERP Solutions"
  },
  webDevelopment: {
    title: "Web Development | Salowtech",
    description:
      "High-performance web apps, custom SaaS portals, and scalable cloud architectures built for speed and security. Discuss your web architecture with us.",
    canonicalPath: "/web-development",
    h1: "Create a Website That Captures Attention, Builds Trust & Drives Action"
  },
  mobileAppDevelopment: {
    title: "Mobile App Development | Salowtech",
    description:
      "Engineered native iOS, Android, and Flutter mobile applications with offline sync, clean UX, and strict app store SLAs. Build your custom mobile app.",
    canonicalPath: "/mobile-app-development",
    h1: "Sovereign Mobile App Engineering for iOS & Android"
  },
  hrmPayroll: {
    title: "HRM & Payroll | Salowtech",
    description:
      "Automate biometric attendance, statutory tax calculations, leave workflows, and multi-tier salary disbursements. Book an HRM demo with Salowtech.",
    canonicalPath: "/hrm-payroll",
    h1: "Empower Your Workforce with Intelligent HRM & Payroll"
  },
  aiVoiceAssistant: {
    title: "AI Voice Assistant | Salowtech",
    description:
      "Low-latency conversational voice bots and automated call assistants for 24/7 customer support and inbound routing. Deploy your custom voice agent.",
    canonicalPath: "/ai-voice-assistant",
    h1: "Automate Operations with 24/7 AI Voice Assistants"
  },
  seoAndGrowth: {
    title: "SEO & Growth | Salowtech",
    description:
      "Technical SEO, Core Web Vitals optimization, and structured search architecture to dominate organic rankings and AI discovery. Audit your search rank.",
    canonicalPath: "/seo-and-growth",
    h1: "Dominate Search Rankings & Accelerate Digital Growth"
  },
  aboutUs: {
    title: "About Us | Salowtech",
    description:
      "Meet the software architects and systems engineers behind Salowtech. We build long-term sovereign digital infrastructure. Learn about our philosophy.",
    canonicalPath: "/about-us",
    h1: "Built by people who care about craft"
  },
  testimonials: {
    title: "Testimonials | Salowtech",
    description:
      "Read verified feedback, operational impact metrics, and case studies from founders and enterprise leaders working with Salowtech. View our track record.",
    canonicalPath: "/testimonials",
    h1: "A partnership to accelerate engineering results"
  },
  contactUs: {
    title: "Contact Us | Salowtech",
    description:
      "Direct access to Salowtech technical founders and architects. Discuss scope, timelines, and technical requirements. Request a direct consultation.",
    canonicalPath: "/contact-us",
    h1: "Contact us"
  },
  blog: {
    title: "Blog | Salowtech",
    description:
      "In-depth technical guides, architectural blueprints, and engineering analyses on ERPs, CRMs, private AI, and modern web systems. Read our latest articles.",
    canonicalPath: "/blog",
    h1: "Engineering Insights & Technology Breakdown"
  },
  privacyPolicy: {
    title: "Privacy Policy & Data Security | Salowtech",
    description:
      "How Salowtech collects, protects, and governs client and visitor data in compliance with enterprise security and privacy standards. Read our privacy policy.",
    canonicalPath: "/privacy-policy",
    h1: "Privacy Policy & Data Protection"
  },
  termsAndConditions: {
    title: "Terms of Service & Engagement | Salowtech",
    description:
      "Contractual standards, intellectual property ownership terms, SLAs, and development service conditions governing client engagements with Salowtech.",
    canonicalPath: "/terms-and-conditions",
    h1: "Terms of Service & Engagement"
  },
  notFound: {
    title: "Page Not Found (404) | Salowtech",
    description:
      "The requested page could not be located on Salowtech. Return to the homepage or contact our engineering team for assistance.",
    canonicalPath: "/404",
    h1: "Woof! This page ran off.",
    noindex: true
  }
} as const;

export const blogArticlesSEO: Record<string, { seoTitle: string; seoDescription?: string }> = {
  "ai-voice-assistant-customer-support": {
    seoTitle: "24x7 AI Voice Customer Support | Salowtech",
    seoDescription:
      "Deploy sub-400ms neural speech synthesis, natural Indian accent recognition, and CRM escalation for mission-critical call operations."
  },
  "business-automation-repetitive-tasks": {
    seoTitle: "Business Workflow Automation Guide | Salowtech",
    seoDescription:
      "Practical workflow recipes to automate invoice OCR, lead routing, customer onboarding, and report generation with custom scripts and webhooks."
  },
  "cloud-erp-security-checklist": {
    seoTitle: "Cloud ERP Ledger Security Guide | Salowtech",
    seoDescription:
      "Role-Based Access Control (RBAC), immutable audit logging, and cryptographic database vaults engineered for financial and operational resilience."
  },
  "custom-vs-ready-made-mobile-app": {
    seoTitle: "Custom vs Ready-Made Mobile Apps | Salowtech",
    seoDescription:
      "Compare total cost of ownership, offline performance, hardware integrations, and App Store dominance between bespoke code and templates."
  },
  "erp-vs-crm-vs-hrm-guide": {
    seoTitle: "ERP vs CRM vs HRM Comparison Guide | Salowtech",
    seoDescription:
      "Confused between supply chain backbones, revenue accelerators, and workforce engines? Here is our comprehensive architectural decision framework."
  },
  "google-seo-ranking-2026": {
    seoTitle: "Website SEO & Search Ranking Guide | Salowtech",
    seoDescription:
      "From Core Web Vitals and Schema markup to Generative Engine Optimization (GEO), learn how leading brands capture high-intent search clicks."
  },
  "high-converting-business-website": {
    seoTitle: "High-Converting Website Guide | Salowtech",
    seoDescription:
      "Sub-second cold start speeds, semantic SEO architecture, and editorial micro-interactions that turn casual website visitors into signed clients."
  },
  "manage-customers-crm-pipeline": {
    seoTitle: "CRM Sales Pipeline Management | Salowtech",
    seoDescription:
      "Convert more leads with automated WhatsApp alerts, instant telephony sync, and predictive pipeline visibility engineered for modern sales squads."
  },
  "omnichannel-customer-support-hub": {
    seoTitle: "Omnichannel Support Hub Guide | Salowtech",
    seoDescription:
      "Break down departmental silos by consolidating client chats, inbound telephony recordings, and email threads into a centralized sovereign timeline."
  },
  "postgresql-timescaledb-financial-vault": {
    seoTitle: "PostgreSQL Financial Ledger Guide | Salowtech",
    seoDescription:
      "Deep-dive into double-entry accounting schemas, cryptographic transaction audits, and sub-second partition aggregation for enterprise ledgers."
  },
  "what-is-hrm-software": {
    seoTitle: "What is HRM Software? Complete Guide | Salowtech",
    seoDescription:
      "Manual spreadsheets drain hours each month. Discover how sovereign HRM software automates attendance, tax filings, and payroll for growing teams."
  }
};

export default pagesSEO;
