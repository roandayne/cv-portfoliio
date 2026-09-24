import { Link } from 'react-router-dom';
import Contact from '../components/Contact';
import Eyebrow from '../components/Eyebrow';
import Tags from '../components/Tags';
import { DownloadIcon } from '../components/Icons';
import { bio, education, experience, hero, person, technicalFocus } from '../data/site';
import './home.css';
import './about.css';

/**
 * The résumé, as a page.
 *
 * The homepage shows the same record folded into <details>; here every role is
 * open, in full, so both a reader and a crawler get the whole history without
 * an interaction. Projects are deliberately not repeated from the homepage —
 * the roles below already cover that ground in résumé form.
 */
const About = () => (
  <>
    <header className="band resume__head">
      <div className="page" data-reveal-group data-reveal-step="80">
        <Eyebrow>About</Eyebrow>
        <h1 className="resume__name">{person.fullName}</h1>
        <p className="resume__role">{hero.eyebrow}</p>
        <ul className="resume__meta">
          <li>{person.location}</li>
          <li>
            <a className="link" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </li>
          <li>
            <a className="link" href={person.linkedin} rel="me noopener noreferrer" target="_blank">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="link" href={person.github} rel="me noopener noreferrer" target="_blank">
              GitHub
            </a>
          </li>
        </ul>
        <p className="resume__bio">{bio}</p>
        <div className="btn-row">
          <a className="btn btn--dark" href={person.resume} aria-label="Résumé, download PDF">
            <DownloadIcon />
            Download résumé
          </a>
          <Link className="btn btn--line" to="/#work">
            See the work
          </Link>
        </div>
      </div>
    </header>

    <section className="band band--alt" aria-labelledby="about-experience">
      <div className="page">
        <h2 className="resume__h2" id="about-experience" data-reveal="rise">
          Experience
        </h2>
        <ol className="rec" data-reveal-group data-reveal-step="70">
          {experience.map((role) => (
            <li className="rec__item" key={`${role.org}-${role.period}`}>
              <div className="rec__aside">
                <p className="rec__period">{role.period}</p>
                {role.current ? <p className="rec__now">Current</p> : null}
              </div>
              <div className="rec__body">
                <h3 className="rec__role">{role.role}</h3>
                <p className="rec__org">
                  {role.org}
                  {role.location ? `, ${role.location}` : ''}
                </p>
                <ul className="bullets">
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {role.stack.length > 0 ? <Tags items={role.stack} className="chips--small" /> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="band" aria-labelledby="about-focus">
      <div className="page focus">
        <div className="focus__head">
          <h2 className="focus__title" id="about-focus" data-reveal="rise">
            Tech stack
          </h2>
          <p className="focus__sub" data-reveal="fade">
            Every language, framework, and tool I work with.
          </p>
        </div>
        <ul className="focus__grid" data-reveal-group data-reveal-step="70">
          {technicalFocus.map((group) => (
            <li key={group.area}>
              <h3 className="focus__area">{group.area}</h3>
              <Tags items={group.items} className="chips--small" />
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="band band--alt" aria-labelledby="about-education">
      <div className="page">
        <h2 className="resume__h2" id="about-education" data-reveal="rise">
          Education
        </h2>
        <ol className="rec rec--tight" data-reveal-group data-reveal-step="70">
          {education.map((item) => (
            <li className="rec__item" key={item.qualification}>
              <div className="rec__aside">
                <p className="rec__period">{item.period}</p>
              </div>
              <div className="rec__body">
                <h3 className="rec__role">{item.qualification}</h3>
                <p className="rec__org">{item.institution}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <Contact />
  </>
);

export default About;
