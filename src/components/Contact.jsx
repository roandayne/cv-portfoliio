import { DownloadIcon, GitIcon, LinkedInIcon, MailIcon } from './Icons';
import { person } from '../data/site';

/**
 * The closing contact band. Shared by the homepage and the About page so the
 * address, the links and the résumé button are stated once.
 */
const Contact = () => (
  <section className="contact" id="contact">
    <div className="page contact__inner">
      <div className="contact__lead" data-reveal-group data-reveal-step="90">
        <h2 className="contact__title">Have a project or opportunity in mind?</h2>
        <p>Open to development, QA, and project management.</p>
        {/* The address stays visible so it can be read and copied, not only
            clicked. */}
        <p className="contact__address">{person.email}</p>
      </div>
      {/* Reuses the hero's secondary button so the two match. Each carries a
          visible label; aria-label adds the destination for screen readers
          and keeps the visible text inside the accessible name. */}
      <ul className="contact__links" data-reveal-group data-reveal-step="70">
        <li>
          <a
            className="btn btn--ghost contact__btn"
            href={`mailto:${person.email}`}
            aria-label={`Email ${person.email}`}
          >
            <MailIcon />
            Email
          </a>
        </li>
        <li>
          <a
            className="btn btn--ghost contact__btn"
            href={person.linkedin}
            rel="me noopener noreferrer"
            target="_blank"
            aria-label="LinkedIn profile, opens in a new tab"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </li>
        <li>
          <a
            className="btn btn--ghost contact__btn"
            href={person.github}
            rel="me noopener noreferrer"
            target="_blank"
            aria-label="GitHub profile, opens in a new tab"
          >
            <GitIcon />
            GitHub
          </a>
        </li>
        <li>
          <a className="btn btn--ghost contact__btn" href={person.resume} aria-label="Résumé, download PDF">
            <DownloadIcon />
            Résumé
          </a>
        </li>
      </ul>
    </div>
  </section>
);

export default Contact;
