import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../../ForEveryPage/Background';
import Bottombar from '../../../ForEveryPage/Bottombar';
import '../AaMiscTemplates.css';
import FullStar from '../../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../../HomePages/FriendsImages/WhiteStarHalf.png';
// CONTENT: import your photos here.
// import MainPhoto from '../MiscPageImages/YourFolder/Main.jpg';
// import Photo1 from '../MiscPageImages/YourFolder/Photo1.jpg';
// import Photo2 from '../MiscPageImages/YourFolder/Photo2.jpg';

const TemplateRestaurantReview = () => {
  // CONTENT: update these fields.
  const title = 'Restaurant Name Here';
  const ratingOutOf10 = 8;
  const tripAdvisorUrl = 'https://www.tripadvisor.com/';
  const yelpUrl = 'https://www.yelp.com/';

  const mainPhoto = {
    src: null, // MainPhoto,
    alt: 'Main photo',
    caption: 'Main photo caption here.'
  };

  // CONTENT: paste text into each section. Use blank lines to split paragraphs.
  const sections = [
    {
      type: 'text',
      text: `
Intro text goes here.
      `
    },
    {
      type: 'photo-right',
      text: `
Text that should sit beside the photo on the right.
      `,
      photo: {
        src: null, // Photo1,
        alt: 'Photo 1',
        caption: 'Photo 1 caption here.'
      }
    },
    {
      type: 'photo-left',
      text: `
Text that should sit beside the photo on the left.
      `,
      photo: {
        src: null, // Photo2,
        alt: 'Photo 2',
        caption: 'Photo 2 caption here.'
      }
    },
    {
      type: 'text',
      text: `
Closing paragraph here.
      `
    }
  ];

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

  const renderParagraphs = (text) => {
    return text
      .trim()
      .split(/\n\s*\n/)
      .map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ));
  };

  const renderSection = (section, index) => {
    if (section.type === 'photo-right') {
      return (
        <div key={index} className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            {renderParagraphs(section.text)}
          </div>
          <div className="image-with-caption">
            {section.photo.src && (
              <img loading="lazy" decoding="async" src={section.photo.src} alt={section.photo.alt} />
            )}
            {section.photo.caption && (
              <p className="image-caption">{section.photo.caption}</p>
            )}
          </div>
        </div>
      );
    }

    if (section.type === 'photo-left') {
      return (
        <div key={index} className="paragraph-photo-left-container">
          <div className="image-with-caption">
            {section.photo.src && (
              <img loading="lazy" decoding="async" src={section.photo.src} alt={section.photo.alt} />
            )}
            {section.photo.caption && (
              <p className="image-caption">{section.photo.caption}</p>
            )}
          </div>
          <div className="Seperator-photo-left">
            {renderParagraphs(section.text)}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="paragraph-only-container">
        {renderParagraphs(section.text)}
      </div>
    );
  };

  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>{title}</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">
          <div className="star-container">
            {renderStars(ratingOutOf10)}
          </div>
        </div>
        <div className="author-links">
          <p>
            Written by John Geddes |
            <a href={tripAdvisorUrl} target="_blank" rel="noopener noreferrer"> Tripadvisor </a> |
            <a href={yelpUrl} target="_blank" rel="noopener noreferrer"> Yelp </a>
          </p>
        </div>
        <div className="MainPhoto-container">
          {mainPhoto.src && (
            <img loading="lazy" decoding="async" src={mainPhoto.src} alt={mainPhoto.alt} />
          )}
          {mainPhoto.caption && (
            <p className="image-caption">{mainPhoto.caption}</p>
          )}
        </div>
        {sections.map(renderSection)}
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

export default TemplateRestaurantReview;
