import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import BurgerPhoto from './MiscPageImages/Burger/Burger.jpg'
import GrillPhoto from './MiscPageImages/Burger/Grillin burgers.jpg'

const AmazingBurgerRecipe = () => {

  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>The Amazing Burger Recipe</h1>
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
          <img src={BurgerPhoto} alt="Burger" />
          <p className="image-caption">Photo of a Burger (not mine but I will be putting a photo of mine when I make it)</p> 
        </div>

        <div className="paragraph-only-container">
          <p>
          Well okay, so everyone always has a story when they write their recipes, so I figured I’d do the same. 
          I think it has something to do with Google Analytics, but if you want to skip to the recipe, click <a href="#BurgerRecipelink">here</a>. 
          When it comes to burgers, this recipe is the best way to go. 
          My dad taught me how to make burgers when I was a kid, and over the years, I’ve stuck to his method while adding a few tweaks of my own. 
          One thing he always emphasized was the magic of eggs and Worcestershire sauce. 
          I wasn’t sure about it at first, but after trying it his way, I couldn’t go back.
          </p>
        </div>
        <div className="paragraph-photo-left-container">
            <div className = "image-with-caption">
        <img src={GrillPhoto} alt="Hopleaf Interior" />
        <p className="image-caption">Burger on the grill (also not mine I will replace it when I grill)</p>
        </div>
        <div className = "Seperator-photo-right">
          <p>
          The egg helps bind everything together, giving the burger that perfect, juicy consistency. 
          It keeps the patty from drying out, especially when you’re cooking it to perfection. 
          Then there’s the Worcestershire sauce, which might be the best-kept secret of any good burger. 
          It brings this deep, savory flavor that’s just hard to beat — it’s like a flavor bomb that seeps into the meat as it cooks. 
          Over time, I’ve experimented with different 
          </p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          combinations and spices, but the foundation of my dad’s recipe, with that egg and Worcestershire combo, remains unchanged. 
          I’ve tried adding garlic, onion, even a splash of soy sauce at times, but those two ingredients are always the base. 
          It’s a simple recipe, but it’s one that never fails. 
          Alright here is the recipe. 
          Oh also it makes 6-8 burgers, or 4 half pound burgers.
          </p>
        </div>
        <div id="BurgerRecipelink" className="BurgerRecipelink">
        <div className="recipes">
          <h2>THE AMAZING BURGERS</h2>
          <p2>Serves: 8 people | Prep Time: 15 Minutes | Cook Time: 3 hours</p2>
          <p>-2 lb Ground beef</p>
          <p>-Steak Seasoning</p>
          <p>-Worcestershire sauce</p>
          <p>-Smoked paprika</p>
          <p>-Garlic Powder</p>
          <p>-Cayenne</p>
          <p>-1 Egg</p>
          <p>-3/4 Onion</p>
          <p>-3 Garlic Cloves</p>
          <p>-Olive Oil (For cooking Onions)</p>
          <p>-Salt and Pepper (to taste)</p>
          <p>-Butter (For Buns)</p>
          <p>-Buns</p>
          <h2>Directions</h2>
          <p>-Cut up the onions and garlic and start sautéing the onions. When the onions start to get soft, throw in the garlic. Cook for another 3 minutes then put off to the side. (This isn’t to cool but its okay if this does happen)</p>
          <p>-Throw the Beef, steak seasoning, Worchestire sauce, egg, smoked paprika, cayenne, and sautéd onions and garlic in a bowl and start mixing. I am honestly not sure on measurements, the more you play around with it the more it’ll feel natural to you, just do NOT over season it with steak seasoning. </p>
          <p>-Butter your buns before you grill. This allows you to toss it on when you have less than a minute of grilling</p>
          <p>-Throw on the grill and cook for 7 minutes on each side or until looking good. This is also to personal preference, just don't burn the patties. </p>
          <p>-When you flip it for the last time and it's starting to look like your taking it off the grill, throw those buns on for a minute or so. This is touche, and will burn very quickly.</p>
          <p>-Take everything off the grill, and enjoy. Oh add pickles.</p>
        </div>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default AmazingBurgerRecipe;