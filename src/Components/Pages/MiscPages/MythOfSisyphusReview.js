import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png'; 
import MythOfSisyphus from './MiscPageImages/TheMythofSisyphus/TheMythofSisyphus.jpg'

const MythOfSisyphusReview = () => {
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
        <h1>The Way of Kings</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">
          <div className="star-container">
            {renderStars(7.5)}
          </div>
        </div>
        <div className="author-links">
          <p>
            Written by John Geddes | "
            <a href="https://www.goodreads.com/book/show/7235533-the-way-of-kings">The Way of Kings</a> by <a href="https://www.goodreads.com/author/show/38550.Brandon_Sanderson">Brandon Sanderson"</a><br/>
          </p>
        </div>
       
        {/* Cover For Books */}
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          Brandon Sanderson does it again. 
          Sucks me into a massive series only for it to be probably my favorite fantasy series I’ve read to this date. 
          To tell the story about how I found it really just shows how the smallest things can have such a drastic impact on your life. 
          I was at a my sisters 49ers vs Chiefs super bowl party talking with people I have never met and I will never talk to again and this guy brings up Red Rising. 
          Now the Red Rising series is my favorite and will probably always be my favorite Science Fiction book, so this perked my ears right up. 
          We got to talking and I recommended him some books (name of the wind) and he recommended me this book right here. 
          </p>
          <p>Initially, I didn’t even think I would read it, but I bought it and it didn’t speak to me. Not at all, I just couldn't relate to Kal while he was in Amarams </p>
          </div>
          <div className = "Cover-with-caption">
          <img src={MythOfSisyphus} alt="Way of Kings" />
          <p className="Cover-caption">The Way of Kings by Brandon Sanderson</p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          army. But I stuck with it and really got into it when he became a slave. I think this is what you would call a slow start but the moment it picks up I couldn’t put it down. The attention to detail is crazy, and I am currently writing this review after I finished Rhythm of war, the amount of call backs is insane. I could only read this series for a year and I don’t think I would ever get bored.
          </p>
        </div>
        
        {/* Paragraph Only Container */}
        <div className="paragraph-only-container">
          <p>
          The only downfall I’ve heard people say to me that I do get is the book is long. I don’t mind this in the least bit. There are very few things I would cut. I do understand this criticism however, it can seem daunting to read a book that long especially when you start. My only solace is it is so worth it to finish the series.
          </p>
        </div>

      </div>
      <Bottombar />
    </>
  );
};

export default MythOfSisyphusReview;