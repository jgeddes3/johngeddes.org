import React from 'react';
import { Helmet } from 'react-helmet-async';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './AaMiscTemplates.css';
import Chili1 from './MiscPageImages/Chili/ChiliPhoto1.webp';
import Chili2 from './MiscPageImages/Chili/ChiliPhoto2.jpg';
import Stout1 from './MiscPageImages/Chili/StoutBeer.jpg';

const CrockPotChilli = () => {

    
  return (
    <>
      <SEO
        title="Crock Pot Beer Chili"
        description="John Geddes' crock pot chili recipe with stout beer — slow-cooked with chipotle, garlic, beans, and tomato puree. Serves 12."
        path="/CrockPotChilli"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Recipe",
          "name": "Crockpot Chili with Beer",
          "author": { "@type": "Person", "name": "John Geddes" },
          "description": "Slow-cooked crock pot chili with stout beer, chipotle garlic seasoning, multiple beans, and tomato puree.",
          "prepTime": "PT35M",
          "cookTime": "PT480M",
          "totalTime": "PT515M",
          "recipeYield": "12 servings",
          "recipeCategory": "Main Course",
          "recipeCuisine": "American",
          "recipeIngredient": [
            "2 pounds ground beef",
            "4 cans Westbrae chili bean mix",
            "2 cans garbanzo beans",
            "1 can black beans mild spice",
            "15 oz tomato puree",
            "1 onion, cut up",
            "4 garlic cloves, minced",
            "Chili seasoning",
            "Steak seasoning",
            "Chipotle garlic barbecue blend",
            "Worcestershire sauce",
            "Oregano",
            "Cayenne",
            "Garlic powder",
            "Cloves",
            "Cinnamon",
            "1/2 cup stout beer",
            "1/2 cup beef broth",
            "Shredded cheese for topping",
            "Sourdough bread for serving",
            "Cilantro for topping"
          ],
          "recipeInstructions": [
            { "@type": "HowToStep", "text": "Start by browning your meat with chipotle garlic seasoning, steak seasoning, cayenne, and garlic powder." },
            { "@type": "HowToStep", "text": "When the meat is browned, put the meat in the crock pot and start browning the onions in the same pan. When browned, put on top of the meat." },
            { "@type": "HowToStep", "text": "Now put the beans, tomato puree, garlic cloves, chili seasoning, Worcestershire sauce, oregano, more garlic powder, cloves, cinnamon, beer, and broth." },
            { "@type": "HowToStep", "text": "Cook for 6-8 hours on low." },
            { "@type": "HowToStep", "text": "Serve with cheese on top and cilantro on top, with a slice of bread to dip it in." }
          ]
        })}</script>
      </Helmet>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>The Best Crock Pot Chili</h1>
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
          <img loading="lazy" decoding="async" src={Chili1} alt="Chili1" />
          <p className="image-caption">This is a photo of Chili (I will replace when I make chili)</p> 
        </div>
        <div className="paragraph-only-container">
          <p>
          So the biggest thing with this chili is seasoning the meat before it goes anywhere near the crockpot.
          You're hitting two pounds of ground beef with chipotle garlic barbecue seasoning, garlic powder, steak seasoning, salt, and pepper while you brown it.
          The chipotle gives it some heat and smokiness, and the steak seasoning rounds it out. You want the meat to already taste good on its own before it goes in the pot — that's what makes the end result so much better.
          </p>
        </div>

        {/* Paragraph with photo on the right */}
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          Now the stout beer — this is the move that makes people ask you for the recipe.
          It sounds weird if you haven't done it before, but the beer adds this dark, almost malty taste that works really well against the tomato and onion.
          There's a slight bitterness to it that keeps the chili from being one-note. You're only using half a cup, plus half a cup of beef broth alongside the 
          </p>
          </div>
          <div className = "image-with-caption">
          <img loading="lazy" decoding="async" src={Chili2} alt="Chili2" />
          <p className="image-caption">This is a photo of Chili (I will replace when I make chili)</p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          stout, so it's not overpowering — it just ties everything together.
          </p>
        </div>

        {/* Paragraph with photo on the left */}
        <div className="paragraph-photo-left-container">
            <div className = "image-with-caption">
          <img loading="lazy" decoding="async" src={Stout1} alt="Stout1" />
          <p className="image-caption">A Nice Stout Beer</p>
          </div>
        <div className = "Seperator-photo-left">
          <p>
          The crockpot does the rest of the heavy lifting. You just set it on low and let it go for 6-8 hours.
          By hour three or four, your place is going to smell incredible and you're going to want to eat it early — don't.
          Let it go the full time. The beans soak up everything and the beef gets super tender. Every spoonful hits a little different — 
          </p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          sometimes you get the chipotle, sometimes the garlic, sometimes just straight beefy goodness.
          </p>
        </div>

        {/* Paragraph Only Container */}
        <div className="paragraph-only-container">
          <p>
          You need to serve this with sourdough bread, shredded cheese, and cilantro — that's non-negotiable.
          The sourdough is great for dipping and the tanginess works well with how rich the chili is.
          Cheese on top melts right in, and cilantro gives it some freshness (assuming you don't have that gene where it tastes like soap).
          Also, important to note, the leftover chili is always better than same day chili 
          </p>
        </div>

        <div className="recipes">
          <h2>Crockpot Chili Recipe with Beer</h2>
          <p2>Serves: 12 people | Prep Time: 35 Minutes | Cook Time: 6-8 hours</p2>
          <h2>Ingredients </h2>
          <p>-2 pounds of ground beef</p>
          <p>-4 cans of Westbrae chili bean mix</p>
          <p>-2 cans of Garbanzo Beans</p>
          <p>-1 can of Black Beans mild spice</p>
          <p>-15 oz of Tomatoe Puree</p>
          <p>-1 onion cut up</p>
          <p>-4 Garlic Cloves minced</p>
          <p>-Chili seasoning</p>
          <p>-Steak seasoning</p>
          <p>-Chipotle garlic Barbecue blend by the Spice House</p>
          <p>-Worcheshire sauce</p>
          <p>-Oregano</p>
          <p>-Cayenne</p>
          <p>-Garlic powder</p>
          <p>-Cloves</p>
          <p>-Cinnamon</p>
          <p>-1/2 cup stout beer</p>
          <p>-1/2 cup beef broth</p>
          <h2>For after chili is made</h2>
          <p>-Shredded Cheese</p>
          <p>-Sourdough Bread</p>
          <p>-Cilantro  (if you don't have that weird gene)</p>
          <h2>Directions</h2>
          <p>-Start by browning your meat with chipotle garlic seasoning, steak seasoning, cayanne, and garlic powder.</p>
          <p>-When the meat is browned, put the meat in the crock pot and start browning the onions in the same pan. When browned, put on top of the meat.</p>
          <p>-Now put the beans, tomatoes puree, garlic cloves, chili seasoning, worcheshire sauce, oregano, more garlic powder, cloves, Cinnamon, beer, and broth.</p>
          <p>-Cook for 6-8 hours on low.</p>
          <p>-Serve with cheese on top and cilantro on top, with a slice of bread to dip it in.</p>
        </div>
      </div>
      <div className="misc-nav-buttons">
        <Link to="/friends" className="misc-nav-button misc-nav-friends">
          Friends Page
        </Link>
        <Link to="/misc" className="misc-nav-button misc-nav-misc">
          Misc Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default CrockPotChilli;


        
