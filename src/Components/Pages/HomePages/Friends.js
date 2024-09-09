import React from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Friends.css';
import Fantasy1 from './FriendsImages/Sleeper_Screenshot.png';
import Fantasy2 from './FriendsImages/YahooFant1.png';
import Fantasy3 from './FriendsImages/YahooFant2.png';


const FriendsPage = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Hello Friends!</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          Friends!
        </p>
      </div>
      {/* Fantasy Container */}
      <div className="fantasy-main-container main-content">
        {/* Fantasy Team 1 */}
        <div className="fantasy-item fantasy-team1">
          <h3>OFaran Friends Team</h3>
          <div className="image-box-scrollable">
            <img src={Fantasy1} alt="Fantasy Team 1" />
          </div>
        </div>

        {/* Fantasy Team 2 */}
        <div className="fantasy-item fantasy-team2">
          <h3>Family team</h3>
          <div className="image-box-scrollable">
            <img src={Fantasy2} alt="Fantasy Team 2" />
          </div>
        </div>

        {/* Fantasy Team 3 */}
        <div className="fantasy-item fantasy-team3">
          <h3>Random Team for Money</h3>
          <div className="image-box-scrollable">
            <img src={Fantasy3} alt="Fantasy Team 3" />
          </div>
        </div>
      </div>


      {/* Rectangle with text */}
      <div className='fantasy-second-container main-content'>
      <div className="info-rectangle">
        <div id = "FantasyPara">
            <div className="AboutPara4 AboutMeTextSmall">My educational history along with my previous internships has moved me to be a more outgoing and creative person when it comes to computer science. Ai has been a recent passion of mine that I have been attempting to integrate into all parts of my life. While I use many ai services, I am still working to integrate them into personal projects.</div>
            <div className="AboutPara5 AboutMeTextSmall">My Philosophy Minor has pushed me towards ai as well, with me finding my passion of philosophy and computer science intertwined at the crossroads of Neuro-ethics. Much of the new and arising technology is going towards Neuroscience, but many Ai arguments arise in sphere of Neuro-ethics. This is due to the fact that many can make the leap that Ai could be seen as a brain depending on a line they draw. </div>
          </div>
        </div>
      </div>
      <div className="bottom-buttons-container">
        <Link to="/contracts" className="contracts-nav-button">
          Contracts Page
        </Link>
        <Link to="/philosophy" className="philosophy-nav-button">
          Philosophy Page
        </Link>
      </div>


      <Bottombar />
    </>
  );
};

export default FriendsPage;
