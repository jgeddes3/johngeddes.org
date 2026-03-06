import React, { useState, useRef, useEffect, useCallback } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import './WeatherApp.css';

const WMO_CODES = {
  0: { desc: 'Clear sky', icon: '\u2600\uFE0F' },
  1: { desc: 'Mainly clear', icon: '\uD83C\uDF24\uFE0F' },
  2: { desc: 'Partly cloudy', icon: '\u26C5' },
  3: { desc: 'Overcast', icon: '\u2601\uFE0F' },
  45: { desc: 'Foggy', icon: '\uD83C\uDF2B\uFE0F' },
  48: { desc: 'Depositing rime fog', icon: '\uD83C\uDF2B\uFE0F' },
  51: { desc: 'Light drizzle', icon: '\uD83C\uDF26\uFE0F' },
  53: { desc: 'Moderate drizzle', icon: '\uD83C\uDF26\uFE0F' },
  55: { desc: 'Dense drizzle', icon: '\uD83C\uDF27\uFE0F' },
  56: { desc: 'Light freezing drizzle', icon: '\uD83C\uDF28\uFE0F' },
  57: { desc: 'Dense freezing drizzle', icon: '\uD83C\uDF28\uFE0F' },
  61: { desc: 'Slight rain', icon: '\uD83C\uDF26\uFE0F' },
  63: { desc: 'Moderate rain', icon: '\uD83C\uDF27\uFE0F' },
  65: { desc: 'Heavy rain', icon: '\uD83C\uDF27\uFE0F' },
  66: { desc: 'Light freezing rain', icon: '\uD83C\uDF28\uFE0F' },
  67: { desc: 'Heavy freezing rain', icon: '\uD83C\uDF28\uFE0F' },
  71: { desc: 'Slight snow fall', icon: '\uD83C\uDF28\uFE0F' },
  73: { desc: 'Moderate snow fall', icon: '\u2744\uFE0F' },
  75: { desc: 'Heavy snow fall', icon: '\u2744\uFE0F' },
  77: { desc: 'Snow grains', icon: '\u2744\uFE0F' },
  80: { desc: 'Slight rain showers', icon: '\uD83C\uDF26\uFE0F' },
  81: { desc: 'Moderate rain showers', icon: '\uD83C\uDF27\uFE0F' },
  82: { desc: 'Violent rain showers', icon: '\uD83C\uDF27\uFE0F' },
  85: { desc: 'Slight snow showers', icon: '\uD83C\uDF28\uFE0F' },
  86: { desc: 'Heavy snow showers', icon: '\u2744\uFE0F' },
  95: { desc: 'Thunderstorm', icon: '\u26C8\uFE0F' },
  96: { desc: 'Thunderstorm with slight hail', icon: '\u26C8\uFE0F' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '\u26C8\uFE0F' }
};

