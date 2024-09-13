import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
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
          <img src={Image1} alt="Hopeleaf Exterior" />
          <p className="image-caption">Hopleaf Exterior, taken by user WarmWeatherPlease013 on Tripadvisor in 2019</p> 
        </div>
                <div className="paragraph-only-container">
          <p>
          I’ve had the pleasure of visiting Hopleaf a few times, and without hesitation, I can confidently say it remains my top recommendation for anyone visiting Chicago. 
          Whether you’re a local or just passing through, Hopleaf has something special to offer, making it a must-visit destination for craft beer enthusiasts and food lovers alike.
          </p>
        </div>        
        <div className="paragraph-only-container">
          <p>
          First off, let’s talk about beer. Hopleaf’s selection is truly impressive, with over 50 draft beers available at any given time. 
          Their rotating menu spans a wide variety of styles, from local Chicago brews to hard-to-find international ales. Whether you prefer a rich stout, a crisp lager, or something more experimental like a sour or cider, Hopleaf has got you covered. 
          Personally, I’ve barely scratched the surface of their offerings, and yet every time I visit, I find something new and exciting to try, although I have had every cider that they have had to offer. 
          </p>
        </div>
        <div className="paragraph-photo-right-container">
            <div className = "Seperator-photo-right">
          <p>
          Beyond the beer, Hopleaf’s food menu stands out, too. On my visits, a few dishes have really caught my attention. 
          The oysters were a perfect start, fresh and briny with just the right touch of seasoning. 
          They’re a great match for some of the lighter beers on tap, and for seafood lovers, they’re a treat you can’t miss. 
          They are also quite filling, so if you get another entry you will probably be taking it to go.
          </p>
          </div>
          <div className="image-with-caption">
            <img src={Image2} alt="Hopleaf Mussels" />
            <p className="image-caption">Mussels for One, taken by user 'Sallie ..' on Yelp in 2022</p>
        </div>
        </div>
        <div className="paragraph-only-container">
          <p>
          But it’s not just the oysters that make Hopleaf shine. 
          Their poutine is a comforting, savory appetizer that brings together crispy fries, rich gravy, and melted cheese curds in a way that’s irresistible. 
          It’s the kind of indulgent comfort food you crave after a long day, and it pairs perfectly with one of their darker ales or lagers.
          The balance of flavors is spot on, and it’s a dish I’ll order again and again.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          Finally, one of my absolute favorites: the brisket reuben. 
          This sandwich is a masterpiece. 
          The brisket is tender and flavorful, with just the right amount of smokiness, and it’s complemented beautifully by the tangy sauerkraut and melted cheese. 
          The rye bread is toasted to perfection, giving it a satisfying crunch with every bite. 
          It’s hearty, filling, and incredibly satisfying — the kind of sandwich that leaves a lasting impression.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          Overall, Hopleaf is more than just a beer bar or a restaurant. 
          It’s a Chicago institution, a place where you can enjoy a world-class selection of beers alongside equally memorable food. 
          Whether you’re going for the drinks, the food, or both, Hopleaf delivers every time, making it a spot I’ll continue to recommend to anyone looking for a true taste of the city. 
          One thing to note, if you go on a Thursday, Friday or Saturday, you may be hard pressed to find a seat, but in that area for good food it's the same everywhere.  
          </p>
        </div>

      </div>
      <Bottombar />
    </>
  );
};

export default Hopleaf;



