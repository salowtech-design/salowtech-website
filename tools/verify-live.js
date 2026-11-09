const fs = require('fs');

async function testUrl(url, opts = {}) {
  try {
    const res = await fetch(url, { redirect: 'manual', ...opts });
    return {
      status: res.status,
      location: res.headers.get('location'),
      headers: res.headers,
      text: async () => await res.text()
    };
  } catch (e) {
    return { status: 'ERROR', error: e.message };
  }
}

async function verifyLive() {
  console.log('=== VERIFYING PRODUCTION VERCEL DEPLOYMENT ===\n');

  // 1. Check Homepage
  console.log('1. Checking Homepage https://salowtech.com/ ...');
  const home = await testUrl('https://salowtech.com/');
  console.log(`Status: ${home.status}`);
  if (home.status === 200) {
    const html = await home.text();
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    if (ldMatch) {
      const data = JSON.parse(ldMatch[1]);
      const org = data['@graph']?.find(i => i['@type'] === 'Organization');
      const web = data['@graph']?.find(i => i['@type'] === 'WebSite');
      const page = data['@graph']?.find(i => i['@type'] === 'WebPage');
      console.log('  Organization @id:', org?.['@id']);
      console.log('  Organization sameAs count:', org?.sameAs?.length);
      console.log('  WebSite publisher:', web?.publisher?.['@id']);
      console.log('  WebPage about:', page?.about?.['@id']);
    }
  }

  // 2. Check /services hub
  console.log('\n2. Checking Services Hub https://salowtech.com/services ...');
  const services = await testUrl('https://salowtech.com/services');
  console.log(`Status: ${services.status}`);
  if (services.status === 200) {
    const html = await services.text();
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('  Title:', titleMatch ? titleMatch[1].trim() : 'none');
    console.log('  H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'none');
  }

  // 3. Check www redirect
  console.log('\n3. Checking Host Redirect https://www.salowtech.com/ ...');
  const www = await testUrl('https://www.salowtech.com/');
  console.log(`Status: ${www.status}, Location: ${www.location}`);

  // 4. Check /saas-development redirect
  console.log('\n4. Checking Redirect https://salowtech.com/saas-development ...');
  const saas = await testUrl('https://salowtech.com/saas-development');
  console.log(`Status: ${saas.status}, Location: ${saas.location}`);

  // 5. Check /blog-post noindex
  console.log('\n5. Checking /blog-post noindex status...');
  const blogPost = await testUrl('https://salowtech.com/blog-post');
  console.log(`Status: ${blogPost.status}`);
  if (blogPost.status === 200) {
    const html = await blogPost.text();
    const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["'](.*?)["']/i);
    console.log('  Robots meta:', robots ? robots[1] : 'NONE');
  }

  // 6. Check all 26 Sitemap URLs
  console.log('\n6. Checking all 26 Sitemap URLs on Production...');
  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  let passedCount = 0;
  for (const url of urls) {
    const r = await testUrl(url);
    if (r.status === 200) {
      passedCount++;
    } else {
      console.warn(`  FAIL/NON-200 [${url}]: Status ${r.status}`);
    }
  }
  console.log(`Sitemap URLs returning 200 OK: ${passedCount} / ${urls.length}`);

  console.log('\n=== PRODUCTION VERIFICATION COMPLETE ===');
}

verifyLive();
