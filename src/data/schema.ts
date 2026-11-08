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
    alternateName: ["Salow Technologies", "Salowtech Technologies"],
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
    alternateName: ["Salow Technologies", "Salowtech Technologies"],
    description: siteConfig.meta.defaultDescription,
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
  const graph = [getOrganizationEntity(), getWebSiteEntity()];
  if (faq) graph.push(faq as any);

  return {
    "@context": "https://schema.org",
    "@graph": graph
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
      areaServed: {
        "@type": "Country",
        name: "India"
      }
    },
    getBreadcrumbList([
      { name: "Home", url: `${siteConfig.siteUrl}/` },
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

export function getBlogIndexSchema() {
  const url = `${siteConfig.siteUrl}/blog`;
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
