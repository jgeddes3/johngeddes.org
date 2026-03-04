const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');

const app = express();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USER;
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
  const res = await fetch(`https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`);
  if (!res.ok) throw new Error(`Horoscope API returned ${res.status}`);
  const json = await res.json();
  if (!json.data || !json.data.horoscope) throw new Error('No horoscope data returned');
  return json.data.horoscope;
};

const askHaikuForPairing = async (sign, horoscopeText) => {
  const snippet = (horoscopeText || '').slice(0, 300);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      temperature: 1,
      messages: [{
        role: 'user',
        content: `You are a wildly creative cosmic bartender. Given this ${sign} horoscope, pick a surprising and unique cocktail and derive the horoscope's mood, lucky number, and color. NEVER pick Sazerac — be adventurous! Think tropical, tiki, obscure classics, modern craft cocktails, or timeless favorites.

Horoscope: "${snippet}"

Reply with ONLY a JSON object:
{"cocktail":"<cocktail name>","vibe":"<creative 8 words max>","mood":"<one or two words>","luckyNumber":"<number 1-99>","color":"<hex color code like #7B3FA0>"}`
      }]
    })
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API returned ${res.status}: ${errBody}`);
  }
  const json = await res.json();
  const text = (json.content && json.content[0] && json.content[0].text) || '';
  console.log('Haiku raw response:', text);
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned);
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
  try {
    // 1. Get horoscope text from free API
    const horoscopeText = await fetchHoroscope(sign);

    // 2. Ask Haiku for cocktail pairing + details
    let cocktailName = '';
    let flavorProfile = '';
    const horoscope = { text: horoscopeText, zodiac: sign };
    try {
      if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
      }
      const haikuResult = await askHaikuForPairing(sign, horoscopeText);
      cocktailName = haikuResult.cocktail || '';
      flavorProfile = haikuResult.vibe || '';
      horoscope.mood = haikuResult.mood || '';
      horoscope.luckyNumber = haikuResult.luckyNumber || '';
      horoscope.color = haikuResult.color || '';
      console.log('Haiku picked:', cocktailName, '/', flavorProfile);
    } catch (err) {
      console.error('Haiku fallback:', err.message);
      flavorProfile = 'mysterious and unknowable';
    }

    // 3. Get cocktail details
    const FALLBACK_COCKTAILS = ['zombie', 'mojito', 'mai tai', 'cosmopolitan', 'negroni', 'paloma', 'pisco sour', 'aperol spritz', 'dark and stormy', 'french 75'];
    let cocktail = null;
    try {
      cocktail = await fetchCocktail(cocktailName || FALLBACK_COCKTAILS[Math.floor(Math.random() * FALLBACK_COCKTAILS.length)]);
    } catch (err) {
      console.error('CocktailDB fallback:', err.message);
    }

    res.json({ sign, horoscope, cocktail, flavorProfile });
  } catch (err) {
    console.error('Horoscope error:', err.message);
    res.status(500).json({ error: 'Failed to fetch horoscope. Please try again.' });
  }
});

// ---- Route Weather ----

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

const geocodeLocation = async (query) => {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox geocode returned ${res.status}`);
  const json = await res.json();
  if (!json.features || json.features.length === 0) return null;
  const feature = json.features[0];
  const [lon, lat] = feature.geometry.coordinates;
  const name = feature.properties.full_address || feature.properties.name || query;
  return { lat, lon, name };
};

const getRoute = async (startCoords, endCoords) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?access_token=${MAPBOX_ACCESS_TOKEN}&overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox directions returned ${res.status}`);
  const json = await res.json();
  if (!json.routes || json.routes.length === 0) throw new Error('No route found');
  const route = json.routes[0];
  return {
    duration: route.duration,
    distance: route.distance,
    geometry: route.geometry,
    legs: route.legs
  };
};

const extractWaypoints = (route, departureDatetime) => {
  const waypoints = [];
  let accumulatedTime = 0;
  const INTERVAL = 3.5 * 3600; // 3.5 hours in seconds
  let nextThreshold = INTERVAL;

  const steps = route.legs[0].steps;
  for (const step of steps) {
    accumulatedTime += step.duration;
    if (accumulatedTime >= nextThreshold) {
      const endCoord = step.maneuver.location; // [lon, lat]
      const eta = new Date(departureDatetime.getTime() + accumulatedTime * 1000);
      waypoints.push({
        lat: endCoord[1],
        lon: endCoord[0],
        eta: eta.toISOString(),
        label: `Waypoint ${waypoints.length + 1}`
      });
      nextThreshold += INTERVAL;
    }
  }

  // Add final destination
  const lastStep = steps[steps.length - 1];
  const finalCoord = lastStep.maneuver.location;
  const arrivalEta = new Date(departureDatetime.getTime() + route.duration * 1000);
  waypoints.push({
    lat: finalCoord[1],
    lon: finalCoord[0],
    eta: arrivalEta.toISOString(),
    label: 'Destination'
  });

  return waypoints;
};

const getOpenMeteoWeather = async (lat, lon, datetime) => {
  const now = new Date();
  const diffDays = (datetime - now) / (1000 * 60 * 60 * 24);

  if (diffDays > 14) {
    return getHistoricalClimate(lat, lon, datetime);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=16`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const times = json.hourly.time;
    const targetISO = datetime.toISOString().slice(0, 13); // match to hour
    let idx = times.findIndex(t => t.startsWith(targetISO));
    if (idx === -1) {
      // Find closest hour
      const targetMs = datetime.getTime();
      let minDiff = Infinity;
      times.forEach((t, i) => {
        const diff = Math.abs(new Date(t).getTime() - targetMs);
        if (diff < minDiff) { minDiff = diff; idx = i; }
      });
    }
    if (idx === -1) return null;
    return {
      temp: Math.round(json.hourly.temperature_2m[idx]),
      precipitation: json.hourly.precipitation[idx],
      weatherCode: json.hourly.weather_code[idx],
      windSpeed: Math.round(json.hourly.wind_speed_10m[idx]),
      isHistorical: false
    };
  } catch (err) {
    console.error('Open-Meteo forecast error:', err.message);
    return null;
  }
};

