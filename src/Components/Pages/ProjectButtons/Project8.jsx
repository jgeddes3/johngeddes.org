import React from 'react';
import './Project1.css';
import Photo8 from './ProjectButtonImages/GateKeepLogo.webp';

const Project8 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>GateKeep</h1>
        <p>Gig booking for one city&apos;s musicians and venues (planned)</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          {/* GateKeep has no logo yet. This is its initials in the wordmark's typeface and colour. */}
          <img loading="lazy" decoding="async" src={Photo8} alt="GK, standing in for a GateKeep logo" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project8;
