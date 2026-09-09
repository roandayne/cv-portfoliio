/**
 * Build-time prerender.
 *
 * Renders every route to a static HTML file with its own title, description,
 * canonical URL, social tags and JSON-LD, then writes a sitemap. The output is
 * still a set of plain static files — there is no server involved — but a
 * crawler now receives the full page content instead of an empty root div.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const distDir = join(root, 'dist');

const { render, ROUTE_PATHS, metaFor, SITE_URL } = await import(
  join(root, 'dist-ssr', 'entry-server.js')
);

const template = await readFile(join(distDir, 'index.html'), 'utf8');

/** Escapes a string for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(title)}</title>`);
}

function replaceMeta(html, selectorAttr, name, value) {
  const pattern = new RegExp(`<meta\\s+${selectorAttr}="${name}"[\\s\\S]*?/?>`, 'i');
  const tag = `<meta ${selectorAttr}="${name}" content="${attr(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceCanonical(html, href) {
  return html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/?>/i,
    `<link rel="canonical" href="${attr(href)}" />`,
  );
}

const routes = [...ROUTE_PATHS];

for (const route of routes) {
  const meta = metaFor(route);
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;

  let html = template;
  html = replaceTitle(html, meta.title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  html = replaceCanonical(html, canonical);
  html = replaceMeta(html, 'property', 'og:title', meta.title);
  html = replaceMeta(html, 'property', 'og:description', meta.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', meta.title);
  html = replaceMeta(html, 'name', 'twitter:description', meta.description);

  if (route !== '/') {
    html = html.replace(/<meta property="og:type"[\s\S]*?\/?>/i, '<meta property="og:type" content="article" />');
  }

  if (meta.jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`;
    html = html.replace('</head>', `    ${script}\n  </head>`);
  }

  const markup = render(route);
  html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  const outDir = route === '/' ? distDir : join(distDir, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), html, 'utf8');
  console.log(`prerendered ${route}`);
}

// A 404 document for hosts that serve one by convention.
{
  const meta = metaFor('/does-not-exist');
  let html = replaceTitle(template, meta.title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  html = replaceMeta(html, 'name', 'robots', 'noindex, follow');
  html = html.replace('<div id="root"></div>', `<div id="root">${render('/does-not-exist')}</div>`);
  await writeFile(join(distDir, '404.html'), html, 'utf8');
  console.log('prerendered 404');
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = `${SITE_URL}${route === '/' ? '/' : route}`;
    const priority = route === '/' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n')}
</urlset>
`;

await writeFile(join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('wrote sitemap.xml');
