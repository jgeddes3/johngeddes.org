import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import AudioVisualIcon from './RecruiterImages/AudioVisual.png';
import ExecutiveITIcon from './RecruiterImages/ExecutiveIT.png';
import ManagerIcon from './RecruiterImages/Manager.png';
import WebDevITIcon from './RecruiterImages/WebDevIT.png';
import './Recruiters.css';

// Served from public/ at stable URLs that survive every deploy — bundling the
// PDFs gave them content-hashed paths that broke stale tabs and shared links.
// /Geddes_Resume_26.pdf is kept as a copy of the AV version so links already
// out in the world still resolve to a current resume.
const TRACKS = [
  {
    slug: 'av',
    label: 'Audio Visual Engineer',
    icon: AudioVisualIcon,
    file: '/resumes/Geddes_AV_Engineer.pdf',
    download: 'Geddes_AV_Engineer.pdf',
    body: [
      `Five years of AV work, and the last four of them in enterprises where a failed call costs somebody real money. I started at Loyola running events on analog gear, mixers and Crestron, moved to Kirkland and Ellis configuring Cisco and Crestron rooms for client meetings at a firm that bills by the hour, then to Abbott and Discover on Biamp, Q-SYS, Shure and QSC.`,
      `At TAG I lead the modernisation of the company's AV estate onto a Logitech ecosystem, deploying Q-SYS, Crestron, Biamp and Shure to bring failing rooms back into service. I am also the senior technical lead on that team — I set priorities, coordinate the project work, and train the junior engineers on escalation and standards.`,
      `The through line is that I have done every part of this job, from carrying speakers across a campus quad to designing the room standard an enterprise deploys against.`,
    ],
  },
  {
    slug: 'executive',
    label: 'Executive Technician',
    icon: ExecutiveITIcon,
    file: '/resumes/Geddes_Executive_Technician.pdf',
    download: 'Geddes_Executive_Technician.pdf',
    body: [
      `I am the technical support for a full C-Suite. When a board meeting will not connect, I am the person who fixes it while the room waits, which is a different job from fixing it correctly with an afternoon to spare.`,
      `That work sits on top of real enterprise administration rather than beside it. I manage endpoints and devices across JAMF, ServiceNow, Microsoft Intune and Azure Active Directory, so provisioning and compliance stay consistent whether the laptop belongs to an executive or a field technician.`,
      `Kirkland and Ellis taught me the discretion half of it — coordinating conference rooms for client meetings at a firm where you are in the room for conversations you do not repeat. The technical part can be learned. Being trusted on that floor takes longer.`,
    ],
  },
  {
    slug: 'manager',
    label: 'Manager',
    icon: ManagerIcon,
    file: '/resumes/Geddes_Manager.pdf',
    download: 'Geddes_Manager.pdf',
    body: [
      `I led a team of five Level 1 technicians at Discover, setting troubleshooting practice and guiding the system optimisation work. At TAG I am the senior technical lead on the AV engineering team: I own priorities, coordinate project execution across sites, and mentor the junior engineers on escalation and system standards.`,
      `What I bring to managing technical people is that I still do the work. I can tell whether an estimate is honest, whether a problem is genuinely hard, and when somebody is stuck rather than slow — because I have been all three.`,
      `I also keep building the tooling my own teams run on. At Discover that was a room-check app and an inventory tool in Power Apps and Power BI; at TAG it is the asset platform that replaced a spreadsheet the IT team had been maintaining by hand.`,
    ],
  },
  {
    slug: 'web',
    label: 'Web Developer',
    icon: WebDevITIcon,
    file: '/resumes/Geddes_Web_Developer.pdf',
    download: 'Geddes_Web_Developer.pdf',
    body: [
      `Computer Science degree from Loyola, and I have been shipping software the whole time. I interned at Brag House on the front end of their iOS app in React Native and Figma, and at TLC MilliMeter Wave Products, where I moved the company off an on-site code repository onto Bitbucket and trained the staff on git so the migration actually held.`,
      `The work I would rather be judged on is what I have built since. Cipher Tracker is a React Native habit tracker where every entry is encrypted on the device before it reaches the server, with no password reset by design and 548 passing tests. Rambler Registrar started as my senior practicum on Python and MongoDB and has since been rebuilt on React Native and Firestore around a real constraint solver that scores every conflict-free timetable it can build.`,
      `At TAG I built the internal device platform: a React and TypeScript front end, an Express gateway adding single sign-on and a pooled service-token layer, and a PostgreSQL service that reconciles eleven vendor APIs into one record per machine. This site is mine too, including the serverless API behind it.`,
    ],
  },
];

const RecruitersPage = () => {
  // Which panel is open lives in the URL, not in component state, so a
  // recruiter can be sent straight to one track: /recruiters?role=web
  const [searchParams, setSearchParams] = useSearchParams();
  const activeButton = TRACKS.findIndex((t) => t.slug === searchParams.get('role'));

  const toggleButton = (buttonIndex) => {
    const next = new URLSearchParams(searchParams);
    if (activeButton === buttonIndex) {
      next.delete('role');
    } else {
      next.set('role', TRACKS[buttonIndex].slug);
    }
    // replace, not push — opening and closing panels should not fill the back
    // button with steps a visitor has to click through to leave the page.
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <SEO
        title="Recruiters"
        description="John Geddes — role-specific resumes for AV Engineer, Executive Technician, Manager and Web Developer positions."
        path="/recruiters"
      />
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Welcome Recruiters!</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          I am an AV engineer and a developer, currently at The Aspen Group in Chicago as a
          Senior Executive Desktop Support Engineer. I graduated from Loyola Chicago with a
          Bachelor's in Computer Science and a minor in Philosophy, and the five years since
          have been split between enterprise AV work and building software — sometimes for
          the same employer in the same week. Pick whichever track you are hiring for below;
          each one has its own resume rather than the same document under four names.
        </p>
      </div>
      <div className="button-container main-content">
        {TRACKS.map((track, index) => (
          <div
            key={track.label}
            className={`collapsible-button ${activeButton === index ? 'expanded' : ''}`}
          >
            {/* The heading wraps the control rather than sitting beside it, so
                the four tracks show up in a screen reader's heading list and
                the button keeps its disclosure semantics. */}
            <h2 className="resume-heading">
              <button
                type="button"
                className="button-cover"
                aria-expanded={activeButton === index}
                aria-controls={`resume-panel-${index}`}
                onClick={() => toggleButton(index)}
              >
                <span className="resume-text">{track.label} Resume</span>
                <span className="ellipsis">
                  <img loading="lazy" decoding="async" src={track.icon} alt="" className="recruiter-img" />
                </span>
              </button>
            </h2>
            {activeButton === index && (
              <div id={`resume-panel-${index}`} className="text-pdf-container">
                <div className="unique-text">
                  {track.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                <div className="pdf-viewer-container">
                  <iframe
                    src={track.file}
                    title={`${track.label} resume`}
                    loading="lazy"
                    className="resume-viewer"
                  ></iframe>
                  <a
                    href={track.file}
                    download={track.download}
                    className="download-btn"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            )}
          </div>
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
