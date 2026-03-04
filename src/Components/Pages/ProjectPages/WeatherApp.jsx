import React, { useState, useRef, useEffect, useCallback } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import './WeatherApp.css';

const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
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
  const maxDate = toDateStr(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

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
        mode
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
                  max={maxDate}
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
                  {result.mode === 'drive' ? 'Along the Route' : 'Departure'}
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
                          <span>{wp.weather.temp}&deg;F</span>
                          {wp.weather.weatherCode != null && (
                            <span>{WMO_CODES[wp.weather.weatherCode] || `Code ${wp.weather.weatherCode}`}</span>
                          )}
                          {wp.weather.description && (
                            <span>{wp.weather.description}</span>
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
                        <span className="rw-day-temp">
                          {day.weather.tempHigh}&deg; / {day.weather.tempLow}&deg;F
                        </span>
                        {day.weather.weatherCode != null && (
                          <span className="rw-day-desc">
                            {WMO_CODES[day.weather.weatherCode] || `Code ${day.weather.weatherCode}`}
                          </span>
                        )}
                        <div className="rw-day-details">
                          {day.weather.windSpeed != null && (
                            <span>Wind {day.weather.windSpeed} mph</span>
                          )}
                          {day.weather.precipitation != null && day.weather.precipitation > 0 && (
                            <span>{day.weather.precipitation} mm precip</span>
                          )}
                          {day.weather.isHistorical && (
                            <span className="rw-historical-badge">historical avg</span>
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
