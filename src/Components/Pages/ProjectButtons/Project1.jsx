import React from 'react';
import './Project1.css';
// The app's own mark. The university crest that used to sit here is Loyola's
// trademark, and the app is not affiliated with the university.
import Photo1 from './ProjectButtonImages/RamblerIcon.webp';

const Project1 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Rambler Registrar</h1>
        <p>Course scheduling for Loyola students</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo1} alt="Rambler Registrar app icon" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project1;

