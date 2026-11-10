import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import Glyph from './icons/Glyph';
import './ProjectTemplate.css';
import './WeatherApp.css';

// Weather categories as the API groups WMO codes. `severity` orders how bad a
// stretch is; `hazard` marks what gets called out as something to drive through.
const CATEGORIES = {
  clear: { label: 'Clear', glyph: 'wxSun', night: 'wxMoon', severity: 0, hazard: false },
  partly: { label: 'Partly cloudy', glyph: 'wxPartly', severity: 0, hazard: false },
  cloud: { label: 'Overcast', glyph: 'wxCloud', severity: 0, hazard: false },
  fog: { label: 'Fog', glyph: 'wxFog', severity: 2, hazard: true },
  drizzle: { label: 'Drizzle', glyph: 'wxDrizzle', severity: 2, hazard: true },
  rain: { label: 'Rain', glyph: 'wxRain', severity: 3, hazard: true },
  heavy: { label: 'Heavy rain', glyph: 'wxHeavyRain', severity: 4, hazard: true },
  snow: { label: 'Snow', glyph: 'wxSnow', severity: 4, hazard: true },
  freezing: { label: 'Freezing rain', glyph: 'wxSleet', severity: 5, hazard: true },
  storm: { label: 'Thunderstorms', glyph: 'wxStorm', severity: 5, hazard: true },
  unknown: { label: 'No forecast', glyph: 'wxCloud', severity: 0, hazard: false }
};

// Finer wording per WMO code for the hour-by-hour rows.
const WMO_TEXT = {
  0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  56: 'Light freezing drizzle', 57: 'Freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Light freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
};

const categoryOf = (weather) =>
  weather && CATEGORIES[weather.category] ? weather.category : 'unknown';

const glyphFor = (weather) => {
  const cat = CATEGORIES[categoryOf(weather)];
  return weather && weather.isDay === false && cat.night ? cat.night : cat.glyph;
};

const describe = (weather) => {
  if (!weather) return 'No forecast';
  return WMO_TEXT[weather.weatherCode] || CATEGORIES[categoryOf(weather)].label;
};

const worseOf = (a, b) => (CATEGORIES[a].severity >= CATEGORIES[b].severity ? a : b);

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
};

const formatMiles = (meters) => `${Math.round(meters / 1609.34)} mi`;

const formatInches = (inches) => (inches >= 0.1 ? `${inches.toFixed(1)} in` : `${inches.toFixed(2)} in`);

// Every time on the page is printed in the zone of the place it refers to,
// which the API supplies per point. An unknown zone falls back to the browser's.
const withZone = (zone, options) => {
  try {
    if (zone) new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return { ...options, timeZone: zone || undefined };
  } catch {
    return options;
  }
};

const formatClock = (iso, zone) =>
  new Date(iso).toLocaleTimeString('en-US', withZone(zone, { hour: 'numeric', minute: '2-digit' }));

const formatZone = (iso, zone) => {
  const parts = new Intl.DateTimeFormat('en-US', withZone(zone, { timeZoneName: 'short' })).formatToParts(new Date(iso));
  const z = parts.find((p) => p.type === 'timeZoneName');
  return z ? z.value : '';
};

const formatDayTime = (iso, zone) => {
  const day = new Date(iso).toLocaleDateString('en-US', withZone(zone, { weekday: 'short', month: 'short', day: 'numeric' }));
  return `${day} at ${formatClock(iso, zone)} ${formatZone(iso, zone)}`;
};

const formatDate = (dateStr) =>
  new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

// Local calendar date, not UTC, so "today" stays pickable through the evening
// for anyone west of Greenwich.
const toDateStr = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const stepLabel = (samples) => {
  if (samples.length < 2) return 'point';
  const step = samples[1].elapsed - samples[0].elapsed;
  if (step <= 900) return 'quarter hour';
  if (step <= 1800) return 'half hour';
  if (step <= 3600) return 'hour';
  return `${Math.round(step / 3600)} hours`;
};

// The nearest sample with a town name. Only a handful are named per route, so
// most stretches say "near" somewhere a few miles off.
const nearestLabel = (samples, i) => {
  if (samples[i].label) return { name: samples[i].label, exact: true };
  for (let d = 1; d < samples.length; d++) {
    const before = samples[i - d];
    const after = samples[i + d];
    if (before && before.label) return { name: before.label, exact: false };
    if (after && after.label) return { name: after.label, exact: false };
  }
  return null;
};

