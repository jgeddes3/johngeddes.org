import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Friends.css';
import Fantasy1 from './FriendsImages/Sleeper_Screenshot.png';
import Fantasy2 from './FriendsImages/YahooFant1.png';
import Fantasy3 from './FriendsImages/YahooFant2.png';
import Golf1 from './FriendsImages/Golf1.jpg';
import Golf2 from './FriendsImages/Golf2.jpg';
import Chess from './FriendsImages/Chess.png';
import WhiteStar from './FriendsImages/WhiteStar.png';
import WhiteStarHalf from './FriendsImages/WhiteStarHalf.png';

const FriendsPage = () => {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [iframePosition, setIframePosition] = useState({ top: 0, left: 0 });
  
  const handleButtonClick = (url, event) => {
    event.stopPropagation(); // Prevent event bubbling to avoid closing iframe on button click
    setIframeUrl(url);
    const buttonRect = event.target.getBoundingClientRect();
    const iframeTop = buttonRect.top + window.scrollY + (buttonRect.bottom > window.innerHeight / 2 ? -620 : 320);
    const iframeLeft = buttonRect.left;
    setIframePosition({ top: iframeTop, left: iframeLeft });
  };
  
  // Memoize the closeIframe function so it doesn't change on every render
  const closeIframe = useCallback((event) => {
    if (!event.target.closest('.iframe-container')) {
      setIframeUrl(null);
    }
  }, []); // No dependencies since the function doesn't rely on props/state
  
  useEffect(() => {
    if (iframeUrl) {
      document.addEventListener('click', closeIframe);
    } else {
      document.removeEventListener('click', closeIframe);
    }
  
    return () => document.removeEventListener('click', closeIframe); // Cleanup event listener
  }, [iframeUrl, closeIframe]);
  
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
const [showChessIframe, setShowChessIframe] = useState(false);

// Memoize handleScroll function using useCallback
const handleScroll = useCallback(() => {
  const element = document.getElementById('chess-section');
  const elementTop = element.getBoundingClientRect().top;

  if (elementTop < window.innerHeight && !showChessIframe) {
    setShowChessIframe(true);
  }
}, [showChessIframe]);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll); // Cleanup listener on unmount
  };
}, [handleScroll]); // Add handleScroll to dependencies


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
          <p className="golf-description">I love golf. I am not good at golf by any means but the older I get the more fun it is. I took golf lessons all throughout grade school and was in my high school’s golf team for a short amount of time. It never stuck however until my sister and her boyfriend found some cheap golf clubs that I bought from them. Since then, I’ve been hitting from the red and running with a 32 handicap (I tell people 18).</p>
          </div>
      <div id="centerpieceFriends">
          <h1 className='main-content'>Books Books Books!</h1>
      </div> 

      <div className="books-friends-container main-content">
        {/* Left 2/3rd box */}
        <div className="books-friends-left">
          <div className="books-friends-rect-left">
            <h2 className="books-friends-header">Book Reviews</h2>
            <p className="books-friends-description">
            I have a deep appreciation for books that explore complex themes and imaginative worlds. In Sci-Fi, the Red Rising series by Pierce Brown is my all-time favorite, with its space setting and intricate characters. In Fantasy, nothing compares to Brandon Sanderson's The Way of Kings, a masterpiece of world-building and storytelling. When it comes to Philosophy, The Art of Loving by Erich Fromm resonates with me on a personal level, offering profound insights into human nature and relationships. As for standalone novels, Babel by R.F. Kuang stands out for its powerful exploration of history, the British empire, and resistance.</p>
            <p className="books-friends-description">I am no professional reader nor a well-developed reviewer, but if you click on any of the books to the right you will be able to see the reviews that I have left! In them I will link to the good reader review as well, but it will sound eerily similar to the review you would read on my website. If you have any recommendations based on the other books, do not hesitate to click this <a href="https://forms.gle/xjqgC1DkY8KZWBu7A" target="_blank" rel="noopener noreferrer">this link</a> and fill out the form!
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
                    {renderStars(8)}
                   </div></Link>
                <Link to="/HowToBlowUpAPipelineReview" className="books-friends-button">How To Blow Up A...
                <div className="star-container">
                            {renderStars(6)}
                        </div>
                </Link>
                <Link to="/MorningStarReview" className="books-friends-button">Morning Star Review
                        <div className="star-container">
                            {renderStars(9)}
                        </div></Link>
                <Link to="/MythOfSisyphusReview" className="books-friends-button">Myth Of Sisyphus Review
                <div className="star-container">
                            {renderStars(5)}
                      </div>
                </Link>
                <Link to="/RedRisingReview" className="books-friends-button">Red Rising Review
                <div className="star-container">
                            {renderStars(7)}
                        </div>
                </Link>
                <Link to="/WayOfKingsReview" className="books-friends-button">Way of Kings Review
                <div className="star-container">
                            {renderStars(9)}
                        </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

      <div id="centerpieceFriends">
          <h1 className='main-content'>My Favs and Soon to be Favs</h1>
      </div> 
       <div className="friends-description-container">
        <p className="projects-description main-content">
        In this section, on the right I have placed restaurants and bars I like and on the left I have placed restaurants and bars I have been to and reviewed!
        </p>
      </div>

  <div className="bars-friends-container main-content">
  {/* Left Side with Bars (Non-Scrollable Rectangle, Scrollable Buttons) */}
  <div className="bars-friends-right">
    <div className="bars-friends-rect-right">
      <div className="books-friends-button-container">
      <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/dearly-beloved-chicago', e)}>Dearly Beloved</button>
          <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/king-of-cups-chicago', e)}>King of Cups</button>
          <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/bernards-chicago-2', e)}>Bernard's</button>
          <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/the-gatsby-chicago', e)}>The Gatsby</button>
          <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/buzzed-by-zea-chicago', e)}>Buzzed by Zea</button>
          <button className="bars-friends-button" onClick={(e) => handleButtonClick('https://www.yelp.com/biz/ella-elli-chicago', e)}>Ella Elli</button>
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
        <Link to="/Hopleaf" className="books-friends-button">Hopleaf Review
        <div className="star-container">
            {renderStars(9)}
          </div>
        </Link>
      </div>
    </div>
  </div>
