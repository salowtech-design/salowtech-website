/**
 * Salowtech Editorial Resource Hub & Summary Engine
 */

const SALOW_ARTICLES = [
  {
    id: 'what-is-hrm-software',
    category: 'Tips',
    categoryPill: 'HRM & People',
    title: 'What is an HRM Software? 5 Big Benefits for Small & Growing Businesses',
    excerpt: 'Manual attendance spreadsheets and scattered payroll calculations drain dozens of hours each month. Discover how modern sovereign HRMS transforms people operations.',
    readTime: '10min read',
    date: 'October 20, 2026',
    author: {
      name: 'Débora Oliveira',
      role: 'Principal HR Tech Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Eliminate up to 88% of manual payroll processing time through automated statutory tax and attendance synchronization.',
      'Provide employees frictionless self-service (ESS) for encrypted payslips, leave approvals, and tax declarations.',
      'Biometric fingerprint, facial recognition, and GPS-geofenced mobile punch-in guarantee 100% audit-proof attendance.',
      'Zero recurring per-seat fees with custom-built sovereign systems compared to traditional legacy SaaS taxes.'
    ],
    aiSummary: 'A modern Human Resource Management (HRM) system unifies biometric attendance, leave workflows, and 1-click compliant payroll into a single source of truth. Organizations transitioning from fragmented spreadsheets save 80+ operational hours monthly, achieve 100% statutory PF/ESIC tax compliance, and boost employee satisfaction through mobile-first self-service portals.',
    content: [
      {
        heading: 'The Hidden Cost of Fragmented Spreadsheets',
        body: 'For growing businesses with 20 to 500 employees, workforce administration quietly becomes one of the largest operational drains. HR teams juggle biometric log files, WhatsApp leave requests, overtime adjustments, and complex statutory tax formulas across disconnected Excel workbooks. A single formula error in Provident Fund (PF) or Tax Deducted at Source (TDS) can lead to penalties and friction between management and staff.'
      },
      {
        heading: 'Benefit 1: 1-Click Zero-Error Statutory Payroll',
        body: 'A sovereign HRM platform automatically pulls clean biometric clock-ins, calculates exact shift hours, applies leave rules, and executes payroll in a single click. Deductions for PF, ESIC, Professional Tax, and gratuity are updated dynamically to comply with the latest federal and state tax codes. Directly formatted NACH batch disbursals link directly to premier banking gateways.'
      },
      {
        heading: 'Benefit 2: Biometric & GPS Mobile Geofencing',
        body: 'Whether your workforce operates out of a centralized manufacturing hub, distributed warehouses, or client sites, automated attendance ingestion eliminates proxy punch-ins and buddy clocking. Mobile check-in validates both biometric facial scan and GPS geofencing with sub-second accuracy.'
      },
      {
        heading: 'Benefit 3: Employee Self-Service (ESS)',
        body: 'Empowering staff with self-service mobile dashboards reduces HR query load by over 75%. Staff can download AES-256 encrypted payslips, check compensatory off balances, submit expense receipts, and track tax investments directly from their phones.'
      },
      {
        heading: 'Benefit 4: Structured Performance & 360° Appraisals',
        body: 'Move beyond stressful annual evaluations. Modern HRM embeds quarterly OKR tracking, continuous manager feedback notes, and peer review matrices that tie individual performance directly to commission and merit bonuses.'
      },
      {
        heading: 'Benefit 5: Full Data Sovereignty & Zero Seat Tax',
        body: 'Unlike legacy SaaS platforms that penalize business growth with escalating monthly per-user subscription fees, Salowtech engineers sovereign HRM systems with 100% proprietary source code ownership and zero recurring seat tax.'
      }
    ]
  },
  {
    id: 'manage-customers-crm-pipeline',
    category: 'Tech',
    categoryPill: 'CRM & Sales',
    title: 'How to Manage Customers with a CRM and Double Your Sales Pipeline',
    excerpt: 'Convert more leads with automated WhatsApp alerts, instant telephony sync, and predictive pipeline visibility engineered for modern sales squads.',
    readTime: '8min read',
    date: 'September 17, 2026',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Growth Systems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Sub-5 minute lead response times increase inbound deal conversion by over 391%.',
      'Automated multi-channel engagement routes WhatsApp, phone calls, and email inquiries into a unified pipeline.',
      'Eliminate manual data entry for reps with automatic call logging and sentiment transcript tagging.'
    ],
    aiSummary: 'A bespoke CRM system transforms disjointed customer touchpoints into an automated revenue machine. By integrating WhatsApp API routing, automated telephony logging, and predictive deal scoring, high-growth sales teams close deals 40% faster while eliminating manual administrative overhead.',
    content: [
      {
        heading: 'Why Traditional CRM Implementations Fail',
        body: 'Most off-the-shelf CRMs fail not because of missing features, but because of excessive complexity. Sales representatives spend more time filling out tedious mandatory form fields than speaking with qualified buyers. When data entry feels like homework, data becomes stale and pipeline visibility evaporates.'
      },
      {
        heading: 'Automating the Sub-5-Minute Lead Window',
        body: 'Research demonstrates that contacting an inbound lead within five minutes yields an exponential lift in qualification rates compared to waiting 30 minutes. Custom CRM engineering triggers instant automated WhatsApp qualification sequences and routes high-intent prospects straight to available account executives.'
      },
      {
        heading: 'Unified Omnichannel Communication Hub',
        body: 'Bring WhatsApp conversations, VoIP phone recordings, email threads, and client contracts into one unified timeline. Every rep on your squad has complete contextual memory before dialling a client.'
      }
    ]
  },
  {
    id: 'erp-vs-crm-vs-hrm-guide',
    category: 'Tips',
    categoryPill: 'Enterprise ERP',
    title: 'ERP vs CRM vs HRM: Which Enterprise System Does Your Business Need First?',
    excerpt: 'Confused between supply chain backbones, revenue accelerators, and workforce engines? Here is the CTO architectural decision framework.',
    readTime: '7min read',
    date: 'October 15, 2026',
    author: {
      name: 'Dr. Alistair Chen',
      role: 'Chief Enterprise Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'CRM focuses outward on customer acquisition, deal acceleration, and revenue pipeline velocity.',
      'ERP orchestrates inward operations: inventory, double-entry financial ledgers, manufacturing, and supply chain.',
      'HRM powers human capital: biometric attendance, statutory tax deductions, and payroll disbursals.'
    ],
    aiSummary: 'Understanding the operational boundaries between CRM, ERP, and HRM prevents costly integration dead-ends. While CRM drives outward revenue and customer relationships, ERP synchronizes internal physical and financial ledgers, and HRM manages talent operations. Salowtech unifies all three into an integrated, modular event bus.',
    content: [
      {
        heading: 'Demystifying the Three Enterprise Pillars',
        body: 'As businesses scale beyond single-location operations, software requirements bifurcate into customer relationships, physical operations, and human payroll. Choosing which system to build first depends on your primary bottleneck.'
      },
      {
        heading: 'When to Prioritize CRM First',
        body: 'If your biggest operational challenge is losing prospective leads, delayed sales follow-ups, or lack of pipeline forecasting, invest first in a custom CRM. It delivers the fastest direct cashflow return on investment.'
      },
      {
        heading: 'When ERP Becomes Non-Negotiable',
        body: 'If stock discrepancies occur across warehouses, purchase orders do not reconcile with accounts payable, or manufacturing shop floors face material shortages, an ERP system is the critical foundation.'
      }
    ]
  },
  {
    id: 'high-converting-business-website',
    category: 'Tech',
    categoryPill: 'Web Engineering',
    title: '7 Things to Know Before Building a High-Converting Business Website',
    excerpt: 'Sub-second cold start speeds, semantic SEO architecture, and editorial micro-interactions that turn casual website visitors into signed enterprise contracts.',
    readTime: '6min read',
    date: 'September 28, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Lead UI/UX Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Core Web Vitals directly determine both organic Google rankings and paid ad conversion rates.',
      'Clear, authoritative typography beats flashy generic animations every single time.',
      'Eliminate form friction: 4 high-intent fields convert 160% better than 12 generic inputs.'
    ],
    aiSummary: 'High-converting business websites succeed on three technical foundations: sub-second page performance, crisp editorial clarity, and frictionless conversion paths. Modern engineering avoids heavy template bloat in favor of clean semantic markup, accessible typography, and tailored lead capture.',
    content: [
      {
        heading: 'Performance is the First Feature',
        body: 'Every additional second of page load latency reduces conversion rates by up to 20%. Modern web engineering achieves sub-second Largest Contentful Paint (LCP) by minimizing third-party script bloat, pre-rendering critical CSS, and serving responsive modern image formats.'
      },
      {
        heading: 'Editorial Authority vs Generic Tech Clutter',
        body: 'High-ticket buyers judge your engineering capability by the polish and restraint of your digital storefront. Calm neutrals, warm serif typography, and balanced white space convey institutional credibility.'
      }
    ]
  },
  {
    id: 'custom-vs-ready-made-mobile-app',
    category: 'Tips',
    categoryPill: 'App Development',
    title: 'Custom App vs Ready-Made App: Which Delivers Higher ROI in 2026?',
    excerpt: 'We analyze total cost of ownership, offline performance, hardware integrations, and App Store dominance between bespoke code and off-the-shelf templates.',
    readTime: '9min read',
    date: 'September 18, 2026',
    author: {
      name: 'Rohan Sharma',
      role: 'Head of Mobile Engineering',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Off-the-shelf app templates have low initial costs but hit strict architectural ceilings within 12 months.',
      'Custom native/Flutter apps deliver silky 120 FPS performance, offline SQLite sync, and bespoke Bluetooth/biometric hardware hooks.',
      'Full IP ownership eliminates recurring revenue-share taxes and vendor lock-in.'
    ],
    aiSummary: 'While template apps offer quick prototypes, custom mobile applications engineered in Flutter or Native Swift/Kotlin deliver superior long-term ROI. Bespoke apps provide 120 FPS render performance, robust offline data synchronization, and zero licensing constraints.',
    content: [
      {
        heading: 'The False Economy of Template Apps',
        body: 'Ready-made templates often seem attractive for rapid validation. However, as soon as a business needs customized biometric verification, proprietary offline ledgers, or unique checkout flows, templates require costly workarounds and often break.'
      },
      {
        heading: 'Offline-First Architecture',
        body: 'For logistics, field sales, and warehouse apps, network drops are a daily reality. Bespoke apps store state locally and queue bi-directional sync batches seamlessly without interrupting the user.'
      }
    ]
  },
  {
    id: 'ai-voice-assistant-customer-support',
    category: 'Tech',
    categoryPill: 'AI & Voice',
    title: 'How to Run 24x7 Customer Support with an Intelligent Voice Assistant',
    excerpt: 'Sub-400ms neural speech synthesis, natural Indian accent recognition, and automatic CRM escalation for mission-critical enterprise call operations.',
    readTime: '11min read',
    date: 'August 20, 2026',
    author: {
      name: 'Dr. Priya Nair',
      role: 'Conversational AI Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Resolve over 75% of routine tier-1 inbound support queries without human agent intervention.',
      'Natural real-time latency (<400ms) with streaming WebSocket speech-to-text and neural voice synthesis.',
      'Instant sentiment-based escalation transfers call context and full transcript to human supervisors.'
    ],
    aiSummary: 'Conversational voice assistants handle thousands of concurrent inbound customer calls without queue times. Leveraging streaming ASR, domain-tuned LLMs, and neural voice synthesis, modern voice bots answer complex support questions, book calendar meetings, and log records into CRM systems in real time.',
    content: [
      {
        heading: 'The Death of Robotic IVR Menus',
        body: 'Nobody enjoys listening to "Press 1 for Sales, Press 2 for Support". Modern enterprise voice assistants allow callers to speak naturally in everyday phrasing, comprehending intent and nuance instantly.'
      },
      {
        heading: 'Sub-400ms Response Latency',
        body: 'To feel like a natural conversation, an AI voice system must respond in under 450 milliseconds. By streaming audio tokens over WebSockets, the assistant begins articulating before the entire LLM generation completes.'
      }
    ]
  },
  {
    id: 'google-seo-ranking-2026',
    category: 'Tips',
    categoryPill: 'SEO & Growth',
    title: 'Website SEO: 10 Easy Proven Ways to Rank at the Top of Google & AI Search',
    excerpt: 'From Core Web Vitals and Schema markup to Generative Engine Optimization (GEO), here is how leading brands capture high-intent organic search clicks.',
    readTime: '8min read',
    date: 'August 17, 2026',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Growth Systems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Search engines now evaluate both traditional page rankings and AI search citations (Perplexity, ChatGPT Search, Gemini).',
      'Clean schema JSON-LD markup and semantic article tags establish verifiable domain authority.',
      'High topical authority built across cluster hubs outranks thin, scattered keyword stuffing.'
    ],
    aiSummary: 'Modern SEO requires optimizing for both conventional search engine result pages and new AI answer engines. Technical performance, clean structured schema, and authoritative long-form content ensure high visibility across Google, Perplexity, and AI overviews.',
    content: [
      {
        heading: 'The Dual Search Era: Google + AI Answer Engines',
        body: 'Users no longer just browse blue links; they ask direct questions to Perplexity, ChatGPT, and Google AI Overviews. To be cited as the authoritative source, your content must provide direct, unambiguous definitions and structured data.'
      },
      {
        heading: 'Topical Authority Clustering',
        body: 'Rather than publishing standalone disconnected blog posts, build interconnected content pillars that thoroughly answer every sub-question within your core industry domain.'
      }
    ]
  },
  {
    id: 'cloud-erp-security-checklist',
    category: 'Tech',
    categoryPill: 'ERP Systems',
    title: 'Cloud ERP Security: How Modern Enterprises Protect Sensitive Ledger Data',
    excerpt: 'Role-Based Access Control (RBAC), immutable audit logging, and cryptographic database vaults engineered for financial and operational resilience.',
    readTime: '12min read',
    date: 'July 28, 2026',
    author: {
      name: 'Dr. Alistair Chen',
      role: 'Chief Enterprise Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Multi-tenant isolation and field-level encryption protect trade secrets and sensitive ledger entries.',
      'Immutable audit trails log every change to inventory quantities, prices, and bank disbursements.',
      'Enforce least-privilege RBAC so employees only access data strictly necessary for their active role.'
    ],
    aiSummary: 'Enterprise ERP platforms hold the most sensitive financial, customer, and supply chain data in a company. Implementing strict zero-trust architectures, granular RBAC, and append-only audit ledgers ensures regulatory compliance and protects against internal and external threats.',
    content: [
      {
        heading: 'Why ERP Data is High-Target',
        body: 'Financial ledgers, customer pricing agreements, and supplier bank records represent the crown jewels of enterprise operations. Securing this data requires defense in depth across network, application, and database tiers.'
      },
      {
        heading: 'Cryptographic Audit Trails',
        body: 'Every ledger debit, credit, inventory write-off, or purchase order modification must be permanently written to an append-only log with cryptographic hashing to guarantee tamper evidence.'
      }
    ]
  },
  {
    id: 'business-automation-repetitive-tasks',
    category: 'Tips',
    categoryPill: 'Automation',
    title: 'Business Automation: How to Cut Daily Manual Repetitive Tasks by 80%',
    excerpt: 'Discover practical workflow recipes to automate invoice OCR, lead routing, customer onboarding, and report generation with custom scripts and webhooks.',
    readTime: '7min read',
    date: 'August 24, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Lead UI/UX Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Document OCR and automated parser pipelines extract invoice line items directly into ERP with zero human typing.',
      'Event-driven webhooks trigger instant client onboarding sequences the millisecond an agreement is signed.',
      'Automated daily executive Slack/WhatsApp briefings eliminate hours spent manually compiling status decks.'
    ],
    aiSummary: 'Repetitive copy-pasting between spreadsheets, email clients, and legacy databases costs businesses thousands of productive hours each year. Custom event-driven automations connect disparate systems to process invoices, assign tasks, and generate insights automatically.',
    content: [
      {
        heading: 'Identify the Repetition Tax',
        body: 'If any member of your team performs the exact same sequence of copy-paste keystrokes more than three times a week, that task is an immediate candidate for programmatic automation.'
      },
      {
        heading: 'The Power of Event-Driven Microservices',
        body: 'Rather than relying on fragile manual triggers, modern businesses configure webhook event buses. When a contract is e-signed, a CRM record updates, an invoice generates, and onboarding credentials disburse automatically.'
      }
    ]
  },
  {
    id: 'omnichannel-customer-support-hub',
    category: 'Tech',
    categoryPill: 'Customer Experience',
    title: 'Connecting WhatsApp, Voice, & Email into One Unified Customer Hub',
    excerpt: 'Break down departmental silos by consolidating client chats, inbound telephony recordings, and email threads into a centralized sovereign timeline.',
    readTime: '9min read',
    date: 'August 12, 2026',
    author: {
      name: 'Dr. Priya Nair',
      role: 'Conversational AI Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Customer satisfaction drops by 64% when buyers are asked to repeat their query across different communication channels.',
      'Unified omnichannel pipelines synchronize customer history and ticket context between WhatsApp, email, and live phone calls.',
      'Sovereign backend storage eliminates third-party platform lock-in and per-agent licensing fees.'
    ],
    aiSummary: 'An omnichannel support hub provides a single source of truth for all customer communications. By linking WhatsApp Business APIs, VoIP telephony, and ticketing into one unified database, enterprises eliminate context fragmentation, reduce resolution times by 45%, and elevate client loyalty.',
    content: [
      {
        heading: 'The Frustration of Channel Fragmentation',
        body: 'In typical organizations, customer conversations live in separate silos: sales talks on WhatsApp, support replies over email, and account managers make phone calls without logging notes. This lack of shared context leads to repeated questions and slow resolutions.'
      },
      {
        heading: 'Real-Time Bi-Directional Event Routing',
        body: 'When a customer contacts your team on any touchpoint, the omnichannel hub identifies their account, surfaces past invoices, open tickets, and recent delivery updates in under 200 milliseconds.'
      }
    ]
  },
  {
    id: 'postgresql-timescaledb-financial-vault',
    category: 'Tech',
    categoryPill: 'Enterprise ERP',
    title: 'PostgreSQL & TimescaleDB: Architecting High-Volume Financial Ledgers',
    excerpt: 'Deep-dive into double-entry accounting schemas, cryptographic transaction audits, and sub-second partition aggregation for high-throughput enterprise systems.',
    readTime: '13min read',
    date: 'July 14, 2026',
    author: {
      name: 'Dr. Alistair Chen',
      role: 'Chief Enterprise Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
    },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    keyTakeaways: [
      'Strict double-entry constraints enforced at database layer prevent ledger imbalances under high concurrency.',
      'TimescaleDB hypertables compress time-series transaction records by up to 92% while maintaining microsecond query performance.',
      'Append-only cryptographic hash chains ensure 100% compliance with financial auditing regulations.'
    ],
    aiSummary: 'Engineering mission-critical enterprise ledgers demands mathematical precision and high-throughput write performance. By combining PostgreSQL ACID guarantees with TimescaleDB time-series partitioning, enterprises achieve zero-latency financial reporting and immutable ledger integrity.',
    content: [
      {
        heading: 'Why Application-Layer Ledger Validation Fails',
        body: 'Relying solely on application code to balance debits and credits is dangerous in distributed systems. Network timeouts and concurrency race conditions inevitably cause ledger corruption. True integrity requires database constraints and zero-balance triggers.'
      },
      {
        heading: 'Time-Series Hypertable Optimization',
        body: 'Financial telemetry and inventory audits generate millions of row events daily. Partitioning transactions into chunked hypertables keeps active indexes memory-resident, sustaining peak write throughput.'
      }
    ]
  }
];

