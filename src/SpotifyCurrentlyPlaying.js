import React, { useState, useEffect } from 'react';
import './SpotifyCurrentlyPlaying.css';
import SpotifyLogo from './SpotifyLogo.png';  // Adjust the path based on your project structure

const SpotifyCurrentlyPlaying = () => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/recently-played')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); // Debug log
        if (data && data.items && data.items.length > 1) {
          setTrack(data.items[1].track);  // Access the second most recent track
        } else {
          console.log('Not enough recently played tracks found.'); // Debug log
        }
      })
      .catch(error => {
        console.error('Error fetching recently played track:', error); // Debug log
      });
  }, []);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="spotify-currently-playing">
      <img src={SpotifyLogo} alt="Spotify Logo" className="spotify-logo" />
      <div className="text-container">
        <div className="header">Recently Played</div>
        {track ? (
          <div className="track-info">
            <div className="track-details">
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="track-link">
                {truncateText(track.name, 20)} by {truncateText(track.artists[0].name, 20)}
              </a>
            </div>
          </div>
        ) : (
          <div>No second most recently played track found.</div>
        )}
      </div>
    </div>
  );
};

export default SpotifyCurrentlyPlaying;
