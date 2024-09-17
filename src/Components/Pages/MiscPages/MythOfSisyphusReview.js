import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import FullStar from '../HomePages/FriendsImages/WhiteStar.png';
import HalfStar from '../HomePages/FriendsImages/WhiteStarHalf.png'; 
import MythOfSisyphus from './MiscPageImages/TheMythofSisyphus/TheMythofSisyphus.jpg'

const MythOfSisyphusReview = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating / 2) {
        stars.push(<img key={i} src={FullStar} alt="Full Star" className="star-icon" />);
      } else if (i === Math.ceil(rating / 2) && rating % 2 !== 0) {
        stars.push(<img key={i} src={HalfStar} alt="Half Star" className="halfstar-icon" />);
      }
    }
    return stars;
  };

  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>The Way of Kings</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">
          <div className="star-container">
            {renderStars(7.5)}
          </div>
        </div>
        <div className="author-links">
          <p>
            Written by John Geddes | "
            <a href="https://www.goodreads.com/book/show/11987.The_Myth_of_Sisyphus_and_Other_Essays">The Myth of Sisyphus and Other Essays</a> by <a href="https://www.goodreads.com/author/show/957894.Albert_Camus">Albert Camus</a><br/>
          </p>
        </div>
       
        {/* Cover For Books */}
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          In The Myth of Sisyphus, Albert Camus dives deep into the human condition, exploring themes of absurdity, meaning, and existence. 
          Camus presents the ancient Greek myth of Sisyphus, the man condemned by the gods to roll a boulder up a hill for eternity, only to watch it roll back down every time he reaches the top. 
          This endless, futile task becomes a symbol of human life, which Camus argues is inherently devoid of meaning, yet we continue to seek purpose in a world that offers none.
          </p>
          <p>What makes this myth particularly tragic, Camus suggests, is that Sisyphus is fully aware of his situation. It’s this consciousness that both burdens and frees him. As Camus writes, "If this myth is tragic, it is because the Hero is conscious." Sisyphus knows the futility of his task, yet he 
          </p>
          </div>
          <div className = "Cover-with-caption">
          <img src={MythOfSisyphus} alt="Way of Kings" />
          <p className="Cover-caption">The Way of Kings by Brandon Sanderson</p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
         continues, and it’s in this perseverance that we find a profound statement about human resilience and defiance.
          </p>
        </div>
        
        {/* Paragraph Only Container */}
        <div className="paragraph-only-container">
          <p>
          One of the most striking moments in Camus' interpretation is when he emphasizes Sisyphus' descent from the summit. Camus argues that the hour-long walk down, after the rock has inevitably tumbled back, is when Sisyphus is truly free. This descent, often seen as the lowest point, is also a moment of liberation. Camus provocatively suggests that "if this descent is in sorrow, then it can also be in joy." Sisyphus may be condemned to repeat the same task, but in those moments between the struggle, he is conscious of his fate and free to choose his attitude towards it. This is where Camus' existential philosophy shines: the recognition that even in a life devoid of inherent meaning, we can find freedom by accepting and embracing the absurdity.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
            There is catharsis in monotony and labor, and for that there is mercy involving Sisyphus. Where some are involved in endless suffering at the hands of tormentors, Sisyphus must only push a boulder up a hill. He must simply endure.

          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
            While I read this book with the lens of my own, I also gained catharsis. While in this endless endeavor of labor and searching for meaning, it feels better knowing that there are others. Others that are laboring endlessly with no end in sight. While I do not know if this was Camus intention, it does make me feel less alone. 

          </p>
        </div>

      </div>
      <Bottombar />
    </>
  );
};

export default MythOfSisyphusReview;