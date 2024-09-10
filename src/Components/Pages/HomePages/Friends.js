import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Friends.css';
import Fantasy1 from './FriendsImages/Sleeper_Screenshot.png';
import Fantasy2 from './FriendsImages/YahooFant1.png';
import Fantasy3 from './FriendsImages/YahooFant2.png';
import Golf1 from './FriendsImages/Golf1.jpg';
import Golf2 from './FriendsImages/Golf2.jpg';
import WhiteStar from './FriendsImages/WhiteStar.png';
import WhiteStarHalf from './FriendsImages/WhiteStarHalf.png';

const FriendsPage = () => {
const [iframeUrl, setIframeUrl] = useState(null);

const handleButtonClick = (url) => {
  setIframeUrl(url);
};

const closeIframe = () => {
  setIframeUrl(null);
};
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating / 2) {
      stars.push(<img key={i} src={WhiteStar} alt="Star" className="star-icon" />);
    } else if (i === Math.ceil(rating / 2) && rating % 2 !== 0) {
      stars.push(<img key={i} src={WhiteStarHalf} alt="Half Star" className="half-star-icon" />);
    }
  }
  return stars;
};
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Hello Friends!</h1>
      </div>
      <div className="friends-description-container">
        <p className="projects-description main-content">
        In this page, you will find everything I am passionate about. I have many passions ranging from reading to golf to fantasy football, and this will be a good read of my character if that’s what you are looking for. While I may not be the best at my passions, they are what keep me sane. Philosophy is also one of my greatest passions, and if you are looking for that you may find it at the bottom of the page. 
        </p>
      </div>
      <div id="centerpieceFriends">
          <h1 className='main-content'>Fantasy Football</h1>
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
            <div className="AboutPara4 AboutMeTextSmall">Friends! These are my three fantasy teams that I am running this year. The first team is a legacy team of 12, and I am the incumbent champion soon to retake my crown. The second team is my family team, and while I do not focus on this team quite as much, I still enjoy it. The third team is a random team I joined and put some money down.</div>
            <div className="AboutPara5 AboutMeTextSmall">(9/09) As you can tell, I put a lot of stock into Caleb Williams panning out. Obviously, It is not going exactly how I’d like but this is only week 1. W1 saw a loss in OFaran, and Random but I won in the Family league against my amazing Grandmother. Being a Vikings fan, I am hoping to see some results on Darnold like last week, but we will see. I am hoping I won’t be eating my words with Caleb Williams, but TBD.</div>
          </div>
        </div>
      </div>
        <div id="centerpieceFriends">
          <h1 className='main-content'>Golfing</h1>
      </div>

      <div className="golf-container main-content">
          <div className="golf-image-box">
            <img src={Golf1} alt="Golf 1" />
            <img src={Golf2} alt="Golf 2" />
          </div>
        </div>
        <div className="golf-container2 main-content">
          <p className="golf-description">This is the golf section, where you will find some exciting insights into golf strategies and more!</p>
          </div>
      <div id="centerpieceFriends">
          <h1 className='main-content'>Books Books Books!</h1>
      </div> 

      <div className="books-friends-container">
        {/* Left 2/3rd box */}
        <div className="books-friends-left">
          <div className="books-friends-rect-left">
            <h2 className="books-friends-header">Book Reviews and Summaries</h2>
            <p className="books-friends-description">
              Explore a collection of insightful reviews and summaries of impactful books. From fantasy worlds to philosophical discussions, these reviews dive deep into each book's uniqueness.
            </p>
          </div>
        </div>
          {/* Right 1/3rd box */}
          <div className="books-friends-right">
            <div className="books-friends-rect-right">
              <div className="books-friends-button-container">
                <Link to="/BabelReview" className="books-friends-button">Babel Review
                          <div className="star-container">
                            {renderStars(10)}
                          </div>
                </Link>
                <Link to="/GoldenSonReview" className="books-friends-button">Golden Son Review
                 <div className="star-container">
                    {renderStars(7)}
                   </div></Link>
                <Link to="/HowToBlowUpAPipelineReview" className="books-friends-button">How To Blow Up A Pipeline</Link>
                <Link to="/MorningStarReview" className="books-friends-button">Morning Star Review
                                          <div className="star-container">
                            {renderStars(8)}
                          </div></Link>
                <Link to="/MythOfSisyphusReview" className="books-friends-button">Myth Of Sisyphus Review</Link>
                <Link to="/RedRisingReview" className="books-friends-button">Red Rising Review</Link>
                <Link to="/WayOfKingsReview" className="books-friends-button">Way of Kings Review</Link>
              </div>
            </div>
          </div>
        </div>

      <div id="centerpieceFriends">
          <h1 className='main-content'>Bars I like and would like</h1>
      </div> 
       <div className="friends-description-container">
        <p className="projects-description main-content">
        In this section, on the right I have placed bars I like and on the left I have placed bars I have been to and reviewed!
        </p>
      </div>

      <div className="bars-friends-container">
  {/* Left Side with Bars (Non-Scrollable Rectangle, Scrollable Buttons) */}
  <div className="bars-friends-right">
    <div className="bars-friends-rect-right">
      <div className="books-friends-button-container">
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/dearly-beloved-chicago')}>Dearly Beloved</button>
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/king-of-cups-chicago')}>King of Cups</button>
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/bernards-chicago-2')}>Bernard's</button>
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/the-gatsby-chicago')}>The Gatsby</button>
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/buzzed-by-zea-chicago')}>Buzzed by Zea</button>
        <button className="bars-friends-button" onClick={() => handleButtonClick('https://www.yelp.com/biz/ella-elli-chicago')}>Ella Elli</button>
      </div>
    </div>
  </div>

  {/* Right Side with Reviews */}
  <div className="bars-friends-right">
    <div className="bars-friends-rect-right">
      <div className="books-friends-button-container">
        <Link to="/SparrowReview" className="books-friends-button">Sparrow Review
            <div className="star-container">
            {renderStars(10)}
            </div>
        </Link>
        <Link to="/TrivoliTavernReview" className="books-friends-button">Trivoli Tavern Review
        <div className="star-container">
            {renderStars(10)}
          </div>
        </Link>
      </div>
    </div>
  </div>
</div>

{/* Popup Iframe */}
{iframeUrl && (
  <div className="iframe-popup" onClick={closeIframe}>
    <div className="iframe-container">
      <iframe src={iframeUrl} title="Bar Yelp Review"></iframe>
    </div>
  </div>
)}


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
