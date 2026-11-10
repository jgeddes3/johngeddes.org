const express = require('express');

const app = express();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USER;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Only the site itself and local dev may call the API from a browser. Cross-origin
// requests from other pages are rejected outright (not just denied CORS read access,
// which would still let hostile pages spend the paid upstream quotas). Requests
// without an Origin header (same-origin GETs, curl, crawlers) pass — the rate
// limiter below is the backstop for those.
const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?johngeddes\.org$/,
  /^http:\/\/localhost(:\d+)?$/
];

const isAllowedOrigin = (origin, req) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.some((pattern) => pattern.test(origin))) return true;
  // Vercel preview deployments serve the frontend and API from the same host,
  // so allow an origin that matches the host being requested (never a third party).
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin, req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (origin) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  next();
});

// Per-IP rate limiting (per warm function instance) — protects the paid
// Anthropic/Mapbox proxies. A generous default covers normal browsing (the
// WeatherApp alone can fire dozens of suggest/map calls a minute); the expensive
// endpoints add their own tighter scope below.
const RATE_WINDOW_MS = 60 * 1000;
const rateBuckets = new Map();

const sweepExpiredBuckets = (now) => {
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.start >= RATE_WINDOW_MS) rateBuckets.delete(key);
  }
  // Last-resort memory guard; only reachable if >20k IPs are active in one window.
  if (rateBuckets.size > 20000) rateBuckets.clear();
};

const rateLimit = (max, scope) => (req, res, next) => {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0].trim();
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start >= RATE_WINDOW_MS) {
    if (rateBuckets.size > 5000) sweepExpiredBuckets(now);
    rateBuckets.set(key, { start: now, count: 1 });
    return next();
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  next();
};

app.use(rateLimit(120, 'all'));

const buildRecentTracksUrl = () => {
  return 'https://ws.audioscrobbler.com/2.0/?' + new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: LASTFM_API_KEY,
    limit: '5',
    format: 'json'
  }).toString();
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
      playedAt: track && track.date && track.date.uts ? Number(track.date.uts) * 1000 : null,
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

const RECENT_TTL_MS = 60 * 1000;
let recentCache = { at: 0, data: null };
let recentPending = null; // concurrent cache misses share one upstream round-trip

const fetchRecentlyPlayed = async () => {
  const response = await fetch(buildRecentTracksUrl());
  if (!response.ok) {
    throw new Error(`Last.fm returned ${response.status}`);
  }
  const body = await response.json();
  if (body && body.error) {
    throw new Error(body.message || 'Last.fm API returned an error.');
  }
  const tracks = body && body.recenttracks && body.recenttracks.track
    ? body.recenttracks.track
    : [];
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return { items: [] };
  }
  return { items: normalizeTracks(tracks) };
};

// The footer mounts this widget on every route, so one visitor browsing five
// pages used to mean five function invocations and five Last.fm round-trips.
// A track is allowed to be a minute late: cache in-process and at the CDN.
const handleRecentlyPlayed = async (req, res) => {
  if (!LASTFM_API_KEY || !LASTFM_USER) {
    res.status(500).json({
      error: 'Last.fm credentials are missing. Set LASTFM_API_KEY and LASTFM_USER.'
    });
    return;
  }

  const sendFresh = (data) => {
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json(data);
  };

  if (recentCache.data && Date.now() - recentCache.at < RECENT_TTL_MS) {
    sendFresh(recentCache.data);
    return;
  }
  if (!recentPending) {
    recentPending = fetchRecentlyPlayed().finally(() => { recentPending = null; });
  }
  try {
    const data = await recentPending;
    recentCache = { at: Date.now(), data };
    sendFresh(data);
  } catch (err) {
    console.error('Failed to fetch recent tracks', err.message);
    if (recentCache.data) {
      // Upstream hiccup: a stale track beats an error in the footer.
      res.json(recentCache.data);
      return;
    }
    res.status(500).json({ error: 'Failed to fetch recent tracks.' });
  }
};

app.get(['/recently-played', '/api/recently-played', '/recently'], handleRecentlyPlayed);

// ---- Stock/News Ticker ----

const TICKER_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'SPY', 'TSLA'];
const TICKER_TTL_MS = 4 * 60 * 1000;
let tickerCache = { at: 0, data: null };
let tickerPending = null; // concurrent cache misses share one upstream round-trip

const buildTicker = async () => {
  // Each fetch tolerates its own failure — one bad quote must not kill the ticker.
  const [newsRes, ...quoteResults] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`).catch(() => null),
    ...TICKER_SYMBOLS.map((s) =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${FINNHUB_API_KEY}`).catch(() => null)
    )
  ]);
  const news = newsRes && newsRes.ok ? await newsRes.json().catch(() => null) : null;
  const quotes = await Promise.all(
    quoteResults.map((r) => (r && r.ok ? r.json().catch(() => null) : Promise.resolve(null)))
  );
  // Only real numbers leave the server — a failed quote is omitted, never a
  // placeholder the client could render as a fabricated "+0.00%".
  const quoteItems = TICKER_SYMBOLS
    .map((symbol, i) => ({ symbol, quote: quotes[i] }))
    .filter(({ quote }) => quote && typeof quote.c === 'number' && typeof quote.dp === 'number')
    .map(({ symbol, quote }) => ({ symbol, c: quote.c, dp: quote.dp }));
  const data = {
    news: (Array.isArray(news) ? news : []).slice(0, 15).map((n) => ({ headline: n.headline })),
    quotes: quoteItems
  };
  // Cache only complete responses; partial ones are served but retried next request.
  const complete = Array.isArray(news) && quoteItems.length === TICKER_SYMBOLS.length;
  return { data, complete };
};

app.get(['/ticker', '/api/ticker'], async (req, res) => {
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: 'Ticker is not configured.' });
  }
  if (tickerCache.data && Date.now() - tickerCache.at < TICKER_TTL_MS) {
    return res.json(tickerCache.data);
  }
  if (!tickerPending) {
    tickerPending = buildTicker().finally(() => { tickerPending = null; });
  }
  try {
    const { data, complete } = await tickerPending;
    if (complete) {
      tickerCache = { at: Date.now(), data };
    }
    res.json(data);
  } catch (err) {
    console.error('Ticker error:', err.message);
    res.status(500).json({ error: 'Failed to fetch ticker data.' });
  }
});

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

