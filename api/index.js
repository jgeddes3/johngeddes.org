const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');

const app = express();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USER;
const APIVERVE_API_KEY = process.env.APIVERVE_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

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

const handleRecentlyPlayed = (req, res) => {
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

    if (body && body.error) {
      console.error('Last.fm API error', body);
      res.status(500).json({
        error: body.message || 'Last.fm API returned an error.'
      });
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
};

app.get(['/recently-played', '/api/recently-played', '/recently'], handleRecentlyPlayed);

// ---- Drink Horoscope ----

const VALID_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const fetchHoroscope = async (sign) => {
  const res = await fetch(`https://api.apiverve.com/v1/horoscope?sign=${sign}`, {
    headers: { 'x-api-key': APIVERVE_API_KEY }
  });
  if (!res.ok) throw new Error(`APIVerve returned ${res.status}`);
  const json = await res.json();
  if (!json.data) throw new Error('No horoscope data returned');
  return json.data;
};

const askHaikuForCocktail = async (mood, horoscopeText) => {
  const snippet = (horoscopeText || '').slice(0, 200);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Horoscope mood: ${mood}. Horoscope: "${snippet}"\nReply with ONLY a JSON object: {"cocktail":"<cocktail name>","vibe":"<8 words max>"}`
      }]
    })
  });
  if (!res.ok) throw new Error(`Anthropic API returned ${res.status}`);
  const json = await res.json();
  const text = json.content && json.content[0] && json.content[0].text;
  return JSON.parse(text);
};

const fetchCocktail = async (name) => {
  const searchRes = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`);
  const searchJson = await searchRes.json();
  let drink = searchJson.drinks && searchJson.drinks[0];
  if (!drink) {
    const randomRes = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const randomJson = await randomRes.json();
    drink = randomJson.drinks && randomJson.drinks[0];
  }
  if (!drink) return null;
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ing = drink[`strIngredient${i}`];
    const meas = drink[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: (meas || '').trim() });
    }
  }
  return {
    name: drink.strDrink,
    image: drink.strDrinkThumb,
    instructions: drink.strInstructions,
    glass: drink.strGlass,
    ingredients
  };
};

app.get(['/horoscope', '/api/horoscope'], async (req, res) => {
  const sign = (req.query.sign || '').toLowerCase().trim();
  if (!VALID_SIGNS.includes(sign)) {
    return res.status(400).json({ error: `Invalid sign. Must be one of: ${VALID_SIGNS.join(', ')}` });
  }
  if (!APIVERVE_API_KEY) {
    return res.status(500).json({ error: 'APIVERVE_API_KEY not configured' });
  }

  try {
    // 1. Get horoscope
    const horoscopeData = await fetchHoroscope(sign);
    const horoscope = {
      text: horoscopeData.horoscope || '',
      mood: horoscopeData.mood || '',
      luckyNumber: horoscopeData.luckyNumber || horoscopeData.lucky_number || '',
      luckyTime: horoscopeData.luckyTime || horoscopeData.lucky_time || '',
      color: horoscopeData.color || '',
      compatibility: horoscopeData.compatibility || '',
      zodiac: sign
    };

    // 2. Ask Haiku for cocktail pairing
    let cocktailName = '';
    let flavorProfile = '';
    try {
      if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
      }
      const haikuResult = await askHaikuForCocktail(horoscope.mood, horoscope.text);
      cocktailName = haikuResult.cocktail || '';
      flavorProfile = haikuResult.vibe || '';
      console.log('Haiku picked:', cocktailName, '/', flavorProfile);
    } catch (err) {
      console.error('Haiku fallback:', err.message);
      flavorProfile = 'mysterious and unknowable';
    }

    // 3. Get cocktail details
    let cocktail = null;
    try {
      cocktail = await fetchCocktail(cocktailName || 'margarita');
    } catch (err) {
      console.error('CocktailDB fallback:', err.message);
    }

    res.json({ sign, horoscope, cocktail, flavorProfile });
  } catch (err) {
    console.error('Horoscope error:', err.message);
    res.status(500).json({ error: 'Failed to fetch horoscope. Please try again.' });
  }
});

module.exports = app;
