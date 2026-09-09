/**
 * Per-route metadata and JSON-LD. Consumed at build time by prerender.js to
 * write real tags into each static HTML file, and at runtime by useMeta so
 * client-side navigation keeps the document in sync.
 *
 * Everything here derives from src/data/site.js. Answer engines and search
 * engines should never be told anything the page itself does not say.
 */

import { SITE_URL, answers, bio, education, employer, experience, person, technicalFocus } from './data/site';

/** The skills the Person node claims, flattened from the technical focus. */
const SKILLS = technicalFocus.flatMap((group) => group.items);

const PERSON_LD = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: person.fullName,
  alternateName: person.name,
  description: bio,
  url: `${SITE_URL}/`,
  mainEntityOfPage: { '@id': `${SITE_URL}/about#webpage` },
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og.jpg`,
    width: 1200,
    height: 630,
  },
  jobTitle: 'Full-stack developer',
  email: `mailto:${person.email}`,
  knowsLanguage: 'en',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tagaytay City',
    addressCountry: 'PH',
  },
  sameAs: [person.linkedin, person.github],
  worksFor: {
    '@type': 'Organization',
    name: employer.name,
    url: employer.url,
  },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Web developer',
    occupationalCategory: '15-1254.00',
    skills: SKILLS.join(', '),
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
  hasCredential: education.map((item) => ({
    '@type': 'EducationalOccupationalCredential',
    name: item.qualification,
    recognizedBy: { '@type': 'Organization', name: item.institution },
  })),
};

const WEBSITE_LD = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: `${person.name} — Web developer, project manager, QA engineer`,
  url: `${SITE_URL}/`,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person` },
};

/**
 * The Q&A block rendered at /#answers, restated as schema. The question and
 * answer text is the same string the page shows — an answer engine and a
 * reader get the identical wording.
 */
const FAQ_LD = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: answers.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

function breadcrumb(name, path) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

export const ROUTES = {
  '/': {
    title: 'Roan Dino — Web Developer | Golang, React, TypeScript & BIM',
    description:
      'Roan Dino is a software developer with 7+ years across development, QA, and Agile delivery — Golang, Ruby on Rails, Laravel, React and TypeScript. Currently building StratApps, a construction-intelligence SaaS suite, at Strategic Planning Co.',
    ogType: 'profile',
    jsonLd: graph(
      PERSON_LD,
      WEBSITE_LD,
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: 'Roan Dino — Full-stack developer',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#person` },
      },
      FAQ_LD,
    ),
  },
  '/about': {
    title: 'About Roan Dino — Résumé, experience and technical focus',
    description:
      'The full record: seven years of experience across web development, QA, and Agile delivery, role by role — Strategic Planning Co., CRH Ph / Sence1, Akaru PH, Clever Harvest, Yosemitelabs, and Coreproc — with technical focus, education, and contact details.',
    ogType: 'profile',
    jsonLd: graph(
      PERSON_LD,
      WEBSITE_LD,
      {
        '@type': ['AboutPage', 'ProfilePage'],
        '@id': `${SITE_URL}/about#webpage`,
        url: `${SITE_URL}/about`,
        name: 'About Roan Dino',
        description: bio,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#person` },
        /* The roles the page lists, as the work history of the Person node. */
        about: experience.map((role) => ({
          '@type': 'OrganizationRole',
          roleName: role.role,
          /* The periods in the record are human ranges ("Aug 2025 — present"),
             not ISO dates, so they stay in the description rather than being
             forced into startDate. */
          description: `${role.period}. ${role.points.join(' ')}`,
          memberOf: { '@type': 'Organization', name: role.org },
        })),
      },
      breadcrumb('About', '/about'),
    ),
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
