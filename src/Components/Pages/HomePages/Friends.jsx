import React from 'react';

import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Friends.css';
import NewsTicker from './NewsTicker';
import { books, restaurants } from '../../../reviews';
import ReviewIndex from '../../../reviews/ReviewIndex';
import Golf1 from './FriendsImages/Golf1.webp';
import Golf2 from './FriendsImages/Golf2.webp';
import Chess from './FriendsImages/Chess.webp';
import RockClimb1 from './FriendsImages/RockClimb1.jpg';
import RockClimb2 from './FriendsImages/RockClimb2.jpg';
import Mongolia from './FriendsImages/Mongolia.png';

const BARS_TO_TRY = [
  { title: 'Dearly Beloved', url: 'https://www.yelp.com/biz/dearly-beloved-chicago' },
  { title: 'King of Cups', url: 'https://www.yelp.com/biz/king-of-cups-chicago' },
  { title: "Bernard's", url: 'https://www.yelp.com/biz/bernards-chicago-2' },
  { title: 'The Gatsby', url: 'https://www.yelp.com/biz/the-gatsby-chicago' },
  { title: 'Buzzed by Zea', url: 'https://www.yelp.com/biz/buzzed-by-zea-chicago' },
  { title: 'Ella Elli', url: 'https://www.yelp.com/biz/ella-elli-chicago' },
];

