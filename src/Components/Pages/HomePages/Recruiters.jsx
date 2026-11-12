import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import ResumeSheet from './ResumeSheet';
import { TRACKS } from '../../../resumes/data';
import { resolveRole } from '../../../resumes/roles';
import './Recruiters.css';

const RecruitersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // The build prerenders /recruiters with no ?role=, so the first render must
  // match it (main) or hydration breaks. After mount, the URL decides. A layout
  // effect re-renders before the browser paints, so arriving at ?role= from
  // inside the app never flashes the main resume first.
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => { setHydrated(true); }, []);
  const active = hydrated ? resolveRole(searchParams.get('role')) : 'main';
  const tabRefs = useRef({});

  const select = (key, moveFocus) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'main') next.delete('role');
    else next.set('role', key);
    // replace, not push: switching tabs should not fill the back button.
    setSearchParams(next, { replace: true });
    if (moveFocus) tabRefs.current[key]?.focus();
  };

  const onKeyDown = (e) => {
    const i = TRACKS.findIndex((t) => t.key === active);
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % TRACKS.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + TRACKS.length) % TRACKS.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = TRACKS.length - 1;
    if (j === null) return;
    e.preventDefault();
    select(TRACKS[j].key, true);
  };

  return (
    <>
      <SEO path="/recruiters" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Welcome Recruiters!</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          I work in enterprise AV and build software, currently at The Aspen Group in
          Chicago. Start with the main resume or pick the one written for your role, then
          download it as a PDF or a Word file.
        </p>
      </div>
      <div className="recruiters-body main-content">
        <div className="resume-tabs" role="tablist" aria-label="Resume versions">
          {TRACKS.map((t) => (
            <button
              key={t.key}
              ref={(el) => { tabRefs.current[t.key] = el; }}
              type="button"
              role="tab"
              id={`resume-tab-${t.key}`}
              aria-selected={active === t.key}
              aria-controls={`resume-panel-${t.key}`}
              tabIndex={active === t.key ? 0 : -1}
              className="resume-tab"
              onClick={() => select(t.key, false)}
              onKeyDown={onKeyDown}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Every panel stays in the DOM so the prerendered page carries all
            five resumes; only the active one is shown. The panel takes focus
            itself (tabIndex 0) because its first content is not focusable.
            The aside comes first so the note and downloads are read before
            the resume; on wide screens the grid places it in the right column. */}
        {TRACKS.map((t) => (
          <section
            key={t.key}
            role="tabpanel"
            id={`resume-panel-${t.key}`}
            aria-labelledby={`resume-tab-${t.key}`}
            hidden={active !== t.key}
            tabIndex={0}
            className="resume-panel"
          >
            <aside className="resume-aside">
              <p className="resume-note">{t.note}</p>
              <ul className="resume-figures">
                {t.figures.map(([value, label]) => (
                  <li key={label}><strong>{value}</strong><span>{label}</span></li>
                ))}
              </ul>
              <div className="resume-downloads">
                <a className="resume-download pdf" href={`/resumes/${t.file}.pdf`} download={`${t.file}.pdf`}>
                  Download PDF
                </a>
                <a className="resume-download word" href={`/resumes/${t.file}.docx`} download={`${t.file}.docx`}>
                  Download Word
                </a>
              </div>
            </aside>
            <ResumeSheet track={t} />
          </section>
        ))}
      </div>
      <div className="contract-button-container">
        <Link to="/contracts" className="contract-button">
          Contracts Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default RecruitersPage;
