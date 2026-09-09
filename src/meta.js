/**
 * Per-route metadata and JSON-LD. Consumed at build time by prerender.js to
 * write real tags into each static HTML file, and at runtime by useMeta so
 * client-side navigation keeps the document in sync.
 */

import { SITE_URL, person } from './data/site';

const PERSON_LD = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: person.fullName,
  alternateName: person.name,
  url: `${SITE_URL}/`,
  jobTitle: 'Full-stack developer',
  email: `mailto:${person.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tagaytay City',
    addressCountry: 'PH',
  },
  sameAs: [person.linkedin, person.github],
  worksFor: {
    '@type': 'Organization',
    name: 'Strategic Planning Co.',
  },
  knowsAbout: [
    'Full-stack web development',
    'Golang',
    'Ruby on Rails',
    'Laravel',
    'React',
    'React Native',
    'TypeScript',
    'PostgreSQL',
    'Vue.js',
    'Quality assurance and software testing',
    'Agile project management',
    'Three.js',
    'WebGL',
    'BIM',
    'IFC',
    'Construction technology',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of the Philippines Los Baños',
  },
};

const WEBSITE_LD = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: `${person.name} — Web developer, project manager, QA engineer`,
  url: `${SITE_URL}/`,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person` },
};

function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export const ROUTES = {
  '/': {
    title: 'Roan Dino — Web Developer | Golang, React, TypeScript & BIM',
    description:
      'Roan Dino is a software developer with 7+ years across development, QA, and Agile delivery — Golang, Ruby on Rails, Laravel, React and TypeScript. Currently building StratApps, a construction-intelligence SaaS suite, at Strategic Planning Co.',
    jsonLd: graph(PERSON_LD, WEBSITE_LD, {
      '@type': 'ProfilePage',
      url: `${SITE_URL}/`,
      name: 'Roan Dino — Full-stack developer',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/#person` },
    }),
  },
};

export const NOT_FOUND_META = {
  title: 'Page not found — Roan Dino',
  description: 'That page does not exist on roandino.dev.',
  noindex: true,
};

export function metaFor(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return ROUTES[clean] || NOT_FOUND_META;
}

export const ROUTE_PATHS = Object.keys(ROUTES);
