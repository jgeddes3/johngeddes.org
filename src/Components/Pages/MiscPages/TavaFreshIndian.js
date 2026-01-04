import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import { Link } from 'react-router-dom';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png'; 
import Tava1 from './MiscPageImages/TavaFresh/Tava1.jpg'
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
          This is one of the best, if not the best, Indian food Iâ€™ve had in Chicago. 
          From the moment I walked in, I could tell this place was special. 
          The aromas alone were enough to get my mouth watering, and once the food arrived, I was not disappointed. 
          They also serve some of the first and best alcoholic Lassi's I have ever had, which added an extra layer of enjoyment to the meal.
          </p>
        </div>
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          I had the Tandoori Chicken, Tava Fish Tandoori, Chicken Makhani, and Carrot Halwa for dessert. Each dish was bursting with flavor, perfectly spiced, and cooked to perfection. 
          Anything that is a TAVA Signature I would recommend without hesitation, but the Chicken Makhani was truly something to die for. 
          It was rich, creamy, and full of that buttery tomato goodness that defines a great makhani. 
          I couldnâ€™t get enough.
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
          The restaurant itself is a very nice place to eat, with a warm ambiance and comfortable seating. 
          Despite the service hiccup, I very much enjoyed my time here and will definitely be back to try more dishes
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
      <Bottombar />
    </>
  );
};

export default TavaFreshIndian;
