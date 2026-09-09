/**
 * Type that rises into place a word at a time.
 *
 * Each word sits in its own mask, so the letters climb out of the line rather
 * than fading on the spot. The wrapper carries the accessible name and the
 * word spans are hidden from assistive technology, so the phrase is still
 * announced — and indexed — as one string.
 *
 * The delays are inline custom properties rather than classes: they depend on
 * the word count, which is content, not style.
 */
const SplitText = ({ text, className = '', delay = 0, step = 90 }) => (
  <span className={`split ${className}`.trim()} aria-label={text}>
    {text.split(' ').map((word, i) => (
      // Words repeat inside a phrase, so the index belongs in the key.
      <span className="split__word" key={`${word}-${i}`} aria-hidden="true">
        <span className="split__inner" style={{ '--word-delay': `${delay + i * step}ms` }}>
          {word}
        </span>
      </span>
    ))}
  </span>
);

export default SplitText;