const getHistoricalClimate = async (lat, lon, datetime) => {
  const lastYear = new Date(datetime);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const dateStr = lastYear.toISOString().slice(0, 10);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m,precipitation&temperature_unit=fahrenheit`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const times = json.hourly.time;
    const targetHour = datetime.getUTCHours();
    let idx = times.findIndex(t => new Date(t).getUTCHours() === targetHour);
    if (idx === -1) idx = 0;
    return {
      temp: Math.round(json.hourly.temperature_2m[idx]),
      precipitation: json.hourly.precipitation[idx],
      weatherCode: null,
      windSpeed: null,
      isHistorical: true
    };
  } catch (err) {
    console.error('Open-Meteo historical error:', err.message);
    return null;
  }
};

const getOpenMeteoDailyForecast = async (lat, lon, startDate, numDays) => {
  const now = new Date();
  const start = new Date(startDate + 'T12:00:00');
  const diffDays = (start - now) / (1000 * 60 * 60 * 24);

  try {
    if (diffDays > 14) {
      // Use historical archive from last year as estimate
      const lastYear = new Date(start);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const endDate = new Date(lastYear);
      endDate.setDate(endDate.getDate() + numDays - 1);
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${lastYear.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      if (!json.daily || !json.daily.time) return null;
      return json.daily.time.map((date, i) => {
        // Remap the date to the actual requested year
        const actualDate = new Date(start);
        actualDate.setDate(actualDate.getDate() + i);
        return {
          date: actualDate.toISOString().slice(0, 10),
          weather: {
            tempHigh: Math.round(json.daily.temperature_2m_max[i]),
            tempLow: Math.round(json.daily.temperature_2m_min[i]),
            precipitation: json.daily.precipitation_sum[i],
            weatherCode: null,
            windSpeed: null,
            isHistorical: true
          }
        };
      });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.daily || !json.daily.time) return null;

    // Find the index of the start date
    const startIdx = json.daily.time.indexOf(startDate);
    if (startIdx === -1) return null;

    const days = [];
    for (let i = 0; i < numDays && (startIdx + i) < json.daily.time.length; i++) {
      const idx = startIdx + i;
      days.push({
        date: json.daily.time[idx],
        weather: {
          tempHigh: Math.round(json.daily.temperature_2m_max[idx]),
          tempLow: Math.round(json.daily.temperature_2m_min[idx]),
          precipitation: json.daily.precipitation_sum[idx],
          weatherCode: json.daily.weather_code[idx],
          windSpeed: Math.round(json.daily.wind_speed_10m_max[idx]),
          isHistorical: false
        }
      });
    }
    return days;
  } catch (err) {
    console.error('Open-Meteo daily forecast error:', err.message);
    return null;
  }
};

const encodePolyline = (coordinates) => {
  if (!coordinates.length) return '';
  const factor = 1e5;
  const round = (v) => Math.floor(Math.abs(v) + 0.5) * (v >= 0 ? 1 : -1);
  const enc = (cur, prev) => {
    cur = round(cur * factor);
    prev = round(prev * factor);
    let coord = (cur - prev) * 2;
    if (coord < 0) coord = -coord - 1;
    let out = '';
    while (coord >= 0x20) {
      out += String.fromCharCode((0x20 | (coord & 0x1f)) + 63);
      coord = Math.floor(coord / 32);
    }
    out += String.fromCharCode(coord + 63);
    return out;
  };
  // Polyline expects [lat, lon] but input is [lon, lat]
  let out = enc(coordinates[0][1], 0) + enc(coordinates[0][0], 0);
  for (let i = 1; i < coordinates.length; i++) {
    out += enc(coordinates[i][1], coordinates[i - 1][1]);
    out += enc(coordinates[i][0], coordinates[i - 1][0]);
  }
  return out;
};

const buildStaticMapUrl = (routeGeometry, waypoints) => {
  if (!MAPBOX_ACCESS_TOKEN || !routeGeometry) return null;
  const coords = routeGeometry.coordinates;
  // Simplify to ~100 points to keep URL manageable
  const step = Math.max(1, Math.floor(coords.length / 100));
  const simplified = coords.filter((_, i) => i % step === 0 || i === coords.length - 1);
  const encoded = encodePolyline(simplified);
  const pathOverlay = `path-4+4882F5-0.6(${encodeURIComponent(encoded)})`;
  // Pin markers for waypoints
  const pins = waypoints.map(wp => `pin-s+FF6B35(${wp.lon.toFixed(4)},${wp.lat.toFixed(4)})`).join(',');
  const overlays = pins ? `${pathOverlay},${pins}` : pathOverlay;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${overlays}/auto/800x400@2x?access_token=${MAPBOX_ACCESS_TOKEN}&padding=50`;
};