// Consecutive samples of the same kind of weather. Dry kinds (clear, partly
// cloudy, overcast) merge into one so the list reads as stretches of dry road
// and stretches of something to drive through.
const windowsFor = (route) => {
  const { samples, duration } = route;
  const kindOf = (s) => {
    const c = categoryOf(s.weather);
    if (c === 'unknown') return 'unknown';
    return CATEGORIES[c].hazard ? c : 'dry';
  };
  const runs = [];
  samples.forEach((s, i) => {
    const kind = kindOf(s);
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.end = i;
    else runs.push({ kind, start: i, end: i });
  });
  return runs.map((run) => {
    const span = samples.slice(run.start, run.end + 1);
    const from = samples[run.start];
    const hasNext = run.end + 1 < samples.length;
    const to = hasNext ? samples[run.end + 1] : samples[run.end];
    const endElapsed = hasNext ? to.elapsed : duration;
    const numbers = (key) => span.map((s) => (s.weather ? s.weather[key] : null)).filter((v) => v != null);
    const temps = numbers('temp');
    const probs = numbers('precipProbability');
    const rates = numbers('precipitation');
    const snow = numbers('snowfall');
    const worst = span.reduce((acc, s) => worseOf(acc, categoryOf(s.weather)), categoryOf(span[0].weather));
    return {
      ...run,
      category: worst,
      from,
      to,
      toIsArrival: !hasNext,
      seconds: Math.max(0, endElapsed - from.elapsed),
      tempMin: temps.length ? Math.min(...temps) : null,
      tempMax: temps.length ? Math.max(...temps) : null,
      maxProb: probs.length ? Math.max(...probs) : null,
      maxRate: rates.length ? Math.max(...rates) : null,
      maxSnow: snow.length ? Math.max(...snow) : null,
      placeFrom: nearestLabel(samples, run.start),
      placeTo: nearestLabel(samples, Math.min(run.end + 1, samples.length - 1))
    };
  });
};

const verdictFor = (route) => {
  const seconds = {};
  let score = 0;
  windowsFor(route).forEach((w) => {
    if (w.kind === 'dry' || w.kind === 'unknown') return;
    seconds[w.category] = (seconds[w.category] || 0) + w.seconds;
    score += CATEGORIES[w.category].severity * w.seconds;
  });
  const cats = Object.keys(seconds).sort((a, b) => CATEGORIES[b].severity - CATEGORIES[a].severity);
  const total = Object.values(seconds).reduce((a, b) => a + b, 0);
  if (cats.length === 0) return { text: 'Dry the whole way', hazard: false, score: 0, total: 0 };
  const names = cats.slice(0, 2).map((c) => CATEGORIES[c].label.toLowerCase()).join(' and ');
  const text = `${names.charAt(0).toUpperCase()}${names.slice(1)} for ${formatDuration(total)}`;
  return { text, hazard: true, score, total };
};

const placeText = (w, end) => {
  if (w.toIsArrival) {
    const from = w.placeFrom;
    if (!from) return `Into ${end.short}`;
    return `${from.exact ? '' : 'Near '}${from.name} to ${end.short}`;
  }
  const from = w.placeFrom;
  const to = w.placeTo;
  if (!from || !to) return '';
  if (from.name === to.name) return `${from.exact && to.exact ? 'Around' : 'Near'} ${from.name}`;
  return `${from.exact ? '' : 'Near '}${from.name} to ${to.exact ? '' : 'near '}${to.name}`;
};

const detailText = (w) => {
  const parts = [];
  if (w.tempMin != null) {
    parts.push(w.tempMin === w.tempMax ? `${w.tempMin}°F` : `${w.tempMin} to ${w.tempMax}°F`);
  }
  if (w.kind === 'dry') {
    if (w.maxProb != null && w.maxProb >= 30) parts.push(`${w.maxProb}% chance of rain`);
  } else if (w.kind !== 'unknown') {
    if (w.maxProb != null) parts.push(`${w.maxProb}% chance`);
    if (w.maxSnow != null && w.maxSnow > 0) parts.push(`up to ${formatInches(w.maxSnow)} of snow an hour`);
    else if (w.maxRate != null && w.maxRate > 0) parts.push(`up to ${formatInches(w.maxRate)} an hour`);
  }
  return parts.join(', ');
};

