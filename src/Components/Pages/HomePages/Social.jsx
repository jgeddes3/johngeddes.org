import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { bySlug } from '../../../reviews';
import { formatDate } from '../../../philosophy';
import content from '../../../social/now';
import './Social.css';

/* ---- Live signals: one cached call, shared across remounts ---- */
const SIGNALS_TTL_MS = 5 * 60 * 1000;
let cachedSignals = null; // { at, data }
let pendingSignals = null;

const loadSignals = () => {
  if (cachedSignals && Date.now() - cachedSignals.at < SIGNALS_TTL_MS) {
    return Promise.resolve(cachedSignals.data);
  }
  if (!pendingSignals) {
    pendingSignals = fetch('/api/signals')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`signals ${res.status}`))))
      .then((data) => {
        cachedSignals = { at: Date.now(), data };
        return data;
      })
      .finally(() => {
        pendingSignals = null;
      });
  }
  return pendingSignals;
};

const relativeTime = (when) => {
  if (!when) return '';
  const ms = Date.now() - new Date(when).getTime();
  const min = Math.round(ms / 60000);
  if (min < 2) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
};

const chicagoClock = () =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' })
    .format(new Date())
    .toLowerCase();

/* ---- Tile ---- */
const Tile = ({ label, value, sub, href, live, muted }) => {
  const inner = (
    <>
      <span className="social-tile-label">
        {live && <span className="social-tile-live" aria-hidden="true" />}
        {label}
      </span>
      <span className="social-tile-value">{value}</span>
      <span className="social-tile-sub">{sub}</span>
    </>
  );
  const cls = `social-tile${muted ? ' muted' : ''}`;
  if (!href) return <div className={cls}>{inner}</div>;
  if (href.startsWith('/')) return <Link to={href} className={cls}>{inner}</Link>;
  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
};

/* Each live tile has three states: loading, data, and "the feed is quiet",
   which reads as a calm line rather than an error. */
const PlayingTile = ({ s, loading }) => {
  if (loading) return <Tile label="Now playing" value="…" sub="Checking Last.fm" />;
  if (!s) return <Tile label="Now playing" value="Silence" sub="Nothing scrobbled lately" muted />;
  return (
    <Tile
      label={s.nowPlaying ? 'Now playing' : 'Last played'}
      value={s.track}
      sub={`${s.artist}${s.nowPlaying ? '' : s.playedAt ? ` · ${relativeTime(s.playedAt)}` : ''}`}
      href={s.url}
      live={s.nowPlaying}
    />
  );
};

const ChessTile = ({ s, loading }) => {
  if (loading) return <Tile label="Chess.com" value="…" sub="Checking the rating" />;
  if (!s) return <Tile label="Chess.com" value="—" sub="Rating unavailable right now" muted />;
  const last = s.last
    ? `${s.last.outcome} vs ${s.last.opponent}${s.last.endTime ? ` · ${relativeTime(s.last.endTime)}` : ''}`
    : s.record
      ? `${s.record.win} W · ${s.record.loss} L · ${s.record.draw} D`
      : '';
  return <Tile label={`Chess.com ${s.mode.toLowerCase()}`} value={s.rating.toLocaleString()} sub={last} href={s.url} />;
};

const CommitTile = ({ s, loading }) => {
  if (loading) return <Tile label="Last commit" value="…" sub="Checking GitHub" />;
  if (!s) return <Tile label="Last commit" value="—" sub="Nothing public lately" muted />;
  return <Tile label="Last commit" value={s.repo} sub={`${s.message} · ${relativeTime(s.at)}`} href={s.url} />;
};

const WeatherTile = ({ s, loading }) => {
  if (loading) return <Tile label="Chicago right now" value="…" sub="Checking the sky" />;
  if (!s) return <Tile label="Chicago right now" value="—" sub="Weather unavailable" muted />;
  return <Tile label="Chicago right now" value={`${s.temp}°`} sub={`${s.description}, wind ${s.wind} mph`} href="/WeatherApp" />;
};

const BookTile = () => {
  const book = content.reading ? bySlug(content.reading) : null;
  if (!book) return <Tile label="Last book rated" value="—" sub="Between books" muted />;
  return (
    <Tile
      label="Last book rated"
      value={book.title}
      sub={`${book.author || ''}${book.rating != null ? ` · ${book.rating}/10` : ''}`}
      href={`/${book.slug}`}
    />
  );
};

const ClockTile = () => {
  const [time, setTime] = useState(chicagoClock);
  useEffect(() => {
    const id = setInterval(() => setTime(chicagoClock()), 30 * 1000);
    return () => clearInterval(id);
  }, []);
  return <Tile label="Local time" value={time} sub="Chicago · Central time" />;
};

const SocialPage = () => {
  const [signals, setSignals] = useState(() => (cachedSignals ? cachedSignals.data : null));
  const [loading, setLoading] = useState(!cachedSignals);

  useEffect(() => {
    let active = true;
    loadSignals()
      .then((data) => {
        if (active) setSignals(data);
      })
      .catch((err) => {
        console.error('Signals unavailable:', err);
        if (active) setSignals({});
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const s = signals || {};
  const profiles = content.profiles.filter((p) => p.handle);

  return (
    <>
      <SEO
        title="Social"
        description="What John Geddes is up to right now — live signals from Last.fm, Chess.com, and GitHub, plus where to find him."
        path="/social"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <p className="social-eyebrow">Signals · live</p>
        <h1>Social</h1>
      </div>
      <div className="social-page">
        <p className="social-deck main-content">{content.deck}</p>

        <div className="social-tiles main-content">
          <PlayingTile s={s.playing} loading={loading} />
          <ChessTile s={s.chess} loading={loading} />
          <CommitTile s={s.commit} loading={loading} />
          <BookTile />
          <WeatherTile s={s.weather} loading={loading} />
          <ClockTile />
        </div>

        <section className="social-section main-content">
          <h2>Now</h2>
          <p className="social-section-date">Last changed {formatDate(content.updated)}</p>
          <div className="social-card">
            <dl className="social-now">
              {content.now.map((n) => (
                <div key={n.term}>
                  <dt>{n.term}</dt>
                  <dd>{n.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="social-section main-content">
          <h2>Find me</h2>
          <div className="social-card">
            <div className="social-badges">
              {profiles.map((p) => (
                <a key={p.title} className="social-badge" href={p.url} target="_blank" rel="noopener noreferrer">
                  <span className="social-badge-mono" aria-hidden="true">{p.mono}</span>
                  <span className="social-badge-title">{p.title}</span>
                  <span className="social-badge-handle">{p.handle}</span>
                </a>
              ))}
            </div>
            {content.note && <p className="social-note">{content.note}</p>}
          </div>
        </section>
      </div>
      <div className="social-nav">
        <Link to="/philosophy" className="phil-nav-button">
          Philosophy Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default SocialPage;