// Cache one pairing per sign per day — repeated requests must not each hit the
// Anthropic API. Only complete results are cached, so a transient upstream failure
// is retried on the next request instead of pinning a degraded pairing all day.
const horoscopeCache = new Map(); // `${sign}:${YYYY-MM-DD}` -> payload
const horoscopePending = new Map(); // same key -> in-flight promise (dedups concurrent misses)

// "Daily" should roll over at the audience's midnight, not UTC's mid-evening.
const horoscopeDateKey = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());

const buildHoroscope = async (sign) => {
  let complete = true;

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
    complete = false;
  }

  // 3. Get cocktail details
  const FALLBACK_COCKTAILS = [
    'zombie', 'mojito', 'mai tai', 'cosmopolitan', 'negroni', 'paloma',
    'pisco sour', 'aperol spritz', 'dark and stormy', 'french 75',
    'old fashioned', 'margarita', 'manhattan', 'sidecar', 'daiquiri',
    'espresso martini', 'whiskey sour', 'tom collins', 'gimlet', 'penicillin',
    'boulevardier', 'aviation', 'bee\'s knees', 'pornstar martini', 'spritz',
    'tequila sunrise', 'pina colada', 'rum runner', 'rusty nail', 'stinger',
    'old pal', 'new york sour', 'planter\'s punch', 'sangria', 'salty dog',
    'singapore sling', 'screwdriver', 'sea breeze', 'white russian', 'rum punch',
    'pegu club', 'pink lady', 'the last word', 'ramos gin fizz'
  ];
  let cocktail = null;
  try {
    let pickName = cocktailName || FALLBACK_COCKTAILS[Math.floor(Math.random() * FALLBACK_COCKTAILS.length)];
    // If zombie was picked, 1-in-10 chance to keep it — otherwise re-roll
    if (pickName.toLowerCase() === 'zombie' && Math.random() > 0.1) {
      const nonZombie = FALLBACK_COCKTAILS.filter(c => c !== 'zombie');
      pickName = nonZombie[Math.floor(Math.random() * nonZombie.length)];
      console.log('Zombie re-rolled to:', pickName);
    }
    cocktail = await fetchCocktail(pickName);
  } catch (err) {
    console.error('CocktailDB fallback:', err.message);
  }
  if (!cocktail) {
    complete = false;
  }

  return { payload: { sign, horoscope, cocktail, flavorProfile }, complete };
};

app.get(['/horoscope', '/api/horoscope'], rateLimit(10, 'horoscope'), async (req, res) => {
  const sign = (req.query.sign || '').toLowerCase().trim();
  if (!VALID_SIGNS.includes(sign)) {
    return res.status(400).json({ error: `Invalid sign. Must be one of: ${VALID_SIGNS.join(', ')}` });
  }
  const today = horoscopeDateKey();
  const cacheKey = `${sign}:${today}`;
  const cached = horoscopeCache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  let job = horoscopePending.get(cacheKey);
  if (!job) {
    job = buildHoroscope(sign).finally(() => horoscopePending.delete(cacheKey));
    horoscopePending.set(cacheKey, job);
  }
  try {
    const { payload, complete } = await job;
    if (complete && !horoscopeCache.has(cacheKey)) {
      // Evict only stale-dated entries — never today's fresh ones.
      for (const key of horoscopeCache.keys()) {
        if (!key.endsWith(today)) horoscopeCache.delete(key);
      }
      horoscopeCache.set(cacheKey, payload);
    }
    res.json(payload);
  } catch (err) {
    console.error('Horoscope error:', err.message);
    res.status(500).json({ error: 'Failed to fetch horoscope. Please try again.' });
  }
});

// ---- Route Weather ----
//
// A drive is sampled at a fixed cadence (15 to 60 minutes, depending on
// length) along the route geometry using the per-segment durations Mapbox
// returns, so each sample is where the car actually is at that minute. The
// old approach walked turn-by-turn steps and reported the step's starting
// point with the time at its end, which put "Des Plaines" three hours into a
// Chicago departure. One Open-Meteo call then returns the hour-matched
// forecast for every sample of a route. Times stay UTC on the server; each
// sample carries its IANA zone so the page can print the local clock time.

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const MAX_ROUTES = 3;
const MAX_SAMPLES = 24;
const LABELLED_SAMPLES = 8;
const FORECAST_HORIZON_DAYS = 15;
const WINDOW_PAD_MS = 14 * 3600 * 1000; // covers any zone offset when the hourly window is local time
const HOUR_MS = 3600 * 1000;
const DAY_MS = 24 * HOUR_MS;

const pad2 = (n) => String(n).padStart(2, '0');
const round5 = (n) => Math.round(n * 1e5) / 1e5;
const roundOrNull = (v) => (v == null ? null : Math.round(v));

// WMO weather codes grouped into the categories the page colours by. The
// client holds the labels and colours; this is the single source of grouping.
const weatherCategory = (code) => {
  if (code == null) return 'unknown';
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code === 51 || code === 53 || code === 80) return 'drizzle';
  if (code === 55 || code === 61 || code === 63 || code === 81) return 'rain';
  if (code === 65 || code === 82) return 'heavy';
  if (code === 56 || code === 57 || code === 66 || code === 67) return 'freezing';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'unknown';
};

const CATEGORY_SEVERITY = {
  unknown: 0, clear: 0, partly: 0, cloud: 0, fog: 2, drizzle: 2, rain: 3, heavy: 4, snow: 4, freezing: 5, storm: 5
};

// ---- Time zones. Node's Intl has full ICU, so wall-clock conversions use the
// IANA zone Open-Meteo reports for a point rather than the browser's offset.

const zoneParts = (ms, zone) => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
  const parts = {};
  for (const p of fmt.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return {
    y: Number(parts.year), mo: Number(parts.month), d: Number(parts.day),
    h: Number(parts.hour) % 24, mi: Number(parts.minute)
  };
};

const isValidZone = (zone) => {
  try { new Intl.DateTimeFormat('en-US', { timeZone: zone }); return true; } catch { return false; }
};

// Offset (ms) of `zone` from UTC at the instant `ms`.
const zoneOffsetMs = (ms, zone) => {
  const p = zoneParts(ms, zone);
  const minute = ms - (ms % 60000);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - minute;
};

// Wall-clock parts (expressed as a Date.UTC value) in `zone` to a UTC instant.
// The second pass settles times that sit on a daylight-saving boundary.
const localToUtcMs = (naiveMs, zone) => {
  const guess = naiveMs - zoneOffsetMs(naiveMs, zone);
  return naiveMs - zoneOffsetMs(guess, zone);
};

