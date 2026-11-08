const fs = require('fs');
const path = require('path');

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

console.log('Validating JSON-LD across all 25 sitemap URLs + blog-post...');

let totalBlocks = 0;
let errors = 0;

for (const u of urls) {
  const rel = u.replace('https://salowtech.com', '') || '/';
  const file = rel === '/' ? 'dist/index.html' : path.join('dist', rel, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1].trim());

  if (scripts.length === 0) {
    console.error(`[ERROR] No JSON-LD found in ${u}`);
    errors++;
    continue;
  }

  for (let idx = 0; idx < scripts.length; idx++) {
    totalBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(scripts[idx]);
    } catch (e) {
      console.error(`[SYNTAX ERROR] in ${u} script #${idx + 1}: ${e.message}`);
      errors++;
      continue;
    }

    // Check duplicate @id with conflicting data
    const idMap = new Map();
    const items = parsed['@graph'] || [parsed];
    for (const item of items) {
      if (item['@id']) {
        if (idMap.has(item['@id'])) {
          const prev = idMap.get(item['@id']);
          if (JSON.stringify(prev) !== JSON.stringify(item)) {
            console.error(`[CONFLICTING @id] ${item['@id']} in ${u}`);
            errors++;
          }
        } else {
          idMap.set(item['@id'], item);
        }
      }
    }

    // Specific Homepage Checks
    if (u === 'https://salowtech.com/') {
      const org = items.find(i => i['@type'] === 'Organization');
      if (!org) {
        console.error('[ERROR] Homepage missing Organization schema');
        errors++;
      } else {
        if (org['@id'] !== 'https://salowtech.com/#organization') {
          console.error(`[ERROR] Org @id mismatch: ${org['@id']}`);
          errors++;
        }
        if (org.name !== 'Salowtech') {
          console.error(`[ERROR] Org name is not "Salowtech": ${org.name}`);
          errors++;
        }
        const expectedSameAs = [
          'https://linkedin.com/company/salowtech',
          'https://x.com/salowtech',
          'https://github.com/salowtech',
          'https://instagram.com/salowtech',
          'https://clutch.co/profile/salowtech'
        ];
        if (JSON.stringify(org.sameAs) !== JSON.stringify(expectedSameAs)) {
          console.error('[ERROR] Org sameAs mismatch:', org.sameAs);
          errors++;
        }
      }

      const web = items.find(i => i['@type'] === 'WebSite');
      if (!web) {
        console.error('[ERROR] Homepage missing WebSite schema');
        errors++;
      } else {
        if (web['@id'] !== 'https://salowtech.com/#website') {
          console.error(`[ERROR] WebSite @id mismatch: ${web['@id']}`);
          errors++;
        }
        if (web.name !== 'Salowtech') {
          console.error(`[ERROR] WebSite name is not "Salowtech": ${web.name}`);
          errors++;
        }
        const expectedAlt = ['Salow Technologies', 'Salowtech Technologies'];
        if (JSON.stringify(web.alternateName) !== JSON.stringify(expectedAlt)) {
          console.error('[ERROR] WebSite alternateName mismatch:', web.alternateName);
          errors++;
        }
        if (!web.publisher || web.publisher['@id'] !== 'https://salowtech.com/#organization') {
          console.error('[ERROR] WebSite publisher not pointing to Organization @id:', web.publisher);
          errors++;
        }
      }
    } else {
      // Non-homepage pages MUST have BreadcrumbList
      const breadcrumb = items.find(i => i['@type'] === 'BreadcrumbList');
      if (!breadcrumb) {
        console.error(`[ERROR] Missing BreadcrumbList on ${u}`);
        errors++;
      } else {
        const elements = breadcrumb.itemListElement || [];
        if (elements.length < 2) {
          console.error(`[ERROR] Breadcrumb on ${u} has fewer than 2 elements`);
          errors++;
        } else {
          // Verify element URLs match canonical HTTPS exactly
          if (elements[0].item !== 'https://salowtech.com/') {
            console.error(`[ERROR] Breadcrumb Home item mismatch on ${u}: ${elements[0].item}`);
            errors++;
          }
          const last = elements[elements.length - 1];
          if (last.item !== u) {
            console.error(`[ERROR] Breadcrumb last item mismatch on ${u}: ${last.item} != ${u}`);
            errors++;
          }
          if (u.startsWith('https://salowtech.com/blog/')) {
            if (elements.length !== 3 || elements[1].item !== 'https://salowtech.com/blog') {
              console.error(`[ERROR] Blog article breadcrumb structure mismatch on ${u}: expected Home > Blog > Article`);
              errors++;
            }
          }
        }
      }
    }

    // Blog articles specific checks
    if (u.startsWith('https://salowtech.com/blog/')) {
      const posting = items.find(i => i['@type'] === 'BlogPosting');
      if (!posting) {
        console.error(`[ERROR] Missing BlogPosting on ${u}`);
        errors++;
      } else {
        if (!posting.headline) { console.error(`[ERROR] Missing headline on ${u}`); errors++; }
        if (!posting.description) { console.error(`[ERROR] Missing description on ${u}`); errors++; }
        if (!posting.datePublished) { console.error(`[ERROR] Missing datePublished on ${u}`); errors++; }
        if (!posting.dateModified) { console.error(`[ERROR] Missing dateModified on ${u}`); errors++; }
        if (!posting.author || posting.author['@id'] !== 'https://salowtech.com/#organization' || posting.author.name !== 'Salowtech') {
          console.error(`[ERROR] Author is not Organization Salowtech on ${u}:`, posting.author);
          errors++;
        }
        if (!posting.publisher || posting.publisher['@id'] !== 'https://salowtech.com/#organization') {
          console.error(`[ERROR] Publisher not Organization @id on ${u}:`, posting.publisher);
          errors++;
        }
        if (posting.mainEntityOfPage !== u && posting.mainEntityOfPage?.['@id'] !== u) {
          console.error(`[ERROR] mainEntityOfPage mismatch on ${u}:`, posting.mainEntityOfPage);
          errors++;
        }
        if (!posting.image) {
          console.warn(`[WARN] Article without image: ${u}`);
        }
      }
    }
  }
}

// Blog-post verification
const blogPostHtml = fs.readFileSync('dist/blog-post/index.html', 'utf8');
const robots = blogPostHtml.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
if (!robots || !robots[1].includes('noindex')) {
  console.error('[ERROR] /blog-post missing noindex meta tag!');
  errors++;
} else {
  console.log('✓ Verified: /blog-post contains noindex meta tag:', robots[1]);
}

console.log(`\n======================================================`);
console.log(`Validation Completed: Tested ${totalBlocks} JSON-LD blocks across all pages.`);
console.log(`Errors found: ${errors}`);
console.log(`======================================================`);

if (errors > 0) process.exit(1);