const FriendsPage = () => {
  return (
    <>
      <SEO
        title="Friends & Interests"
        description="John Geddes' personal interests including rock climbing, book reviews, restaurant reviews, chess, golf, and foreign affairs."
        path="/friends"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Hello Friends!</h1>
      </div>
      <div className="friends-description-container">
        <p className="projects-description main-content">
        This page is everything I'm passionate about — rock climbing, reading, chess, golf, and
        the places I eat and drink around Chicago. I'm not the best at any of them; they're what
        keep me sane. If you're trying to get a read on my character, this is the right page.
        Philosophy gets its own corner of the site — the link is at the bottom.
        </p>
      </div>
      {/* Fantasy Football - commented out for now
      ...Fantasy Football content...
      */}

      {/* 1. Rock Climbing */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Solo John</h1>
      </div>

      <div className="golf-container main-content">
          <div className="golf-image-box">
            <img loading="lazy" decoding="async" src={RockClimb1} alt="Rock Climbing 1" />
            <img loading="lazy" decoding="async" src={RockClimb2} alt="Rock Climbing 2" />
          </div>
        </div>
        <div className="golf-container2 main-content">
          <p className="golf-description">Rock climbing has become one of my favorite ways to stay active.</p>
          </div>

      {/* 2. Reading */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Books Books Books!</h1>
      </div>

      <div className="books-friends-container main-content">
        {/* Left 2/3rd box */}
        <div className="books-friends-left">
          <div className="books-friends-rect-left">
            <h2 className="books-friends-header">Book Reviews</h2>
            <p className="books-friends-description">
            I love to read, and if you're here I'd guess you do too. (If you don't, you're missing
            out on one of the oldest mediums we have.) My reading gravitates toward fantasy, sci-fi,
            and historical fiction, with philosophy and the classics mixed in when I have the mental
            capacity. In fantasy I have a habit of falling for authors who can't finish a series to
            save their lives — The Name of the Wind, The Lies of Locke Lamora, A Game of Thrones.
            For series that actually get finished, there's The Stormlight Archive, the Licanius
            Trilogy, and the Poppy War trilogy. On the sci-fi side it's the Red Rising series above
            all, The Will of the Many more recently, and one-offs like Artemis by Andy Weir and
            Recursion by Blake Crouch.</p>
            <p className="books-friends-description">
            Every book on the right links to a review — or at least a score while the written
            review is on its way. I'm no professional critic, so take the scores with a grain of
            salt. And if you know a book that's right up my alley, send it to app@johngeddes.org —
            I read the suggestions.
            </p>
          </div>
        </div>
          {/* Right 1/3rd box */}
          <div className="books-friends-right">
            <div className="books-friends-rect-right">
              <ReviewIndex
                items={books}
                compact
                label="Book reviews"
                note={`"Soon" means I've read it and settled on a score — the written review is on the way.`}
              />
            </div>
          </div>
        </div>

      {/* 3. Foreign Affairs */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Foreign Affairs</h1>
      </div>
       <div className="chess-section">
           <img loading="lazy" decoding="async" src={Mongolia} alt="Mongolia" className="chess-image" />
        </div>
        <NewsTicker />
        <div className="chess-container2 main-content">
          <p className="chess-description">Foreign affairs are one of the most crucial things to pay attention to in an increasingly global economy. With everything connected, even keeping your finger on five percent of the pulse is difficult. I read about it purely to know what's going on, even when I can't change any of it. For wire services I recommend the Associated Press and Reuters; for video, I gravitate toward RealLifeLore, Wendover (more logistics, but it overlaps), Morning Brew, and TLDR News.</p>
          </div>

      {/* 4. Golf */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Golfing</h1>
      </div>

      <div className="golf-container main-content">
          <div className="golf-image-box">
            <img loading="lazy" decoding="async" src={Golf1} alt="Golf 1" />
            <img loading="lazy" decoding="async" src={Golf2} alt="Golf 2" />
          </div>
        </div>
        <div className="golf-container2 main-content">
          <p className="golf-description">I love golf. I'm not good at it by any means, but the older I get the more fun it becomes. I took lessons all through grade school and spent a short stint on my high school's team, but it never stuck — not until my sister and her boyfriend found some cheap clubs and sold them to me. I've been playing whenever I can since.</p>
          </div>

      {/* 5. Chess */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>Chess!!!!!</h1>
      </div>
       <div id="chess-section" className="chess-section">
           <img loading="lazy" decoding="async" src={Chess} alt="Chess" className="chess-image" />
        </div>
        <div className="chess-container2 main-content">
          <p className="chess-description">I'm not good at chess by any means, but that doesn't stop me from playing every day. My rating fluctuates, and I love playing random new people regardless of how good they are. Whether I lose gracefully or crush someone new to the game, it's always fun. If you're up for a match, challenge me at <a href="https://www.chess.com/member/shyne4life" target="_blank" rel="noopener noreferrer">Shyne4life</a> on chess.com — or we can play the chess variant I invented, <Link to="/ChessDeck">Chess Deck</Link>, over on my projects page.</p>
          </div>

      {/* 6. Bars and Restaurants */}
      <div id="centerpieceFriends">
          <h1 className='main-content'>My Favs and Soon to be Favs</h1>
      </div>
       <div className="friends-description-container">
        <p className="projects-description main-content">
        On the left, the places I've been and reviewed. On the right, the running list of bars and
        restaurants I want to try next — those links open Yelp until I've been and written them up.
        </p>
      </div>

  <div className="bars-friends-container main-content">
  {/* Reviewed */}
  <div className="bars-friends-right">
    <h3 className="mobile-section-header">Reviewed</h3>
    <div className="bars-friends-rect-right">
      <ReviewIndex items={restaurants} label="Reviewed restaurants and bars" />
    </div>
  </div>

  {/* On the list */}
  <div className="bars-friends-right">
    <h3 className="mobile-section-header">On the List</h3>
    <div className="bars-friends-rect-right">
      <ReviewIndex items={BARS_TO_TRY} label="Bars and restaurants to try" />
    </div>
  </div>
</div>

      {/* BBQ'n n' Grillin - commented out for now
      ...BBQ content...
      */}

      <div className="bottom-buttons-container">
        <Link to="/contracts" className="contracts-nav-button">
          Contracts Page
        </Link>
        <Link to="/philosophy" className="philosophy-nav-button">
          Philosophy Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default FriendsPage;