const localHourKey = (ms, zone) => {
  const p = zoneParts(ms, zone);
  return `${p.y}-${pad2(p.mo)}-${pad2(p.d)}T${pad2(p.h)}:00`;
};

const naiveUtcHour = (ms) => new Date(ms).toISOString().slice(0, 13) + ':00';
const naiveUtcDate = (ms) => new Date(ms).toISOString().slice(0, 10);

// ---- Mapbox

const shortPlaceName = (feature, fallback) => {
  const props = feature.properties || {};
  const ctx = props.context || {};
  const place = (ctx.place && ctx.place.name) || (ctx.locality && ctx.locality.name) || props.name;
  const regionCode = ctx.region && (ctx.region.region_code || ctx.region.name);
  if (place && regionCode) return `${place}, ${regionCode}`;
  return place || props.name || fallback;
};

const geocodeLocation = async (query) => {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox geocode returned ${res.status}`);
  const json = await res.json();
  if (!json.features || json.features.length === 0) return null;
  const feature = json.features[0];
  const [lon, lat] = feature.geometry.coordinates;
  const name = feature.properties.full_address || feature.properties.name || query;
  return { lat, lon, name, short: shortPlaceName(feature, name) };
};

const reverseGeocode = async (lat, lon) => {
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lon}&latitude=${lat}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&types=place,locality,neighborhood`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.features || json.features.length === 0) return null;
    const feature = json.features[0];
    const city = feature.properties.name;
    const region = feature.properties.context && feature.properties.context.region;
    const stateCode = region && (region.region_code_full || region.region_code || region.name);
    // "City, ST": region_code_full arrives as "US-MN".
    const abbr = stateCode ? stateCode.replace(/^[A-Z]{2}-/, '') : null;
    if (city && abbr) return `${city}, ${abbr}`;
    return city || feature.properties.full_address || null;
  } catch {
    return null;
  }
};

// Up to three routes, each with cumulative time and distance per geometry
// coordinate so a position can be read off at any elapsed second.
const getRoutes = async (start, end) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lon},${start.lat};${end.lon},${end.lat}?access_token=${MAPBOX_ACCESS_TOKEN}&alternatives=true&overview=full&geometries=geojson&annotations=duration,distance`;
  const res = await fetch(url);
  const json = await res.json().catch(() => null);
  // Mapbox answers an undrivable pair with NoRoute or NoSegment, sometimes on
  // a 4xx status; both mean the same thing to the reader.
  if (json && /^No(Route|Segment)$/.test(json.code || '')) throw new Error('No route found');
  if (!res.ok || !json) throw new Error(`Mapbox directions returned ${res.status}`);
  if (!json.routes || json.routes.length === 0) throw new Error('No route found');
  return json.routes.slice(0, MAX_ROUTES).map((route) => {
    const coords = route.geometry.coordinates;
    const segDurations = route.legs.flatMap((leg) => (leg.annotation && leg.annotation.duration) || []);
    const segDistances = route.legs.flatMap((leg) => (leg.annotation && leg.annotation.distance) || []);
    const times = [0];
    const dists = [0];
    for (let i = 0; i < coords.length - 1; i++) {
      times.push(times[i] + (segDurations[i] || 0));
      dists.push(dists[i] + (segDistances[i] || 0));
    }
    // Annotation sums drift a little from the headline figures; scale so the
    // last coordinate lands exactly on arrival.
    const tLast = times[times.length - 1];
    const dLast = dists[dists.length - 1];
    const tScale = tLast > 0 ? route.duration / tLast : 1;
    const dScale = dLast > 0 ? route.distance / dLast : 1;
    return {
      duration: route.duration,
      distance: route.distance,
      coords,
      times: times.map((t) => t * tScale),
      dists: dists.map((d) => d * dScale),
      bbox: bboxOf(coords),
      summary: route.legs.map((leg) => leg.summary).filter(Boolean).join(', ') || null
    };
  });
};

const bboxOf = (coords) => {
  const box = { west: Infinity, south: Infinity, east: -Infinity, north: -Infinity };
  for (const [lon, lat] of coords) {
    if (lon < box.west) box.west = lon;
    if (lon > box.east) box.east = lon;
    if (lat < box.south) box.south = lat;
    if (lat > box.north) box.north = lat;
  }
  return box;
};

const unionBbox = (boxes) => ({
  west: Math.min(...boxes.map((b) => b.west)),
  south: Math.min(...boxes.map((b) => b.south)),
  east: Math.max(...boxes.map((b) => b.east)),
  north: Math.max(...boxes.map((b) => b.north))
});

// A thinned copy of the geometry with elapsed seconds, so the page can put a
// dot on the road at any minute of the playback without the full polyline.
const TRACK_POINTS = 160;
const routeTrack = (route) => {
  const n = route.coords.length;
  const step = Math.max(1, (n - 1) / (TRACK_POINTS - 1));
  const out = [];
  for (let k = 0; k < TRACK_POINTS; k++) {
    const i = Math.min(n - 1, Math.round(k * step));
    const [lon, lat] = route.coords[i];
    out.push([round5(lon), round5(lat), Math.round(route.times[i])]);
    if (i === n - 1) break;
  }
  return out;
};

// Largest index whose cumulative time is at or before `t`.
const indexAtTime = (times, t) => {
  let lo = 0;
  let hi = times.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (times[mid] <= t) lo = mid; else hi = mid - 1;
  }
  return lo;
};

const pointAtTime = (route, t) => {
  const last = route.coords.length - 1;
  const i = indexAtTime(route.times, t);
  if (i >= last) {
    return { lon: route.coords[last][0], lat: route.coords[last][1], distance: route.distance, index: last };
  }
  const span = route.times[i + 1] - route.times[i];
  const f = span > 0 ? Math.min(1, Math.max(0, (t - route.times[i]) / span)) : 0;
  const [lon0, lat0] = route.coords[i];
  const [lon1, lat1] = route.coords[i + 1];
  return {
    lon: lon0 + (lon1 - lon0) * f,
    lat: lat0 + (lat1 - lat0) * f,
    distance: route.dists[i] + (route.dists[i + 1] - route.dists[i]) * f,
    index: i
  };
};

// 15-minute steps for short drives, widening so a long one stays under
// MAX_SAMPLES points. Always includes departure and arrival.
const sampleStep = (duration) => Math.max(900, Math.ceil(duration / MAX_SAMPLES / 900) * 900);

const sampleRoute = (route, departureMs) => {
  const step = sampleStep(route.duration);
  const elapsed = [];
  for (let t = 0; t < route.duration - step / 3; t += step) elapsed.push(t);
  elapsed.push(route.duration);
  return elapsed.map((t) => {
    const p = pointAtTime(route, t);
    return {
      elapsed: Math.round(t),
      eta: new Date(departureMs + t * 1000).toISOString(),
      lat: round5(p.lat),
      lon: round5(p.lon),
      distance: Math.round(p.distance),
      geomIndex: p.index
    };
  });
};

// ---- Open-Meteo

const HOURLY_VARS = 'temperature_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m,snowfall,is_day';
const ARCHIVE_VARS = 'temperature_2m,precipitation,weather_code,wind_speed_10m,snowfall';
const OM_UNITS = 'temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch';

const lookupZone = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&forecast_days=1&daily=weather_code`;
    const res = await fetch(url);
    if (!res.ok) return 'UTC';
    const json = await res.json();
    return json.timezone && isValidZone(json.timezone) ? json.timezone : 'UTC';
  } catch {
    return 'UTC';
  }
};

