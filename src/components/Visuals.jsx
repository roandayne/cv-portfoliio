/**
 * Schematic artwork.
 *
 * A line diagram, never a mockup dressed to look like a screenshot. Pet Portal
 * is unbuilt, so there is nothing real to show; this describes shape and
 * intent instead, and is captioned as a diagram where it appears.
 */

/**
 * A phone wireframe for Pet Portal, labelled with the planned areas. Sample
 * labels only; the product is not built.
 */
export function PetPortalDiagram() {
  const rows = ['Vaccinations', 'Medical history', 'Medications', 'Reminders'];
  return (
    <svg
      className="petphone"
      viewBox="0 0 150 280"
      role="img"
      aria-label="Wireframe of a planned Pet Portal screen: a pet profile header above a list of record areas — vaccinations, medical history, medications, and reminders. Not a screenshot."
    >
      <rect x="6" y="6" width="138" height="268" rx="18" fill="var(--paper-raised)" stroke="var(--rule)" />
      <rect x="16" y="18" width="118" height="72" rx="8" fill="var(--paper-sunk)" stroke="var(--rule-faint)" />
      <circle cx="46" cy="54" r="15" fill="none" stroke="var(--rule)" />
      <path d="M39 61 a7 7 0 0 1 14 0" fill="none" stroke="var(--rule)" />
      <circle cx="46" cy="49" r="4.5" fill="none" stroke="var(--rule)" />
      <line x1="72" y1="48" x2="122" y2="48" stroke="var(--rule)" strokeWidth="2" />
      <line x1="72" y1="60" x2="106" y2="60" stroke="var(--rule-faint)" strokeWidth="2" />
      {rows.map((row, i) => (
        <g key={row}>
          <rect
            x="16"
            y={104 + i * 40}
            width="118"
            height="30"
            rx="6"
            fill="none"
            stroke="var(--rule)"
          />
          <circle cx="31" cy={119 + i * 40} r="4" fill="none" stroke="var(--accent)" />
          <text
            x="44"
            y={122 + i * 40}
            fontFamily="var(--font-display)"
            fontSize="8"
            fill="var(--ink-muted)"
          >
            {row}
          </text>
        </g>
      ))}
    </svg>
  );
}
