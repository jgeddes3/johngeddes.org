import React, { useState, useEffect } from 'react';
import './LastFmRecentlyPlayed.css';
import LastFmLogo from './last-fm-logo-icon.png';

const LastFmRecentlyPlayed = () => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetch('/api/recently-played')
      .then((response) => response.json())
      .then((data) => {
        const items = data && Array.isArray(data.items) ? data.items : [];
        const fallbackItem = items[0] || null;
        const nonNowPlaying = items.find((item) => !item.isNowPlaying);
        const selectedItem = nonNowPlaying || fallbackItem;

        setTrack(selectedItem ? selectedItem.track : null);
      })
      .catch((error) => {
        console.error('Error fetching recent track:', error);
      });
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) {
      return '';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="lastfm-currently-playing">
      <img loading="lazy" decoding="async" src={LastFmLogo} alt="Last.fm Logo" className="lastfm-logo" />
      <div className="text-container">
        <div className="header">Recently Played</div>
        {track ? (
          <div className="track-info">
            <div className="track-details">
              <a
                href={track.external_urls.lastfm}
                target="_blank"
                rel="noopener noreferrer"
                className="track-link"
              >
                {truncateText(track.name, 20)} by{' '}
                {truncateText(track.artists[0].name, 20)}
              </a>
            </div>
          </div>
        ) : (
          <div>No recent track found.</div>
        )}
      </div>
    </div>
  );
};

export default LastFmRecentlyPlayed;

