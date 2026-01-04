import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../../ForEveryPage/Background';
import Bottombar from '../../../ForEveryPage/Bottombar';
import '../AaMiscTemplates.css';
// CONTENT: import your photos here.
// import MainPhoto from '../MiscPageImages/YourFolder/Main.jpg';
// import Photo1 from '../MiscPageImages/YourFolder/Photo1.jpg';
// import Photo2 from '../MiscPageImages/YourFolder/Photo2.jpg';

const TemplateRecipe = () => {
  // CONTENT: update these fields.
  const title = 'Recipe Title Here';
  const tripAdvisorUrl = 'https://www.tripadvisor.com/';
  const yelpUrl = 'https://www.yelp.com/';

  const mainPhoto = {
    src: null, // MainPhoto,
    alt: 'Main photo',
    caption: 'Main photo caption here.'
  };

  const sections = [
    {
      type: 'text',
      text: `
Intro text goes here.
      `
    },
    {
      type: 'photo-left',
      text: `
Text beside a left photo.
      `,
      photo: {
        src: null, // Photo1,
        alt: 'Photo 1',
        caption: 'Photo 1 caption here.'
      }
    },
    {
      type: 'photo-right',
      text: `
Text beside a right photo.
      `,
      photo: {
        src: null, // Photo2,
        alt: 'Photo 2',
        caption: 'Photo 2 caption here.'
      }
    }
  ];

  // CONTENT: paste the recipe below. Use lines starting with "##" for headings.
  const recipeText = `
## Recipe Name
Serves: 4 | Prep Time: 20 minutes | Cook Time: 30 minutes

## Ingredients
- Ingredient one
- Ingredient two
- Ingredient three

## Directions
- Step one
- Step two
- Step three
  `;

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

  const renderRecipeLines = (text) => {
    const lines = text.trim().split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return null;
      }
      if (trimmed.startsWith('##')) {
        return <h2 key={index}>{trimmed.replace(/^##\s*/, '')}</h2>;
      }
      return <p key={index}>{trimmed}</p>;
    });
  };

  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>{title}</h1>
      </div>
      <div className="restaurant-container main-content">
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
        <div className="recipes">
          {renderRecipeLines(recipeText)}
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

export default TemplateRecipe;
