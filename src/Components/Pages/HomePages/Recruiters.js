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
    "During my time as an Audio Visual Engineer, I have racked up over three years of experience doing a multitude of tasks and working with a diverse range of individuals. From college age peers to senior executives at the largest law firm in the world, I have serviced them all to give the best experience possible. While at Loyola Chicago, I worked through many different scenarios and events that gave me the foundation through fire that allows me to succeed and thrive in the Audio-Visual environment. Loyola was a combination of tech stuck in time and conference rooms that were updated while I was there. This range allowed me to be successful in my next position at Kirkland and Ellis. Kirkland and Ellis was undergoing a move while I was hired on, which gave me excellent opportunities to install and service all of the newest AV equipment money could buy. Following the installation and troubleshooting process, I was given the esteemed opportunity to offer white glove service to many notable professionals such as Jon Ballis and Chiara Wrocinski. This extensive experience has equipped me with the technical expertise and customer service skills necessary to succeed as an Audio-Visual Engineer in any demanding environment.",
    "While I have a year plus in experience at data analytics from my internships, I was incredibly passionate about it during my time at university and have tried to incorporate it in every part of my career and personal life. During my time at TLC wafer technology, I was first taught SQL and was given the time to dip my feet into python statistical programming.  Following that time, I was given the ability to query and work on large data modules at my time at the Brag House. This was a foundational time not only for SQL but also for Excel. Using the combination of these experiences, I was well prepared when I was designing my Practicum for Loyola Chicago. Rambler Registrar was a new and updated app that was an attempt at revolutionizing the class scheduling for Loyola students. This required me to make an app that used complex algorithms to sort all of the classes students had to take, but also sorted and curtailed classes students needed to take for their future goals as well. Based on my experience in SQL, Python, and data management, as well as my passion for data analytics, I am confident that I would excel as a data analyst at your company.",
    "I have three plus years of experience working in the IT field, supporting the IT department in various capacities. While there are many things that go into making a good IT specialist, I believe technical expertise, adaptability, and communication are key. At Loyola Chicago, I worked closely with the IT department to troubleshoot and resolve issues with AV systems and other technology across campus, which honed my problem-solving skills. My adaptability was put to the test at Kirkland and Ellis, where I supported the IT team during a major office relocation, helping to install and configure the latest AV and IT equipment. Throughout these roles, effective communication was critical, as I often needed to explain technical issues to non-technical users and collaborate with the IT department to ensure seamless service delivery. These experiences have given me a strong foundation to thrive in IT environments.",
    "Check the website nerd"
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
          I am a versatile professional with a Bachelor's degree in Computer Science from Loyola University Chicago and a minor in Philosophy. Over the past three years, Iâ€™ve gained valuable experience across multiple areas, including Data Analytics, IT Support, A.V. Technology, and Web Development. Iâ€™ve managed and supported A.V. systems in corporate environments, provided technical support for high-profile events, and worked with platforms like WebEx and Microsoft Teams. Additionally, my background in front-end development, including Python, Java, and React.js, has sharpened my problem-solving and analytical skills. My diverse experience allows me to thrive in IT and technical roles, where I enjoy leading projects and collaborating with teams to deliver effective solutions.
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
                    download={`Resume_${index + 1}.pdf`}
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
      <Bottombar />
    </>
  );
};

export default RecruitersPage;
