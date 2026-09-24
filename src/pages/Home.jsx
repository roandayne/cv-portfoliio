import Contact from '../components/Contact';
import Cosmos from '../components/Cosmos/Cosmos';
import Eyebrow from '../components/Eyebrow';
import SplitText from '../components/SplitText';
import Tags from '../components/Tags';
import TechMarks from '../components/TechMarks';
import { PetPortalDiagram } from '../components/Visuals';
import { ExternalIcon } from '../components/Icons';
import {
  about,
  answers,
  current,
  education,
  experience,
  hero,
  inDevelopment,
  person,
  projects,
  technicalFocus,
} from '../data/site';
import './home.css';

const Home = () => (
  <>
    <section className="hero" aria-labelledby="hero-title">
      <Cosmos />
      <div className="page hero__inner">
        <div className="hero__text">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__eyebrow">{hero.eyebrow}</span>
            <span className="hero__name">
              <SplitText text={person.name} delay={120} step={110} />
            </span>
            <span className="hero__lede">{hero.lede}</span>
          </h1>
          <p className="hero__support">{hero.supporting}</p>
          <div className="btn-row">
            <a className="btn btn--light" href="#work">
              View selected work
            </a>
            <a className="btn btn--ghost" href={person.resume}>
              View résumé
            </a>
          </div>
          <TechMarks />
        </div>
        {/* Empty: the cosmos is a full-bleed layer on the section itself. This
            reserves the column it settles over so the copy never runs under it. */}
        <div className="hero__visual" aria-hidden="true" />
      </div>
    </section>

    <section className="band" id="current">
      <div className="page feature">
        <div className="feature__text" data-reveal-group data-reveal-step="70">
          <Eyebrow>Currently building</Eyebrow>
          <h2 className="feature__title">{current.name}</h2>
          <p className="feature__org">
            {current.role}, {current.org} — {current.period}
          </p>
          <p className="feature__summary">{current.summary}</p>
          <p className="feature__short">{current.short}</p>
          <Tags items={current.tags} />
          <ul className="tools">
            {current.tools.map((tool) => (
              <li key={tool.name}>
                <span className="tools__name">{tool.name}</span>
                <span className="tools__what">{tool.what}</span>
              </li>
            ))}
          </ul>
          <p className="feature__links">
            <a
              className="btn btn--dark"
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit StratApps, opens in a new tab"
            >
              <ExternalIcon />
              Visit StratApps
            </a>
          </p>
        </div>
        <figure className="feature__visual" data-reveal="media">
          <img
            className="shot"
            src="/images/stratapps-iboq.webp"
            width="1904"
            height="863"
            loading="lazy"
            decoding="async"
            alt="The iBOQ screen in StratApps: a BIM model of a building on the left, and on the right the bill of quantities taken off it, grouped by cost sub-group, package and level with quantity, units, plant and labour columns."
          />
          <figcaption className="caption">Sample project.</figcaption>
        </figure>
      </div>
    </section>

    <section className="band band--alt" id="work">
      <div className="page">
        <Eyebrow>Projects</Eyebrow>
        <h2 className="u-sr">Projects</h2>
        {/* One list, newest first. No featured tier and no "earlier" tier:
            every project carries the same fields and the same weight, and the
            period is what orders them. */}
        <ul className="projects" data-reveal-group="cards" data-reveal-step="120">
          {projects.map((project) => (
            <li className="project" key={project.id} data-spotlight>
              <p className="project__period">{project.period}</p>
              <h3 className="project__title">{project.name}</h3>
              <p className="project__org">{project.org}</p>
              <p className="project__text">{project.short}</p>
              <dl className="project__facts">
                <dt>Role</dt>
                <dd>{project.role}</dd>
                <dt>Stack</dt>
                <dd>{project.stack.join(', ')}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="band" id="in-development">
      <div className="page dev">
        <div className="dev__text">
          <Eyebrow>In development</Eyebrow>
          <h2 className="u-sr">In development</h2>
          <ul className="dev__cards" data-reveal-group="cards" data-reveal-step="120">
            {inDevelopment.map((product) => (
              <li className="card" key={product.slug}>
                <p className="card__status">Not launched</p>
                <h3 className="card__title">{product.name}</h3>
                <p className="card__text">{product.tagline}</p>
                <Tags items={product.tags} />
              </li>
            ))}
          </ul>
          <p className="caption" data-reveal="fade">
            Both are in development. The areas listed describe intended scope, not shipped
            functionality.
          </p>
        </div>
        <figure className="dev__visual" data-reveal="media">
          <PetPortalDiagram />
          <figcaption className="caption">Pet Portal — concept wireframe.</figcaption>
        </figure>
      </div>
    </section>

    <section className="band band--alt" id="focus">
      <div className="page focus">
        <div className="focus__head">
          <h2 className="focus__title" data-reveal="rise">
            Technical focus
          </h2>
          <p className="focus__sub" data-reveal="fade">
            The tools and technologies I work with.
          </p>
        </div>
        <ul className="focus__grid" data-reveal-group data-reveal-step="70">
          {technicalFocus.map((group) => (
            <li key={group.area}>
              <h3 className="focus__area">{group.area}</h3>
              <p className="focus__items">{group.items.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="band" id="experience">
      <div className="page">
        <Eyebrow>Experience</Eyebrow>
        <h2 className="u-sr">Experience</h2>
        <ol className="cv" data-reveal-group data-reveal-step="55">
          {experience.map((role) => (
            <li key={`${role.org}-${role.period}`}>
              <details className="cv__role">
                <summary>
                  <span className="cv__period">{role.period}</span>
                  <span className="cv__title">
                    {role.role}
                    <span className="cv__org">
                      {' '}
                      — {role.org}
                      {role.location ? `, ${role.location}` : ''}
                    </span>
                  </span>
                  {role.current ? <span className="cv__now">Current</span> : null}
                  <span className="cv__toggle" aria-hidden="true" />
                </summary>
                <div className="cv__detail">
                  <ul className="bullets">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {role.stack.length > 0 ? <Tags items={role.stack} /> : null}
                </div>
              </details>
            </li>
          ))}
        </ol>
        <p className="cv__edu" data-reveal="fade">
          {education.map((item) => `${item.qualification}, ${item.institution} (${item.period})`).join('  ·  ')}
        </p>
      </div>
    </section>

    <section className="band band--alt" id="about">
      <div className="page about">
        <div>
          <Eyebrow>Approach</Eyebrow>
          <h2 className="about__title" data-reveal="rise">
            How I work
          </h2>
        </div>
        <ol className="approach" data-reveal-group="text" data-reveal-step="90">
          {about.map((point) => (
            <li key={point.slice(0, 24)}>{point}</li>
          ))}
        </ol>
      </div>
    </section>

    <section className="band" id="answers">
      <div className="page">
        <Eyebrow>In brief</Eyebrow>
        <h2 className="u-sr">In brief</h2>
        <dl className="qa" data-reveal-group data-reveal-step="70">
          {answers.map((item) => (
            <div className="qa__item" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <Contact />
  </>
);

export default Home;
