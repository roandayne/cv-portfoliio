/**
 * Line icons for the contact buttons.
 *
 * Drawn in the same stroke weight as the rest of the site rather than pulled
 * from an icon set, and deliberately not brand marks: each button carries its
 * own visible label, so the icon only needs to signal the kind of action.
 * Every icon is decorative and hidden from assistive technology.
 */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const MailIcon = () => (
  <svg {...base}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="m3.5 7 7.3 5.2a2 2 0 0 0 2.4 0L20.5 7" />
  </svg>
);

export const LinkedInIcon = () => (
  <svg {...base}>
    <rect x="3" y="3" width="18" height="18" rx="3.5" />
    <path d="M7.6 10.6V17" />
    <circle cx="7.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
    <path d="M11.6 17v-6.4M11.6 13.4a2.6 2.6 0 0 1 5.2 0V17" />
  </svg>
);

export const GitIcon = () => (
  <svg {...base}>
    <circle cx="6.5" cy="6" r="2.5" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="17.5" cy="8" r="2.5" />
    <path d="M6.5 8.5v7M17.5 10.5v.5a4.5 4.5 0 0 1-4.5 4.5H9" />
  </svg>
);

export const DownloadIcon = () => (
  <svg {...base}>
    <path d="M12 3.5v10.5m0 0-3.5-3.5M12 14l3.5-3.5" />
    <path d="M4.5 16.5v1.5a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-1.5" />
  </svg>
);

export const ExternalIcon = () => (
  <svg {...base}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </svg>
);
