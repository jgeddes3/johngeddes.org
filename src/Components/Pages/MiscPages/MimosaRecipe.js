import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import Mimosa1 from './MiscPageImages/Mimosas/Mimosas1.jpg'
import Cava1 from './MiscPageImages/Mimosas/Cava1.jpg'
import OrangeJuice1 from './MiscPageImages/Mimosas/OJ.jpg'

const MimosaRecipe = () => {
  

  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Mimosa Recipe</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="rating-container">

        </div>
        <div className="author-links">
          <p>
            Written by John Geddes | 
            <a href="https://www.tripadvisor.com/Profile/JohnHoss" target="_blank" rel="noopener noreferrer"> Tripadvisor </a> | 
            <a href="https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg" target="_blank" rel="noopener noreferrer"> Yelp </a>
          </p>
        </div>
        <div className="MainPhoto-container">
          <img src={Mimosa1} alt="Hopleaf Example" />
          <p className="image-caption">Mimosas (Not taken by me, will change when making mimosas)</p> 
        </div>
        <div className="paragraph-only-container">
          <p>
          The fact that you’re looking up how to make mimosas suggests one of three things, and as long as you drink responsibly, I’m not here to judge: 1) You’re too young to be drinking mimosas, 2) You’re already a bit too tipsy to be mixing another round, or 3) You’re on a quest to craft the perfect mimosa with a creative twist. As long as you're safe and of age, then let's have some fun! Click <a href="#MimosaRecipeLink">here</a> if you want to skip to the recipe.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
          To start, let’s focus on one of the two key ingredients in the classic mimosa: orange juice. Many people assume that any orange juice will do since it’s mixed with alcohol, but that couldn’t be further from the truth. I like to compare it to sushi—you can get decent sushi at Whole Foods, but it’s not going to match the quality you’d find at Nobu. The same goes for mimosas. In my opinion, you should always try to squeeze your own orange juice using a juicer. If that’s not an option, Whole Foods and most local grocery stores offer freshly squeezed orange juice as a good alternative.
          </p>
        </div>
        <div className="paragraph-photo-left-container">
            <div className = "image-with-caption">
          <img src={Cava1} alt="Cava" />
          <p className="image-caption">Segura Viudas Rose</p>
          </div>
        <div className = "Seperator-photo-left">
          <p>
          That said, I get that freshly squeezed juice can be double or triple the price, which might not be ideal if you're sharing it with friends. As long as you steer clear of brands like Minute Maid, Simply Orange, and Tropicana, you should be okay. If you’re looking for something close to freshly squeezed, I recommend Uncle Matt’s or Trader Joe’s generic brands. (Not sponsored)

          </p>
          </div>
        </div>
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          Now, let's focus on the fun part. The bubbly. If you are using real champagne in your mimosa’s then you are either in a significantly higher tax bracket than me or you are wasting good wine and good money. To reiterate what has been said a billion times, Champagne is only from the region of Champagne France. There is a small group in California that can call their wine champagne but they are not champagne. Anyways. The wine I’d recommend is a Cava. 

          </p>
          </div>
          <div className = "image-with-caption">
          <img src={OrangeJuice1} alt="Hopleaf Interior" />
          <p className="image-caption">Trader Joes Orange Juice</p>
          </div>
        </div>
        <div className="paragraph-only-container">
          <p>
          Cava is a Spanish wine which is a very easily accessible wine that one can find at just about any liquor store. It’s affordable, but don’t let the price fool you—Cava brings a crisp, clean flavor to mimosas without overpowering the orange juice. It’s also made using the traditional method (the same one used for champagne), so you still get those nice, fine bubbles that elevate the drink. Another great thing about Cava is its versatility. It pairs well with a variety of juices if you ever want to mix things up beyond orange. Plus, it’s light enough to enjoy for brunch without leaving you feeling weighed down. Now that we have discussed the ingredients, let's go into making it.
          </p>
        </div>
        <div id="MimosaRecipeLink" className="MimosaRecipeLink">
        <div className="recipes">
          <h2>The Best Mimosas you've ever had</h2>
          <p2>Serves: 8 people | Prep Time: 15 Minutes | Cook Time: Nothing</p2>
          <h2>Ingredients</h2>
          <p>-One Bottle (750 ml) of Freshly Squeezed Orange Juice</p>
          <p>-One Bottle (750 ml) of Cava, Chilled.</p>
          <h2>Directions</h2>
          <p>Pour in half Orange Juice Half Cava into a champagne flute and enjoy!</p>
        </div>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default MimosaRecipe;