import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../../ForEveryPage/Background';
import Bottombar from '../../../ForEveryPage/Bottombar';
import '../AaMiscTemplates.css';
// CONTENT: import your photos here if needed.
// import Photo1 from '../MiscPageImages/YourFolder/Photo1.jpg';
// import Photo2 from '../MiscPageImages/YourFolder/Photo2.jpg';

const TemplatePhilosophy = () => {
  // CONTENT: update these fields.
  const title = 'Philosophy Title Here';

  const sections = [
    {
      type: 'text',
      text: `
Paste your main text here.

Add new paragraphs with blank lines.
      `
    },
    {
      type: 'photo-right',
      text: `
Optional text beside a right photo.
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
Optional text beside a left photo.
      `,
      photo: {
        src: null, // Photo2,
        alt: 'Photo 2',
        caption: 'Photo 2 caption here.'
      }
    }
  ];

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

export default TemplatePhilosophy;
