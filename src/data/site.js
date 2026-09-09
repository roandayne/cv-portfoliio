/**
 * Single source of truth for every fact rendered on the site.
 *
 * Every entry here is drawn from the resume PDF in /public, the git remote,
 * or information supplied directly by Roan. Nothing is inferred or embellished:
 * if a fact is not in one of those sources, it does not belong in this file.
 */

export const SITE_URL = 'https://roandino.dev';

export const person = {
  name: 'Roan Dino',
  fullName: 'Roan Dayne Dino',
  role: 'Web developer',
  location: 'Tagaytay City, Philippines',
  email: 'roandaynedenaerys@gmail.com',
  phone: '+63 917 148 9734',
  linkedin: 'https://www.linkedin.com/in/roan-dayne-dino-471888bb',
  github: 'https://github.com/roandayne',
  resume: '/resume-dino.pdf',
  since: 2019,
};

/**
 * Roan's employer. The website address is the one she maintains, named in her
 * resume; nothing here is drawn from the platform itself, which is access-
 * controlled.
 */
export const employer = {
  name: 'Strategic Planning Co.',
  url: 'https://strategicplanning.nz',
  location: 'New Zealand',
};

/**
 * One-paragraph biography. Every clause restates a fact already recorded in
 * this file — it is the prose form of the record, not an addition to it.
 * Used by the About page, the Person schema, and /llms.txt so all three say
 * the same thing.
 */
export const bio =
  'Roan Dino is a web developer based in Tagaytay City, Philippines, with seven years across development, quality assurance, and Agile delivery. She builds and maintains web applications end to end \u2014 frontend, backend, and APIs \u2014 and has shipped production systems in construction technology, fintech, blockchain, education, and e-commerce. She is currently a web developer at Strategic Planning Co. in New Zealand, working on StratApps, a construction-intelligence SaaS suite.';

export const hero = {
  eyebrow: 'Web developer · Project manager · QA engineer',
  lede: 'Building software, systems, and interactive experiences.',
  supporting:
    'Seven years across development, QA, and Agile delivery. Production systems in construction technology, fintech, blockchain, education, and e-commerce.',
};

/**
 * Current work. Supplied directly by Roan; the platform itself sits behind
 * Cloudflare Access, so nothing here is drawn from the application.
 */
export const current = {
  slug: 'stratapps',
  name: 'StratApps',
  status: 'Current',
  year: '2026',
  org: 'Strategic Planning Co.',
  location: 'New Zealand (remote)',
  period: 'Aug 2025 — present',
  role: 'Web Developer',
  /** Public sign-up entry point for the product, supplied by Roan. */
  url: 'http://joinstratapps.qgenx.co.nz/',
  summary:
    'A construction-intelligence SaaS suite used by contractors in New Zealand, Australia, and other markets.',
  short:
    'I develop and maintain the suite, build the company website, and build custom web applications for individual clients.',
  tags: ['IFC / BIM', 'PostgreSQL', 'Go', 'React', 'Cloudflare Access'],
  /** The tools in the suite, as named in Roan's resume. */
  tools: [
    { name: 'iBOQ', what: 'Bill-of-quantities generation' },
    { name: 'IFC-3D Browser', what: 'IFC and BIM model viewing' },
    { name: 'Weatherwise Contingency', what: 'Weather-delay contingency analysis' },
    { name: 'ScheduleScan DCMA', what: 'Schedule quality checks' },
    { name: 'PDF to MS Project', what: 'Programme conversion' },
  ],
  responsibilities: [
    'Developing and maintaining the StratApps suite.',
    'Building and maintaining the company website, strategicplanning.nz.',
    'Building custom web applications for individual clients.',
    'Working with IFC and FRAG model data, and investigating platform data in PostgreSQL.',
  ],
  note: 'The platform is access-controlled, so no screenshots or internal detail appear here.',
};

/**
 * Every project, newest first by start date. There is no featured tier and no
 * "earlier" tier — each entry carries the same fields and the same weight, and
 * the period is what orders them.
 *
 * Each maps to a role in the resume; the wording restates that record rather
 * than adding to it.
 */
