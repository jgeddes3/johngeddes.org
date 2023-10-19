import React from 'react';
import './Homepage.css';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import Largebutton1 from '../hpButtons/Largebutton1';
import Smallbutton1 from '../hpButtons/Smallbutton1';
import LargeButton2 from '../hpButtons/Largebutton2';
import SmallButton2 from '../hpButtons/Smallbutton2';
import Largebutton3 from '../hpButtons/Largebutton3';
import Smallbutton3 from '../hpButtons/Smallbutton3';

const HomePage = () => {
  return (
    <>
    <Background />
    <div id="centerpiece">
          <h1>I'm John Joseph Geddes</h1>
      </div>
      <div className="button-container">
        <div className="button-row">
         <Largebutton1 />
         <Smallbutton1/>
         </div>
          <div className="button-row">
         <SmallButton2 />
         <LargeButton2 />
         </div>
         <div id = "centerpiece1">
           <h1>In Progress</h1>
           </div>
           <div className="button-row">
         <Smallbutton3 />
         <Largebutton3 />
         </div>
      </div>
      <Bottombar />
      </>
    
  );
};

export default HomePage;
