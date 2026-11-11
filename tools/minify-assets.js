const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const rootDir = path.resolve(__dirname, '..');
const rootRequire = createRequire(path.join(rootDir, 'package.json'));
const esbuild = rootRequire('esbuild');

async function minifyAssets() {
  console.log('Minifying CSS and JS assets with esbuild...');

  // 1. Minify styles.css
  const cssInputPath = path.join(rootDir, 'public', 'css', 'styles.css');
  const cssOutputPath = path.join(rootDir, 'public', 'css', 'styles.min.css');
  const cssRaw = fs.readFileSync(cssInputPath, 'utf8');
  const cssResult = await esbuild.transform(cssRaw, {
    loader: 'css',
    minify: true,
    legalComments: 'none'
  });
  fs.writeFileSync(cssOutputPath, cssResult.code, 'utf8');
  console.log(`✓ CSS: styles.css (${(cssRaw.length / 1024).toFixed(1)} KiB) -> styles.min.css (${(cssResult.code.length / 1024).toFixed(1)} KiB) - Saved ${((1 - cssResult.code.length / cssRaw.length) * 100).toFixed(1)}%`);

  // 2. Minify main.js
  const jsInputPath = path.join(rootDir, 'public', 'js', 'main.js');
  const jsOutputPath = path.join(rootDir, 'public', 'js', 'main.min.js');
  const jsRaw = fs.readFileSync(jsInputPath, 'utf8');
  const jsResult = await esbuild.transform(jsRaw, {
    loader: 'js',
    minify: true,
    legalComments: 'none',
    target: ['es2020']
  });
  fs.writeFileSync(jsOutputPath, jsResult.code, 'utf8');
  console.log(`✓ JS: main.js (${(jsRaw.length / 1024).toFixed(1)} KiB) -> main.min.js (${(jsResult.code.length / 1024).toFixed(1)} KiB) - Saved ${((1 - jsResult.code.length / jsRaw.length) * 100).toFixed(1)}%`);
}

minifyAssets().catch(err => {
  console.error('Minification failed:', err);
  process.exit(1);
});