</div>

    {/* Popup Iframe */}
    {iframeUrl && (
      <div className="iframe-popup" style={{ top: iframePosition.top, left: iframePosition.left }}>
        <div className="iframe-container">
          <iframe src={iframeUrl} title="Bar Yelp Review"></iframe>
        </div>
      </div>
    )}

      <div id="centerpieceFriends">
          <h1 className='main-content'>BBQ'n n' Grillin</h1>
      </div> 
      <div className='fantasy-third-container main-content'>
      <div className="info-rectangle2">
        <div id = "FantasyPara">
            <div className="BBQPara4 AboutMeTextSmall">Grilling is one of my favorite ways to cook, but I enjoy cooking in general and experimenting in the kitchen. Whether it’s modifying recipes to create something new or simply improving a dish, I love the creative process involved in cooking. Whether it's marinating meats for the grill or adding a twist to a traditional pasta dish, I'm always looking for ways to elevate the flavors. My passion for cooking extends beyond the grill, and I enjoy exploring different cuisines and techniques in the kitchen.</div>
            <div className="BBQPara5 AboutMeTextSmall">At the end of this paragraph, you’ll find a button that will take you to the misc section, where I share some of my favorite recipes. I’ve taken classic dishes and added my own spin, whether it's tweaking the seasoning, adjusting the cooking method, or combining ingredients in a unique way. From grilled meats to hearty stews, my recipes reflect my passion for experimenting in the kitchen. If you enjoy cooking or just want to try something new, you'll find plenty of ideas and inspiration in the collection. </div>
          </div>
        </div>
        </div>
        
        <div className="AboutFriends-button-container main-content">
        <Link to="/misc" className="AboutFriends-button">
          Go to Misc to see more
        </Link>
      </div>

      <div id="centerpieceFriends">
          <h1 className='main-content'>Chess!!!!!</h1>
      </div> 
       <div id="chess-section" className="chess-section">
           <img src={Chess} alt="Chess" className="chess-image" />
        </div>
        <div className="chess-container2 main-content">
          <p className="chess-description">Chess has always been a passion of mine, and I love the challenge and mental focus it brings with every game. My rank fluctuates, but regardless of the outcome, it's always a great time to meet new people, exchange strategies, and test my skills in a match. Whether I’m on a winning streak or learning from a tough game, every match sharpens my strategy and keeps me coming back for more. If you’re up for a game, feel free to add me at <a href="https://www.chess.com/member/shyne4life" target="_blank" rel="noopener noreferrer">Shyne4life</a> on chess.com—let's play!</p>
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