app.get(['/city-suggest', '/api/city-suggest'], async (req, res) => {
  const q = (req.query.q || '').trim();
  if (q.length < 2) return res.json([]);
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality`;
    const response = await fetch(url);
    if (!response.ok) return res.json([]);
    const json = await response.json();
    const suggestions = (json.features || []).map(f => {
      const [lon, lat] = f.geometry.coordinates;
      return { name: f.properties.full_address || f.properties.name, lat, lon };
    });
    res.json(suggestions);
  } catch (err) {
    console.error('City suggest error:', err.message);
    res.json([]);
  }
});

app.get(['/route-weather', '/api/route-weather'], async (req, res) => {
  const { startLocation, endLocation, departureDate, departureTime, stayDays, mode } = req.query;

  if (!startLocation || !endLocation || !departureDate || !departureTime) {
    return res.status(400).json({ error: 'Missing required parameters: startLocation, endLocation, departureDate, departureTime' });
  }

  const numStayDays = parseInt(stayDays, 10) || 1;
  const travelMode = mode === 'fly' ? 'fly' : 'drive';

  try {
    // Geocode both locations
    const startCoords = await geocodeLocation(startLocation);
    if (!startCoords) return res.status(400).json({ error: `Could not find location: ${startLocation}` });

    const endCoords = await geocodeLocation(endLocation);
    if (!endCoords) return res.status(400).json({ error: `Could not find location: ${endLocation}` });

    const departureDatetime = new Date(`${departureDate}T${departureTime}:00`);

    const response = {
      start: startCoords,
      end: endCoords,
      mode: travelMode,
      departureTime: departureDatetime.toISOString(),
      totalDuration: null,
      totalDistance: null,
      waypoints: [],
      destination: {
        arrival: null,
        stayDays: numStayDays,
        days: []
      }
    };

    if (travelMode === 'drive') {
      const route = await getRoute(startCoords, endCoords);
      response.totalDuration = route.duration;
      response.totalDistance = route.distance;

      const waypoints = extractWaypoints(route, departureDatetime);

      // Fetch weather for each waypoint in parallel
      const waypointWeather = await Promise.all(
        waypoints.map(async (wp) => {
          const weather = await getOpenMeteoWeather(wp.lat, wp.lon, new Date(wp.eta));
          return { ...wp, weather };
        })
      );
      response.waypoints = waypointWeather;

      const arrivalTime = new Date(departureDatetime.getTime() + route.duration * 1000);
      response.destination.arrival = arrivalTime.toISOString();

      // Build static map URL
      response.mapUrl = buildStaticMapUrl(route.geometry, waypoints);
    } else {
      // Fly mode
      const flightDuration = 3 * 3600; // 3 hours placeholder
      response.totalDuration = flightDuration;

      // Get departure weather using Open-Meteo hourly
      const departureWeather = await getOpenMeteoWeather(startCoords.lat, startCoords.lon, departureDatetime);
      response.waypoints = [{
        label: `Departure: ${startCoords.name}`,
        lat: startCoords.lat,
        lon: startCoords.lon,
        eta: departureDatetime.toISOString(),
        weather: departureWeather
      }];

      const arrivalTime = new Date(departureDatetime.getTime() + flightDuration * 1000);
      response.destination.arrival = arrivalTime.toISOString();
    }

    // Get destination weather for each stay day using Open-Meteo daily forecast
    const arrivalDate = new Date(response.destination.arrival);
    const arrivalDateStr = arrivalDate.toISOString().slice(0, 10);
    const dailyForecast = await getOpenMeteoDailyForecast(endCoords.lat, endCoords.lon, arrivalDateStr, numStayDays);
    response.destination.days = dailyForecast || [];

    res.json(response);
  } catch (err) {
    console.error('Route weather error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to compute route weather.' });
  }
});

module.exports = app;