const getWmoInfo = (code) => {
  const entry = WMO_CODES[code];
  if (!entry) return { desc: `Code ${code}`, icon: '\uD83C\uDF21\uFE0F' };
  return entry;
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const formatDistance = (meters) => {
  const miles = meters / 1609.34;
  return `${Math.round(miles)} mi`;
};

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const toDateStr = (date) => date.toISOString().slice(0, 10);

const WeatherApp = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('14:00');
  const [stayDays, setStayDays] = useState(3);
  const [numWaypoints, setNumWaypoints] = useState(3);
  const [mode, setMode] = useState('drive');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Autocomplete state
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const startDebounce = useRef(null);
  const endDebounce = useRef(null);

  // Date constraints
  const today = toDateStr(new Date());

  // Cleanup debounce timers
  useEffect(() => {
    return () => {
      clearTimeout(startDebounce.current);
      clearTimeout(endDebounce.current);
    };
  }, []);

  const fetchSuggestions = useCallback(async (query, setter) => {
    if (query.trim().length < 2) { setter([]); return; }
    try {
      const res = await fetch(`/api/city-suggest?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setter(data);
    } catch {
      setter([]);
    }
  }, []);

  const handleStartChange = (val) => {
    setStartLocation(val);
    setShowStartSuggestions(true);
    clearTimeout(startDebounce.current);
    startDebounce.current = setTimeout(() => fetchSuggestions(val, setStartSuggestions), 300);
  };

  const handleEndChange = (val) => {
    setEndLocation(val);
    setShowEndSuggestions(true);
    clearTimeout(endDebounce.current);
    endDebounce.current = setTimeout(() => fetchSuggestions(val, setEndSuggestions), 300);
  };

  const selectStartSuggestion = (suggestion) => {
    setStartLocation(suggestion.name);
    setStartSuggestions([]);
    setShowStartSuggestions(false);
  };

  const selectEndSuggestion = (suggestion) => {
    setEndLocation(suggestion.name);
    setEndSuggestions([]);
    setShowEndSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        startLocation,
        endLocation,
        departureDate,
        departureTime,
        stayDays: String(stayDays),
        mode,
        tzOffset: String(new Date().getTimezoneOffset()),
        ...(mode === 'drive' ? { numWaypoints: String(numWaypoints) } : {})
      });
      const res = await fetch(`/api/route-weather?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch route weather');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  const canSubmit = startLocation.trim() && endLocation.trim() && departureDate && departureTime;

  return (
    <>
      <SEO
        title="Route Weather"
        description="Plan your trip with weather forecasts along your driving route and at your destination."
        path="/WeatherApp"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Route Weather</h1>
      </div>
      <div className="proj-page main-content">

        {/* Form */}
        {!loading && !result && (
          <form className="rw-form" onSubmit={handleSubmit}>
            <div className="rw-input-group rw-autocomplete">
              <label>From</label>
              <input
                type="text"
                placeholder="City or address"
                value={startLocation}
                onChange={(e) => handleStartChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
                onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
              />
              {showStartSuggestions && startSuggestions.length > 0 && (
                <ul className="rw-suggestions">
                  {startSuggestions.map((s, i) => (
                    <li key={i} className="rw-suggestion-item" onMouseDown={() => selectStartSuggestion(s)}>
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rw-input-group rw-autocomplete">
              <label>To</label>
              <input
                type="text"
                placeholder="City or address"
                value={endLocation}
                onChange={(e) => handleEndChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
                onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
              />
              {showEndSuggestions && endSuggestions.length > 0 && (
                <ul className="rw-suggestions">
                  {endSuggestions.map((s, i) => (
                    <li key={i} className="rw-suggestion-item" onMouseDown={() => selectEndSuggestion(s)}>
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rw-row">
              <div className="rw-input-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  min={today}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
              <div className="rw-input-group">
                <label>Departure Time</label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </div>
            </div>

            <div className="rw-row">
              <div className="rw-input-group">
                <label>Days at Destination</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={stayDays}
                  onChange={(e) => setStayDays(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 14))}
                />
              </div>
              {mode === 'drive' && (
                <div className="rw-input-group">
                  <label>Weather Waypoints</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={numWaypoints}
                    onChange={(e) => setNumWaypoints(Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), 10))}
                  />
                </div>
              )}
            </div>

            <div className="rw-mode-toggle">
              <button
                type="button"
                className={mode === 'drive' ? 'active' : ''}
                onClick={() => setMode('drive')}
              >
                Drive
              </button>
              <button
                type="button"
                className={mode === 'fly' ? 'active' : ''}
                onClick={() => setMode('fly')}
              >
                Fly
              </button>
            </div>

            <button type="submit" className="rw-submit" disabled={!canSubmit}>
              Check Weather
            </button>

            {error && <p className="rw-error">{error}</p>}
          </form>
        )}

        {/* Loading */}
        {loading && (
          <div className="rw-loading">
            <p className="rw-loading-text">
              {mode === 'drive' ? 'Mapping your route...' : 'Checking the skies...'}
            </p>
            <div className="rw-loading-dot" />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="rw-results">
            {/* Route Summary */}
            <div className="rw-summary">
              <div className="rw-summary-route">
                {result.start.name} &rarr; {result.end.name}
              </div>
              <div className="rw-summary-details">
                {result.totalDistance && (
                  <span className="rw-summary-detail">
                    {formatDistance(result.totalDistance)}
                  </span>
                )}
                {result.totalDuration && (
                  <span className="rw-summary-detail">
                    {formatDuration(result.totalDuration)} {result.mode === 'drive' ? 'drive' : 'flight'}
                  </span>
                )}
                <span className="rw-summary-detail">
                  {result.destination.stayDays} day{result.destination.stayDays !== 1 ? 's' : ''} at destination
                </span>
              </div>
            </div>

            {/* Route Map (drive mode only) */}
            {result.mapUrl && (
              <div className="rw-map">
                <img src={result.mapUrl} alt="Route map" />
              </div>
            )}

            {/* Waypoints Timeline */}
            {result.waypoints.length > 0 && (
              <div>
                <h2 className="rw-timeline-heading">
                  {result.mode === 'drive' ? 'Along the Route' : 'Flight'}
                </h2>
                <div className="rw-timeline">
                  {result.waypoints.map((wp, i) => (
                    <div className="rw-waypoint-card" key={i}>
                      <div className="rw-wp-header">
                        <span className="rw-wp-label">{wp.label}</span>
                        <span className="rw-wp-eta">{formatTime(wp.eta)}</span>
                      </div>
                      {wp.weather ? (
                        <div className="rw-wp-weather">
                          {wp.weather.weatherCode != null && (
                            <span className="rw-weather-icon">{getWmoInfo(wp.weather.weatherCode).icon}</span>
                          )}
                          <span>{wp.weather.temp}&deg;F</span>
                          {wp.weather.weatherCode != null && (
                            <span>{getWmoInfo(wp.weather.weatherCode).desc}</span>
                          )}
                          {wp.weather.windSpeed != null && (
                            <span>{wp.weather.windSpeed} mph wind</span>
                          )}
                          {wp.weather.precipitation != null && wp.weather.precipitation > 0 && (
                            <span>{wp.weather.precipitation} mm precip</span>
                          )}
                          {wp.weather.isHistorical && (
                            <span className="rw-historical-badge">historical avg</span>
                          )}
                        </div>
                      ) : (
                        <div className="rw-wp-weather">
                          <span>Weather unavailable</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destination Weather */}
            <div>
              <h2 className="rw-destination-heading">
                Weather at {result.end.name}
              </h2>
              {result.destination.arrival && (
                <p className="rw-destination-arrival">
                  Arriving {formatTime(result.destination.arrival)}
                </p>
              )}
              <div className="rw-destination-days">
                {result.destination.days.map((day, i) => (
                  <div className="rw-destination-day" key={i}>
                    <span className="rw-day-date">{formatDate(day.date)}</span>
                    {day.weather ? (
                      <>
                        {day.weather.isHistorical && (
                          <span className="rw-historical-badge">historical data</span>
                        )}
                        {day.weather.weatherCode != null && (
                          <span className="rw-day-icon-emoji">{getWmoInfo(day.weather.weatherCode).icon}</span>
                        )}
                        <span className="rw-day-temp">
                          {day.weather.tempHigh}&deg; / {day.weather.tempLow}&deg;F
                        </span>
                        {day.weather.weatherCode != null && (
                          <span className="rw-day-desc">
                            {getWmoInfo(day.weather.weatherCode).desc}
                          </span>
                        )}
                        {!day.weather.weatherCode && day.weather.isHistorical && (
                          <span className="rw-day-desc">Based on last year</span>
                        )}
                        <div className="rw-day-details">
                          {day.weather.windSpeed != null && (
                            <span>Wind {day.weather.windSpeed} mph</span>
                          )}
                          {day.weather.precipitation != null && day.weather.precipitation > 0 && (
                            <span>{day.weather.precipitation} mm precip</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="rw-day-desc">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button className="rw-reset" onClick={handleReset}>
              Plan Another Trip
            </button>
          </div>
        )}
      </div>

      <div className="proj-nav-buttons">
        <Link to="/projects" className="proj-nav-button">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default WeatherApp;
