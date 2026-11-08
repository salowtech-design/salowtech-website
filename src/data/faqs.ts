/**
 * Salowtech - Canonical FAQ Database
 * Single source of truth for on-page FAQ sections and matching FAQPage JSON-LD structured schemas.
 * Questions and answers match visible DOM text 1:1.
 */

export interface FAQEntry {
  question: string;
  answer: string;
}

export const faqsData: Record<string, FAQEntry[]> = {
  "home": [
    {
      "question": "What services do you offer?",
      "answer": "Websites, mobile apps, CRM/HRM/ERM software, AI chatbots and Voice Assistants, all in one place."
    },
    {
      "question": "What is the difference between CRM, HRM and ERM?",
      "answer": "CRM manages your customers, leads and sales. HRM manages your people: attendance, leave, payroll and hiring. ERM brings day-to-day operations like inventory, accounts and reports into one system. We can build them separately or connected."
    },
    {
      "question": "What will the AI and Voice Assistant do for my business?",
      "answer": "The AI chatbot answers customer questions on your website and WhatsApp 24/7, captures leads and books appointments. The Voice Assistant does the same on phone calls and hands over to your team whenever needed."
    },
    {
      "question": "How much time and cost will my project need?",
      "answer": "It depends on the features and size of your project. After a short discovery call we share a clear scope, timeline and fixed quote, so there are no surprise costs later."
    },
    {
      "question": "Will the mobile app work on both Android and iOS?",
      "answer": "Yes. We build one app that runs on both Android and iOS, so you manage a single product and can launch on both stores together."
    },
    {
      "question": "Is my data safe?",
      "answer": "Yes. Your data is encrypted, access is role-based so people only see what they should, and automatic backups run regularly."
    },
    {
      "question": "Do you provide support after launch?",
      "answer": "Yes. We stay with you after launch with bug fixes, updates, team training and help whenever you want to add new features."
    }
  ],
  "ai-voice-assistant": [
    {
      "question": "What can Salowtech AI Voice and Chat Assistants do for enterprise operations?",
      "answer": "Our AI agents answer customer inquiries 24/7 across website chat, WhatsApp, and phone calls. They qualify leads, schedule appointments directly into your team's calendar, resolve support tickets, look up order statuses in your ERP/CRM, and seamlessly transfer complex calls to human agents."
    },
    {
      "question": "How human-like is the voice assistant, and what is the latency during phone conversations?",
      "answer": "We engineer ultra-low latency voice pipelines (under 500ms response time) using neural speech synthesis (TTS) and deep speech recognition (STT). The assistant sounds natural, handles interruptions gracefully, understands accents, and pauses naturally like a trained human representative."
    },
    {
      "question": "How is the AI trained on our company's proprietary products and policies?",
      "answer": "We implement Retrieval-Augmented Generation (RAG) connected to your private knowledge base, product catalogs, FAQs, and PDFs. The AI provides accurate, hallucination-free answers strictly grounded in your company's approved documentation."
    },
    {
      "question": "Does the AI Voice Assistant support multiple languages and regional accents?",
      "answer": "Yes. Our voice agents support English, Hindi, Hinglish, Spanish, Arabic, and regional dialects, automatically detecting the caller's spoken language and responding in the appropriate tongue and accent."
    },
    {
      "question": "Can the AI Voice Assistant dial outbound calls for payment reminders or lead qualification?",
      "answer": "Yes. The system can execute automated outbound call campaigns for appointment confirmations, abandoned cart recovery, event reminders, and subscription renewals with intelligent scheduling and CRM status logging."
    },
    {
      "question": "How do you prevent data leaks and protect caller confidentiality?",
      "answer": "All conversations and transcripts are encrypted in transit and at rest. Personally Identifiable Information (PII) is automatically masked or redacted before storage, adhering to strict enterprise privacy and telecom compliance standards."
    }
  ],
  "crm-development": [
    {
      "question": "How does a custom Salowtech CRM differ from SaaS tools like Salesforce or HubSpot?",
      "answer": "Off-the-shelf SaaS platforms lock your business into steep recurring per-user monthly subscription fees and force your workflow into their rigid templates. A Salowtech custom CRM is built around your exact sales pipeline, eliminates per-seat licensing fees forever, and runs on your sovereign infrastructure."
    },
    {
      "question": "Can our custom CRM integrate with WhatsApp, email, telephony, and accounting systems?",
      "answer": "Yes. We integrate official WhatsApp Business Cloud API, two-way email tracking (Gmail/Outlook), VoIP telephony (Twilio, Exotel) for click-to-call recording, and automatic invoice sync with Tally, QuickBooks, or Zoho Books."
    },
    {
      "question": "How does the CRM help sales teams close deals faster?",
      "answer": "Our CRM features intelligent lead scoring, automated task reminders, interactive Kanban deal boards, real-time quote generation, and automated follow-up drip sequences that ensure no high-value opportunity slips through the cracks."
    },
    {
      "question": "What security measures protect our client contact list and deal financials?",
      "answer": "Your client data is protected by granular Role-Based Access Control (RBAC), preventing reps from exporting or viewing records outside their assigned territory. All database tables are encrypted with AES-256, backed by immutable audit logs."
    },
    {
      "question": "How long does custom CRM deployment take, and how do we migrate existing data?",
      "answer": "An operational MVP CRM deploys in 4 to 8 weeks. We provide zero-downtime ETL migration scripts that clean, deduplicate, and import your existing customer records from legacy spreadsheets, Salesforce, or Zoho without disruption."
    },
    {
      "question": "Do we own the full source code and data after launch?",
      "answer": "Yes. You hold 100% intellectual property ownership of the code, database, and configurations. You can host it on your private cloud (AWS, Azure, GCP) or on-premise servers with total autonomy."
    }
  ],
  "erp-development": [
    {
      "question": "What modules are included in a custom Salowtech ERP system?",
      "answer": "Our modular ERP architecture can include Inventory & Warehouse Management, Procurement & Vendor Portals, Production & Bill of Materials (BOM), Multi-Warehouse Logistics, Financial Accounting & GST/Tax Invoicing, and Executive BI Analytics."
    },
    {
      "question": "Can the ERP handle multi-branch, multi-warehouse, and multi-currency operations?",
      "answer": "Yes. Our enterprise engine supports distributed multi-plant topology, real-time inter-branch stock transfers, automated currency conversions, and consolidated corporate balance sheets with granular subsidiary reporting."
    },
    {
      "question": "How do you connect the ERP with factory floor IoT and barcode scanners?",
      "answer": "We provide native integrations for thermal barcode/QR printers, handheld RFID scanners, weighbridge automation, and PLC/SCADA industrial controllers via MQTT and industrial IoT gateway protocols."
    },
    {
      "question": "How do you guarantee statutory compliance and tax reporting?",
      "answer": "Our accounting modules generate automated e-invoices, e-way bills, GST returns (GSTR-1, GSTR-3B), TDS reconciliation, and audit trails adhering to local statutory commercial laws and IFRS compliance standards."
    },
    {
      "question": "What is the typical timeline and methodology for enterprise ERP implementation?",
      "answer": "We deploy ERPs using phased modular rollouts over 8 to 16 weeks. Critical modules (Inventory & Invoicing) launch first to deliver immediate operational ROI, followed by manufacturing automation and advanced executive reporting."
    },
    {
      "question": "What disaster recovery and backup safeguards are built in?",
      "answer": "Every deployment includes automated hourly incremental snapshots, geo-redundant database replication, point-in-time recovery (PITR), and 99.99% uptime SLAs with failover redundancy."
    }
  ],
  "hrm-payroll": [
    {
      "question": "How does Salowtech HRM automate monthly payroll and tax deductions?",
      "answer": "Our automated payroll engine calculates gross-to-net salary, statutory deductions (PF, ESI, TDS, Professional Tax), overtime, bonuses, and expense reimbursements with one-click bank disbursement file generation and instant digital payslip delivery."
    },
    {
      "question": "Can the HRM integrate with biometric fingerprint and facial recognition attendance hardware?",
      "answer": "Yes. We integrate directly with physical biometric turnstiles, Essl/ZKTeco devices, geo-fenced mobile check-ins, and RFID card readers, synchronizing real-time shift punches directly into payroll without manual spreadsheet entry."
    },
    {
      "question": "What self-service features are available for employees?",
      "answer": "Employees get a dedicated mobile and web self-service portal to view/download payslips, submit leave applications, submit tax declaration investment proofs, request expense reimbursements, and update personal information."
    },
    {
      "question": "How does the system handle complex shift scheduling and leave policies?",
      "answer": "The platform supports custom rotational shifts, night allowance calculations, comp-off accruals, sandwich leave rules, and multi-tier managerial approval workflows customized to your HR policy handbook."
    },
    {
      "question": "How is confidential employee salary and personal data secured?",
      "answer": "All employee compensation data is protected by multi-tier encryption and strict role isolation. HR managers, department heads, and executives only access payroll tiers appropriate to their authorization clearance."
    },
    {
      "question": "Can the HRM system scale as our workforce expands from 50 to 5,000+ employees?",
      "answer": "Yes. Built on cloud-native containerized architecture with high-concurrency database indexing, the system handles concurrent thousands-of-employee shift logins and high-volume payroll batch runs without degradation."
    }
  ],
  "mobile-app-development": [
    {
      "question": "Do you build native iOS, native Android, or cross-platform mobile apps?",
      "answer": "We build both. For graphics-intensive, hardware-coupled applications we build native Swift/SwiftUI for iOS and Kotlin/Jetpack Compose for Android. For high-velocity commercial products, we leverage Flutter and React Native to deliver 120 FPS native performance with a single unified codebase."
    },
    {
      "question": "How do you manage App Store and Google Play Store submission and approvals?",
      "answer": "We manage the entire deployment lifecycle end-to-end: Apple Developer and Google Play Console provisioning, cryptographic signing, privacy policy compliance, metadata optimization, and App Store Review guidelines compliance until official live release."
    },
    {
      "question": "Can the app function offline with background data synchronization?",
      "answer": "Yes. We implement resilient local SQLite/Room/CoreData persistence with conflict-free replicated data types (CRDTs) or queued bidirectional sync, allowing users to perform actions offline that seamlessly reconcile once network connectivity returns."
    },
    {
      "question": "How do you ensure enterprise-grade mobile security and data privacy?",
      "answer": "Our mobile security framework includes AES-256 local database encryption, SSL/TLS certificate pinning, biometric authentication (Face ID / Fingerprint), jailbreak/root detection, and strict OWASP Mobile Top 10 compliance."
    },
    {
      "question": "What backend architecture powers your mobile applications?",
      "answer": "We architect scalable cloud backends on AWS, Google Cloud, or your private sovereign servers using Node.js, Go, or Python with PostgreSQL, Redis caching, real-time WebSockets, and serverless push notification pipelines (APNs &amp; FCM)."
    },
    {
      "question": "What post-launch maintenance and OS update support do you provide?",
      "answer": "We provide comprehensive 24/7 SLA maintenance covering annual major iOS and Android OS version migrations, third-party API deprecations, crash reporting via Sentry/Firebase, performance telemetry, and regular security patching."
    }
  ],
  "seo-and-growth": [
    {
      "question": "What does Salowtech's Technical & Organic SEO service encompass?",
      "answer": "We execute full-funnel search engine optimization: deep technical website audits, Core Web Vitals optimization, semantic schema markup (JSON-LD), programmatic SEO architecture, competitive keyword mapping, and authority-building content strategies."
    },
    {
      "question": "How long does it take to see measurable ranking and organic traffic improvements?",
      "answer": "Technical fixes (crawl errors, indexing, page speed) often produce positive signals within 2 to 4 weeks. Sustained high-intent organic keyword rankings and inbound sales pipeline growth typically materialize within 3 to 6 months."
    },
    {
      "question": "Do you guarantee first-page Google rankings for our business?",
      "answer": "We strictly adhere to Google Search Essentials (white-hat SEO) and avoid fraudulent 'guaranteed overnight #1' claims that lead to algorithmic penalties. We deliver proven, transparent organic traffic growth, top-3 keyword positions for commercial queries, and verifiable inbound leads."
    },
    {
      "question": "How do you optimize for Google Core Web Vitals and page experience?",
      "answer": "We resolve Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) directly in the website code: reducing JavaScript execution time, optimizing CSS delivery, and eliminating layout shifts."
    },
    {
      "question": "Can you help our local business dominate Google Maps and local search?",
      "answer": "Yes. Our Local SEO package optimizes your Google Business Profile (GBP), builds authoritative local citations, manages customer review workflows, and implements geo-targeted schema markup to drive phone calls and foot traffic."
    },
    {
      "question": "What reporting and analytics transparency do you provide?",
      "answer": "You receive an executive real-time dashboard linking Google Analytics 4, Search Console, and keyword rank trackers. Monthly reviews cover organic impressions, click-through rates, keyword ranking deltas, and qualified lead conversions."
    }
  ],
  "web-development": [
    {
      "question": "What types of websites and web platforms does Salowtech build?",
      "answer": "We engineer bespoke enterprise web platforms, high-conversion commercial portals, custom SaaS web apps, and headless e-commerce architectures. Every build is developed from scratch without off-the-shelf templates, tailored precisely to your brand and operational workflows."
    },
    {
      "question": "How do you guarantee sub-second page load speeds and Core Web Vitals?",
      "answer": "Our web engineering follows performance-first principles: pure semantic HTML5, zero bloat, next-gen WebP/AVIF image compression, CSS hardware acceleration, intelligent resource preloading, edge caching, and CDN deployment, achieving guaranteed 95+ Google PageSpeed and Lighthouse scores."
    },
    {
      "question": "Will our website be fully responsive and accessible across all devices?",
      "answer": "Yes. Every interface is designed mobile-first and tested rigorously across iOS Safari, Android Chrome, tablet breakpoints, and 4K ultra-wide monitors. We adhere strictly to WCAG 2.1 AA accessibility guidelines, including full keyboard navigation, screen reader ARIA landmarks, and high-contrast compliance."
    },
    {
      "question": "Do you integrate custom APIs, CRM, ERP, and payment gateways?",
      "answer": "Absolutely. We build robust, secure REST and GraphQL integrations with leading ERPs (SAP, Oracle), CRMs (Salesforce, HubSpot, custom Salowtech CRM), payment gateways (Stripe, Razorpay, PayPal), and third-party logistics or marketing automations."
    },
    {
      "question": "How long does a custom web development project take to launch?",
      "answer": "A dedicated marketing or corporate website ships in 3 to 5 weeks. Complex custom web applications, SaaS dashboards, or e-commerce platforms typically deploy in 6 to 10 weeks via iterative, agile milestones with continuous staging previews."
    },
    {
      "question": "Do we own the full source code and intellectual property?",
      "answer": "100% Yes. Upon project completion and final milestone sign-off, all repository source code, design assets, database schemas, and intellectual property rights are transferred unconditionally to your organization with zero recurring proprietary vendor fees."
    }
  ],
  "testimonials": [
    {
      "question": "What services do you offer?",
      "answer": "Websites, mobile apps, CRM/HRM/ERM software, AI chatbots and Voice Assistants, all in one place."
    },
    {
      "question": "How do you verify the authenticity of client testimonials and metrics?",
      "answer": "Every testimonial and performance metric on this page is sourced from authenticated enterprise contracts and executive stakeholders. For prospective clients under mutual NDA, we coordinate direct peer-to-peer reference calls with our active CTO and engineering leaders."
    },
    {
      "question": "What do you mean by \"100% Sovereign Software Platforms\"?",
      "answer": "Unlike third-party SaaS vendors that store your sensitive factory or financial data overseas and charge recurring monthly per-seat licenses, Salowtech builds platforms that run on your own private cloud or on-premise infrastructure. You own 100% of the code, IP, and database tables."
    },
    {
      "question": "How long does an enterprise migration or project kickoff typically take?",
      "answer": "A standard custom web platform or CRM deployment ships within 4 to 6 weeks. Comprehensive multi-plant ERP migrations with legacy database ingest, barcode hardware integration, and statutory GST verification are delivered in 60 to 90 days with guaranteed zero business downtime."
    },
    {
      "question": "Can we connect Salowtech's platforms with our existing hardware and APIs?",
      "answer": "Yes. Our architectures feature native REST, GraphQL, and MQTT webhook connectors. We regularly integrate with biometric thumbprint scanners, weighbridges, warehouse barcode readers, banking payment gateways, and statutory NIC GST / e-Way portals."
    },
    {
      "question": "Is our enterprise client and financial data secure?",
      "answer": "Yes. Your data is encrypted at rest and in transit, access is strictly role-based (RBAC) so personnel only view authorized records, automated backups run continuously, and platforms comply with Indian DPDP Act 2023 guidelines."
    },
    {
      "question": "Do you provide support and SLAs after launch?",
      "answer": "Yes. Every sovereign platform deployment includes dedicated post-launch engineering support, proactive server telemetry, bug fixes, team training, and quarterly feature upgrades with guaranteed SLA response times."
    }
  ]
};

export function getFAQPageSchema(pageKey: string, pageUrl: string) {
  const items = faqsData[pageKey];
  if (!items || items.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export default faqsData;
