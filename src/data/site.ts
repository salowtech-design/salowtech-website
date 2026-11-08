/**
 * Salowtech - Central Site Configuration
 * Single source of truth for site URLs, metadata, contact coordinates, and social channels.
 */

export const siteConfig = {
  name: "Salowtech",
  legalName: "Salowtech Technologies",
  tagline: "Sovereign Software Platforms for India",
  siteUrl: "https://salowtech.com",
  contact: {
    email: "contact@salowtech.com",
    phone: "+91 63517 88935",
    phoneRaw: "+916351788935",
    phoneTel: "tel:+916351788935",
    address: {
      city: "Surat",
      state: "Gujarat",
      country: "India",
      countryCode: "IN"
    },
    whatsapp: {
      number: "916351788935",
      url: "https://wa.me/916351788935?text=Hi%20Salowtech%2C%20I%20want%20to%20discuss%20a%20project",
      directUrl: "https://wa.me/916351788935"
    }
  },
  social: {
    linkedin: "https://linkedin.com/company/salowtech",
    x: "https://x.com/salowtech",
    github: "https://github.com/salowtech",
    instagram: "https://instagram.com/salowtech",
    clutch: "https://clutch.co/profile/salowtech"
  },
  meta: {
    defaultTitle: "Salowtech - Sovereign Software Platforms & Enterprise Systems",
    defaultDescription: "Salowtech architects sovereign multi-tenant SaaS platforms, enterprise ERPs, CRMs, and AI voice agents. 100% code ownership. Request a discovery proposal.",
    defaultKeywords: "custom software development company India, enterprise ERP software development, custom CRM development, HRM payroll software India, native mobile app development, conversational AI voice assistant, enterprise software architecture, Surat, Bangalore",
    defaultOgImage: "https://salowtech.com/assets/salowtech_team_hero.jpg"
  }
} as const;

export default siteConfig;
