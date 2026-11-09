import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Philosophy.css';
import { CATEGORIES } from '../../../philosophy/categories';
import { essaysIn, formatDate } from '../../../philosophy';
import ReviewIndex from '../../../reviews/ReviewIndex';

/* One shelf per category, in the same layout as the Misc page sections.
   Essays come from src/philosophy/entries; a shelf with none shows one line. */
const Shelf = ({ category }) => {
  const items = essaysIn(category.key).map((e) => ({
    slug: e.slug,
    title: e.title,
    blurb: e.deck,
    meta: formatDate(e.date),
    status: e.status,
  }));
  return (
    <section className="phil-shelf">
      <div className="phil-shelf-header main-content">
        <span className="phil-shelf-logo">
          <img src={category.logo} alt="" loading="lazy" decoding="async" />
        </span>
        <h2>{category.title}</h2>
      </div>
      <div className="phil-shelf-card main-content">
        {items.length > 0 ? (
          <ReviewIndex items={items} showBlurb label={category.title} />
        ) : (
          <p className="phil-shelf-empty">{category.empty}</p>
        )}
      </div>
    </section>
  );
};

const PhilosophyPage = () => {
  return (
    <>
      <SEO path="/philosophy" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Philosophy</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          In Progress, as all of life is.
        </p>
      </div>

      <div className="phil-shelves">
        {CATEGORIES.map((category) => (
          <Shelf key={category.key} category={category} />
        ))}
      </div>

      <div className="bottom-buttons-container">
        <Link to="/friends" className="friends1-nav-button">
          Friends Page
        </Link>
        <Link to="/social" className="social-nav-button">
          Social Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default PhilosophyPage;
