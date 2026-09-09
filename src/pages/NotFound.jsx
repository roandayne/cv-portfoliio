import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page" style={{ paddingBlock: 'var(--s-10)' }}>
    <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Page not found</h1>
    <p style={{ marginTop: 'var(--s-4)', color: 'var(--ink-muted)' }}>
      That page does not exist.{' '}
      <Link className="link" to="/">
        Return to the homepage
      </Link>
      .
    </p>
  </div>
);

export default NotFound;
