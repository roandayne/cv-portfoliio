/** A row of stack or topic chips. Styled in base.css. */
const Tags = ({ items, className = '' }) => (
  <ul className={`chips ${className}`.trim()}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export default Tags;
