/**
 * Salowtech - Centralized Structured Data (JSON-LD) Factory
 * Generates verified, valid Schema.org entities across all pages using data from siteConfig and faqsData.
 */

import { siteConfig } from "./site";
import { getFAQPageSchema } from "./faqs";

export function getOrganizationEntity() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: "Salowtech",
    legalName: siteConfig.legalName,
    alternateName: ["Salow Technologies", "Salowtech Technologies", "Salow Tech"],
    url: `${siteConfig.siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.siteUrl}/#logo`,
      url: `${siteConfig.siteUrl}/assets/salowtech_logo_square.png`,
      caption: "Salowtech Logo",
      width: "1024",
      height: "1024"
    },
    image: siteConfig.meta.defaultOgImage,
    description: siteConfig.meta.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      addressCountry: siteConfig.contact.address.countryCode
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en", "hi"]
      }
    ],
    sameAs: [
      "https://linkedin.com/company/salowtech",
      "https://x.com/salowtech",
      "https://github.com/salowtech",
      "https://instagram.com/salowtech",
      "https://clutch.co/profile/salowtech"
    ]
  };
}

export function getWebSiteEntity() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    url: `${siteConfig.siteUrl}/`,
    name: "Salowtech",
    alternateName: "Salow Technologies",
    description: siteConfig.meta.defaultDescription,
    inLanguage: "en",
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`
    }
  };
}

export function getBreadcrumbList(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function getHomeSchema() {
  const faq = getFAQPageSchema("home", siteConfig.siteUrl);
  const homeWebPage = {
    "@type": "WebPage",
    "@id": `${siteConfig.siteUrl}/#webpage`,
    url: `${siteConfig.siteUrl}/`,
    name: "Salowtech | Custom Software, CRM, ERP and App Development",
    description: siteConfig.meta.defaultDescription,
    inLanguage: "en",
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`
    },
    about: {
      "@id": `${siteConfig.siteUrl}/#organization`
    }
  };

  const graph: any[] = [getOrganizationEntity(), getWebSiteEntity(), homeWebPage];
  if (faq) graph.push(faq as any);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function getServicesHubSchema() {
  const url = `${siteConfig.siteUrl}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url: url,
        name: "Services | Salowtech",
        description:
          "Sovereign enterprise software engineering services. Custom ERP, CRM, web platforms, mobile apps, HRM, AI voice, and search growth.",
        isPartOf: {
          "@id": `${siteConfig.siteUrl}/#website`
        },
        about: {
          "@id": `${siteConfig.siteUrl}/#organization`
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Salowtech Engineering Services",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Web Development", url: `${siteConfig.siteUrl}/web-development` },
            { "@type": "ListItem", position: 2, name: "Mobile App Development", url: `${siteConfig.siteUrl}/mobile-app-development` },
            { "@type": "ListItem", position: 3, name: "ERP Development", url: `${siteConfig.siteUrl}/erp-development` },
            { "@type": "ListItem", position: 4, name: "CRM Development", url: `${siteConfig.siteUrl}/crm-development` },
            { "@type": "ListItem", position: 5, name: "HRM & Payroll", url: `${siteConfig.siteUrl}/hrm-payroll` },
            { "@type": "ListItem", position: 6, name: "AI Voice Assistant", url: `${siteConfig.siteUrl}/ai-voice-assistant` },
            { "@type": "ListItem", position: 7, name: "SEO & Growth", url: `${siteConfig.siteUrl}/seo-and-growth` }
          ]
        }
      },
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: "Services", url: url }
      ])
    ]
  };
}

export function getServiceSchema(opts: {
  serviceKey: string;
  serviceName: string;
  serviceType: string;
  description: string;
  path: string;
  breadcrumbTitle: string;
}) {
  const serviceUrl = `${siteConfig.siteUrl}${opts.path}`;
  const graph: any[] = [
    {
      "@type": "Service",
      "@id": `${serviceUrl}#service`,
      name: opts.serviceName,
      serviceType: opts.serviceType,
      description: opts.description,
      provider: {
        "@type": "Organization",
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: "Salowtech",
        url: `${siteConfig.siteUrl}/`
      },
      areaServed: "Worldwide"
    },
    getBreadcrumbList([
      { name: "Home", url: `${siteConfig.siteUrl}/` },
      { name: "Services", url: `${siteConfig.siteUrl}/services` },
      { name: opts.breadcrumbTitle, url: serviceUrl }
    ])
  ];

  const faq = getFAQPageSchema(opts.serviceKey, serviceUrl);
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function getAboutSchema() {
  const url = `${siteConfig.siteUrl}/about-us`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url: url,
        name: "About Us | Salowtech",
        description:
          "Senior software architects and engineering team building sovereign ERP, CRM, web and mobile platforms with 100% IP ownership.",
        mainEntity: {
          "@id": `${siteConfig.siteUrl}/#organization`
        }
      },
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: "About Us", url: url }
      ])
    ]
  };
}

