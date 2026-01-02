// AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom'; 
import './AboutPage.css';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import img_5354 from './AboutPages/img_5354.jpg'; 
import ImageRectangles from './AboutPages/ImageRectangles';
import LastFmRecentlyPlayed from '../../LastFmRecentlyPlayed.js'; 

const AboutPage = () => {
  return (
    <>
      <Background />
      <div id="centerpieceAbout" className='main-content'>
        <h1>I'm John.</h1>
      </div>
      <div className="content-container main-content">
        <div id= "AboutMeStartcontainer">
          <div className="aboutoimage-container main-content">
            <img src= {img_5354} alt="About Me" className="about-image"/>
          </div>
          <div className="aboutrectlastfm main-content">
            <LastFmRecentlyPlayed />
          </div>
          <div className="AboutMeTextLarge AboutPara1 main-content">
          I'm an Audio Visual Engineer, and aspiring Web Designer, Data Analyst, and IT Specialist working from Chicago IL
          </div>
          <div className="AboutMeTextSmall AboutPara2 main-content">
            In the most recent months, I have been working at Kirkland & Ellis. On the side, I've been working on projects and certificates in order to improve my chances to be a marketable employee. I am always willing to try new things and work with anyone and everyone.
          </div>
        </div>
        <div id= "AboutMeResume">
          <div className="ResumeRect6 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Kirkland & Ellis</div>
            <div className="ResumPara2 AboutMeGreyLarge">A.V. Technology Specialist</div>
            <div className="ResumNum AboutMeWhiteNum">24~</div>
          </div>
          <div className="ResumeRect1 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Attending University of Loyola</div>
            <div className="ResumPara2 AboutMeGreyLarge">Student</div>
            <div className="ResumNum AboutMeWhiteNum">19-23</div>
          </div>
          <div className="ResumeRect2 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Loyola University of Chicago</div>
            <div className="ResumPara2 AboutMeGreyLarge">Audio Visual (A.V.) Technician</div>
            <div className="ResumNum AboutMeWhiteNum">21-23</div>
          </div>
          <div className="ResumeRect3 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">TLC Precision Wafer</div>
            <div className="ResumPara2 AboutMeGreyLarge">Software Intern</div>
            <div className="ResumNum AboutMeWhiteNum">19-20</div>
          </div>
          <div className="ResumeRect4 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">The Brag House</div>
            <div className="ResumPara2 AboutMeGreyLarge">Front-End Intern</div>
            <div className="ResumNum AboutMeWhiteNum">22-22</div>
          </div>
        </div>
        <div id = "AboutMeColab">
          <div className="AboutPara3">Iâ€™m willing to collaborate! Let me know if you need help with designing or implementing mockups!</div>
        </div>
        <div id = "AboutMePara">
          <div className="ResumeRect5">
            <div className="AboutPara4 AboutMeTextSmall">My educational history along with my previous internships has moved me to be a more outgoing and creative person when it comes to computer science. Ai has been a recent passion of mine that I have been attempting to integrate into all parts of my life. While I use many ai services, I am still working to integrate them into personal projects.</div>
            <div className="AboutPara5 AboutMeTextSmall">My Philosophy Minor has pushed me towards ai as well, with me finding my passion of philosophy and computer science intertwined at the crossroads of Neuro-ethics. Much of the new and arising technology is going towards Neuroscience, but many Ai arguments arise in sphere of Neuro-ethics. This is due to the fact that many can make the leap that Ai could be seen as a brain depending on a line they draw. </div>
            <div className="AboutPara6 AboutMeTextSmall">Apart from writing papers and side projects in computer science, I love to play chess, drink coffee, and pet cats. Music is also in my passions, but I am by no means a music expert.</div>
          </div>
        </div>
        <div className="AboutFriends-button-container">
        <Link to="/friends" className="AboutFriends-button">
          Go to Friends to see more
        </Link>
      </div>
        <div id = "AboutMePhotos">
          <ImageRectangles />
        </div>
        <Bottombar />
      </div>
    </>
  );
};

export default AboutPage;
