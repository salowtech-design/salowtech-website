const fs = require('fs');
const path = require('path');

console.log('=== STARTING SALOWTECH SITELINKS & SEO AUDIT ===\n');

const distDir = path.resolve(__dirname, '../dist');
const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
const vercelPath = path.resolve(__dirname, '../vercel.json');

let hasError = false;

// 1. Audit vercel.json
console.log('1. Auditing vercel.json redirects & host settings...');
try {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const wwwRedirect = vercel.redirects?.find(r => 
    r.has && r.has.some(h => h.type === 'host' && h.value === 'www.salowtech.com')
  );
  if (!wwwRedirect) {
    console.error('FAIL: Missing host redirect for www.salowtech.com');
    hasError = true;
  } else {
    console.log(`PASS: www host redirect found -> ${wwwRedirect.destination} (permanent: ${wwwRedirect.permanent})`);
  }

  const saasRedirect = vercel.redirects?.find(r => r.source === '/saas-development');
  if (!saasRedirect) {
    console.error('FAIL: Missing redirect for /saas-development');
    hasError = true;
  } else {
    console.log(`PASS: /saas-development redirect found -> ${saasRedirect.destination}`);
  }

  if (vercel.trailingSlash !== false) {
    console.error('FAIL: trailingSlash should be false');
    hasError = true;
  } else {
    console.log('PASS: trailingSlash is false');
  }

  if (vercel.cleanUrls !== true) {
    console.error('FAIL: cleanUrls should be true');
    hasError = true;
  } else {
    console.log('PASS: cleanUrls is true');
  }
} catch (e) {
  console.error('FAIL parsing vercel.json:', e.message);
  hasError = true;
}

// 2. Audit Sitemap URLs
console.log('\n2. Auditing sitemap.xml URLs...');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`Found ${locMatches.length} URLs in sitemap.`);
if (locMatches.length !== 26) {
  console.error(`FAIL: Expected 26 URLs in sitemap, got ${locMatches.length}`);
  hasError = true;
} else {
  console.log('PASS: Exactly 26 clean URLs in sitemap.');
}

// 3. Audit Built HTML Pages for all 26 Sitemap URLs
console.log('\n3. Auditing HTML files in dist/ corresponding to all 26 sitemap URLs...');

const titles = new Map();
const descriptions = new Map();

for (const sitemapUrl of locMatches) {
  const parsed = new URL(sitemapUrl);
  const pathname = parsed.pathname;
  
  let filePath;
  if (pathname === '/') {
    filePath = path.join(distDir, 'index.html');
  } else {
    filePath = path.join(distDir, pathname.replace(/^\//, ''), 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    console.error(`FAIL [${sitemapUrl}]: Built file missing at ${filePath}`);
    hasError = true;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Title
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    console.error(`FAIL [${pathname}]: Missing <title>`);
    hasError = true;
  }

  // Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["'](.*?)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';
  if (canonical !== sitemapUrl) {
    console.error(`FAIL [${pathname}]: Canonical mismatch! Page has "${canonical}", sitemap has "${sitemapUrl}"`);
    hasError = true;
  }

  // H1
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length !== 1) {
    console.error(`FAIL [${pathname}]: Expected exactly 1 <h1>, found ${h1Matches.length}`);
    hasError = true;
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  if (titles.has(title)) {
    console.error(`FAIL [${pathname}]: Duplicate title "${title}" (already on ${titles.get(title)})`);
    hasError = true;
  } else {
    titles.set(title, pathname);
  }

  if (descriptions.has(desc)) {
    console.error(`FAIL [${pathname}]: Duplicate description (already on ${descriptions.get(desc)})`);
    hasError = true;
  } else {
    descriptions.set(desc, pathname);
  }

  if (desc.length < 120 || desc.length > 165) {
    console.warn(`WARN [${pathname}]: Description length is ${desc.length} chars (aim for 120-155): "${desc}"`);
  }

  // Check JSON-LD
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    console.error(`FAIL [${pathname}]: Missing JSON-LD structured data`);
    hasError = true;
  } else {
    for (const m of jsonLdMatches) {
      try {
        const parsed = JSON.parse(m[1]);
        if (!parsed['@context'] || !parsed['@context'].includes('schema.org')) {
          console.error(`FAIL [${pathname}]: JSON-LD missing @context schema.org`);
          hasError = true;
        }
      } catch (e) {
        console.error(`FAIL [${pathname}]: Invalid JSON-LD syntax:`, e.message);
        hasError = true;
      }
    }
  }

  console.log(`PASS [${pathname.padEnd(35)}]: title="${title.slice(0, 32)}...", H1=${h1Matches.length}, canonical=${canonical === sitemapUrl ? 'OK' : 'MISMATCH'}`);
}

// Check /blog-post stub
const blogPostPath = path.join(distDir, 'blog-post/index.html');
if (fs.existsSync(blogPostPath)) {
  const html = fs.readFileSync(blogPostPath, 'utf8');
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["'](.*?)["']/i);
  if (!robotsMatch || !robotsMatch[1].includes('noindex')) {
    console.error('FAIL [/blog-post]: Missing noindex in robots meta');
    hasError = true;
  } else {
    console.log('PASS: /blog-post contains noindex, nofollow');
  }
}

// 4. Verify Homepage JSON-LD
console.log('\n4. Verifying Homepage JSON-LD @graph...');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const indexLd = JSON.parse(indexHtml.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)[1]);
const graph = indexLd['@graph'];
const org = graph?.find(e => e['@type'] === 'Organization');
const website = graph?.find(e => e['@type'] === 'WebSite');
const webpage = graph?.find(e => e['@type'] === 'WebPage');

if (!org || !website || !webpage) {
  console.error('FAIL: Homepage JSON-LD graph missing Organization, WebSite or WebPage');
  hasError = true;
} else {
  console.log('PASS: Homepage JSON-LD has Organization, WebSite, and WebPage entities.');
  console.log(`  Organization name: ${org.name}, legalName: ${org.legalName}`);
  console.log(`  Organization sameAs (${org.sameAs?.length} links):`, org.sameAs);
  console.log(`  WebSite publisher:`, website.publisher);
  console.log(`  WebPage about:`, webpage.about);
}

if (hasError) {
  console.error('\nAUDIT FAILED WITH ERRORS!');
  process.exit(1);
} else {
  console.log('\n=== ALL AUDIT CHECKS PASSED PERFECTLY (100%) ===');
}
