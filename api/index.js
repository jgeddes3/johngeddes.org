const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');

const app = express();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USER;

app.use(cors());

const buildRecentTracksUrl = () => {
  return 'https://ws.audioscrobbler.com/2.0/?' + querystring.stringify({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: LASTFM_API_KEY,
    limit: 5,
    format: 'json'
  });
};

const normalizeTracks = (tracks) => {
  return tracks.map((track) => {
    const artistName = track && track.artist && track.artist['#text']
      ? track.artist['#text']
      : 'Unknown Artist';
    const isNowPlaying = Boolean(
      track && track['@attr'] && track['@attr'].nowplaying
    );

    return {
      isNowPlaying,
      track: {
        name: track && track.name ? track.name : 'Unknown Track',
        artists: [{ name: artistName }],
        external_urls: {
          lastfm: track && track.url ? track.url : ''
        }
      }
    };
  });
};

app.get('/recently-played', (req, res) => {
  if (!LASTFM_API_KEY || !LASTFM_USER) {
    res.status(500).json({
      error: 'Last.fm credentials are missing. Set LASTFM_API_KEY and LASTFM_USER.'
    });
    return;
  }

  const options = {
    url: buildRecentTracksUrl(),
    json: true
  };

  request.get(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error('Failed to fetch recent tracks', error, body);
      res.status(500).json({ error: 'Failed to fetch recent tracks.' });
      return;
    }

    const tracks = body && body.recenttracks && body.recenttracks.track
      ? body.recenttracks.track
      : [];

    if (!Array.isArray(tracks) || tracks.length === 0) {
      res.json({ items: [] });
      return;
    }

    res.json({ items: normalizeTracks(tracks) });
  });
});

module.exports = app;
