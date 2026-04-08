import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Friends.css';
import NewsTicker from './NewsTicker';
import Fantasy1 from './FriendsImages/Sleeper_Screenshot.png';
import Fantasy2 from './FriendsImages/YahooFant1.png';
import Fantasy3 from './FriendsImages/YahooFant2.png';
import Golf1 from './FriendsImages/Golf1.webp';
import Golf2 from './FriendsImages/Golf2.webp';
import Chess from './FriendsImages/Chess.webp';
import RockClimb1 from './FriendsImages/RockClimb1.jpg';
import RockClimb2 from './FriendsImages/RockClimb2.jpg';
import Mongolia from './FriendsImages/Mongolia.png';
import WhiteStar from './FriendsImages/WhiteStar.png';
import WhiteStarHalf from './FriendsImages/WhiteStarHalf.png';

const FriendsPage = () => {
  const handleButtonClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating / 2) {
      stars.push(<img loading="lazy" decoding="async" key={i} src={WhiteStar} alt="Star" className="star-icon" />);
    } else if (i === Math.ceil(rating / 2) && rating % 2 !== 0) {
      stars.push(<img loading="lazy" decoding="async" key={i} src={WhiteStarHalf} alt="Half Star" className="half-star-icon" />);
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
      <SEO
        title="Friends & Interests"
        description="John Geddes' personal interests including fantasy football, golf, book reviews, restaurant reviews, chess, and grilling."
        path="/friends"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Hello Friends!</h1>
      </div>
      <div className="friends-description-container">
        <p className="projects-description main-content">
        In this page, you will find everything I am passionate about. I have many passions ranging from rock climbing, to reading, to chess, and this will be a good read of my character if that's what you are looking for. While I may not be the best at my passions, they are what keep me sane. Philosophy is also one of my greatest passions, and if you are looking for that you may find it at the bottom of the page. (I yet have to write so there may be nothing)
        </p>
      </div>
      {/* Fantasy Football - commented out for now
      ...Fantasy Football content...
      */}

      {/* 1. Rock Climbing */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Solo John</h1>
      </div>

      <div className="golf-container main-content">
          <div className="golf-image-box">
            <img loading="lazy" decoding="async" src={RockClimb1} alt="Rock Climbing 1" />
            <img loading="lazy" decoding="async" src={RockClimb2} alt="Rock Climbing 2" />
          </div>
        </div>
        <div className="golf-container2 main-content">
          <p className="golf-description">In this page, you will find everything I am passionate about. I have many passions ranging from rock climbing, to reading, to chess, and this will be a good read of my character if that's what you are looking for. While I may not be the best at my passions, they are what keep me sane. Philosophy is also one of my greatest passions, and if you are looking for that you may find it at the bottom of the page. (I yet have to write so there may be nothing)</p>
          </div>

      {/* 2. Reading */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Books Books Books!</h1>
      </div>

      <div className="books-friends-container main-content">
        {/* Left 2/3rd box */}
        <div className="books-friends-left">
          <div className="books-friends-rect-left">
            <h2 className="books-friends-header">Book Reviews</h2>
            <p className="books-friends-description">
            I love to read! I am sure if you are reading this you love to read too! If you don't you are seriously missing out on one of the oldest mediums of content ever. Weirdo. Anyways, my reading habits often gravitate towards Fantasy, Sci Fi, and historical fiction but I do read philosophy and the classics when I have the mental capacity. For Fantasy, I keep reading authors who cant finish a series to save their life. Examples of some of my favorites are the Name of the wind, Lies of Locke Lamora, and Game of thrones. Some authors that actually finish their series' that I read are Way of Kings, The Licanius Trilogy, and the Poppy War trilogy. When it comes to Sci Fi obviously Red Rising series, a new one which is The will of the Many, and some one off's like Artimes by Andy Weird and Recursion by Blake Crouch.</p>
            <p className="books-friends-description">
            I have so many other recommendations and I would hope you look at the reviews, but I am in no way a professional writer and much less a professional reviewer so take my opinions with a mountain of salt. If you can think of any books that are right up my alley send me an email at app@johngeddes.org!
            </p>
          </div>
        </div>
          {/* Right 1/3rd box */}
          <div className="books-friends-right">
            <div className="books-friends-rect-right">
              <div className="books-friends-button-container">
                <Link to="/LiesOfLockeLamoraReview" className="books-friends-button">Lies of Locke Lamora...
                <div className="star-container">
                            {renderStars(10)}
                        </div>
                </Link>
                <Link to="/StrengthOfTheFewReview" className="books-friends-button">Strength of the Few...
                <div className="star-container">
                            {renderStars(9)}
                        </div>
                </Link>
                <Link to="/RepublicOfThievesReview" className="books-friends-button">Republic of Thieves...
                <div className="star-container">
                            {renderStars(9)}
                        </div>
                </Link>
                <Link to="/KatabasisReview" className="books-friends-button">Katabasis Review
                <div className="star-container">
                            {renderStars(8)}
                        </div>
                </Link>
                <Link to="/RecursionReview" className="books-friends-button">Recursion Review
                <div className="star-container">
                            {renderStars(8)}
                        </div>
                </Link>
                <Link to="/SunAlsoRisesReview" className="books-friends-button">The Sun Also Rises...
                <div className="star-container">
                            {renderStars(8)}
                        </div>
                </Link>
                <Link to="/ProjectHailMaryReview" className="books-friends-button">Project Hail Mary...
                <div className="star-container">
                            {renderStars(8)}
                        </div>
                </Link>
                <Link to="/RedSeasUnderRedSkiesReview" className="books-friends-button">Red Seas Under Red...
                <div className="star-container">
                            {renderStars(8)}
                        </div>
                </Link>
                <Link to="/WillOfTheManyReview" className="books-friends-button">Will of the Many...
                <div className="star-container">
                            {renderStars(7)}
                        </div>
                </Link>
                <Link to="/BriefHistoryOfIntelligenceReview" className="books-friends-button">A Brief History of...
                <div className="star-container">
                            {renderStars(4)}
                        </div>
                </Link>
                <Link to="/WayOfKingsReview" className="books-friends-button">Way of Kings Review
                <div className="star-container">
                            {renderStars(9)}
                        </div>
                </Link>
                <Link to="/MythOfSisyphusReview" className="books-friends-button">Myth of Sisy... Review
                <div className="star-container">
                            {renderStars(7)}
                      </div>
                </Link>
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

                <Link to="/RedRisingReview" className="books-friends-button">Red Rising Review
                <div className="star-container">
                            {renderStars(7)}
                        </div>
                </Link>

              </div>
            </div>
          </div>
        </div>

      {/* 3. Foreign Affairs */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Foreign Affairs</h1>
      </div>
       <div className="chess-section">
           <img loading="lazy" decoding="async" src={Mongolia} alt="Mongolia" className="chess-image" />
        </div>
        <NewsTicker />
        <div className="chess-container2 main-content">
          <p className="chess-description">Foreign Affairs are one of the most crucial thing to pay attention to in our increasingly global economy and politics. With everything being connected, even keeping your finger on the pulse of 5% is difficult. I enjoy reading about it purely for the knowledge of what is going on even if I cannot change. The news corporations I recommend are Associated Press and Reuters. If I am watching the news, the people I usually gravitate towards are RealLifeLore on Youtube, Wendover who does more logistics but it correlates to foreign affaires, Morning Brew, and TLDR News.</p>
          </div>

      {/* 4. Golf */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Golfing</h1>
      </div>

      <div className="golf-container main-content">
          <div className="golf-image-box">
            <img loading="lazy" decoding="async" src={Golf1} alt="Golf 1" />
            <img loading="lazy" decoding="async" src={Golf2} alt="Golf 2" />
          </div>
        </div>
        <div className="golf-container2 main-content">
          <p className="golf-description">I love golf. I am not good at golf by any means but the older I get the more fun it is. I took golf lessons all throughout grade school and was in my high school's golf team for a short amount of time. It never stuck however until my sister and her boyfriend found some cheap golf clubs that I bought from them. Since then I've been playing whenever I can.</p>
          </div>

      {/* 5. Chess */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Chess!!!!!</h1>
      </div>
       <div id="chess-section" className="chess-section">
           <img loading="lazy" decoding="async" src={Chess} alt="Chess" className="chess-image" />
        </div>
        <div className="chess-container2 main-content">
          <p className="chess-description">I am not good at chess by any means, but that does not stop me from playing every day. My rank fluctuates, but I love playing random new people regardless of how good they are. Whether I lose gracefully and with class or crush someone who's new to the game it is always fun. If you are up for a game, feel free to challenge me at <a href="https://www.chess.com/member/shyne4life" target="_blank" rel="noopener noreferrer">Shyne4life</a> on chess.com, or we can play my chess game I invented on my projects page called <Link to="/ChessDeck">"Chess Deck"</Link>!</p>
          </div>

      {/* 6. Bars and Restaurants */}
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
    <h3 className="mobile-section-header">Unreviewed</h3>
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
    <h3 className="mobile-section-header">Reviewed</h3>
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

      {/* BBQ'n n' Grillin - commented out for now
      ...BBQ content...
      */}

      <div className="bottom-buttons-container">
        <Link to="/contracts" className="contracts-nav-button">
          Contracts Page
        </Link>
        <Link to="/philosophy" className="philosophy-nav-button">
          Philosophy Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default FriendsPage;

