/**
 * Contextual Internal Linking Data for Service Pages (SEO Sitelinks & User Navigation)
 * Connects service capabilities to complementary services and deep-dive engineering guides.
 */

export interface RelatedSolution {
  title: string;
  path: string;
  description: string;
  tag: string;
}

export interface RelatedGuide {
  title: string;
  path: string;
  readTime: string;
  tag: string;
}

export interface ServiceRelatedData {
  services: RelatedSolution[];
  guides: RelatedGuide[];
}

export const serviceRelatedMap: Record<string, ServiceRelatedData> = {
  "crm-development": {
    services: [
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "Modern cloud web apps and enterprise SaaS platforms with zero layout shift.",
        tag: "Web Apps"
      },
      {
        title: "Enterprise ERP Solutions",
        path: "/erp-development",
        description: "End-to-end supply chain, warehouse telemetry, and operations sync.",
        tag: "Operations"
      },
      {
        title: "AI Voice Assistants",
        path: "/ai-voice-assistant",
        description: "Autonomous telephony AI agents integrated with CRM workflows.",
        tag: "AI Voice"
      },
      {
        title: "SEO & Growth",
        path: "/seo-and-growth",
        description: "Organic search visibility and Generative Engine Optimization.",
        tag: "Search Growth"
      }
    ],
    guides: [
      {
        title: "How to Manage Customers with a CRM and Double Your Sales Pipeline",
        path: "/blog/manage-customers-crm-pipeline",
        readTime: "5 min read",
        tag: "Sales Tech"
      },
      {
        title: "ERP vs CRM vs HRM: Architectural Decision Framework",
        path: "/blog/erp-vs-crm-vs-hrm-guide",
        readTime: "8 min read",
        tag: "Architecture"
      }
    ]
  },
  "erp-development": {
    services: [
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Lead pipeline management, quotation automation, and customer sync.",
        tag: "CRM Hub"
      },
      {
        title: "HRM & Payroll",
        path: "/hrm-payroll",
        description: "Biometric attendance, statutory compliance, and payroll disbursement.",
        tag: "Workforce"
      },
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "High-performance enterprise dashboards and customer portals.",
        tag: "Web Apps"
      },
      {
        title: "AI Voice Assistants",
        path: "/ai-voice-assistant",
        description: "Automated supplier inquiry handling and order status bots.",
        tag: "AI Voice"
      }
    ],
    guides: [
      {
        title: "Cloud ERP Ledger Security Guide: RBAC & Database Vaults",
        path: "/blog/cloud-erp-security-checklist",
        readTime: "6 min read",
        tag: "Security"
      },
      {
        title: "PostgreSQL & TimescaleDB for Immutable Financial Ledgers",
        path: "/blog/postgresql-timescaledb-financial-vault",
        readTime: "7 min read",
        tag: "Database"
      }
    ]
  },
  "web-development": {
    services: [
      {
        title: "Mobile App Development",
        path: "/mobile-app-development",
        description: "Native iOS, Android, and Flutter apps built for 120 FPS scale.",
        tag: "Mobile Apps"
      },
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Tailored lead capture and automated pipeline velocity.",
        tag: "CRM Hub"
      },
      {
        title: "Enterprise ERP Solutions",
        path: "/erp-development",
        description: "Synchronize inventory, finance, and plant operations.",
        tag: "Operations"
      },
      {
        title: "SEO & Growth",
        path: "/seo-and-growth",
        description: "Core Web Vitals green scores and Generative Engine Optimization.",
        tag: "Search Growth"
      }
    ],
    guides: [
      {
        title: "How to Build a High-Converting Business Website in 2026",
        path: "/blog/high-converting-business-website",
        readTime: "6 min read",
        tag: "Web Architecture"
      },
      {
        title: "Website SEO & Search Ranking Guide 2026",
        path: "/blog/google-seo-ranking-2026",
        readTime: "7 min read",
        tag: "SEO Strategy"
      }
    ]
  },
  "mobile-app-development": {
    services: [
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "Scalable cloud backends, customer portals, and microservice APIs.",
        tag: "Web Apps"
      },
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Real-time mobile push notifications and field sales automation.",
        tag: "CRM Hub"
      },
      {
        title: "AI Voice Assistants",
        path: "/ai-voice-assistant",
        description: "In-app conversational voice interaction and automated support.",
        tag: "AI Voice"
      },
      {
        title: "Enterprise ERP Solutions",
        path: "/erp-development",
        description: "Mobile warehouse scanning and field operations telemetry.",
        tag: "Operations"
      }
    ],
    guides: [
      {
        title: "Custom App vs Ready-Made App: Which Delivers Higher ROI in 2026?",
        path: "/blog/custom-vs-ready-made-mobile-app",
        readTime: "7 min read",
        tag: "Mobile ROI"
      },
      {
        title: "Omnichannel Customer Support Hub Architecture",
        path: "/blog/omnichannel-customer-support-hub",
        readTime: "6 min read",
        tag: "Architecture"
      }
    ]
  },
  "hrm-payroll": {
    services: [
      {
        title: "Enterprise ERP Solutions",
        path: "/erp-development",
        description: "Integrate workforce cost centers directly with financial ledgers.",
        tag: "Operations"
      },
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Track employee sales performance and commission automation.",
        tag: "CRM Hub"
      },
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "Sovereign employee self-service portals and internal dashboards.",
        tag: "Web Apps"
      },
      {
        title: "AI Voice Assistants",
        path: "/ai-voice-assistant",
        description: "Automated HR policy Q&A and employee helpdesk voice bots.",
        tag: "AI Voice"
      }
    ],
    guides: [
      {
        title: "What is HRM Software? Complete Enterprise Architecture Guide",
        path: "/blog/what-is-hrm-software",
        readTime: "6 min read",
        tag: "HRM Tech"
      },
      {
        title: "ERP vs CRM vs HRM: Architectural Decision Framework",
        path: "/blog/erp-vs-crm-vs-hrm-guide",
        readTime: "8 min read",
        tag: "Architecture"
      }
    ]
  },
  "ai-voice-assistant": {
    services: [
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Automatic call transcription and lead timeline synchronization.",
        tag: "CRM Hub"
      },
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "Real-time telephony control rooms and agent supervisory dashboards.",
        tag: "Web Apps"
      },
      {
        title: "Mobile App Development",
        path: "/mobile-app-development",
        description: "Mobile SDK integration for in-app voice agents and calls.",
        tag: "Mobile Apps"
      },
      {
        title: "Enterprise ERP Solutions",
        path: "/erp-development",
        description: "Voice-driven inventory queries and purchase order status bots.",
        tag: "Operations"
      }
    ],
    guides: [
      {
        title: "24/7 AI Voice Customer Support Architecture & Indian Accents",
        path: "/blog/ai-voice-assistant-customer-support",
        readTime: "7 min read",
        tag: "AI Telephony"
      },
      {
        title: "Business Workflow Automation for Repetitive Tasks",
        path: "/blog/business-automation-repetitive-tasks",
        readTime: "5 min read",
        tag: "Automation"
      }
    ]
  },
  "seo-and-growth": {
    services: [
      {
        title: "Custom Web Development",
        path: "/web-development",
        description: "Sub-second load times, semantic HTML5, and zero layout shift.",
        tag: "Web Apps"
      },
      {
        title: "Custom CRM Development",
        path: "/crm-development",
        description: "Inbound lead tracking from organic search to closed revenue.",
        tag: "CRM Hub"
      },
      {
        title: "Mobile App Development",
        path: "/mobile-app-development",
        description: "App Store Optimization (ASO) and deep linking architectures.",
        tag: "Mobile Apps"
      },
      {
        title: "AI Voice Assistants",
        path: "/ai-voice-assistant",
        description: "Voice search optimization and answer engine readiness.",
        tag: "AI Voice"
      }
    ],
    guides: [
      {
        title: "Website SEO & Search Ranking Guide 2026",
        path: "/blog/google-seo-ranking-2026",
        readTime: "7 min read",
        tag: "SEO Strategy"
      },
      {
        title: "How to Build a High-Converting Business Website in 2026",
        path: "/blog/high-converting-business-website",
        readTime: "6 min read",
        tag: "Conversion"
      }
    ]
  }
};

export function getServiceRelatedData(serviceKey: string): ServiceRelatedData {
  return serviceRelatedMap[serviceKey] || serviceRelatedMap["crm-development"];
}

