import React from 'react';
import { Link } from 'react-router-dom';
import Stars from './Stars';
import './reviews.css';

/* Card-catalog style list of reviews: full title, author, dotted leader,
   rating. Rows link to the review page; rows with a `url` instead of a
   `slug` link out (used for the not-yet-reviewed bar list). */

const RowInner = ({ item, showBlurb }) => (
  <>
    <span className="review-index-titles">
      <span className="review-index-title">{item.title}</span>
      {item.author && <span className="review-index-author">{item.author}</span>}
      {showBlurb && item.blurb && <span className="review-index-blurb">{item.blurb}</span>}
    </span>
    {(item.rating != null || item.url) && <span className="review-index-leader" aria-hidden="true" />}
    {item.rating != null ? (
      <span className="review-index-score">
        <Stars rating={item.rating} size={15} />
        <span className="review-index-number" aria-hidden="true">{item.rating}</span>
        {item.status === 'coming-soon' && <span className="review-index-pending">soon</span>}
      </span>
    ) : item.url ? (
      <span className="review-index-ext" aria-hidden="true">↗</span>
    ) : null}
  </>
);

const ReviewIndex = ({ items, label, showBlurb = false, note, compact = false }) => (
  <>
    <nav className={`review-index${compact ? ' compact' : ''}`} aria-label={label}>
      {items.map((item) =>
        item.url ? (
          <a
            key={item.url}
            className="review-index-row"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RowInner item={item} showBlurb={showBlurb} />
          </a>
        ) : (
          <Link key={item.slug} className="review-index-row" to={`/${item.slug}`}>
            <RowInner item={item} showBlurb={showBlurb} />
          </Link>
        )
      )}
    </nav>
    {note && <p className="review-index-note">{note}</p>}
  </>
);

export default ReviewIndex;
