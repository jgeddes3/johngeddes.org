import React from 'react';
import './Project3.css';
import Photo5 from './ProjectButtonImages/HikeAwayTours.webp';

const Project5 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>Hike Away Tours</h1>
        <p>Operated walking tours on US rail-trails, booked like a flight</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo5} alt="A phone showing the Hike Away Tours app icon, held up against an Alpine valley" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project5;

