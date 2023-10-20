import React from 'react';
import './AboutPage.css';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import img_5354 from './AboutPages/img_5354.jpg'; 

const AboutPage = () => {
  return (
    <>
    <Background />
    <div id="centerpiece2">
          <h1>I'm John.</h1>
      </div>
    <div id= "AboutMeStartcontainer">
        <div className="aboutoimage-container">
            <img src= {img_5354} alt="About Me" className="about-image"/>
        </div>
        <div className="aboutrectspotify"></div>
        <div className="AboutMeTextLarge AboutPara1">
            I’m a Recent Graduate, and aspiring Web Designer and Software Developer working from Chicago IL
        </div>
        <div className="AboutMeTextSmall AboutPara2">
            In the most recent months, I have been working on side projects and certificates in order to improve my chances to be a marketable employee. I am always willing to try new things and work with anyone and everyone.
        </div>
      </div>
      <div id= "AboutMeResume">
        <div className="ResumeRect1"></div>
        <div className="ResumeRect2"></div>
        <div className="ResumeRect3"></div>
        <div className="ResumeRect4"></div>
      </div>
      <div id = "AboutMeColab">
        <div className="AboutPara3">I’m willing to collaborate! Let me know if you need help with designing or implementing mockups!</div>
      </div>
      <div id = "AboutMePara">
        <div className="ResumeRect5">
            <div className="AboutPara4 AboutMeTextSmall">My educational history along with my previous internships has moved me to be a more outgoing and creative person when it comes to computer science. Ai has been a recent passion of mine that I have been attempting to integrate into all parts of my life. While I use many ai services, I am still working to integrate them into personal projects.</div>
            <div className="AboutPara5 AboutMeTextSmall">My Philosophy Minor has pushed me towards ai as well, with me finding my passion of philosophy and computer science intertwined at the crossroads of Neuro-ethics. Much of the new and arising technology is going towards Neuroscience, but many Ai arguments arise in sphere of Neuro-ethics. This is due to the fact that many can make the leap that Ai could be seen as a brain depending on a line they draw. </div>
            <div className="AboutPara6 AboutMeTextSmall">Apart from writing papers and side projects in computer science, I love to play chess, drink coffee, and pet cats. Music is also in my passions, but I am by no means a music expert.</div>
        </div>
      </div>
      <div id = "AboutMePhotos">

      </div>
       <Bottombar />
    </>
  );
};

export default AboutPage;