const fetchOpenMeteo = async (url) => {
  const res = await fetch(url);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.error) {
    throw new Error((json && json.reason) || `Open-Meteo returned ${res.status}`);
  }
  return Array.isArray(json) ? json : [json];
};

// Hour-matched weather for every sample in one request. Beyond the forecast
// horizon it reads the same dates last year from the archive and flags it.
const fetchSampleWeather = async (samples, nowMs) => {
  if (samples.length === 0) return [];
  const firstMs = Date.parse(samples[0].eta);
  const lastMs = Date.parse(samples[samples.length - 1].eta);
  const historical = (lastMs - nowMs) / DAY_MS > FORECAST_HORIZON_DAYS;
  const lat = samples.map((s) => s.lat).join(',');
  const lon = samples.map((s) => s.lon).join(',');
  const yearBack = (ms) => { const d = new Date(ms); d.setUTCFullYear(d.getUTCFullYear() - 1); return d.getTime(); };

  let locations;
  try {
    if (historical) {
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${naiveUtcDate(yearBack(firstMs) - WINDOW_PAD_MS)}&end_date=${naiveUtcDate(yearBack(lastMs) + WINDOW_PAD_MS)}&hourly=${ARCHIVE_VARS}&${OM_UNITS}&timezone=auto`;
      locations = await fetchOpenMeteo(url);
    } else {
      // The hourly window is in each point's local time, so pad it by the
      // widest zone offset. Clamped to what the forecast API will serve.
      const windowStart = Math.max(firstMs - WINDOW_PAD_MS, nowMs - 12 * HOUR_MS);
      const windowEnd = Math.min(lastMs + WINDOW_PAD_MS, nowMs + 16 * DAY_MS - 2 * HOUR_MS);
      const base = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${HOURLY_VARS}&${OM_UNITS}&timezone=auto`;
      try {
        locations = await fetchOpenMeteo(`${base}&start_hour=${naiveUtcHour(windowStart)}&end_hour=${naiveUtcHour(windowEnd)}`);
      } catch (err) {
        console.error('Open-Meteo window rejected, retrying full range:', err.message);
        locations = await fetchOpenMeteo(`${base}&forecast_days=16`);
      }
    }
  } catch (err) {
    console.error('Open-Meteo route weather error:', err.message);
    return samples.map(() => null);
  }

  return samples.map((sample, i) => {
    const loc = locations[i];
    if (!loc || !loc.hourly || !Array.isArray(loc.hourly.time)) return null;
    const zone = loc.timezone && isValidZone(loc.timezone) ? loc.timezone : 'UTC';
    let etaMs = Date.parse(sample.eta);
    if (historical) etaMs = yearBack(etaMs);
    const nearestHour = Math.round(etaMs / HOUR_MS) * HOUR_MS;
    const idx = loc.hourly.time.indexOf(localHourKey(nearestHour, zone));
    if (idx === -1) return { zone, weather: null };
    const h = loc.hourly;
    const pick = (arr) => (Array.isArray(arr) && arr[idx] != null ? arr[idx] : null);
    const code = pick(h.weather_code);
    return {
      zone,
      weather: {
        temp: roundOrNull(pick(h.temperature_2m)),
        precipitation: pick(h.precipitation),
        precipProbability: pick(h.precipitation_probability),
        snowfall: pick(h.snowfall),
        weatherCode: code,
        category: weatherCategory(code),
        windSpeed: roundOrNull(pick(h.wind_speed_10m)),
        isDay: h.is_day ? pick(h.is_day) === 1 : null,
        isHistorical: historical
      }
    };
  });
};

