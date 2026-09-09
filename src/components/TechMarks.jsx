import { techMarks } from '../data/techMarks';

/**
 * The stack, as brand marks rather than words.
 *
 * These are the one place on the site that uses real brand marks: everywhere
 * else an icon is drawn in the site's own stroke weight, because it only has
 * to signal an action. Here the mark is the content — recognising it is the
 * whole point — so the official paths are used and rendered in a single
 * inherited colour, which is how each of these logos is licensed to appear.
 *
 * Each mark is named for assistive technology; the list is not decorative,
 * since nothing else in the hero says what the stack is.
 */
const TechMarks = () => (
  <ul className="marks" aria-label="Core stack">
    {techMarks.map((mark, i) => (
      // The index is the beat this mark comes in on; the timing is in motion.css.
      <li className="marks__item" key={mark.title} style={{ '--i': i }}>
        <svg
          className="marks__glyph"
          viewBox="0 0 24 24"
          role="img"
          aria-label={mark.title}
          focusable="false"
        >
          <path d={mark.path} fill="currentColor" />
        </svg>
      </li>
    ))}
  </ul>
);

export default TechMarks;