/* ---- Pieces ---- */

const Strip = ({ route, compact }) => {
  const { samples, duration } = route;
  const segments = samples.slice(0, -1).map((s, i) => {
    const next = samples[i + 1];
    return {
      key: i,
      grow: Math.max(1, next.elapsed - s.elapsed),
      category: worseOf(categoryOf(s.weather), categoryOf(next.weather))
    };
  });
  const every = Math.max(1, Math.ceil((samples.length - 1) / 6));
  const ticks = samples
    .filter((s, i) => i % every === 0 && i < samples.length - 1 && (duration - s.elapsed) / duration > 0.2)
    .map((s) => ({ left: (s.elapsed / duration) * 100, label: formatClock(s.eta, s.zone) }));
  const last = samples[samples.length - 1];
  return (
    <div className={compact ? 'rw-strip rw-strip-compact' : 'rw-strip'} aria-hidden="true">
      <div className="rw-strip-bar">
        {segments.map((seg) => (
          <span key={seg.key} className={`rw-strip-seg rw-wx-${seg.category}`} style={{ flexGrow: seg.grow }} />
        ))}
      </div>
      {!compact && (
        <div className="rw-strip-ticks">
          {ticks.map((t, i) => (
            <span
              key={i}
              className={`rw-strip-tick${i === 0 ? ' rw-strip-tick-start' : ''}${i % 2 === 1 ? ' rw-strip-tick-odd' : ''}`}
              style={{ left: `${t.left}%` }}
            >
              {t.label}
            </span>
          ))}
          <span className="rw-strip-tick rw-strip-tick-end">{formatClock(last.eta, last.zone)}</span>
        </div>
      )}
    </div>
  );
};

const RouteChooser = ({ routes, selected, onSelect, fastest, driest }) => (
  <div className="rw-routes" role="radiogroup" aria-label="Route options">
    {routes.map((route, i) => {
      const verdict = verdictFor(route);
      const isSelected = i === selected;
      return (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={isSelected}
          className={isSelected ? 'rw-route rw-route-selected' : 'rw-route'}
          onClick={() => onSelect(i)}
        >
          <span className="rw-route-top">
            <span className="rw-route-name">{route.summary ? `via ${route.summary}` : `Route ${'ABC'[i]}`}</span>
            <span className="rw-route-tags">
              {i === fastest && <span className="rw-tag">Fastest</span>}
              {i === driest && <span className="rw-tag">Driest</span>}
            </span>
          </span>
          <span className="rw-route-meta">
            {formatDuration(route.duration)}, {formatMiles(route.distance)}
          </span>
          <Strip route={route} compact />
          <span className={verdict.hazard ? 'rw-route-verdict rw-route-verdict-hazard' : 'rw-route-verdict'}>
            {verdict.text}
          </span>
        </button>
      );
    })}
  </div>
);

