import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../Components/ForEveryPage/Background';
import PageFooter from '../Components/ForEveryPage/PageFooter';
import SEO from '../Components/ForEveryPage/SEO';
import { renderText } from '../reviews/inlineText';
import { CATEGORIES } from './categories';
import { formatDate } from './index';
import '../Components/Pages/PhilosophyPages/PhilosophyTemplate.css';

const categoryTitle = (key) => (CATEGORIES.find((c) => c.key === key) || {}).title || 'Philosophy';

const Caption = ({ caption }) => (caption ? <p className="phil-image-caption">{caption}</p> : null);

const Block = ({ block }) => {
  switch (block.kind) {
    case 'heading':
      return <h2 className="phil-heading">{block.text}</h2>;
    case 'pullquote':
      return <p className="phil-pullquote">{renderText(block.text)}</p>;
    case 'blockquote':
      return <blockquote className="phil-blockquote">{renderText(block.text)}</blockquote>;
    case 'divider':
      return <hr className="phil-divider" />;
    case 'image':
      return (
        <figure className="phil-figure">
          <img className="phil-image" src={block.image.src} alt={block.image.alt} loading="lazy" decoding="async" />
          <Caption caption={block.image.caption} />
        </figure>
      );
    case 'figure':
      return (
        <div className={`phil-image-aside${block.side === 'left' ? ' left' : ''}`}>
          <div className="phil-image-aside-text">
            <p>{renderText(block.text)}</p>
          </div>
          <figure className="phil-image-aside-figure">
            <img src={block.image.src} alt={block.image.alt} loading="lazy" decoding="async" />
            <Caption caption={block.image.caption} />
          </figure>
        </div>
      );
    default:
      return <p className="phil-text">{renderText(block.text)}</p>;
  }
};

const ComingSoon = () => (
  <div className="phil-body">
    <p className="phil-text">
      This one is still being written. I'd rather post nothing than filler, so check back.
      The <Link to="/philosophy">Philosophy page</Link> lists what is finished.
    </p>
  </div>
);

const EssayPage = ({ essay }) => {
  const { slug, category, title, deck, date, status, epigraph, blocks = [] } = essay;
  return (
    <>
      <SEO path={`/${slug}`} />
      <Background />
      <div id="centerpiece2" className="main-content">
        <p className="phil-eyebrow">{categoryTitle(category)}</p>
        <h1 className="phil-title">{title}</h1>
      </div>
      <div className="phil-page main-content">
        {deck && <p className="phil-subtitle">{deck}</p>}
        <p className="phil-byline">
          Written by John Geddes{date ? ` · ${formatDate(date)}` : ''}
        </p>
        {epigraph && (
          <div className="phil-epigraph">
            {epigraph.text}
            {epigraph.attribution && (
              <span className="phil-epigraph-attribution">— {epigraph.attribution}</span>
            )}
          </div>
        )}
        {status === 'coming-soon' ? (
          <ComingSoon />
        ) : (
          <div className="phil-body">
            {blocks.map((block, i) => <Block key={i} block={block} />)}
          </div>
        )}
      </div>
      <div className="phil-nav-buttons">
        <Link to="/philosophy" className="phil-nav-button">
          Philosophy Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default EssayPage;
