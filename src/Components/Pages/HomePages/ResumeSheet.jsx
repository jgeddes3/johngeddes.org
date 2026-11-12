import React from 'react';
import { buildModel } from '../../../resumes/model';

// The resume as real text on the page, from the same model as the PDF and
// Word files, so what a recruiter reads here is what they download.
// A job with no bullets (the short entries on the Software Engineer resume)
// sits on one line, the same way the PDF and Word files print it.
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
        {job.bullets.map((b) => <li key={b}>{b}</li>)}
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
        {m.contact.map((line, i) => <p className="rs-contact" key={i}>{line}</p>)}
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
                <span>{p.link}</span>
              </p>
              <p>{p.text}</p>
            </div>
          ))}
        </section>
      )}
      <section>
        <h3 className="rs-h">Education</h3>
        <div className="rs-job">
          <p className="rs-line">
            <span className="rs-title">{m.education.school}</span>
            <span>{m.education.dates}</span>
          </p>
          <p>{m.education.degree}</p>
          {m.education.note && <p>{m.education.note}</p>}
        </div>
      </section>
    </article>
  );
};

export default ResumeSheet;