/**
 * AI Model Summarize Redirection and Clipboard Integration
 * Triggered when a user clicks an AI Model icon (Gemini, Grok, ChatGPT, Claude)
 */
function summarizeWithAI(modelKey, articleId) {
  const article = SALOW_ARTICLES.find(a => a.id === articleId) || SALOW_ARTICLES[0];
  const pageUrl = window.location.href;

  const promptText = `Please provide a clear, comprehensive summary of this Salowtech engineering article: "${article.title}".
Category: ${article.categoryPill}
Original Article URL: ${pageUrl}

Executive Summary:
${article.aiSummary}

Key Takeaways to expand:
- ${article.keyTakeaways.join('\n- ')}

Please provide:
1. An Executive Summary (3-4 sentences)
2. Strategic Implications for Technology Leaders
3. Tactical Recommendations & Best Practices
4. Common Mistakes to Avoid`;

  let targetUrl = '';
  let modelName = '';

  switch (modelKey.toLowerCase()) {
    case 'gemini':
      modelName = 'Google Gemini';
      targetUrl = `https://gemini.google.com/app?q=${encodeURIComponent(promptText)}`;
      break;
    case 'chatgpt':
      modelName = 'ChatGPT (OpenAI)';
      targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
      break;
    case 'grok':
      modelName = 'Grok (xAI)';
      targetUrl = `https://grok.com/?q=${encodeURIComponent(promptText)}`;
      break;
    case 'claude':
      modelName = 'Claude (Anthropic)';
      targetUrl = `https://claude.ai/new?q=${encodeURIComponent(promptText)}`;
      break;
    case 'qwen':
      modelName = 'Qwen (Alibaba Cloud)';
      targetUrl = `https://chat.qwenlm.ai/?q=${encodeURIComponent(promptText)}`;
      break;
    case 'deepseek':
      modelName = 'DeepSeek AI';
      targetUrl = `https://chat.deepseek.com/?q=${encodeURIComponent(promptText)}`;
      break;
    case 'kimi':
      modelName = 'Kimi (Moonshot AI)';
      targetUrl = `https://kimi.moonshot.cn/?q=${encodeURIComponent(promptText)}`;
      break;
    default:
      modelName = 'Google Gemini';
      targetUrl = `https://gemini.google.com/app?q=${encodeURIComponent(promptText)}`;
  }

  // Copy prompt to clipboard for 100% reliability
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(promptText).then(() => {
      showAIToast(`✓ Summarize prompt copied to clipboard! Opening ${modelName}...`);
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }, 400);
    }).catch(() => {
      showAIToast(`Opening ${modelName}...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  } else {
    showAIToast(`Opening ${modelName}...`);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Animated Toast Notification
 */
function showAIToast(message) {
  let toast = document.getElementById('salow-ai-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'salow-ai-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-medium border border-neutral-700/80';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3800);
}

/**
 * Toggle Instant In-Page AI Summary Preview
 */
function toggleInstantAISummary() {
  const summaryBox = document.getElementById('instant-ai-summary-box');
  if (!summaryBox) return;
  summaryBox.classList.toggle('hidden');
  if (!summaryBox.classList.contains('hidden')) {
    summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Newsletter Form Submit Handler
 */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const emailVal = input ? input.value : '';
  showAIToast(`✓ Subscribed! Welcome to Salowtech resources.`);
  if (input) input.value = '';
}

/**
 * Render Editorial Blog Grid matching Kindsight layout (Image 1)
 * 3-Column responsive card grid with Slot 6 Newsletter Callout
 */
function renderBlogGrid(containerId = 'blog-grid', category = 'all', query = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  const filtered = SALOW_ARTICLES.filter(item => {
    const matchesCategory = normalizedCategory === 'all' || 
      item.category.toLowerCase() === normalizedCategory ||
      item.categoryPill.toLowerCase().includes(normalizedCategory);

    const matchesQuery = !normalizedQuery ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.excerpt.toLowerCase().includes(normalizedQuery) ||
      item.categoryPill.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  const countBadge = document.getElementById('blog-count-badge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Article' : 'Articles'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#E5DFD3] mx-auto flex items-center justify-center text-[#AD8B73] mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
        <p class="text-sm text-stone-500 mb-4">Try searching for other keywords like "HRM", "ERP", "CRM", or "AI".</p>
        <button type="button" onclick="resetBlogFilters()" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
          Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  let html = '';
  let slotIndex = 0;

  filtered.forEach(item => {
    // In slot 6 (index 5) when viewing all or on broad views, inject newsletter box
    if (slotIndex === 5 && (normalizedCategory === 'all' || filtered.length >= 6)) {
      html += getNewsletterBoxHTML();
    }

    html += `
      <article class="h-full">
        <a href="blog-post.html?id=${item.id}" class="blog-editorial-card group block">
          <div>
            <div class="w-full aspect-[16/10] overflow-hidden bg-stone-100">
              <img src="${item.image}" alt="${item.title}" class="blog-card-thumb" loading="lazy">
            </div>
            <div class="p-6 pb-7">
              <div class="mb-3">
                <span class="inline-block text-[11px] font-bold text-[#AD8B73] uppercase tracking-wider bg-[#FAF7F0] border border-[#EAE3D6] px-2.5 py-0.5 rounded-full">
                  ${item.category}
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-950 leading-snug group-hover:text-[#AD8B73] transition-colors mb-2.5 line-clamp-2">
                ${item.title}
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                ${item.excerpt}
              </p>
            </div>
          </div>
        </a>
      </article>
    `;
    slotIndex++;
  });

  // If filtered has fewer than 5 items, append newsletter box at the end
  if (filtered.length < 5 && normalizedCategory === 'all') {
    html += getNewsletterBoxHTML();
  }

  container.innerHTML = html;
}

function getNewsletterBoxHTML() {
  return `
    <div class="h-full">
      <div class="blog-newsletter-box">
        <div>
          <h3 class="font-serif text-2xl sm:text-3xl text-slate-950 font-normal leading-tight mb-3">
            Be the <span class="italic font-serif">first</span> to read our resources.
          </h3>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            One curated engineering dispatch every fortnight — zero spam, just enterprise benchmarks, production architecture breakdowns, and tactical growth recipes straight to your inbox.
          </p>
        </div>
        <form onsubmit="handleNewsletterSubmit(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1.5">Business Email*</label>
            <input type="email" required placeholder="name@company.com" class="w-full bg-white rounded-xl border border-[#D5CBBF] px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#AD8B73] focus:ring-1 focus:ring-[#AD8B73] shadow-xs">
          </div>
          <button type="submit" class="w-full py-2.5 px-4 rounded-xl border border-stone-900 text-stone-900 font-bold text-xs uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-all shadow-xs cursor-pointer">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  `;
}

function resetBlogFilters() {
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) searchInput.value = '';
  const filterBtn = document.getElementById('blog-filter-btn-label');
  if (filterBtn) filterBtn.textContent = 'All Categories';
  renderBlogGrid('blog-grid', 'all', '');
}

// Export for browser
window.SALOW_ARTICLES = SALOW_ARTICLES;
window.summarizeWithAI = summarizeWithAI;
window.showAIToast = showAIToast;
window.toggleInstantAISummary = toggleInstantAISummary;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.renderBlogGrid = renderBlogGrid;
window.resetBlogFilters = resetBlogFilters;
