import React from 'react';
import { buildModel, contactHref } from '../../../resumes/model';

// Contact or project text as a link, or as plain text when href is null (the
// location). The visible text never changes, so the page still reads exactly
// like the PDF. https links open in a new tab like the site's other outbound
// links; mailto: and tel: hand off to the mail or phone app instead.
const Linked = ({ href, text }) => {
  if (!href) return text;
  const newTab = href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return <a href={href} {...newTab}>{text}</a>;
};

const ContactLine = ({ line }) => (
  <p className="rs-contact">
    {line.split(' · ').map((part, i) => (
      <React.Fragment key={part}>
        {i > 0 && ' · '}
        <Linked href={contactHref(part)} text={part} />
      </React.Fragment>
    ))}
  </p>
);

// The resume as real text on the page, from the same model as the PDF and
// Word files, so what a recruiter reads here is what they download.
// A job with no bullets (the short entries on the Software Engineer resume)
// sits on one line, the same way the PDF and Word files print it. A bullet
// prints its marked improvement in bold, as those files do.
const Job = ({ job }) => {
  if (job.bullets.length === 0) {
    return (
      <div className="rs-job rs-short">
        <p className="rs-line">
          <span><span className="rs-title">{job.title}</span> · {job.line}</span>
          <span>{job.dates}</span>
        </p>
      </div>
    );
  }
  return (
    <div className="rs-job">
      <p className="rs-title">{job.title}</p>
      <p className="rs-line">
        <span>{job.line}</span>
        <span>{job.dates}</span>
      </p>
      <ul>
        {job.rich.map((pieces, i) => (
          <li key={job.bullets[i]}>
            {pieces.map((s, k) => (s.bold ? <b key={k}>{s.text}</b> : s.text))}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResumeSheet = ({ track }) => {
  const m = buildModel(track);
  return (
    <article className="resume-sheet" aria-label={`${m.headline} resume`}>
      <header>
        <h2 className="rs-name">{m.name}</h2>
        <p className="rs-headline">{m.headline}</p>
        {m.contact.map((line, i) => <ContactLine line={line} key={i} />)}
      </header>
      <section>
        <h3 className="rs-h">Summary</h3>
        <p>{m.summary}</p>
      </section>
      <section>
        <h3 className="rs-h">Skills</h3>
        <ul className="rs-skills">
          {m.skills.map((s) => (
            <li key={s.group}><b>{s.group}:</b> {s.items}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="rs-h">Work Experience</h3>
        {[...m.jobs, ...m.shortJobs].map((j) => <Job key={j.key} job={j} />)}
      </section>
      {m.projects.length > 0 && (
        <section>
          <h3 className="rs-h">Projects</h3>
          {m.projects.map((p) => (
            <div className="rs-job" key={p.name}>
              <p className="rs-line">
                <span className="rs-title">{p.name}</span>
                <span><Linked href={`https://${p.link}`} text={p.link} /></span>
              </p>
              <p>{p.text}</p>
            </div>
          ))}
        </section>
      )}
      <section>
        <h3 className="rs-h">Education</h3>
        <div className="rs-job">
          <p className="rs-title">{m.education.school}</p>
          <p>{m.education.degree}</p>
          {m.education.note && <p>{m.education.note}</p>}
        </div>
      </section>
    </article>
  );
};

export default ResumeSheet;
