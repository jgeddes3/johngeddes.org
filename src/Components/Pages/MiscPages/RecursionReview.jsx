import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import '../MiscPages/AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png';

const RecursionReview = () => {
  const title = 'Recursion';
  const ratingOutOf10 = 8;
  const authorName = 'Blake Crouch';
  const goodreadsUrl = 'https://www.goodreads.com/';

  const introText = `
Review coming soon!
  `;

  const bodyText = `
Check back later for the full review.
  `;

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
        <div className="paragraph-only-container">
          <p>{introText.trim()}</p>
          <p>{bodyText.trim()}</p>
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

export default RecursionReview;
