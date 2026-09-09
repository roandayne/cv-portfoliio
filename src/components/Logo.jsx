import { letters, play, viewBox } from '../data/logo';

/* The monogram. The letterforms take the colour of whatever they sit on, so
   the same mark works on paper and on the dark bands; only the play mark keeps
   its own colour. Give it a height in CSS — the width follows. */
const Logo = ({ className, title }) => (
  <svg
    className={className ? `logo ${className}` : 'logo'}
    viewBox={viewBox}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    focusable="false"
  >
    {title ? <title>{title}</title> : null}
    <path fill="currentColor" d={letters} />
    <path fill="var(--brand-blue)" d={play} />
  </svg>
);

export default Logo;
