import React from 'react';
import Background from '../ForEveryPage/Background';
import PageFooter from '../ForEveryPage/PageFooter';
import SEO from '../ForEveryPage/SEO';
import './MiscPage.css';
import { books, restaurants, recipes } from '../../reviews';
import ReviewIndex from '../../reviews/ReviewIndex';
import BooksLogo from './MiscButtons/MiscImages/BooksLogo.webp';
import RestaurantLogo from './MiscButtons/MiscImages/RestaurantLogo.webp';
import RecipesLogo from './MiscButtons/MiscImages/RecipesLogo.webp';

const MiscSection = ({ logo, title, children }) => (
  <section className="misc-section">
    <div className="misc-section-header main-content">
      <span className="misc-section-logo">
        <img src={logo} alt="" loading="lazy" decoding="async" />
      </span>
      <h2>{title}</h2>
    </div>
    <div className="misc-section-card main-content">{children}</div>
  </section>
);

const MiscPage = () => {
  const pending = books.filter((b) => b.status === 'coming-soon').length;
  return (
    <>
      <SEO
        title="Miscellaneous"
        description="Book reviews, restaurant reviews, recipes, and other thoughts by John Geddes."
        path="/misc"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Miscellaneous</h1>
        <p className="MiscPages-description main-content">
          Everything that isn't work: the books I've been reading, the places I've been eating,
          and the recipes I actually make.
        </p>
      </div>
      <div className="content-container">
        <MiscSection logo={BooksLogo} title="Book Reviews">
          <ReviewIndex
            items={books}
            label="Book reviews"
            note={pending > 0 ? `"Soon" means I've read it and settled on a score — the written review is on the way.` : undefined}
          />
        </MiscSection>
        <MiscSection logo={RestaurantLogo} title="Restaurants & Bars">
          <ReviewIndex items={restaurants} label="Restaurant and bar reviews" />
        </MiscSection>
        <MiscSection logo={RecipesLogo} title="Recipes">
          <ReviewIndex items={recipes} showBlurb label="Recipes" />
        </MiscSection>
      </div>
      <PageFooter />
    </>
  );
};

export default MiscPage;
