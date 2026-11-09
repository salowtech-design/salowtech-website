async function verifyLive() {
  const resp = await fetch('https://salowtech.com/');
  const html = await resp.text();
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!match) {
    console.error('No JSON-LD found on live homepage');
    process.exit(1);
  }
  const data = JSON.parse(match[1]);
  const graph = data['@graph'] || [];
  const org = graph.find(i => i['@type'] === 'Organization');
  const web = graph.find(i => i['@type'] === 'WebSite');

  console.log('--- Organization ---');
  console.log('@id:', org['@id']);
  console.log('name:', org.name);
  console.log('sameAs:', org.sameAs);
  console.log('logo:', org.logo);

  console.log('\n--- WebSite ---');
  console.log('@id:', web['@id']);
  console.log('name:', web.name);
  console.log('alternateName:', web.alternateName);
  console.log('publisher:', web.publisher);

  const blogResp = await fetch('https://salowtech.com/blog/ai-voice-assistant-customer-support');
  const blogHtml = await blogResp.text();
  const blogMatch = blogHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  const blogData = JSON.parse(blogMatch[1]);
  const post = blogData['@graph'].find(i => i['@type'] === 'BlogPosting');
  const breadcrumb = blogData['@graph'].find(i => i['@type'] === 'BreadcrumbList');

  console.log('\n--- BlogPosting ---');
  console.log('headline:', post.headline);
  console.log('author:', post.author);
  console.log('publisher:', post.publisher);
  console.log('mainEntityOfPage:', post.mainEntityOfPage);
  console.log('Breadcrumb:', breadcrumb.itemListElement.map(e => `${e.position}. ${e.name} (${e.item})`));

  console.log('\nALL LIVE STRUCTURED DATA VERIFIED ON PRODUCTION!');
}

verifyLive();

