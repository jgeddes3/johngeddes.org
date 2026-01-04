import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../../ForEveryPage/Background';
import Bottombar from '../../../ForEveryPage/Bottombar';
import '../AaMiscTemplates.css';
import FullStar from '../../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../../HomePages/FriendsImages/WhiteStarHalf.png';
// CONTENT: import your cover image here.
// import CoverImage from '../MiscPageImages/YourFolder/YourCover.jpg';

const TemplateBookReview = () => {
  // CONTENT: update these fields.
  const title = 'Book Title Here';
  const ratingOutOf10 = 9;
  const authorName = 'Author Name';
  const goodreadsUrl = 'https://www.goodreads.com/';

  // CONTENT: paste your text below. Use a blank line to create a new paragraph.
  const introText = `
Paste your intro here.

Second paragraph here.
  `;

  const bodyText = `
Paste the rest of the review here.

Add more paragraphs with blank lines.
  `;

  const coverPhoto = {
    src: null, // CoverImage,
    alt: 'Book cover',
    caption: 'Cover caption here.'
  };

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
            Written by John Geddes | "
            <a href={goodreadsUrl} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
            " by {authorName}
          </p>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            {renderParagraphs(introText)}
          </div>
          <div className="Cover-with-caption">
            {coverPhoto.src && (
              <img loading="lazy" decoding="async" src={coverPhoto.src} alt={coverPhoto.alt} />
            )}
            {coverPhoto.caption && (
              <p className="Cover-caption">{coverPhoto.caption}</p>
            )}
          </div>
        </div>
        <div className="paragraph-only-container">
          {renderParagraphs(bodyText)}
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

export default TemplateBookReview;
