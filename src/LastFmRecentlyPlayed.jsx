import React, { useState, useEffect } from 'react';
import './LastFmRecentlyPlayed.css';
import LastFmLogo from './last-fm-logo-icon.webp';

// The widget lives in the footer, so it remounts on every route change. Keep
// the last answer at module level: navigating between pages reuses it instead
// of hitting the API again, and the footer renders the track immediately rather
// than flashing "No recent track found." first.
const TRACK_TTL_MS = 60 * 1000;
let cachedTrack = null; // { at, track }
let pendingTrack = null;

const pickTrack = (data) => {
  const items = data && Array.isArray(data.items) ? data.items : [];
  const fallbackItem = items[0] || null;
  const nonNowPlaying = items.find((item) => !item.isNowPlaying);
  const selectedItem = nonNowPlaying || fallbackItem;
  return selectedItem ? selectedItem.track : null;
};

const loadTrack = () => {
  if (cachedTrack && Date.now() - cachedTrack.at < TRACK_TTL_MS) {
    return Promise.resolve(cachedTrack.track);
  }
  if (!pendingTrack) {
    pendingTrack = fetch('/api/recently-played')
      .then((response) => response.json())
      .then((data) => {
        const track = pickTrack(data);
        cachedTrack = { at: Date.now(), track };
        return track;
      })
      .finally(() => {
        pendingTrack = null;
      });
  }
  return pendingTrack;
};

const LastFmRecentlyPlayed = () => {
  const [track, setTrack] = useState(() => (cachedTrack ? cachedTrack.track : null));

  useEffect(() => {
    let active = true;
    loadTrack()
      .then((next) => {
        if (active) setTrack(next);
      })
      .catch((error) => {
        console.error('Error fetching recent track:', error);
      });
    return () => {
      active = false;
    };
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

