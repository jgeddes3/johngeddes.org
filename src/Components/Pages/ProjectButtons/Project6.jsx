import React from 'react';
import './Project3.css';
import Photo6 from './ProjectButtonImages/ChessDeckGame.webp';

const Project6 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>Chess Deck</h1>
        <p>Chess crossed with a card game, playable here</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo6} alt="Chess Deck board and cards" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project6;