const getHistoricalDaily = async (lat, lon, dates) => {
  // Last year's figures for the same dates, as an estimate.
  if (dates.length === 0) return [];
  const shift = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    d.setUTCFullYear(d.getUTCFullYear() - 1);
    return d.toISOString().slice(0, 10);
  };
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${shift(dates[0])}&end_date=${shift(dates[dates.length - 1])}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max&${OM_UNITS}&timezone=auto`;
  try {
    const res = await fetch(url);
    if (!res.ok) return dates.map((d) => ({ date: d, weather: null }));
    const json = await res.json();
    if (!json.daily || !json.daily.time) return dates.map((d) => ({ date: d, weather: null }));
    return dates.map((date, i) => {
      const idx = i < json.daily.time.length ? i : json.daily.time.length - 1;
      const code = json.daily.weather_code ? json.daily.weather_code[idx] : null;
      return {
        date,
        weather: {
          tempHigh: roundOrNull(json.daily.temperature_2m_max[idx]),
          tempLow: roundOrNull(json.daily.temperature_2m_min[idx]),
          precipitation: json.daily.precipitation_sum[idx],
          precipProbability: null,
          weatherCode: code,
          category: weatherCategory(code),
          windSpeed: json.daily.wind_speed_10m_max ? roundOrNull(json.daily.wind_speed_10m_max[idx]) : null,
          isHistorical: true
        }
      };
    });
  } catch (err) {
    console.error('Historical daily error:', err.message);
    return dates.map((d) => ({ date: d, weather: null }));
  }
};

const getOpenMeteoDailyForecast = async (lat, lon, startDate, numDays) => {
  const allDates = [];
  const start = new Date(startDate + 'T12:00:00Z');
  for (let i = 0; i < numDays; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    allDates.push(d.toISOString().slice(0, 10));
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max&${OM_UNITS}&timezone=auto&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) return await getHistoricalDaily(lat, lon, allDates);
    const json = await res.json();
    if (!json.daily || !json.daily.time) return await getHistoricalDaily(lat, lon, allDates);

    const forecastDays = [];
    const historicalDates = [];
    for (const date of allDates) {
      const idx = json.daily.time.indexOf(date);
      if (idx !== -1) {
        const code = json.daily.weather_code[idx];
        forecastDays.push({
          date,
          weather: {
            tempHigh: roundOrNull(json.daily.temperature_2m_max[idx]),
            tempLow: roundOrNull(json.daily.temperature_2m_min[idx]),
            precipitation: json.daily.precipitation_sum[idx],
            precipProbability: json.daily.precipitation_probability_max ? json.daily.precipitation_probability_max[idx] : null,
            weatherCode: code,
            category: weatherCategory(code),
            windSpeed: roundOrNull(json.daily.wind_speed_10m_max[idx]),
            isHistorical: false
          }
        });
      } else {
        historicalDates.push(date);
      }
    }

    const historicalDays = await getHistoricalDaily(lat, lon, historicalDates);
    const allDays = [...forecastDays, ...historicalDays];
    allDays.sort((a, b) => a.date.localeCompare(b.date));
    return allDays;
  } catch (err) {
    console.error('Open-Meteo daily forecast error:', err.message);
    return null;
  }
};

// ---- Forecast grid: hourly precipitation on a grid of points covering the
// routes, for the hours of the drive, so the page can play the forecast
// across the map while the dot moves. One multi-location call; GMT times so
// no local-time padding is needed.

const GRID_TARGET = 96;

// The lat/lon rectangle a map view shows, so the grid covers the whole image
// rather than just the route's own bounding box.
const viewBounds = (view) => {
  const scale = 512 * Math.pow(2, view.zoom);
  const halfLon = ((view.width / 2) / scale) * 360;
  const halfMerc = ((view.height / 2) / scale) * 2 * Math.PI;
  const unmercLat = (m) => ((2 * Math.atan(Math.exp(m)) - Math.PI / 2) * 180) / Math.PI;
  return {
    west: view.lon - halfLon,
    east: view.lon + halfLon,
    south: Math.max(-85, unmercLat(mercY(view.lat) - halfMerc)),
    north: Math.min(85, unmercLat(mercY(view.lat) + halfMerc))
  };
};

const buildGrid = (bounds) => {
  const lonSpan = bounds.east - bounds.west;
  const latSpan = bounds.north - bounds.south;
  const midLat = ((bounds.north + bounds.south) / 2) * (Math.PI / 180);
  const aspect = (lonSpan * Math.cos(midLat)) / latSpan;
  let cols = Math.min(24, Math.max(4, Math.round(Math.sqrt(GRID_TARGET * aspect))));
  let rows = Math.min(24, Math.max(4, Math.round(GRID_TARGET / cols)));
  while (cols * rows > 120) { if (cols >= rows) cols--; else rows--; }
  const points = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({
        lat: round5(bounds.south + ((r + 0.5) * latSpan) / rows),
        lon: round5(bounds.west + ((c + 0.5) * lonSpan) / cols)
      });
    }
  }
  return { bounds, cols, rows, points };
};

const fetchForecastGrid = async (bounds, startMs, endMs, nowMs) => {
  if ((endMs - nowMs) / DAY_MS > FORECAST_HORIZON_DAYS) return null;
  const grid = buildGrid(bounds);
  const windowStart = Math.max(Math.floor(startMs / HOUR_MS) * HOUR_MS - HOUR_MS, nowMs - 12 * HOUR_MS);
  const windowEnd = Math.min(Math.ceil(endMs / HOUR_MS) * HOUR_MS + HOUR_MS, nowMs + 16 * DAY_MS - 2 * HOUR_MS);
  if (windowEnd <= windowStart) return null;
  const lat = grid.points.map((p) => p.lat).join(',');
  const lon = grid.points.map((p) => p.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation,snowfall&precipitation_unit=inch&timezone=GMT&start_hour=${naiveUtcHour(windowStart)}&end_hour=${naiveUtcHour(windowEnd)}`;
  try {
    const locations = await fetchOpenMeteo(url);
    const first = locations[0];
    if (!first || !first.hourly || !Array.isArray(first.hourly.time)) return null;
    const times = first.hourly.time.map((t) => `${t}:00Z`);
    const layer = (key) => times.map((_, t) =>
      locations.map((loc) => {
        const v = loc && loc.hourly && loc.hourly[key] ? loc.hourly[key][t] : null;
        return v == null ? 0 : Math.round(v * 1000) / 1000;
      })
    );
    return {
      bounds: grid.bounds,
      cols: grid.cols,
      rows: grid.rows,
      times,
      precipitation: layer('precipitation'),
      snowfall: layer('snowfall')
    };
  } catch (err) {
    console.error('Open-Meteo grid error:', err.message);
    return null;
  }
};

// ---- Labels: a handful of samples per route get a town name. Departure and
// arrival already have one from the forward geocode.

const labelIndices = (count) => {
  const set = new Set();
  for (let k = 1; k <= LABELLED_SAMPLES; k++) {
    const idx = Math.round((k * (count - 1)) / (LABELLED_SAMPLES + 1));
    if (idx > 0 && idx < count - 1) set.add(idx);
  }
  return [...set];
};

const labelSamples = async (samples, start, end) => {
  const labels = samples.map(() => null);
  if (samples.length === 0) return labels;
  labels[0] = start.short;
  labels[samples.length - 1] = end.short;
  const indices = labelIndices(samples.length);
  const names = await Promise.all(indices.map((i) => reverseGeocode(samples[i].lat, samples[i].lon)));
  indices.forEach((i, k) => { labels[i] = names[k]; });
  return labels;
};

// ---- Static map, coloured by the weather on each stretch.

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
  // Polyline wants [lat, lon]; input is [lon, lat].
  let out = enc(coordinates[0][1], 0) + enc(coordinates[0][0], 0);
  for (let i = 1; i < coordinates.length; i++) {
    out += enc(coordinates[i][1], coordinates[i - 1][1]);
    out += enc(coordinates[i][0], coordinates[i - 1][0]);
  }
  return out;
};

