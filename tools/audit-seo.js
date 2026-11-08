const fs = require('fs');
const path = require('path');

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('Sitemap URL count:', urls.length);

const results = [];
const titles = new Map();
const descs = new Map();

for (const u of urls) {
  const rel = u.replace('https://salowtech.com', '') || '/';
  const file = rel === '/' ? 'dist/index.html' : path.join('dist', rel, 'index.html');
  if (!fs.existsSync(file)) {
    console.error('MISSING FILE IN DIST:', file);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
  
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                         html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  const ogSiteName = (html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const ogTitle = (html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const ogDesc = (html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const ogUrl = (html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const ogImage = (html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';

  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1].trim());

  results.push({
    url: u,
    file: rel,
    title,
    titleLen: title.length,
    titleFormatValid: rel === '/' ? title.startsWith('Salowtech |') : title.endsWith(' | Salowtech'),
    titleUnder60: title.length < 60,
    desc,
    descLen: desc.length,
    descInRange: desc.length >= 120 && desc.length <= 155,
    h1Count: h1Matches.length,
    h1: h1Matches[0] || 'NONE',
    canonical,
    canonicalMatches: canonical === u,
    ogSiteName,
    ogTitle,
    ogDesc,
    ogUrl,
    ogImage,
    jsonLdCount: scripts.length,
    jsonLdBlocks: scripts
  });

  if (title) {
    titles.set(title, (titles.get(title) || []).concat(u));
  }
  if (desc) {
    descs.set(desc, (descs.get(desc) || []).concat(u));
  }
}

console.log('\n======================================================');
console.log('             25 SITEMAP URLS SEO AUDIT');
console.log('======================================================');

let failures = 0;
for (const r of results) {
  const issues = [];
  if (!r.titleUnder60) issues.push(`Title length ${r.titleLen} >= 60`);
  if (!r.titleFormatValid) issues.push(`Title format invalid ("${r.title}")`);
  if (!r.descInRange) issues.push(`Desc length ${r.descLen} not in [120..155] ("${r.desc}")`);
  if (r.h1Count !== 1) issues.push(`H1 count is ${r.h1Count}`);
  if (!r.canonicalMatches) issues.push(`Canonical mismatch: "${r.canonical}" != "${r.url}"`);
  if (r.ogSiteName !== 'Salowtech') issues.push(`og:site_name is "${r.ogSiteName}"`);
  if (!r.ogTitle) issues.push('og:title missing');
  if (!r.ogDesc) issues.push('og:description missing');
  if (r.ogUrl !== r.canonical) issues.push(`og:url mismatch: "${r.ogUrl}" != "${r.canonical}"`);
  if (!r.ogImage) issues.push('og:image missing');

  // Verify JSON-LD parse
  for (let i = 0; i < r.jsonLdBlocks.length; i++) {
    try {
      JSON.parse(r.jsonLdBlocks[i]);
    } catch (e) {
      issues.push(`JSON-LD block ${i + 1} syntax error: ${e.message}`);
    }
  }

  if (issues.length > 0) {
    failures++;
    console.log(`\n✗ FAIL: ${r.url}`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  } else {
    console.log(`✓ PASS: ${r.url} | Title: "${r.title}" (${r.titleLen}c) | Desc: ${r.descLen}c | H1: "${r.h1.slice(0, 40)}..."`);
  }
}

console.log(`\nAudit finished: ${results.length - failures} passed, ${failures} failed out of ${results.length} URLs.`);
