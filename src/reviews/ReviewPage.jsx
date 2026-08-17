import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../Components/ForEveryPage/Background';
import PageFooter from '../Components/ForEveryPage/PageFooter';
import SEO from '../Components/ForEveryPage/SEO';
import Stars from './Stars';
import './reviews.css';

const TYPE_LABEL = {
  book: 'Book Review',
  restaurant: 'Restaurant Review',
  recipe: 'Recipe',
};

/* Block text supports exactly one inline form: [label](target).
   Targets: "#anchor" stays on the page, "/path" is a client route,
   anything else opens externally. */
const renderText = (text) => {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, target] = m;
    if (target.startsWith('/')) {
      out.push(<Link key={m.index} to={target}>{label}</Link>);
    } else if (target.startsWith('#')) {
      out.push(<a key={m.index} href={target}>{label}</a>);
    } else {
      out.push(<a key={m.index} href={target} target="_blank" rel="noopener noreferrer">{label}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

/* Card text: runs of lines starting with "-" become lists, the rest are
   paragraphs. Recipes store ingredients/directions this way. */
const renderCardBody = (text) => {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) {
      out.push(<ul key={`ul-${out.length}`}>{list.map((item, i) => <li key={i}>{renderText(item)}</li>)}</ul>);
      list = [];
    }
  };
  lines.forEach((line, i) => {
    if (/^-\s*/.test(line)) {
      list.push(line.replace(/^-\s*/, ''));
    } else {
      flush();
      out.push(<p key={`p-${i}`}>{renderText(line)}</p>);
    }
  });
  flush();
  return out;
};

const Figcaption = ({ caption }) => (caption ? <figcaption className="review-figcaption">{caption}</figcaption> : null);

const ComingSoon = ({ review }) => {
  const verb = review.type === 'restaurant' ? "I've been" : "I've read this one";
  return (
    <div className="review-coming-soon review-body">
      {review.rating != null ? (
        <p>
          {verb} and landed on {review.rating}/10 — the written review just isn't done yet.
          I'd rather post nothing than filler, so check back.
        </p>
      ) : (
        <p>
          This page is on the way — I'd rather post nothing than filler, so check back.
        </p>
      )}
      <p>
        In the meantime, the <Link to="/misc">Misc page</Link> has the {review.type === 'recipe' ? 'recipes' : 'reviews'} I have finished.
      </p>
    </div>
  );
};

const ReviewPage = ({ review }) => {
  const { title, author, series, place, rating, type, links = [], hero, blocks = [] } = review;
  const subline = type === 'book'
    ? [series, author].filter(Boolean).join(' · ')
    : place;
  let cardCount = 0;

  return (
    <>
      <SEO
        title={type === 'recipe' ? title : `${title} Review`}
        description={review.seoDescription}
        path={`/${review.slug}`}
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <p className="review-eyebrow">{TYPE_LABEL[type]}</p>
        <h1 className="review-title">{title}</h1>
        {subline && <p className="review-subline">{subline}</p>}
      </div>
      <div className="review-container main-content">
        {rating != null && (
          <div className="review-rating">
            <Stars rating={rating} size={30} />
            <span className="review-rating-number" aria-hidden="true">{rating} / 10</span>
          </div>
        )}
        <div className="review-byline">
          <p>
            Written by John Geddes
            {links.map((l) => (
              <React.Fragment key={l.url}>
                {' · '}
                <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
              </React.Fragment>
            ))}
          </p>
        </div>
        {hero && (
          <figure className="review-hero">
            <img src={hero.src} alt={hero.alt} loading="lazy" decoding="async" />
            <Figcaption caption={hero.caption} />
          </figure>
        )}
        {review.status === 'coming-soon' ? (
          <ComingSoon review={review} />
        ) : (
          <div className="review-body">
            {blocks.map((block, i) => {
              if (block.kind === 'figure' && block.image) {
                return (
                  <div key={i} className={`review-figure${block.side === 'left' ? ' left' : ''}`}>
                    <div className="review-figure-text">
                      <p>{renderText(block.text)}</p>
                    </div>
                    <figure className="review-figure-media">
                      <img src={block.image.src} alt={block.image.alt} loading="lazy" decoding="async" />
                      <Figcaption caption={block.image.caption} />
                    </figure>
                  </div>
                );
              }
              if (block.kind === 'card') {
                cardCount += 1;
                return (
                  <section key={i} className="review-card" id={cardCount === 1 ? 'recipe' : undefined}>
                    <h2>{block.heading}</h2>
                    {renderCardBody(block.text)}
                  </section>
                );
              }
              return <p key={i}>{renderText(block.text)}</p>;
            })}
          </div>
        )}
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

export default ReviewPage;