// Six-digit hex, no hash, as the Static Images API wants. Dry stretches take
// a warm neutral that reads as "road"; wet ones step through blues; frozen and
// stormy ones go violet so they stand apart from rain at a glance.
const MAP_COLORS = {
  dry: '8C7B6B',
  fog: '9AA0A6',
  drizzle: '6FA0CC',
  rain: '3E78B0',
  heavy: '244F84',
  snow: '7F93CF',
  freezing: '6E4FA3',
  storm: '3B2466'
};
const PIN_COLOR = 'A30000';
const MAP_PATH_BUDGET = 110;

const mapColorFor = (category) => MAP_COLORS[category] || MAP_COLORS.dry;

// The static image is requested at an explicit centre and zoom rather than
// auto-fit, so the page can place forecast cells and the moving dot on it
// with plain Web Mercator maths. Mapbox renders static images on 512px tiles.
const MAP_W = 900;
const MAP_H = 480;
const MAP_PAD = 0.09;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const computeView = (bbox) => {
  const lonSpan = Math.max(bbox.east - bbox.west, 0.02);
  const mSpan = Math.max(mercY(bbox.north) - mercY(bbox.south), 0.0003);
  const zoomX = Math.log2(((MAP_W * (1 - 2 * MAP_PAD)) / 512) * (360 / lonSpan));
  const zoomY = Math.log2(((MAP_H * (1 - 2 * MAP_PAD)) / 512) * ((2 * Math.PI) / mSpan));
  const zoom = Math.max(1, Math.min(zoomX, zoomY, 15));
  const midMerc = (mercY(bbox.north) + mercY(bbox.south)) / 2;
  const lat = ((2 * Math.atan(Math.exp(midMerc)) - Math.PI / 2) * 180) / Math.PI;
  return { lon: round5((bbox.west + bbox.east) / 2), lat: round5(lat), zoom: Math.round(zoom * 100) / 100, width: MAP_W, height: MAP_H };
};

const thinCoords = (coords, budget) => {
  if (coords.length <= budget) return coords;
  const out = [];
  const step = (coords.length - 1) / (budget - 1);
  for (let k = 0; k < budget; k++) out.push(coords[Math.round(k * step)]);
  return out;
};

const buildStaticMapUrl = (route, samples, weather, view) => {
  if (!MAPBOX_ACCESS_TOKEN || !route || samples.length < 2) return null;
  // One stretch per pair of samples, coloured by the worse of its two ends,
  // then adjacent stretches of the same colour merged into one path.
  const stretches = [];
  for (let i = 0; i < samples.length - 1; i++) {
    const a = weather[i] && weather[i].weather ? weather[i].weather.category : 'unknown';
    const b = weather[i + 1] && weather[i + 1].weather ? weather[i + 1].weather.category : 'unknown';
    const worse = CATEGORY_SEVERITY[a] >= CATEGORY_SEVERITY[b] ? a : b;
    const color = mapColorFor(worse);
    const from = samples[i];
    const to = samples[i + 1];
    const inner = route.coords.slice(from.geomIndex + 1, to.geomIndex + 1);
    const pts = [[from.lon, from.lat], ...inner, [to.lon, to.lat]];
    const prev = stretches[stretches.length - 1];
    if (prev && prev.color === color) prev.pts.push(...pts.slice(1));
    else stretches.push({ color, pts });
  }
  const totalPts = stretches.reduce((n, s) => n + s.pts.length, 0);
  const paths = stretches.map((s) => {
    const budget = Math.max(2, Math.round((s.pts.length / totalPts) * MAP_PATH_BUDGET));
    return `path-5+${s.color}-0.9(${encodeURIComponent(encodePolyline(thinCoords(s.pts, budget)))})`;
  });
  const first = samples[0];
  const last = samples[samples.length - 1];
  const pins = [
    `pin-s-a+${PIN_COLOR}(${first.lon.toFixed(4)},${first.lat.toFixed(4)})`,
    `pin-s-b+${PIN_COLOR}(${last.lon.toFixed(4)},${last.lat.toFixed(4)})`
  ];
  // Same-origin proxy URL; the Mapbox token never reaches the browser.
  return `/api/route-map?o=${encodeURIComponent([...paths, ...pins].join(','))}&v=${view.lon},${view.lat},${view.zoom}`;
};

