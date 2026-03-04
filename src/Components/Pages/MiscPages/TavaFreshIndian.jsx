import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png';
import Tava1 from './MiscPageImages/TavaFresh/Tava1.webp'
import Tava2 from './MiscPageImages/TavaFresh/Tava2.jpg'

const TavaFreshIndian = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating / 2) {
        stars.push(<img loading="lazy" decoding="async" key={i} src={FullStar} alt="Full Star" className="star-icon" />);
      } else if (i === Math.ceil(rating / 2) && rating % 2 !== 0) {
        stars.push(<img loading="lazy" decoding="async" key={i} src={HalfStar} alt="Half Star" className="halfstar-icon" />);
      }
    }
    return stars;
  };

  return (
    <>
      <SEO
        title="Tava Fresh Taste of India Review"
        description="John Geddes' review of TAVA Fresh Taste of India in Chicago — Tandoori Chicken, Chicken Makhani, and alcoholic Lassis."
        path="/TavaFreshIndian"
      />
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>TAVA Fresh Taste of India</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">
          <div className="star-container">
            {renderStars(7)}
          </div>
        </div>
        <div className="author-links">
          <p>
            Written by John Geddes | 
            <a href="https://www.tripadvisor.com/Profile/JohnHoss" target="_blank" rel="noopener noreferrer"> Tripadvisor </a> | 
            <a href="https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg" target="_blank" rel="noopener noreferrer"> Yelp </a>
          </p>
        </div>

        {/* Photo Container */}
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Tava1} alt="Tava Food" />
          <p className="image-caption">Tandoori Chicken and Tava fish Tandoori, Taken by John Geddes 2024</p> 
        </div>
        <div className="paragraph-only-container">
          <p>
          This is one of the best, if not the best, Indian food I've had in Chicago.
          You can smell the food as soon as you walk in and it immediately sets the tone.
          They also serve alcoholic Lassis here, which I had never seen before, and they were honestly some of the best drinks I had that night.
          </p>
        </div>
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          I had the Tandoori Chicken, Tava Fish Tandoori, Chicken Makhani, and Carrot Halwa for dessert. Everything was well-spiced and clearly made with care.
          If it says TAVA Signature on the menu, just order it — you won't regret it. The Chicken Makhani especially was on another level.
          That buttery tomato sauce was so good I was basically drinking it by the end.
          </p>
          </div>
          <div className = "image-with-caption">
          <img loading="lazy" decoding="async" src={Tava2} alt="Hopleaf Interior" />
          <p className="image-caption">Tava Fish Tandoori and Lassi, Taken by John Geddes 2024</p>
          </div>
        </div>
        <div className="paragraph-only-container">
          <p>
            I give this four stars, however, because the service left something to be desired. Nothing particularly bad, but it was not good either. 
            That might have been due to my group looking younger, as we noticed a slight difference in attention compared to other tables. 
            However, the food more than made up for this, and it didn't ruin the experience.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          The restaurant itself is a nice spot — comfortable, good atmosphere, nothing to complain about there.
          Despite the service thing, I really enjoyed it and I'll definitely be going back to try more of the menu
          </p>
        </div>
      </div>
      <div className="misc-nav-buttons">
        <Link to="/friends" className="misc-nav-button misc-nav-friends">
          Friends Page
        </Link>
        <Link to="/misc" className="misc-nav-button misc-nav-misc">
          Misc Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default TavaFreshIndian;
