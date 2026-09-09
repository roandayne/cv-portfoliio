import { person } from '../data/site';
import Logo from './Logo';
import './footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="page footer__inner">
      <p className="footer__id">
        <Logo className="footer__mark" />
        <span>
          <strong>{person.name}</strong> — web developer, {person.location}
        </span>
      </p>
      <p className="footer__copy">© {person.since}—2026 {person.name}</p>
    </div>
  </footer>
);

export default Footer;