export const projects = [
  {
    id: 'blockchain',
    name: 'Blockchain reporting and staking',
    org: 'Freelance',
    period: 'Aug 2024 — Jan 2025',
    short: 'Transaction reporting, syncers, and a recursive-staking web app.',
    role: 'Development',
    stack: ['Go', 'React', 'TypeScript', 'REST APIs'],
  },
  {
    id: 'shortterm',
    name: 'Short-term work platform',
    org: 'CRH Ph / Sence1 Inc.',
    period: 'Jan 2023 — Feb 2025',
    short: 'Connects homeowners with short-term workers.',
    role: 'Development, QA, project management',
    stack: ['Laravel', 'React', 'TypeScript'],
  },
  {
    id: 'scholarship',
    name: 'Scholarship platform',
    org: 'CRH Ph / Sence1 Inc.',
    period: 'Jan 2023 — Feb 2025',
    short: 'Students and providers post, manage, and track applications.',
    role: 'Development, QA, project management',
    stack: ['Ruby on Rails', 'React', 'TypeScript'],
  },
  {
    id: 'manabie',
    name: 'Manabie backend services',
    org: 'Akaru PH',
    period: 'Mar 2022 — Nov 2022',
    short: 'Backend services for an education platform.',
    role: 'Backend development',
    stack: ['gRPC', 'Microservices', 'NATS', 'Kafka'],
  },
  {
    id: 'traceability',
    name: 'Traceability App',
    org: 'Clever Harvest',
    period: 'Dec 2021 — May 2022',
    short: 'Tracks olive oil production across the process.',
    role: 'Development, QA',
    stack: ['React Native', 'React'],
  },
  {
    id: 'myloyalty',
    name: 'MyLoyalty',
    org: 'Coreproc Inc.',
    period: 'Jul 2019 — Jan 2021',
    short: 'Loyalty and rewards platform for cafés in Australia.',
    role: 'Frontend, backend, and APIs',
    stack: ['PHP'],
  },
  {
    id: 'kaching',
    name: 'Kaching',
    org: 'Coreproc Inc.',
    period: 'Jul 2019 — Jan 2021',
    short: 'Remittance and payment platform.',
    role: 'Support and maintenance',
    stack: ['PHP'],
  },
];

/**
 * Products in development. Descriptions are deliberately limited to what has
 * been confirmed; everything not yet built is labelled as planned.
 */
export const inDevelopment = [
  {
    slug: 'pet-portal',
    name: 'Pet Portal',
    status: 'In development',
    tagline: 'A digital baby book for pets.',
    tags: ['Mobile app', 'Health records', 'Concept'],
    summary:
      'A product concept for keeping a pet’s records organised in one place, so an owner can find a vaccination date or a medication history without digging through paperwork.',
    planned: [
      'Pet profile',
      'Vaccination records',
      'Medical history',
      'Medications',
      'Health records',
      'Milestones',
      'Documents',
      'Reminders',
    ],
    plannedNote:
      'A separate professional and veterinary portal is also planned. None of these areas are built yet — they describe the intended scope of the product.',
  },
  {
    slug: 'professional-cleaning-platform',
    name: 'Professional Cleaning Platform',
    status: 'In development',
    tagline: 'A multi-platform product for professional cleaning operations.',
    tags: ['Mobile app', 'Web app', 'Operations'],
    summary:
      'A product being developed across mobile and web to support professional cleaning operations.',
    planned: [],
    plannedNote:
      'Feature scope is still being defined and is not documented here yet.',
  },
];

export const technicalFocus = [
  { area: 'Frontend', items: ['React', 'React Native', 'Vue.js', 'TypeScript'] },
  { area: 'Backend', items: ['Golang', 'Ruby on Rails', 'Laravel', 'PHP'] },
  { area: 'Data', items: ['PostgreSQL', 'Query debugging', 'Data investigation'] },
  { area: 'Distributed systems', items: ['gRPC', 'Microservices', 'NATS', 'Kafka'] },
  { area: '3D and BIM', items: ['Three.js', 'WebGL', 'IFC', 'FRAG', 'BIM model viewing'] },
  { area: 'Quality', items: ['Test case design', 'Regression testing', 'Defect tracking', 'Code review'] },
  { area: 'Delivery', items: ['Agile', 'Scrum', 'Project management'] },
  { area: 'Engineering', items: ['REST APIs', 'Blockchain integrations', 'Git', 'Cloudflare Access'] },
];

