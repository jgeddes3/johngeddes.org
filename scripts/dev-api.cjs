// Runs the Express API from api/index.js locally so `npm run dev` can proxy
// /api calls to it (see vite.config.js). Vercel runs that file as a function
// in production; nothing here is deployed.
//
//   npm run dev:api        (reads .env.local if present, port 3100)
//
// Without a MAPBOX_ACCESS_TOKEN the Mapbox calls are swapped for stand-ins
// with the same response shapes, so the Route Weather page can be worked on
// end to end: the public OSRM demo router for directions, Open-Meteo's
// geocoder for forward geocoding, no result for reverse geocoding (place
// labels along the route stay empty), and a 404 for the static map image.
// Open-Meteo weather calls always go out for real.
const path = require('path');

const mock = !process.env.MAPBOX_ACCESS_TOKEN;
if (mock) {
  process.env.MAPBOX_ACCESS_TOKEN = 'local-stand-in';
  const realFetch = global.fetch;
  const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('api.mapbox.com/directions/v5/mapbox/driving/')) {
      const m = /driving\/([^?]+)\?(.*)$/.exec(u);
      const q = new URLSearchParams(m[2]);
      q.delete('access_token');
      return realFetch(`https://router.project-osrm.org/route/v1/driving/${m[1]}?${q}`);
    }
    if (u.includes('api.mapbox.com/search/geocode/v6/forward')) {
      const q = new URL(u).searchParams.get('q');
      const r = await realFetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
      const j = await r.json();
      const features = (j.results || []).map((hit) => ({
        geometry: { coordinates: [hit.longitude, hit.latitude] },
        properties: {
          name: hit.name,
          full_address: [hit.name, hit.admin1, hit.country].filter(Boolean).join(', '),
          context: { place: { name: hit.name }, region: { region_code: hit.admin1 } }
        }
      }));
      return jsonResponse({ features });
    }
    if (u.includes('api.mapbox.com/search/geocode/v6/reverse')) {
      return jsonResponse({ features: [] });
    }
    if (u.includes('api.mapbox.com/styles/')) {
      // A blank stand-in at the real size, so the page's overlays can be seen.
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="960"><rect width="100%" height="100%" fill="#ece9e3"/>' +
        '<text x="24" y="48" font-family="sans-serif" font-size="28" fill="#9a948c">map stand-in (no Mapbox token)</text></svg>';
      return new Response(svg, { status: 200, headers: { 'content-type': 'image/svg+xml' } });
    }
    return realFetch(url, opts);
  };
}

const app = require(path.join(__dirname, '..', 'api', 'index.js'));
const port = Number(process.env.PORT || 3100);
app.listen(port, () => {
  console.log(`api listening on http://localhost:${port} (Mapbox: ${mock ? 'stand-ins, no token set' : 'real'})`);
});
