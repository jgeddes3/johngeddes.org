import React from 'react';
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './AaMiscTemplates.css';
import Chili1 from './MiscPageImages/Chili/ChiliPhoto1.jpg';
import Chili2 from './MiscPageImages/Chili/ChiliPhoto2.jpg';
import Stout1 from './MiscPageImages/Chili/StoutBeer.jpg';

const CrockPotChilli = () => {

    
  return (
    <>
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
          When it comes to chili, seasoning your meat is key to building a rich and flavorful base for the dish. 
          For this recipe, weâ€™re working with two pounds of ground beef, and the seasoning starts before the meat even hits the crockpot. 
          A blend of Chipotle garlic barbecue seasoning, garlic powder, steak seasoning, salt, and pepper creates a robust and smoky flavor. 
          The Chipotle brings a subtle heat, while the garlic powder and steak seasoning add depth. 
          This combination perfectly prepares the beef to soak up all the other flavors as it slow-cooks in the crockpot.
          </p>
        </div>

        {/* Paragraph with photo on the right */}
        <div className="paragraph-photo-right-container">
        <div className = "Seperator-photo-right">
          <p>
          One of the most exciting ingredients in this chili is the stout beer. 
          It might seem surprising, but stout beer adds an incredible layer of flavor. 
          The dark, malty richness of the stout enhances the chiliâ€™s depth, giving it a slight bitterness that balances the sweetness from the onions and tomato puree.
           It also pairs well with the smoky spices, creating a complex flavor profile that makes every bite interesting. 
           Adding the beef broth alongside the 
          </p>
          </div>
          <div className = "image-with-caption">
          <img loading="lazy" decoding="async" src={Chili2} alt="Chili2" />
          <p className="image-caption">This is a photo of Chili (I will replace when I make chili)</p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          stout gives the chili a meaty backbone that brings everything together.
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
          The best part about this chili is that it simmers low and slow in a crockpot, allowing the ingredients to meld together and develop deep, bold flavors. 
          After a few hours of cooking, the beef becomes tender, and the beans soak up the delicious broth. 
          By the time itâ€™s ready to eat, the aroma of smoky spices, beef, and stout fills the kitchen, making the anticipation almost unbearable. 
          The flavors marry together so well that every spoonful brings 
          </p>
          </div>
        </div>
        <div className="paragraph-wrap">
          <p>
          something newâ€”whether itâ€™s a hit of Chipotle, the bite of garlic, or the richness of the beef and beans.
          </p>
        </div>

        {/* Paragraph Only Container */}
        <div className="paragraph-only-container">
          <p>
          Of course, no bowl of chili is complete without sourdough bread, cheese, and cilantro. 
          The tang of the sourdough cuts through the richness of the chili, providing the perfect vessel to scoop up each bite. 
          A generous sprinkling of cheese melts into the chili, adding a creamy, indulgent layer that balances the spice. 
          Finally, the cilantroâ€”if youâ€™re one of the lucky ones who love itâ€”adds a fresh, herby brightness that lifts the entire dish. 
          These finishing touches arenâ€™t just optional; theyâ€™re essential to truly enjoying the full experience of this chili. 
          Important to note, the leftover chili is always better than same day chili 
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
          <p>-Â½ cup stout beer</p>
          <p>-Â½ cup beef broth</p>
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
      <Bottombar />
    </>
  );
};

export default CrockPotChilli;


        