export const experience = [
  {
    role: 'Web Developer',
    org: 'Strategic Planning Co.',
    location: 'New Zealand (remote)',
    period: 'Aug 2025 — present',
    current: true,
    points: [
      'Develops and maintains StratApps, a construction-intelligence SaaS suite used by contractors across New Zealand, Australia, and other markets — including bill-of-quantities generation (iBOQ), IFC and BIM model viewing (IFC-3D Browser), weather-delay contingency analysis (Weatherwise Contingency), schedule quality checks (ScheduleScan DCMA), and PDF-to-Microsoft-Project conversion.',
      'Builds and maintains the company website, strategicplanning.nz.',
      'Develops additional custom web applications for individual clients.',
    ],
    stack: ['IFC / BIM', 'PostgreSQL', 'React'],
  },
  {
    role: 'Web Developer, Project Manager',
    org: 'CRH Ph / Sence1 Inc.',
    location: 'Philippines',
    period: 'Jan 2023 — Feb 2025',
    points: [
      'Led project management, QA, and full-stack development for a Laravel, React, and TypeScript platform connecting homeowners with short-term workers.',
      'Spearheaded a Ruby on Rails, React, and TypeScript initiative letting students and scholarship providers post, manage, and track scholarship opportunities and applications.',
      'Shipped feature enhancements and resolved defects on a Ruby on Rails and React client project.',
    ],
    stack: ['Laravel', 'Ruby on Rails', 'React', 'TypeScript'],
  },
  {
    role: 'Golang Developer',
    org: 'Freelance',
    period: 'Aug 2024 — Jan 2025',
    points: [
      'Built transaction report generation for a blockchain platform.',
      'Contributed to syncers that process blockchain transactions.',
      'Developed a React and TypeScript web app consuming a blockchain API to support recursive staking.',
    ],
    stack: ['Golang', 'React', 'TypeScript'],
  },
  {
    role: 'Backend Engineer',
    org: 'Akaru PH',
    location: 'Philippines',
    period: 'Mar 2022 — Nov 2022',
    points: [
      'Developed backend services for the Manabie web application using gRPC, microservices, NATS, and Kafka.',
    ],
    stack: ['gRPC', 'NATS', 'Kafka'],
  },
  {
    role: 'Web Developer, QA',
    org: 'Clever Harvest',
    location: 'USA (remote)',
    period: 'Dec 2021 — May 2022',
    points: [
      'Helped build a Traceability App in React Native for tracking olive oil production.',
      'Performed QA on the companion React web application, verifying data accuracy across the production process.',
    ],
    stack: ['React Native', 'React'],
  },
  {
    role: 'QA Engineer',
    org: 'Yosemitelabs',
    location: 'USA (remote)',
    period: 'Mar 2021 — Dec 2021, May 2022 — May 2023',
    points: [
      'Designed test cases and scenarios from software specifications, covering functional and non-functional requirements.',
      'Executed test cases, logged and tracked defects, and ran regression testing after code changes to protect existing functionality.',
    ],
    stack: [],
  },
  {
    role: 'PHP Developer',
    org: 'Coreproc Inc.',
    location: 'Philippines',
    period: 'Jul 2019 — Jan 2021',
    points: [
      'Supported and maintained Kaching, a remittance and payment platform.',
      'Built the frontend, backend, and APIs for MyLoyalty, a loyalty and rewards platform for cafés in Australia.',
    ],
    stack: ['PHP'],
  },
];

export const education = [
  {
    qualification: 'BS Industrial Engineering',
    institution: 'University of the Philippines',
    period: '2010 — 2017',
  },
  {
    qualification: 'Laravel / PHP Bootcamp',
    institution: 'Zuitt Coding Bootcamp',
    period: '2019',
  },
];

/** Three points, in Roan's own words, shown as a numbered sequence. */
export const about = [
  'I build and maintain web apps and websites — from a simple landing page to an app with real logic behind it.',
  'One person, end to end: I build it, test it and ship it myself, so nothing sits in someone else\u2019s queue.',
  'You see progress weekly and I stay on after launch. My current work is software over construction project data, so complexity doesn\u2019t worry me.',
];

/** Concise factual answers, mirrored in the page copy for answer engines. */
export const answers = [
  {
    q: 'Who is Roan Dino?',
    a: 'Roan Dino is a software developer based in Tagaytay City, Philippines, with over seven years of experience across development, QA, and Agile project management.',
  },
  {
    q: 'What does Roan Dino do?',
    a: 'She builds and maintains web applications across frontend, backend, and APIs, runs quality assurance on them, and manages delivery. She is currently a web developer at Strategic Planning Co. in New Zealand, working on a construction-intelligence SaaS suite.',
  },
  {
    q: 'What technologies does Roan Dino use?',
    a: 'Golang, Ruby on Rails, Laravel and PHP, React, React Native, Vue.js, and TypeScript, with PostgreSQL for data. She has also worked with gRPC, microservices, NATS, and Kafka, and with Three.js, WebGL, IFC, and FRAG for 3D and BIM.',
  },
  {
    q: 'Does Roan Dino work with Three.js and 3D visualisation?',
    a: 'Yes. She works on IFC and BIM model viewing as part of the StratApps suite, and with Three.js and WebGL for 3D on the web. The structural model on this site is built in Three.js.',
  },
  {
    q: 'What industries has Roan Dino shipped software in?',
    a: 'Construction technology, fintech, blockchain, education, and e-commerce.',
  },
  {
    q: 'How can someone contact Roan Dino?',
    a: 'By email at roandaynedenaerys@gmail.com, or through LinkedIn and GitHub. Her resume is available on this site.',
  },
];
