const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? process.env.SPOTIFY_PROD_REDIRECT_URI
  : process.env.SPOTIFY_REDIRECT_URI;

let accessToken = '';

app.use(cors());

app.get('/login', (req, res) => {
  const scope = 'user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI
    }));
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(
        CLIENT_ID + ':' + CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      console.log('Access Token:', accessToken); // Debug log
      res.redirect('/api/recently-played');
    } else {
      console.error('Failed to obtain access token', error, body); // Debug log
      res.send(`Failed to obtain access token: ${body.error_description || 'Unknown error'}`);
    }
  });
});

app.get('/recently-played', (req, res) => {
  if (accessToken) {
    const options = {
      url: 'https://api.spotify.com/v1/me/player/recently-played?limit=5',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Recently Played:', body); // Debug log
        res.json(body);
      } else {
        console.error('Failed to fetch recently played track', error, body); // Debug log
        res.json({ error: 'Failed to fetch recently played track.' });
      }
    });
  } else {
    console.error('Access token is missing or invalid'); // Debug log
    res.json({ error: 'Access token is missing or invalid.' });
  }
});

module.exports = app;
