import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { person } from '../data/site';
import Logo from './Logo';
import './nav.css';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#about', label: 'About' },
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

    const observer = new IntersectionObserver(
      (entries) => setOnHero(entries[0].intersectionRatio > 0.12),
      { threshold: [0, 0.12, 0.5] },
    );
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
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav__cta" href={`mailto:${person.email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
};

export default Nav;
