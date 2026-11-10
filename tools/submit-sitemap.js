// Automated IndexNow Submission Engine for Bing, Microsoft Edge, and Yandex
const https = require('https');

const host = "salowtech.com";
const key = "4c9e8d1a2b3f4e5c6a7b8c9d0e1f2a3b";
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  "https://salowtech.com/",
  "https://salowtech.com/services",
  "https://salowtech.com/web-development",
  "https://salowtech.com/mobile-app-development",
  "https://salowtech.com/crm-development",
  "https://salowtech.com/erp-development",
  "https://salowtech.com/hrm-payroll",
  "https://salowtech.com/ai-voice-assistant",
  "https://salowtech.com/seo-and-growth",
  "https://salowtech.com/about-us",
  "https://salowtech.com/contact-us",
  "https://salowtech.com/testimonials",
  "https://salowtech.com/blog",
  "https://salowtech.com/privacy-policy",
  "https://salowtech.com/terms-and-conditions",
  "https://salowtech.com/blog/ai-voice-assistant-customer-support",
  "https://salowtech.com/blog/business-automation-repetitive-tasks",
  "https://salowtech.com/blog/cloud-erp-security-checklist",
  "https://salowtech.com/blog/custom-vs-ready-made-mobile-app",
  "https://salowtech.com/blog/erp-vs-crm-vs-hrm-guide",
  "https://salowtech.com/blog/google-seo-ranking-2026",
  "https://salowtech.com/blog/high-converting-business-website",
  "https://salowtech.com/blog/manage-customers-crm-pipeline",
  "https://salowtech.com/blog/omnichannel-customer-support-hub",
  "https://salowtech.com/blog/postgresql-timescaledb-financial-vault",
  "https://salowtech.com/blog/what-is-hrm-software"
];

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

const req = https.request({
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  console.log(`IndexNow Response: ${res.statusCode} ${res.statusMessage}`);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✅ Successfully submitted 26 URLs to IndexNow (Bing / Microsoft Edge Engine)!');
    } else {
      console.log('Response body:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error submitting to IndexNow:', e);
});

req.write(payload);
req.end();
