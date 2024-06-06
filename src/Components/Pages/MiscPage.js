import React from 'react';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import './MiscPage.css';

const MiscPage = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Miscellanous</h1>
        </div>
        <p className="MiscPages-description main-content">This is for all of my thoughts, recipes, and reviews! </p>

      <Bottombar />
    </>
  );
};

export default MiscPage;
