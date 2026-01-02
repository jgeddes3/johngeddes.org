import React from 'react';
import './Project3.css';
import Photo3 from './ProjectButtonImages/ChessDeckGame.png';

const Project3 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>Chess Deck</h1>
        <p>A Chess Game</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo3} alt="Project 3" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project3;