export function getContactSchema() {
  const url = `${siteConfig.siteUrl}/contact-us`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url}#webpage`,
        url: url,
        name: "Contact Us | Salowtech",
        description:
          "Connect directly with Salowtech senior software architects. Request a confidential quote with mutual NDA.",
        mainEntity: {
          "@id": `${siteConfig.siteUrl}/#organization`
        }
      },
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: "Contact Us", url: url }
      ])
    ]
  };
}

export function getTestimonialsSchema() {
  const url = `${siteConfig.siteUrl}/testimonials`;
  const faq = getFAQPageSchema("testimonials", url);
  const graph: any[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url: url,
      name: "Testimonials | Salowtech",
      description:
        "Verified engineering delivery feedback and case study insights from enterprise founders working with Salowtech.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: `${siteConfig.siteUrl}/`,
        name: "Salowtech"
      }
    },
    getBreadcrumbList([
      { name: "Home", url: `${siteConfig.siteUrl}/` },
      { name: "Testimonials", url: url }
    ])
  ];
  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function getBlogIndexSchema(posts?: any[]) {
  const url = `${siteConfig.siteUrl}/blog`;
  const articleItems =
    posts && posts.length > 0
      ? posts.map((post: any, index: number) => {
          const slug = post.data?.id || post.id || post.slug;
          return {
            "@type": "ListItem",
            position: index + 1,
            name: post.data?.title || slug,
            url: `${siteConfig.siteUrl}/blog/${slug}`
          };
        })
      : [
          {
            "@type": "ListItem",
            position: 1,
            name: "AI Voice Assistant Customer Support",
            url: `${siteConfig.siteUrl}/blog/ai-voice-assistant-customer-support`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Business Automation Repetitive Tasks",
            url: `${siteConfig.siteUrl}/blog/business-automation-repetitive-tasks`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Cloud ERP Security Checklist",
            url: `${siteConfig.siteUrl}/blog/cloud-erp-security-checklist`
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Custom vs Ready Made Mobile App",
            url: `${siteConfig.siteUrl}/blog/custom-vs-ready-made-mobile-app`
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "ERP vs CRM vs HRM Guide",
            url: `${siteConfig.siteUrl}/blog/erp-vs-crm-vs-hrm-guide`
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Google SEO Ranking 2026",
            url: `${siteConfig.siteUrl}/blog/google-seo-ranking-2026`
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "High Converting Business Website",
            url: `${siteConfig.siteUrl}/blog/high-converting-business-website`
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Manage Customers CRM Pipeline",
            url: `${siteConfig.siteUrl}/blog/manage-customers-crm-pipeline`
          },
          {
            "@type": "ListItem",
            position: 9,
            name: "Omnichannel Customer Support Hub",
            url: `${siteConfig.siteUrl}/blog/omnichannel-customer-support-hub`
          },
          {
            "@type": "ListItem",
            position: 10,
            name: "PostgreSQL TimescaleDB Financial Vault",
            url: `${siteConfig.siteUrl}/blog/postgresql-timescaledb-financial-vault`
          },
          {
            "@type": "ListItem",
            position: 11,
            name: "What is HRM Software",
            url: `${siteConfig.siteUrl}/blog/what-is-hrm-software`
          }
        ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url: url,
        name: "Blog | Salowtech",
        description: "Enterprise software engineering analysis, architecture blueprints, and technology insights.",
        publisher: {
          "@type": "Organization",
          "@id": `${siteConfig.siteUrl}/#organization`,
          name: "Salowtech",
          url: `${siteConfig.siteUrl}/`
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Salowtech Engineering Articles",
          numberOfItems: articleItems.length,
          itemListElement: articleItems
        }
      },
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: "Blog", url: url }
      ])
    ]
  };
}

export function getBlogPostingSchema(post: any, slug: string) {
  const url = `${siteConfig.siteUrl}/blog/${slug}`;
  const publishDate = post.data.date ? new Date(post.data.date).toISOString() : "2026-01-01T00:00:00.000Z";
  const modifiedDate = post.data.dateModified ? new Date(post.data.dateModified).toISOString() : publishDate;

  const entity: any = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.data.title,
    description: post.data.excerpt,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: "Salowtech",
      url: `${siteConfig.siteUrl}/`
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: "Salowtech",
      url: `${siteConfig.siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.siteUrl}/#logo`,
        url: `${siteConfig.siteUrl}/assets/salowtech_logo_square.png`
      }
    },
    mainEntityOfPage: url
  };

  if (post.data.image) {
    entity.image = post.data.image;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      entity,
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: "Blog", url: `${siteConfig.siteUrl}/blog` },
        { name: post.data.title, url: url }
      ])
    ]
  };
}

export function getLegalPageSchema(pageName: string, path: string, description: string) {
  const url = `${siteConfig.siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: `${pageName} | Salowtech`,
        description: description,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteConfig.siteUrl}/#website`,
          url: `${siteConfig.siteUrl}/`,
          name: "Salowtech"
        }
      },
      getBreadcrumbList([
        { name: "Home", url: `${siteConfig.siteUrl}/` },
        { name: pageName, url: url }
      ])
    ]
  };
}
