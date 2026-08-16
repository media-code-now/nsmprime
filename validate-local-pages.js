#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = fs.readdirSync(root).filter(file => /^local-seo-.*\.html$/.test(file)).sort();
const failures = [];
const titles = new Map();

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const expectedUrl = `https://nsmprime.com/${file}`;
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];

  if (!title) fail(file, 'missing title');
  else if (titles.has(title)) fail(file, `duplicate title also used by ${titles.get(title)}`);
  else titles.set(title, file);

  if (canonical !== expectedUrl) fail(file, `canonical must be ${expectedUrl}`);
  if (/{{[^}]+}}|\bundefined\b/.test(html)) fail(file, 'contains an unresolved template value');
  if (/<meta name="keywords"/i.test(html)) fail(file, 'contains obsolete meta keywords');
  if (/555-0123|aggregateRating|reviewCount|ratingValue|Local Blvd/.test(html)) fail(file, 'contains fabricated trust or contact data');
  if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) fail(file, 'misrepresents this marketing page as a LocalBusiness');

  for (const match of html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)) {
    try { JSON.parse(match[1]); } catch (error) { fail(file, `invalid JSON-LD: ${error.message}`); }
  }
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of files) {
  if (!sitemap.includes(`<loc>https://nsmprime.com/${file}</loc>`)) fail(file, 'missing from sitemap.xml');
}

if (files.length !== 100) failures.push(`Expected 100 local SEO HTML files, found ${files.length}`);

if (failures.length) {
  console.error(`Local SEO validation failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Local SEO validation passed: ${files.length} pages, unique titles, valid schema, and complete sitemap coverage.`);
