/**
 * Renders the resume PDF from src/data/site.js, so the download and the site
 * can never disagree. Content mirrors Roan's own resume document; only the
 * typesetting here is the site's.
 *
 * Usage: node scripts/make-resume.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const run = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const site = await import(pathToFileURL(join(root, 'src/data/site.js')).href);
const logo = await import(pathToFileURL(join(root, 'src/data/logo.js')).href);

const { person, experience, education, technicalFocus } = site;

// The same monogram the site carries, so the download is on her letterhead.
const MARK = `<svg class="mark" viewBox="${logo.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <path fill="#1b1d1f" d="${logo.letters}"/><path fill="#1668f5" d="${logo.play}"/></svg>`;

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PROFILE =
  'Software developer with 7+ years of experience spanning Golang, Python, Ruby on Rails, Laravel/PHP, ' +
  'React, React Native, Vue.js, and TypeScript. Comfortable operating across the full delivery ' +
  'cycle — development, QA, and Agile project management — and has shipped production systems in ' +
  'construction technology, fintech, blockchain, education, and e-commerce.';

const SKILLS = [
  ['Languages & Frameworks', 'Golang, Python, Ruby on Rails, Laravel/PHP, React, React Native, Vue.js, TypeScript'],
  ['Systems & Infrastructure', 'PostgreSQL, MySQL, gRPC, Microservices, NATS, Kafka, REST APIs'],
  ['Practices', 'Agile/Scrum project management, QA & test case design, code review, blockchain integrations'],
  ['Languages', 'English, Tagalog'],
];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Roan Dino — Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400&display=swap">
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Archivo', Helvetica, Arial, sans-serif; color: #1b1d1f;
         font-size: 9.5pt; line-height: 1.45; }
  h1 { font-size: 21pt; letter-spacing: -0.02em; margin: 0; font-weight: 600; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10mm; }
  .mark { width: 24mm; height: auto; flex: none; margin-top: 1.5mm; }
  .title { font-size: 10pt; color: #5c6063; margin-top: 2mm; }
  .contact { font-size: 8.5pt; color: #5c6063; margin-top: 2mm; }
  h2 { font-size: 8pt; letter-spacing: 0.09em; text-transform: uppercase; color: #5c6063;
       margin: 7mm 0 2.5mm; padding-bottom: 1.5mm; border-bottom: 1px solid #1b1d1f; font-weight: 600; }
  .profile { font-family: 'Source Serif 4', Georgia, serif; font-size: 10pt; line-height: 1.55; }
  .skill { display: grid; grid-template-columns: 46mm 1fr; gap: 1.5mm 3mm; margin-bottom: 1.5mm; }
  .skill b { font-weight: 600; }
  .role { margin-bottom: 4.5mm; page-break-inside: avoid; }
  .role__head { display: flex; justify-content: space-between; gap: 6mm; align-items: baseline; }
  .role__title { font-weight: 600; font-size: 10pt; }
  .role__period { font-size: 8.5pt; color: #5c6063; white-space: nowrap; }
  .role__org { font-size: 9pt; color: #5c6063; margin-bottom: 1.5mm; }
  ul { margin: 0; padding-left: 4.5mm; }
  li { margin-bottom: 1mm; }
  .edu { display: flex; justify-content: space-between; gap: 6mm; align-items: baseline; margin-bottom: 2.5mm; }
  .edu b { font-weight: 600; }
  .edu span { color: #5c6063; }
</style></head><body>
<div class="head">
  <div>
    <h1>${esc(person.fullName.toUpperCase())}</h1>
    <p class="title">Web Developer &middot; Project Manager &middot; QA Engineer</p>
    <p class="contact">${esc(person.location)} &nbsp;|&nbsp; ${esc(person.phone)} &nbsp;|&nbsp; ${esc(person.email)} &nbsp;|&nbsp; roandino.dev</p>
  </div>
  ${MARK}
</div>

<h2>Profile</h2>
<p class="profile">${esc(PROFILE)}</p>

<h2>Skills</h2>
${SKILLS.map(([k, v]) => `<div class="skill"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}

<h2>Work Experience</h2>
${experience
  .map(
    (r) => `<div class="role">
  <div class="role__head"><span class="role__title">${esc(r.role)}</span><span class="role__period">${esc(r.period)}</span></div>
  <div class="role__org">${esc(r.org)}${r.location ? ` — ${esc(r.location)}` : ''}</div>
  <ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
</div>`,
  )
  .join('')}

<h2>Education</h2>
${education
  .map(
    (e) => `<div class="edu"><b>${esc(e.qualification)}</b><span>${esc(e.period)}</span></div>
<div class="role__org">${esc(e.institution)}</div>`,
  )
  .join('')}
</body></html>`;

const tmp = join(root, 'scripts', '.resume.html');
await writeFile(tmp, html, 'utf8');

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
await mkdir(join(root, 'public'), { recursive: true });
await run(chrome, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${join(root, 'public', 'resume-dino.pdf')}`,
  '--virtual-time-budget=6000',
  pathToFileURL(tmp).href,
]);

console.log('wrote public/resume-dino.pdf');
