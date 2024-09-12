import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png'; 
import imageExample from './MiscPageImages/Example.jpg'

const ResTemplate = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating / 2) {
        stars.push(<img key={i} src={FullStar} alt="Full Star" className="star-icon" />);
      } else if (i === Math.ceil(rating / 2) && rating % 2 !== 0) {
        stars.push(<img key={i} src={HalfStar} alt="Half Star" className="halfstar-icon" />);
      }
    }
    return stars;
  };

  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Template</h1>
      </div>
      <div className="restaurant-container">
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
          <img src={imageExample} alt="Hopleaf Example" />
          <p className="image-caption">Hopleaf Exterior</p> 
        </div>

        {/* Paragraph with photo on the right */}
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
            This is where the text for the paragraph will go. This description
            can highlight the ambiance of the restaurant, the quality of service,
            and more.
          </p>
          </div>
          <img src={imageExample} alt="Hopleaf Interior" />
          <p className="image-caption">Hopleaf Interior</p>
        </div>

        {/* Paragraph with photo on the left */}
        <div className="paragraph-photo-left-container">
          <img src={imageExample} alt="Hopleaf Dish" />
          <p className="image-caption">Hopleaf Dish</p>
        <div className = "Seperator-photo-right">
          <p>
            Another paragraph, but this time the photo is on the left. This could
            be a detailed review of the food, drinks, or anything specific to the experience.
          </p>
          </div>
        </div>

        {/* Paragraph Only Container */}
        <div className="paragraph-only-container">
          <p>
            This is a container for only paragraphs. It allows you to write longer
            form reviews without any photos to accompany the content. Here, you can
            discuss your overall experience, pricing, and whether you would recommend
            the restaurant.
          </p>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default ResTemplate;