const Legend = ({ route }) => {
  const present = new Set(route.samples.map((s) => categoryOf(s.weather)));
  const items = [];
  if (['clear', 'partly', 'cloud'].some((c) => present.has(c))) items.push({ key: 'dry', label: 'Dry' });
  Object.keys(CATEGORIES)
    .filter((c) => CATEGORIES[c].hazard && present.has(c))
    .sort((a, b) => CATEGORIES[a].severity - CATEGORIES[b].severity)
    .forEach((c) => items.push({ key: c, label: CATEGORIES[c].label }));
  if (present.has('unknown')) items.push({ key: 'unknown', label: 'No forecast' });
  return (
    <ul className="rw-legend">
      {items.map((item) => (
        <li key={item.key}>
          <span className={`rw-legend-swatch rw-wx-${item.key}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
};

const Windows = ({ route, end }) => {
  const windows = useMemo(() => windowsFor(route), [route]);
  return (
    <ol className="rw-windows">
      {windows.map((w, i) => {
        const hazard = w.kind !== 'dry' && w.kind !== 'unknown';
        const markClass = `rw-window-mark rw-wx-${w.kind === 'dry' ? 'dry' : w.category}`;
        return (
          <li key={i} className={hazard ? 'rw-window rw-window-hazard' : 'rw-window'}>
            <span className={markClass} />
            <div className="rw-window-body">
              <div className="rw-window-head">
                <span className="rw-window-glyph">
                  <Glyph name={glyphFor(route.samples[w.start].weather)} size={22} />
                </span>
                <span className="rw-window-title">{w.kind === 'dry' ? 'Dry' : CATEGORIES[w.category].label}</span>
                <span className="rw-window-time">
                  {formatClock(w.from.eta, w.from.zone)} to {formatClock(w.to.eta, w.to.zone)}
                  <span className="rw-window-length"> ({formatDuration(w.seconds)})</span>
                </span>
              </div>
              <p className="rw-window-place">{placeText(w, end)}</p>
              {detailText(w) && <p className="rw-window-detail">{detailText(w)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const Hours = ({ route, startZone }) => {
  const { samples } = route;
  const crossesZones = samples.some((s) => s.zone && s.zone !== startZone);
  return (
    <details className="rw-hours">
      <summary>Every {stepLabel(samples)} along the way</summary>
      <ol className="rw-hours-list">
        {samples.map((s, i) => {
          const w = s.weather;
          return (
            <li key={i} className="rw-hour">
              <span className="rw-hour-time">
                {formatClock(s.eta, s.zone)}
                {crossesZones && <small> {formatZone(s.eta, s.zone)}</small>}
              </span>
              <span className="rw-hour-place">
                {s.label || (s.distance != null ? `mile ${Math.round(s.distance / 1609.34)}` : '')}
              </span>
              <span className="rw-hour-wx">
                <Glyph name={glyphFor(w)} size={20} />
                {describe(w)}
              </span>
              <span className="rw-hour-temp">{w && w.temp != null ? `${w.temp}°` : ''}</span>
              <span className="rw-hour-prob">{w && w.precipProbability != null ? `${w.precipProbability}%` : ''}</span>
              <span className="rw-hour-wind">{w && w.windSpeed != null ? `${w.windSpeed} mph` : ''}</span>
            </li>
          );
        })}
      </ol>
    </details>
  );
};

const Days = ({ days }) => (
  <div className="rw-days">
    {days.map((day) => {
      const w = day.weather;
      return (
        <div className="rw-day" key={day.date}>
          <span className="rw-day-date">{formatDate(day.date)}</span>
          {w ? (
            <>
              <span className="rw-day-glyph">
                <Glyph name={glyphFor({ ...w, isDay: true })} size={34} />
              </span>
              <span className="rw-day-temp">
                {w.tempHigh}&deg;<small> / {w.tempLow}&deg;</small>
              </span>
              <span className="rw-day-desc">{describe(w)}</span>
              <span className="rw-day-detail">
                {w.precipProbability != null && `${w.precipProbability}% chance of precipitation. `}
                {w.precipitation != null && w.precipitation > 0 && `${formatInches(w.precipitation)} expected. `}
                {w.windSpeed != null && `Wind to ${w.windSpeed} mph.`}
              </span>
              {w.isHistorical && <span className="rw-badge">last year</span>}
            </>
          ) : (
            <span className="rw-day-desc">Unavailable</span>
          )}
        </div>
      );
    })}
  </div>
);

const LegCard = ({ title, sample }) => {
  const w = sample.weather;
  return (
    <div className="rw-leg">
      <span className="rw-leg-title">{title}</span>
      <span className="rw-leg-place">{sample.label}</span>
      <span className="rw-leg-time">{formatDayTime(sample.eta, sample.zone)}</span>
      {w ? (
        <div className="rw-leg-weather">
          <Glyph name={glyphFor(w)} size={34} />
          <span className="rw-leg-temp">{w.temp}&deg;F</span>
          <span className="rw-leg-desc">{describe(w)}</span>
          <span className="rw-leg-detail">
            {w.precipProbability != null && `${w.precipProbability}% chance of precipitation. `}
            {w.windSpeed != null && `Wind ${w.windSpeed} mph.`}
          </span>
          {w.isHistorical && <span className="rw-badge">last year</span>}
        </div>
      ) : (
        <span className="rw-leg-desc">No forecast for this time.</span>
      )}
    </div>
  );
};

const PlaceField = ({ id, label, value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debounce = useRef(null);

  useEffect(() => () => clearTimeout(debounce.current), []);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/city-suggest?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleChange = (val) => {
    onChange(val);
    setOpen(true);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const choose = (s) => {
    onChange(s.name);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="rw-field rw-autocomplete">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul className="rw-suggestions">
          {suggestions.map((s, i) => (
            <li key={i} className="rw-suggestion-item" onMouseDown={() => choose(s)}>
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ---- Page ---- */

const WeatherApp = () => {
  // The page is prerendered at build time on a UTC machine, and React keeps
  // the server's attributes on hydration, so "today" must be worked out in the
  // visitor's browser after mount or the date field rejects their own today.
  const [today, setToday] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  useEffect(() => {
    const now = toDateStr(new Date());
    setToday(now);
    setDepartureDate((d) => d || now);
  }, []);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [stayDays, setStayDays] = useState(2);
  const [mode, setMode] = useState('drive');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chosenRoute, setChosenRoute] = useState(null);
  // A map that fails to load (Mapbox hiccup) is dropped rather than left as a
  // box of alt text; the strip and the list below carry the same information.
  const [mapFailed, setMapFailed] = useState({});

  const routes = result ? result.routes : [];
  const fastest = useMemo(
    () => routes.reduce((best, r, i) => (best === -1 || r.duration < routes[best].duration ? i : best), -1),
    [routes]
  );
  const driest = useMemo(() => {
    if (routes.length < 2) return -1;
    const scores = routes.map((r) => verdictFor(r).score);
    const min = Math.min(...scores);
    if (scores.every((s) => s === min)) return -1;
    return scores.indexOf(min);
  }, [routes]);
  // Default to the driest route when one stands out, else the fastest.
  const selected = chosenRoute != null && chosenRoute < routes.length ? chosenRoute : driest !== -1 ? driest : Math.max(0, fastest);
  const route = routes[selected];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    setChosenRoute(null);
    try {
      const params = new URLSearchParams({
        startLocation,
        endLocation,
        departureDate,
        departureTime,
        stayDays: String(stayDays),
        mode
      });
      const res = await fetch(`/api/route-weather?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      if (!data.routes || data.routes.length === 0) throw new Error('No route came back for that trip.');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not fetch the route weather.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = startLocation.trim() && endLocation.trim() && departureDate && departureTime;
  const historical = result && routes.some((r) => r.samples.some((s) => s.weather && s.weather.isHistorical));
  const verdict = route ? verdictFor(route) : null;
  const lastSample = route ? route.samples[route.samples.length - 1] : null;

  return (
    <>
      <SEO path="/WeatherApp" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Route Weather</h1>
      </div>
      <div className="proj-page main-content rw-page">
        {!result && !loading && (
          <>
            <p className="rw-intro">
              Say where you are driving and when you are leaving. Route Weather works out where
              you will be every quarter hour or so and pulls the forecast for that spot at that
              time, so you can see the rain before you are in it, and pick the route that misses it.
            </p>
            <form className="rw-form" onSubmit={handleSubmit}>
              <div className="rw-form-grid">
                <PlaceField id="rw-from" label="From" value={startLocation} onChange={setStartLocation} placeholder="City or address" />
                <PlaceField id="rw-to" label="To" value={endLocation} onChange={setEndLocation} placeholder="City or address" />
                <div className="rw-field">
                  <label htmlFor="rw-date">Leaving on</label>
                  <input id="rw-date" type="date" value={departureDate} min={today || undefined} onChange={(e) => setDepartureDate(e.target.value)} />
                </div>
                <div className="rw-field">
                  <label htmlFor="rw-time">At</label>
                  <input id="rw-time" type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
                  <span className="rw-hint">Local time where you start.</span>
                </div>
                <div className="rw-field">
                  <label htmlFor="rw-stay">Days at the destination</label>
                  <input
                    id="rw-stay"
                    type="number"
                    min="1"
                    max="14"
                    value={stayDays}
                    onChange={(e) => setStayDays(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 14))}
                  />
                </div>
                <div className="rw-field">
                  <span className="rw-label" id="rw-mode-label">Getting there</span>
                  <div className="rw-mode-toggle" role="radiogroup" aria-labelledby="rw-mode-label">
                    <button type="button" role="radio" aria-checked={mode === 'drive'} className={mode === 'drive' ? 'active' : ''} onClick={() => setMode('drive')}>
                      Driving
                    </button>
                    <button type="button" role="radio" aria-checked={mode === 'fly'} className={mode === 'fly' ? 'active' : ''} onClick={() => setMode('fly')}>
                      Flying
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="rw-submit" disabled={!canSubmit}>
                {mode === 'drive' ? 'Check the drive' : 'Check the flight'}
              </button>
              {error && <p className="rw-error" role="alert">{error}</p>}
            </form>
          </>
        )}

        {loading && (
          <div className="rw-loading" role="status">
            <span className="rw-loading-dot" />
            <p>{mode === 'drive' ? 'Mapping the route and reading the forecast along it.' : 'Reading the forecast at both ends.'}</p>
          </div>
        )}

        {result && !loading && route && (
          <div className="rw-results">
            <header className="rw-head">
              <div className="rw-head-text">
                <h2 className="rw-head-route">
                  {result.start.short} to {result.end.short}
                </h2>
                <p className="rw-head-line">
                  Leaving {formatDayTime(result.departure, result.departureZone)}. Arriving{' '}
                  {formatDayTime(route.arrival, lastSample.zone)}
                  {route.estimated ? ', about ' : ' after '}
                  {formatDuration(route.duration)}
                  {route.distance != null ? ` and ${formatMiles(route.distance)}` : ' in the air, give or take'}.
                </p>
              </div>
              <button type="button" className="rw-change" onClick={() => setResult(null)}>
                Change trip
              </button>
            </header>

            {historical && (
              <p className="rw-note">
                Forecasts reach 16 days out and this trip is further off, so what follows is last
                year's weather on the same dates, not a forecast. Check back closer to the day.
              </p>
            )}

            {result.mode === 'drive' ? (
              <>
                {routes.length > 1 && (
                  <section className="rw-section">
                    <h3 className="rw-section-title">Pick a route</h3>
                    <RouteChooser routes={routes} selected={selected} onSelect={setChosenRoute} fastest={fastest} driest={driest} />
                  </section>
                )}

                <section className="rw-section">
                  <p className={verdict.hazard ? 'rw-verdict rw-verdict-hazard' : 'rw-verdict'}>{verdict.text}</p>
                  {route.mapUrl && !mapFailed[route.mapUrl] && (
                    <figure className="rw-map">
                      <img
                        key={route.mapUrl}
                        src={route.mapUrl}
                        alt={`Map of the route from ${result.start.short} to ${result.end.short}, coloured by the weather on each stretch`}
                        width="900"
                        height="480"
                        onError={() => setMapFailed((m) => ({ ...m, [route.mapUrl]: true }))}
                      />
                    </figure>
                  )}
                  <Legend route={route} />
                  <Strip route={route} />
                  <Windows route={route} end={result.end} />
                  <Hours route={route} startZone={result.departureZone} />
                </section>
              </>
            ) : (
              <section className="rw-section">
                <div className="rw-legs">
                  <LegCard title="Departure" sample={route.samples[0]} />
                  <LegCard title="Arrival" sample={route.samples[1]} />
                </div>
                <p className="rw-fine">
                  Flight time is estimated from the distance, not a schedule, so the arrival forecast is for roughly that hour.
                </p>
              </section>
            )}

            <section className="rw-section">
              <h3 className="rw-section-title">
                {result.destination.stayDays === 1 ? 'The day' : `${result.destination.stayDays} days`} at {result.end.short}
              </h3>
              <Days days={result.destination.days} />
            </section>

            <p className="rw-fine">
              Forecasts from Open-Meteo, routing and maps from Mapbox. Times are shown in the local
              time of each place along the way.
            </p>
          </div>
        )}
      </div>

      <div className="proj-nav-buttons">
        <Link to="/PaperTrail" className="proj-nav-button">
          Paper Trail
        </Link>
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
        <Link to="/ChessDeck" className="proj-nav-button">
          Chess Deck
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default WeatherApp;