// The o param must be exactly what buildStaticMapUrl produces: coloured path
// overlays then two pins. It is parsed structurally and the upstream overlay
// string is REBUILT from the parsed pieces, so nothing from the request is
// forwarded verbatim and double-encoded metacharacters cannot smuggle path or
// query segments into the token-bearing Mapbox URL.
const MAP_HEX = new Set([...Object.values(MAP_COLORS), PIN_COLOR]);
const OVERLAY_TOKEN = /(path-5\+([0-9A-F]{6})-0\.9\(([A-Za-z0-9%!*'~._-]+)\)|pin-s-([ab])\+([0-9A-F]{6})\((-?\d{1,3}\.\d{4}),(-?\d{1,3}\.\d{4})\))(?:,|$)/y;

const parseMapOverlays = (raw) => {
  if (raw.length > 8000) return null;
  const out = [];
  OVERLAY_TOKEN.lastIndex = 0;
  let pos = 0;
  while (pos < raw.length) {
    const m = OVERLAY_TOKEN.exec(raw);
    if (!m || m.index !== pos) return null;
    if (m[2]) {
      if (!MAP_HEX.has(m[2])) return null;
      let polyline;
      try { polyline = decodeURIComponent(m[3]); } catch { return null; }
      // Encoded polylines use only ASCII 63-126.
      if (!polyline || !/^[?-~]+$/.test(polyline)) return null;
      out.push(`path-5+${m[2]}-0.9(${encodeURIComponent(polyline)})`);
    } else {
      if (!MAP_HEX.has(m[5])) return null;
      const lon = Number(m[6]);
      const lat = Number(m[7]);
      if (Math.abs(lon) > 180 || Math.abs(lat) > 90) return null;
      out.push(`pin-s-${m[4]}+${m[5]}(${lon.toFixed(4)},${lat.toFixed(4)})`);
    }
    pos = OVERLAY_TOKEN.lastIndex;
    if (out.length > 40) return null;
  }
  return out.length > 0 ? out.join(',') : null;
};

// "lon,lat,zoom", rebuilt from parsed numbers like the overlays above.
const parseMapView = (raw) => {
  const m = /^(-?\d{1,3}(?:\.\d{1,5})?),(-?\d{1,2}(?:\.\d{1,5})?),(\d{1,2}(?:\.\d{1,2})?)$/.exec(raw);
  if (!m) return null;
  const lon = Number(m[1]);
  const lat = Number(m[2]);
  const zoom = Number(m[3]);
  if (Math.abs(lon) > 180 || Math.abs(lat) > 85 || zoom < 0 || zoom > 20) return null;
  return `${lon},${lat},${zoom}`;
};

app.get(['/route-map', '/api/route-map'], async (req, res) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Map is not configured.' });
  }
  const overlays = parseMapOverlays(String(req.query.o || ''));
  const view = parseMapView(String(req.query.v || ''));
  if (!overlays || !view) {
    return res.status(400).json({ error: 'Invalid map parameters.' });
  }
  try {
    const url = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${overlays}/${view}/${MAP_W}x${MAP_H}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      console.error('Mapbox static map error:', imgRes.status);
      return res.status(502).json({ error: 'Failed to load map image.' });
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    res.set('Content-Type', imgRes.headers.get('content-type') || 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (err) {
    console.error('Route map error:', err.message);
    res.status(502).json({ error: 'Failed to load map image.' });
  }
});

app.get(['/city-suggest', '/api/city-suggest'], async (req, res) => {
  const q = (req.query.q || '').trim();
  if (q.length < 2) return res.json([]);
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality`;
    const response = await fetch(url);
    if (!response.ok) return res.json([]);
    const json = await response.json();
    const suggestions = (json.features || []).map((f) => {
      const [lon, lat] = f.geometry.coordinates;
      return { name: f.properties.full_address || f.properties.name, lat, lon };
    });
    res.json(suggestions);
  } catch (err) {
    console.error('City suggest error:', err.message);
    res.json([]);
  }
});

// Rough block-to-block flight time from great-circle distance. Cruise is taken
// at 800 km/h, below a jet's true airspeed since the average over a whole
// sector includes climb and descent, plus a flat 45 minutes for taxi out,
// departure, approach and taxi in. Short hops are floored at 50 minutes
// because the fixed overhead dominates them. Always an estimate, never a
// schedule: callers surface it as such.
const estimateFlightSeconds = (from, to) => {
  const R = 6371; // km
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(to.lat - from.lat);
  const dLon = rad(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.sin(dLon / 2) ** 2;
  const km = 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  const seconds = (km / 800) * 3600 + 45 * 60;
  return Math.max(50 * 60, Math.round(seconds / 300) * 300); // nearest 5 min
};

const stripInternal = ({ geomIndex, ...sample }) => sample;

app.get(['/route-weather', '/api/route-weather'], rateLimit(10, 'route-weather'), async (req, res) => {
  const { startLocation, endLocation, departureDate, departureTime, stayDays, mode } = req.query;

  if (!startLocation || !endLocation || !departureDate || !departureTime) {
    return res.status(400).json({ error: 'Missing required parameters: startLocation, endLocation, departureDate, departureTime' });
  }
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(departureDate));
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(String(departureTime));
  if (!dateMatch || !timeMatch) {
    return res.status(400).json({ error: 'Departure date must be YYYY-MM-DD and time HH:MM.' });
  }

  const numStayDays = Math.min(Math.max(parseInt(stayDays, 10) || 1, 1), 14);
  const travelMode = mode === 'fly' ? 'fly' : 'drive';
  const nowMs = Date.now();

  try {
    const [start, end] = await Promise.all([geocodeLocation(startLocation), geocodeLocation(endLocation)]);
    if (!start) return res.status(400).json({ error: `Could not find location: ${startLocation}` });
    if (!end) return res.status(400).json({ error: `Could not find location: ${endLocation}` });

    // The departure time is wall-clock time at the starting point, whatever
    // zone the reader's browser is in.
    const startZone = await lookupZone(start.lat, start.lon);
    const naiveMs = Date.UTC(
      Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]),
      Number(timeMatch[1]), Number(timeMatch[2])
    );
    const departureMs = localToUtcMs(naiveMs, startZone);

    const response = {
      mode: travelMode,
      start,
      end,
      departure: new Date(departureMs).toISOString(),
      departureZone: startZone,
      routes: [],
      destination: { arrival: null, zone: null, stayDays: numStayDays, days: [] }
    };

    const assemble = (samples, weather, labels) => samples.map((s, i) => ({
      ...stripInternal(s),
      label: labels[i],
      zone: (weather[i] && weather[i].zone) || startZone,
      weather: weather[i] ? weather[i].weather : null
    }));

    if (travelMode === 'drive') {
      const routes = await getRoutes(start, end);
      const longest = Math.max(...routes.map((r) => r.duration));
      const [built, grid] = await Promise.all([
        Promise.all(routes.map(async (route, index) => {
          const samples = sampleRoute(route, departureMs);
          const view = computeView(route.bbox);
          const [weather, labels] = await Promise.all([
            fetchSampleWeather(samples, nowMs),
            labelSamples(samples, start, end)
          ]);
          return {
            index,
            summary: route.summary,
            duration: route.duration,
            distance: route.distance,
            estimated: false,
            arrival: new Date(departureMs + route.duration * 1000).toISOString(),
            samples: assemble(samples, weather, labels),
            track: routeTrack(route),
            view,
            mapUrl: buildStaticMapUrl(route, samples, weather, view)
          };
        })),
        fetchForecastGrid(unionBbox(routes.map((r) => viewBounds(computeView(r.bbox)))), departureMs, departureMs + longest * 1000, nowMs)
      ]);
      response.routes = built;
      response.forecastGrid = grid;
    } else {
      // No flight-times API behind this: the duration comes from great-circle
      // distance and is flagged so the page can say "about".
      const duration = estimateFlightSeconds(start, end);
      const samples = [
        { elapsed: 0, eta: new Date(departureMs).toISOString(), lat: start.lat, lon: start.lon, distance: 0 },
        { elapsed: duration, eta: new Date(departureMs + duration * 1000).toISOString(), lat: end.lat, lon: end.lon, distance: null }
      ];
      const weather = await fetchSampleWeather(samples, nowMs);
      response.routes = [{
        index: 0,
        summary: 'Flight',
        duration,
        distance: null,
        estimated: true,
        arrival: new Date(departureMs + duration * 1000).toISOString(),
        samples: assemble(samples, weather, [start.short, end.short]),
        mapUrl: null
      }];
    }

    const primary = response.routes[0];
    const arrivalMs = Date.parse(primary.arrival);
    const lastSample = primary.samples[primary.samples.length - 1];
    const destZone = (lastSample && lastSample.zone) || 'UTC';
    response.destination.arrival = primary.arrival;
    response.destination.zone = destZone;
    const arrivalDate = localHourKey(arrivalMs, destZone).slice(0, 10);
    response.destination.days = (await getOpenMeteoDailyForecast(end.lat, end.lon, arrivalDate, numStayDays)) || [];

    res.json(response);
  } catch (err) {
    console.error('Route weather error:', err.message);
    // 'No route found' is user-actionable (no drivable connection), so it is
    // kept; everything else stays generic so internals don't leak.
    if (err.message === 'No route found') {
      return res.status(400).json({ error: 'No driving route found between those locations.' });
    }
    res.status(500).json({ error: 'Failed to compute route weather. Please try again.' });
  }
});

// ---- Social page signals ----
// One cached call feeds the live tiles on /social. Each source fails on its
// own: a dead feed comes back null and the tile shows an empty state, rather
// than one outage blanking the whole board.

const SIGNALS_TTL_MS = 5 * 60 * 1000;
let signalsCache = { at: 0, data: null };
let signalsPending = null;
const CHESS_USER = 'shyne4life';
const GITHUB_USER = 'jgeddes3';
const CHICAGO = { lat: 41.8781, lon: -87.6298 };
const SITE_UA = { 'User-Agent': 'johngeddes.org (app@johngeddes.org)' };

// WMO weather codes as Open-Meteo reports them.
const WMO_TEXT = {
  0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail'
};

const fetchJson = async (url, headers = {}) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
};

const signalPlaying = async () => {
  if (!LASTFM_API_KEY || !LASTFM_USER) return null;
  const { items } = await fetchRecentlyPlayed();
  const item = items[0];
  if (!item) return null;
  return {
    track: item.track.name,
    artist: item.track.artists[0].name,
    url: item.track.external_urls.lastfm || `https://www.last.fm/user/${LASTFM_USER}`,
    nowPlaying: item.isNowPlaying,
    playedAt: item.playedAt
  };
};

const CHESS_DRAWS = new Set(['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient']);

const signalChess = async () => {
  const stats = await fetchJson(`https://api.chess.com/pub/player/${CHESS_USER}/stats`, SITE_UA);
  const modeKey = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'].find((m) => stats[m] && stats[m].last);
  if (!modeKey) return null;
  const mode = modeKey.replace('chess_', '');
  let last = null;
  try {
    const { archives } = await fetchJson(`https://api.chess.com/pub/player/${CHESS_USER}/games/archives`, SITE_UA);
    if (Array.isArray(archives) && archives.length) {
      const { games } = await fetchJson(archives[archives.length - 1], SITE_UA);
      const g = Array.isArray(games) && games[games.length - 1];
      if (g && g.white && g.black) {
        const iAmWhite = (g.white.username || '').toLowerCase() === CHESS_USER;
        const me = iAmWhite ? g.white : g.black;
        const opponent = iAmWhite ? g.black : g.white;
        const outcome = me.result === 'win' ? 'Won' : CHESS_DRAWS.has(me.result) ? 'Drew' : 'Lost';
        last = { outcome, opponent: opponent.username, endTime: g.end_time ? g.end_time * 1000 : null, url: g.url };
      }
    }
  } catch (err) {
    console.error('Chess.com archive lookup failed', err.message);
  }
  return {
    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
    rating: stats[modeKey].last.rating,
    record: stats[modeKey].record || null,
    last,
    url: `https://www.chess.com/member/${CHESS_USER}`
  };
};

const signalCommit = async () => {
  const events = await fetchJson(
    `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`,
    { ...SITE_UA, Accept: 'application/vnd.github+json' }
  );
  const push = Array.isArray(events)
    ? events.find((e) => e.type === 'PushEvent' && e.payload && Array.isArray(e.payload.commits) && e.payload.commits.length)
    : null;
  if (push) {
    const commit = push.payload.commits[push.payload.commits.length - 1];
    const repoFull = push.repo && push.repo.name ? push.repo.name : `${GITHUB_USER}/unknown`;
    return {
      repo: repoFull.split('/')[1],
      message: (commit.message || '').split('\n')[0],
      at: push.created_at,
      url: `https://github.com/${repoFull}/commit/${commit.sha}`
    };
  }
  // The events feed is empty when GitHub activity is set to private, so fall
  // back to the newest commit on the most recently pushed public repo.
  const repos = await fetchJson(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=1`,
    { ...SITE_UA, Accept: 'application/vnd.github+json' }
  );
  const repo = Array.isArray(repos) && repos[0];
  if (!repo) return null;
  const commits = await fetchJson(
    `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`,
    { ...SITE_UA, Accept: 'application/vnd.github+json' }
  );
  const c = Array.isArray(commits) && commits[0];
  if (!c) return null;
  return {
    repo: repo.name,
    message: ((c.commit && c.commit.message) || '').split('\n')[0],
    at: (c.commit && c.commit.author && c.commit.author.date) || repo.pushed_at,
    url: c.html_url || repo.html_url
  };
};

const signalWeather = async () => {
  const json = await fetchJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${CHICAGO.lat}&longitude=${CHICAGO.lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago`
  );
  const c = json.current;
  if (!c || typeof c.temperature_2m !== 'number') return null;
  return {
    temp: Math.round(c.temperature_2m),
    description: WMO_TEXT[c.weather_code] || 'Weather',
    wind: Math.round(c.wind_speed_10m || 0)
  };
};

const buildSignals = async () => {
  const settle = (name, promise) => promise.catch((err) => {
    console.error(`Signal "${name}" failed:`, err.message);
    return null;
  });
  const [playing, chess, commit, weather] = await Promise.all([
    settle('playing', signalPlaying()),
    settle('chess', signalChess()),
    settle('commit', signalCommit()),
    settle('weather', signalWeather())
  ]);
  return { playing, chess, commit, weather, at: new Date().toISOString() };
};

app.get(['/signals', '/api/signals'], async (req, res) => {
  const send = (data) => {
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.json(data);
  };
  if (signalsCache.data && Date.now() - signalsCache.at < SIGNALS_TTL_MS) {
    return send(signalsCache.data);
  }
  if (!signalsPending) {
    signalsPending = buildSignals().finally(() => { signalsPending = null; });
  }
  const data = await signalsPending;
  // Cache when at least one source answered; a total outage is retried next request.
  if (['playing', 'chess', 'commit', 'weather'].some((k) => data[k])) {
    signalsCache = { at: Date.now(), data };
  }
  send(data);
});

module.exports = app;
