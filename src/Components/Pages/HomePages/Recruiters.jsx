import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import AudioVisualIcon from './RecruiterImages/AudioVisual.png';
import ExecutiveITIcon from './RecruiterImages/ExecutiveIT.png';
import ManagerIcon from './RecruiterImages/Manager.png';
import WebDevITIcon from './RecruiterImages/WebDevIT.png';
import Resume from '../../PDF/Geddes_Resume_26.pdf';
import './Recruiters.css';

const RecruitersPage = () => {
  const [activeButton, setActiveButton] = useState(null);
  const recruiterImages = [AudioVisualIcon, ExecutiveITIcon, ManagerIcon, WebDevITIcon];
  const resumes = [Resume, Resume, Resume, Resume];
  const uniqueTexts = [
    "With over five years of hands-on experience in Audio Visual engineering, I have designed, deployed, and supported enterprise AV solutions across corporate, legal, healthcare, and higher education environments. My career began at Loyola University of Chicago, where I managed AV operations across fifteen multipurpose spaces, mastering both analog and digital systems. From there I moved to Kirkland and Ellis, where I installed and configured Cisco and Crestron systems across over two hundred conference rooms, delivering white-glove service to some of the nation's most prominent attorneys. At Abbott Laboratories and Discover Financial, I deepened my expertise in Biamp, Q-SYS, and Shure platforms while leading break-fix operations and mentoring junior technicians. Now at The Aspen Group, I serve as a Senior AV Executive Support Engineer, spearheading the comprehensive modernization of the company's entire AV infrastructure within a Logitech ecosystem and providing dedicated technical support to the full C-Suite. This progression from campus technician to senior enterprise engineer has given me the end-to-end systems knowledge and executive-facing professionalism to deliver seamless AV experiences in any high-stakes environment.",
    "Throughout my career, I have consistently operated at the intersection of technology and executive leadership, providing high-touch, white-glove technical support to C-Suite executives and senior professionals at major enterprises. At The Aspen Group, I serve as a trusted technology partner to the full executive leadership team, rapidly resolving AV, endpoint, and connectivity issues to ensure uninterrupted operations across critical business functions. My responsibilities extend well beyond traditional support — I administer and maintain endpoint management across JAMF, ServiceNow, Microsoft Intune, and Azure Active Directory, ensuring compliance and seamless provisioning across the entire enterprise environment. At Kirkland and Ellis, I honed this executive-facing approach by coordinating over two hundred conference room setups for high-profile client meetings, where discretion and technical precision were paramount. I also developed over fifty VBA macros to automate data workflows, demonstrating my commitment to proactive problem-solving and operational efficiency. This combination of executive-level interpersonal skills and deep technical expertise allows me to anticipate needs, minimize downtime, and deliver the seamless technology experiences that senior leadership demands.",
    "My career in technology has been defined by a natural progression from hands-on technical work into leadership, team mentorship, and strategic project coordination. At Discover Financial, I led and mentored a team of five Level 1 technicians, providing strategic guidance on system optimization, best practices, and technical troubleshooting while managing comprehensive break-fix support across the enterprise. This leadership experience prepared me for my current role at The Aspen Group, where I serve as a senior technical lead within the AV engineering team, guiding priorities, coordinating project execution, and mentoring junior staff on escalation procedures and system standards. Beyond team management, I have consistently driven process improvement — from developing custom corporate tools with Microsoft Power Apps and Power BI at Discover to designing a full-stack IT asset management application using React.js and Express.js at TAG. My management philosophy centers on empowering team members through clear communication and hands-on guidance while maintaining the technical depth to make informed decisions. With a strong foundation in both technology and people leadership, I am confident in my ability to manage teams and deliver results in any enterprise environment.",
    "As a web developer with a Computer Science degree from Loyola University of Chicago, I bring a strong foundation in both front-end and full-stack development to every project I take on. My journey began at The Brag House, where I collaborated with a development team using React.js, React Native, CSS, and HTML to enhance the front-end experience for their iOS app and website, and utilized Figma to deliver the modern design the company envisioned. At TLC Precision Wafer Technology, I transitioned the company from an on-site code repository to a cloud-based solution using Bitbucket, training personnel on Git workflows along the way. My senior practicum project, Rambler Registrar, challenged me to engineer a full mobile application using React Native with a Python back-end and MongoDB database hosted on AWS. Most recently at The Aspen Group, I designed and developed a full-stack IT asset management application using React.js and Vite.js with an Express.js backend, built on top of Snipe-IT to streamline inventory workflows and reporting. Of course, the website you are on right now is also built and maintained by me, and serves as a living portfolio of my development capabilities. With experience spanning front-end design, back-end architecture, and cloud deployment, I am well-equipped to build and maintain web solutions that deliver real business value."
  ];

  const toggleButton = (buttonIndex) => {
    if (activeButton === buttonIndex) {
      setActiveButton(null); // Collapse if already active
    } else {
      setActiveButton(buttonIndex); // Expand the clicked button
    }
  };
  return (
    <>
      <SEO
        title="Recruiters"
        description="John Geddes — resumes and experience for AV Engineer, Executive Technician, Manager, and Web Developer roles."
        path="/recruiters"
      />
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Welcome Recruiters!</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          Hello! I am an Audio Visual Engineer currently working Chicago. Well, my official title is Senior Executive Audio Visual Desktop Engineer, but that is just a mouthful and will not fit on my business cards. For my education, I graduated Loyola Chicago with a Bachelor's Degree in Computer Science and a minor in Philosophy. Over the past five years of my working career, I have gained very valuable experience in Programming, Data Analytics, IT Support, AV Technologies, and of course, Web development. In the most recent months I have been experimenting with AI and programming and the best applications to reduce and remove inefficiencies in my working life. With being a jack of all trades, it has allowed me to excel in the roles I have had. As I continue to learn, I will continue to excel in all of my technical and leadership roles to come.
        </p>
      </div>
      <div className="button-container main-content">
        {['Audio Visual Engineer Resume', 'Executive Technician Resume', 'Manager Resume', 'Web Developer Resume'].map((label, index) => (
          <div 
            key={index} 
            className={`collapsible-button ${activeButton === index ? 'expanded' : ''}`} 
            onClick={() => toggleButton(index)}
          >
            <div className="button-cover">
              <span className="resume-text">{label}</span>
              <div className="ellipsis">
                <img loading="lazy" decoding="async" src={recruiterImages[index]} alt={`Recruiter ${index + 1}`} className="recruiter-img" />
              </div>
            </div>
            {activeButton === index && (
              <div className="text-pdf-container">
                <div className="unique-text">
                  <p>{uniqueTexts[index]}</p>
                </div>
                <div className="pdf-viewer-container">
                  <iframe
                    src={resumes[index]}
                    title={`Resume PDF ${index + 1}`}
                    className="resume-viewer"
                  ></iframe>
                  <a
                    href={resumes[index]}
                    download="Geddes_Resume.pdf"
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
      {/* Add the button at the end linking to Contacts.js */}
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
