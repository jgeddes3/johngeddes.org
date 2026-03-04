import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png'; 
import Image1 from './MiscPageImages/Hopleaf/HopLeafExterior.jpg'
import Image2 from './MiscPageImages/Hopleaf/Mussels.jpg'

const Hopleaf = () => {
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
        title="Hopleaf Review"
        description="John Geddes' review of Hopleaf in Chicago — craft beer, oysters, poutine, and the brisket reuben. A must-visit Chicago bar."
        path="/Hopleaf"
      />
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Hopleaf</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">
          <div className="star-container">
            {renderStars(9)}
          </div>
        </div>
        <div className="author-links">
          <p>
            Written by John Geddes | 
            <a href="https://www.tripadvisor.com/Profile/JohnHoss" target="_blank" rel="noopener noreferrer"> Tripadvisor </a> | 
            <a href="https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg" target="_blank" rel="noopener noreferrer"> Yelp </a>
          </p>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Image1} alt="Hopeleaf Exterior" />
          <p className="image-caption">Hopleaf Exterior, taken by user WarmWeatherPlease013 on Tripadvisor in 2019</p> 
        </div>
                <div className="paragraph-only-container">
          <p>
          I've been to Hopleaf a handful of times now, and it's still the first place I tell people to go when they're visiting Chicago.
          Honestly, even if you live here and haven't been, you're missing out.
          </p>
        </div>        
        <div className="paragraph-only-container">
          <p>
          The beer list is massive — something like 50+ drafts at any given time — and they rotate constantly.
          They've got everything from local Chicago stuff to random European ales you've never heard of. I've barely made a dent in the menu, though I have tried every cider they've had on tap, so there's that. 
          </p>
        </div>
        <div className="paragraph-photo-right-container">
            <div className = "Seperator-photo-right">
          <p>
          The food is legit too. The oysters are great — go for those if you like seafood.
          They go well with whatever lighter beer you've got going. Fair warning though, they're pretty filling, so if you order an entrée after that you'll probably be taking it home.
          </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Image2} alt="Hopleaf Mussels" />
            <p className="image-caption">Mussels for One, taken by user 'Sallie ..' on Yelp in 2022</p>
        </div>
        </div>
        <div className="paragraph-only-container">
          <p>
          The poutine is also a go-to. Fries, gravy, cheese curds — you know the deal, but they do it really well.
          Grab a darker beer with it and you're set. I get it pretty much every time I go.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          But the real star is the brisket reuben.
          The brisket is smoky, the sauerkraut and cheese work, and the rye bread has a good crunch to it.
          It's a big sandwich — you won't leave hungry. Probably my favorite thing on the menu.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          Bottom line — great beer, great food, and it's one of those places that just has a good vibe.
          I'll keep going back and I'll keep telling people to check it out.
          One thing to note, if you go on a Thursday, Friday or Saturday, you may be hard pressed to find a seat, but in that area for good food it's the same everywhere.  
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

export default Hopleaf;




