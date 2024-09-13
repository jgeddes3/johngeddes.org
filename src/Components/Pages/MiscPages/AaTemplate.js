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
        {/*Link down to Recipe*/}
        <a href="#CHANGE THIS">here</a>
        <div id="CHANGE THIS" className="CHANGE THIS"></div>
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
          <div className = "image-with-caption">
          <img src={imageExample} alt="Hopleaf Interior" />
          <p className="image-caption">Hopleaf Interior</p>
          </div>
        </div>

        {/* Paragraph with photo on the left */}
        <div className="paragraph-photo-left-container">
            <div className = "image-with-caption">
          <img src={imageExample} alt="Hopleaf Dish" />
          <p className="image-caption">Hopleaf Dish</p>
          </div>
        <div className = "Seperator-photo-left">
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
        {/* Paragraph Wrap */}
        <div className="paragraph-wrap">
          <p>
          combinations and spices, but the foundation of my dad’s recipe, with that egg and Worcestershire combo, remains unchanged. 
          I’ve tried adding garlic, onion, even a splash of soy sauce at times, but those two ingredients are always the base. 
          It’s a simple recipe, but it’s one that never fails. 
          Alright here is the recipe. 
          Oh also it makes 6-8 burgers, or 4 half pound burgers.
          </p>
        </div>
        {/* Recipes */}
        <div className="recipes">
          <h2>Hopleaf Recipes</h2>
          <p2>Serves: 8 people | Prep Time: 15 Minutes | Cook Time: 3 hours</p2>
          <p>-</p>
          <p>-</p>
          <p>-</p>
          <h2>Hopleaf Recipes</h2>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default ResTemplate;