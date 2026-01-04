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
            <img loading="lazy" decoding="async" src= {img_5354} alt="About Me" className="about-image"/>
          </div>
          <div className="aboutrectlastfm main-content">
            <LastFmRecentlyPlayed />
          </div>
          <div className="AboutMeTextLarge AboutPara1 main-content">
            I'm a Senior Executive Audio Visual Engineer, and aspiring Web Designer, Data Analyst, and App Developer working from Chicago IL.
          </div>
          <div className="AboutMeTextSmall AboutPara2 main-content">
            In the most recent months, I have been working at The Aspen Group (TAG). On the side, I've been working on projects to ensure my sanity, and they are becoming more fun for me. I am always willing to try new things and work with anyone and everyone.
          </div>
        </div>
        <div id= "AboutMeResume">
          <div className="ResumeRect6 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Kirkland & Ellis</div>
            <div className="ResumPara2 AboutMeGreyLarge">A.V. Tech Specialist</div>
            <div className="ResumNum AboutMeWhiteNum">23-24</div>
          </div>
          <div className="ResumeRect1 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Discover Financial</div>
            <div className="ResumPara2 AboutMeGreyLarge">A.V. Technician II</div>
            <div className="ResumNum AboutMeWhiteNum">25-25</div>
          </div>
          <div className="ResumeRect2 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Loyola University of Chicago</div>
            <div className="ResumPara2 AboutMeGreyLarge">Audio Visual (A.V.) Technician</div>
            <div className="ResumNum AboutMeWhiteNum">21-23</div>
          </div>
          <div className="ResumeRect3 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">Abbott Laboratories</div>
            <div className="ResumPara2 AboutMeGreyLarge">A.V. Technician II</div>
            <div className="ResumNum AboutMeWhiteNum">24-25</div>
          </div>
          <div className="ResumeRect4 main-content">
            <div className="ResumPara1 AboutMeWhiteLarge">The Aspen Group (TAG)</div>
            <div className="ResumPara2 AboutMeGreyLarge">Senior AV Engineer</div>
            <div className="ResumNum AboutMeWhiteNum">25~</div>
          </div>
        </div>
        <div id = "AboutMeColab">
          <div className="AboutPara3">I'm willing to collaborate! Let me know if you need help with designing or implementing mockups</div>
        </div>
        <div id = "AboutMePara">
          <div className="ResumeRect5">
            <div className="AboutPara4 AboutMeTextSmall">My current position in the Aspen Group has allowed me to focus on many different avenues that I have always been passionate about. With my background in AV as well as my education in Computer Science, I have been able to thrive technically, but also leverage my love for talking to people.</div>
            <div className="AboutPara5 AboutMeTextSmall">Philosophy used to be something I pursued more heavily, but it has taken a back seat to my employment. Recently I have been pushing for it much more. I have many goals to complete papers I have half written. In these papers I have been able to use my focus from my education in Neuroethics on AI. There are many different avenues to go down, and have made it a goal to pursue all of them. </div>
            <div className="AboutPara6 AboutMeTextSmall">Apart from writing papers and side projects in computer science, I love to play chess, drink coffee, and rock climbing. Music is also in my passions, but I am by no means a music expert. (My Music taste is awful)</div>
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
      </div>
      <Bottombar />
    </>
  );
};

export default AboutPage;

