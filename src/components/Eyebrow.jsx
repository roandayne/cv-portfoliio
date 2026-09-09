/**
 * Small uppercase section label with a trailing rule. Styled in home.css; the
 * rule draws itself from the label outwards once the pair is in view, which is
 * why the element carries its own reveal rather than inheriting a parent's.
 */
const Eyebrow = ({ children }) => (
  <p className="eyebrow" data-reveal="fade">
    <span>{children}</span>
    <span className="eyebrow__rule" aria-hidden="true" />
  </p>
);

export default Eyebrow;
