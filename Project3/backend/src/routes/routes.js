/**
 * Routes Router — /routes
 *
 * POST /routes/calculate
 *   Body: { student_address: string, event_location: string }
 *
 * Geocodes both addresses using Nominatim (OpenStreetMap, no API key needed),
 * then calls the public OSRM demo server for driving directions.
 *
 * ⚠️  For production, replace the OSRM demo URL with a self-hosted instance
 *     or a paid routing provider (Mapbox, Google Maps, etc.).
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { validateRouteCalc } = require('../middleware/validate');

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OSRM_BASE      = 'https://router.project-osrm.org';

/**
 * Geocode a free-text address string via Nominatim.
 * Returns { lat, lon, displayName } or throws on failure.
 */
async function geocodeAddress(address) {
  const url = `${NOMINATIM_BASE}/search`;
  const { data } = await axios.get(url, {
    params: { q: address, format: 'json', limit: 1 },
    headers: { 'User-Agent': 'PNW-Events-App/1.0 (student-project)' },
    timeout: 8000,
  });

  if (!data || data.length === 0) {
    throw Object.assign(new Error(`Could not geocode address: "${address}"`), { status: 422 });
  }

  return {
    lat:         parseFloat(data[0].lat),
    lon:         parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}

/**
 * Convert metres to miles (rounded to 2dp).
 */
function metresToMiles(m) {
  return Math.round((m / 1609.344) * 100) / 100;
}

/**
 * Convert seconds to a human-readable duration string, e.g. "1 hr 23 min".
 */
function secondsToHuman(s) {
  const hrs  = Math.floor(s / 3600);
  const mins = Math.round((s % 3600) / 60);
  if (hrs === 0) return `${mins} min`;
  return `${hrs} hr ${mins} min`;
}

// ─── POST /routes/calculate ───────────────────────────────────────────────────
router.post('/calculate', validateRouteCalc, async (req, res, next) => {
  try {
    const { student_address, event_location } = req.body;

    // 1. Geocode both locations (in parallel)
    const [origin, destination] = await Promise.all([
      geocodeAddress(student_address),
      geocodeAddress(event_location),
    ]);

    // 2. Call OSRM for driving route
    //    Format: /route/v1/driving/{lon,lat};{lon,lat}?overview=full&geometries=geojson
    const osrmUrl =
      `${OSRM_BASE}/route/v1/driving/` +
      `${origin.lon},${origin.lat};${destination.lon},${destination.lat}` +
      `?overview=full&geometries=geojson&steps=false`;

    const { data: osrmData } = await axios.get(osrmUrl, { timeout: 10000 });

    if (osrmData.code !== 'Ok' || !osrmData.routes || osrmData.routes.length === 0) {
      return res.status(422).json({ error: 'OSRM could not find a driving route between those locations.' });
    }

    const route = osrmData.routes[0];
    const distanceMiles    = metresToMiles(route.distance);
    const distanceKm       = Math.round((route.distance / 1000) * 100) / 100;
    const durationHuman    = secondsToHuman(route.duration);
    const durationSeconds  = Math.round(route.duration);

    res.json({
      origin: {
        address:     student_address,
        displayName: origin.displayName,
        lat:         origin.lat,
        lon:         origin.lon,
      },
      destination: {
        address:     event_location,
        displayName: destination.displayName,
        lat:         destination.lat,
        lon:         destination.lon,
      },
      route: {
        distance_miles:   distanceMiles,
        distance_km:      distanceKm,
        duration_seconds: durationSeconds,
        duration_human:   durationHuman,
        geometry:         route.geometry, // GeoJSON LineString for Leaflet rendering
      },
    });
  } catch (err) {
    // Propagate structured errors from geocodeAddress
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
