import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import Recruiterimg_1 from './RecruiterImages/Recruiterimg_1.png'; // Add image imports
import Recruiterimg_3 from './RecruiterImages/Recruiterimg_2.png';
import Recruiterimg_2 from './RecruiterImages/Recruiterimg_3.png';
import Recruiterimg_4 from './RecruiterImages/Recruiterimg_4.png';
import Resume1 from '../../PDF/Audio_Visual_Engineer_Resume.pdf';
import Resume2 from '../../PDF/Data_Analyst_Resume.pdf'; 
import Resume3 from '../../PDF/IT_Specialist_Resume.pdf'; 
import Resume4 from '../../PDF/Web_Developer_Resume.pdf'; 
import './Recruiters.css';

const RecruitersPage = () => {
  const [activeButton, setActiveButton] = useState(null);
  const recruiterImages = [Recruiterimg_1, Recruiterimg_2, Recruiterimg_3, Recruiterimg_4];
  const resumes = [Resume1, Resume2, Resume3, Resume4]; // Array of PDF resumes
  const uniqueTexts = [
    "Unique text for Audio Visual Engineer Resume",
    "Unique text for Data Analyst Resume",
    "Unique text for IT Specialist Resume",
    "Unique text for Web Developer Resume"
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
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Welcome Recruiters!</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          I am a versatile professional with a Bachelor's degree in Computer Science from Loyola University Chicago and a minor in Philosophy. Over the past three years, I’ve gained valuable experience across multiple areas, including Data Analytics, IT Support, A.V. Technology, and Web Development. I’ve managed and supported A.V. systems in corporate environments, provided technical support for high-profile events, and worked with platforms like WebEx and Microsoft Teams. Additionally, my background in front-end development, including Python, Java, and React.js, has sharpened my problem-solving and analytical skills. My diverse experience allows me to thrive in IT and technical roles, where I enjoy leading projects and collaborating with teams to deliver effective solutions.
        </p>
      </div>
      <div className="button-container main-content">
        {['Audio Visual Engineer Specialist Resume', 'Data Analyst Resume', 'IT Specialist Resume', 'Web Developer Resume'].map((label, index) => (
          <div 
            key={index} 
            className={`collapsible-button ${activeButton === index ? 'expanded' : ''}`} 
            onClick={() => toggleButton(index)}
          >
            <div className="button-cover">
              <span className="resume-text">{label}</span>
              <div className="ellipsis">
                <img src={recruiterImages[index]} alt={`Recruiter ${index + 1}`} className="recruiter-img" />
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
                    width="600px" 
                    height="650px" 
                    title={`Resume PDF ${index + 1}`}
                    className="resume-viewer"
                  ></iframe>
                  {/* Invisible download button over the entire PDF */}
                  <a 
                    href={resumes[index]} 
                    download={`Resume_${index + 1}.pdf`} 
                    className="invisible-download-btn"
                  >
                      Download
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
          Contacts Page
        </Link>
      </div>
      <Bottombar />
    </>
  );
};

export default RecruitersPage;