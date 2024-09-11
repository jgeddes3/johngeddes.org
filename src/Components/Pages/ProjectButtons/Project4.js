import React from 'react';
import './Project1.css';
import Photo4 from './ProjectButtonImages/SpotifyAstroLogo.png';

const Project4 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Spotify Astrology App</h1>
        <p>Create a playlist based off of your Astrology Sign!</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img src={Photo4} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project4;
