/**
 * Blog Service Mappings for Contextual Internal Linking (SEO & AEO)
 * Connects editorial blog articles to commercial service capabilities.
 */

export interface RelatedServiceItem {
  title: string;
  shortName: string;
  path: string;
  description: string;
  tag: string;
}

export const blogServiceMap: Record<string, RelatedServiceItem[]> = {
  "what-is-hrm-software": [
    {
      title: "Custom HRM & Payroll Software",
      shortName: "HRM Solutions",
      path: "/hrm-payroll",
      description: "Biometric attendance, automated statutory tax, and sovereign self-service portals.",
      tag: "HR & Workforce"
    },
    {
      title: "Enterprise ERP Development",
      shortName: "ERP Systems",
      path: "/erp-development",
      description: "Unified operations, financial synchronization, and supply chain telemetry.",
      tag: "Enterprise ERP"
    }
  ],
  "manage-customers-crm-pipeline": [
    {
      title: "Custom CRM Development",
      shortName: "CRM Platform",
      path: "/crm-development",
      description: "Omnichannel lead capture, pipeline velocity, and WhatsApp Cloud API automation.",
      tag: "Sales CRM"
    },
    {
      title: "Bespoke Web Development",
      shortName: "Web Apps",
      path: "/web-development",
      description: "High-performance customer portals, dashboards, and scalable web apps.",
      tag: "Web Apps"
    }
  ],
  "erp-vs-crm-vs-hrm-guide": [
    {
      title: "Enterprise ERP Solutions",
      shortName: "ERP Platform",
      path: "/erp-development",
      description: "Synchronize inventory, finance, and plant operations without per-seat taxes.",
      tag: "Operations"
    },
    {
      title: "Custom CRM Development",
      shortName: "CRM Platform",
      path: "/crm-development",
      description: "Lead pipeline management, sales automation, and unified communications.",
      tag: "Sales Pipeline"
    }
  ],
  "high-converting-business-website": [
    {
      title: "Custom Web Development",
      shortName: "Web Engineering",
      path: "/web-development",
      description: "Bespoke React and Next.js websites built for sub-second speed and conversions.",
      tag: "Web Platforms"
    },
    {
      title: "SEO & Growth Engineering",
      shortName: "SEO Services",
      path: "/seo-and-growth",
      description: "Technical search optimization, Core Web Vitals, and Answer Engine Optimization.",
      tag: "Search Growth"
    }
  ],
  "custom-vs-ready-made-mobile-app": [
    {
      title: "Sovereign Mobile App Engineering",
      shortName: "Mobile Apps",
      path: "/mobile-app-development",
      description: "Native iOS, Android, and Flutter apps built for 120 FPS scale and offline sync.",
      tag: "Mobile Apps"
    },
    {
      title: "Custom Web Application Development",
      shortName: "Web Systems",
      path: "/web-development",
      description: "Companion cloud backends, customer portals, and microservice APIs.",
      tag: "Cloud Backend"
    }
  ],
  "ai-voice-assistant-customer-support": [
    {
      title: "24/7 AI Voice Assistants",
      shortName: "AI Voice Agents",
      path: "/ai-voice-assistant",
      description: "Conversational telephony agents with sub-second latency and multilingual speech.",
      tag: "AI Agents"
    },
    {
      title: "Custom CRM Development",
      shortName: "CRM Integration",
      path: "/crm-development",
      description: "Automated call transcription sync and customer conversation timelines.",
      tag: "Telephony CRM"
    }
  ],
  "google-seo-ranking-2026": [
    {
      title: "SEO & Digital Growth Engineering",
      shortName: "SEO & AEO",
      path: "/seo-and-growth",
      description: "Organic search ranking, technical speed, and Generative Engine Optimization.",
      tag: "Organic Growth"
    },
    {
      title: "Custom Web Development",
      shortName: "Web Platforms",
      path: "/web-development",
      description: "Clean semantic markup, sub-second TTFB, and zero layout shift architectures.",
      tag: "Web Platforms"
    }
  ],
  "cloud-erp-security-checklist": [
    {
      title: "Enterprise ERP Development",
      shortName: "ERP Security",
      path: "/erp-development",
      description: "PostgreSQL row-level security, encrypted financial vaults, and sovereign hosting.",
      tag: "Enterprise ERP"
    },
    {
      title: "Custom Web Application Development",
      shortName: "Secure Portals",
      path: "/web-development",
      description: "Hardened enterprise portals with strict RBAC and OWASP compliance.",
      tag: "Secure Systems"
    }
  ],
  "business-automation-repetitive-tasks": [
    {
      title: "Enterprise ERP Solutions",
      shortName: "ERP Automation",
      path: "/erp-development",
      description: "Automate cross-departmental operations, PO approvals, and inventory sync.",
      tag: "Enterprise Systems"
    },
    {
      title: "Conversational AI Voice Assistants",
      shortName: "AI Automation",
      path: "/ai-voice-assistant",
      description: "Autonomous phone support and appointment scheduling agents.",
      tag: "AI Automation"
    }
  ],
  "omnichannel-customer-support-hub": [
    {
      title: "Custom CRM Development",
      shortName: "Omnichannel CRM",
      path: "/crm-development",
      description: "Unified customer inbox for WhatsApp Cloud, email, and telephony.",
      tag: "Customer Support"
    },
    {
      title: "AI Voice Assistant Solutions",
      shortName: "AI Voice Bots",
      path: "/ai-voice-assistant",
      description: "Autonomous customer inquiry resolution with sub-500ms voice latency.",
      tag: "Conversational AI"
    }
  ],
  "postgresql-timescaledb-financial-vault": [
    {
      title: "Enterprise ERP Solutions",
      shortName: "ERP Architecture",
      path: "/erp-development",
      description: "High-scale financial ledger engineering with immutable audit trails.",
      tag: "Database & ERP"
    },
    {
      title: "Custom Web Application Development",
      shortName: "Web Systems",
      path: "/web-development",
      description: "High-throughput financial dashboards and real-time ledger telemetry.",
      tag: "High Scale Web"
    }
  ]
};

const defaultServices: RelatedServiceItem[] = [
  {
    title: "Custom Web Development",
    shortName: "Web Development",
    path: "/web-development",
    description: "High-performance websites and bespoke applications.",
    tag: "Engineering"
  },
  {
    title: "Custom CRM Development",
    shortName: "CRM Systems",
    path: "/crm-development",
    description: "Tailored customer relationship platforms and automation.",
    tag: "Sales"
  }
];

export function getBlogRelatedServices(slug: string): RelatedServiceItem[] {
  return blogServiceMap[slug] || defaultServices;
}
