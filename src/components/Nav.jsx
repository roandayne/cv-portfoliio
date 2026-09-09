import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { person } from '../data/site';
import Logo from './Logo';
import './nav.css';

/* 'About' points at the résumé page; the rest are homepage anchors. A `to`
   entry is routed, an `href` entry is a plain jump. */
const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { to: '/about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

const Nav = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  // Only the homepage opens on the dark hero, so only there does the bar start
  // in its dark state.
  const [onHero, setOnHero] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setOnHero(false);
      return undefined;
    }

    const hero = document.querySelector('.hero');
    if (!hero) return undefined;

    const observer = new IntersectionObserver((entries) => setOnHero(entries[0].intersectionRatio > 0.12), {
      threshold: [0, 0.12, 0.5],
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header className={`nav${onHero ? ' is-dark' : ''}`}>
      <div className="page nav__inner">
        <Link to="/" className="nav__name" aria-current={isHome ? 'page' : undefined}>
          <Logo className="nav__mark" />
          <span>{person.name}</span>
        </Link>
        <nav aria-label="Sections">
          <ul className="nav__links">
            {LINKS.map((link) => (
              <li key={link.to || link.href}>
                {link.to ? (
                  <Link to={link.to} aria-current={pathname === link.to ? 'page' : undefined}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav__cta" href={`mailto:${person.email}`}>
          Get in touch
        </a>
      </div>
      {/* Reading progress. Drawn entirely by a scroll-driven animation in
          styles/motion.css — no scroll listener, and nothing rendered at all in
          browsers that cannot drive it. */}
      <div className="nav__progress" aria-hidden="true">
        <i />
      </div>
    </header>
  );
};

export default Nav;
