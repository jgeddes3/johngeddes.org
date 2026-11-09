import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The build prerenders each route to static HTML (scripts/prerender.mjs) and
// marks the root so React attaches to the markup that is already on screen
// instead of replacing it. The dev server has no prerendered markup, so it
// renders from scratch as before.
if (container.hasAttribute('data-prerendered')) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
