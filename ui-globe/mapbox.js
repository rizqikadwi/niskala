/* ================================================================
   MAPBOX GL JS MODULE
   Handles all map initialization, layer management, and rendering.
   ================================================================ */

/* global mapboxgl, CONFIG, COMPANY_COORDS, CHOKEPOINTS */

// ============================================================
// STATE
// ============================================================
const MapState = {
  map: null,
  isReady: false,
  autoRotateFrame: null,
  currentData: { events: [], companies: [] },
  markerCounter: 0,
};

// Layer ID constants (prevent typos)
const LAYERS = {
  EVENTS_SOURCE: 'events-source',
  EVENTS_PULSE: 'events-pulse-layer',
  EVENTS_CORE: 'events-core-layer',
  COMPANIES_SOURCE: 'companies-source',
  COMPANIES_POINTS: 'companies-points-layer',
  LINKS_SOURCE: 'links-source',
  LINKS_LINE: 'links-line-layer',
  CHOKEPOINT_SOURCE: 'chokepoint-source',
  CHOKEPOINT_FILL: 'chokepoint-fill-layer',
  CHOKEPOINT_STROKE: 'chokepoint-stroke-layer',
  CHOKEPOINT_LABEL: 'chokepoint-label-layer',
};

// ============================================================
// INITIALIZATION
// ============================================================
function initMap() {
  mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

  try {
    MapState.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.8,
      projection: 'globe',
      antialias: true,
      attributionControl: false,  // We'll add compact one
      minZoom: 1,
      maxZoom: 12,
    });

    // Compact attribution
    MapState.map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: 'Market Intelligence Globe',
    }), 'bottom-right');

    MapState.map.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
    }), 'top-right');

    MapState.map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric',
    }), 'bottom-right');

    // Load handler
    MapState.map.on('load', onMapLoad);

    // Error handler
    MapState.map.on('error', (e) => {
      console.error('[Mapbox Error]', e.error || e);
      const errorEl = document.getElementById('map-error');
      if (errorEl && !MapState.isReady) {
        errorEl.classList.remove('hidden');
      }
    });

    // Pause auto-rotate on user interaction
    MapState.map.on('mousedown', stopAutoRotate);
    MapState.map.on('touchstart', stopAutoRotate);
    MapState.map.on('wheel', stopAutoRotate);

  } catch (err) {
    console.error('[Map Init Failed]', err);
    showMapError('Failed to initialize map. Check console for details.');
  }
}

function onMapLoad() {
  MapState.isReady = true;

  // Hide loading
  const loadingEl = document.getElementById('map-loading');
  if (loadingEl) loadingEl.classList.add('hidden');

  // Fog effect
  try {
    MapState.map.setFog({
      range: [-0.5, 2],
      color: 'white',
      'horizon-blend': 0.1,
      'high-color': '#0d1117',
      'space-color': '#000000',
      'star-intensity': 0.6,
    });
  } catch (err) {
    console.warn('Fog effect failed:', err);
  }

  // Chokepoint overlay
  if (CONFIG.SHOW_CHOKEPOINTS) {
    renderChokepoints();
  }

  // Auto-rotate
  if (CONFIG.AUTO_ROTATE) {
    startAutoRotate();
  }

  console.log('✅ Map ready');
}

function showMapError(msg) {
  const el = document.getElementById('map-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  const loading = document.getElementById('map-loading');
  if (loading) loading.classList.add('hidden');
}

// ============================================================
// AUTO-ROTATE
// ============================================================
function startAutoRotate() {
  if (!MapState.map || MapState.autoRotateFrame) return;

  function rotate() {
    if (!MapState.map) return;
    const bearing = (MapState.map.getBearing() + 0.1) % 360;
    MapState.map.setBearing(bearing);
    MapState.autoRotateFrame = requestAnimationFrame(rotate);
  }
  MapState.autoRotateFrame = requestAnimationFrame(rotate);
}

function stopAutoRotate() {
  if (MapState.autoRotateFrame) {
    cancelAnimationFrame(MapState.autoRotateFrame);
    MapState.autoRotateFrame = null;
  }
}

// ============================================================
// CHOKEPOINTS (Static overlay)
// ============================================================
function renderChokepoints() {
  if (!MapState.map || !MapState.isReady) return;

  // Remove existing
  removeLayerAndSource(LAYERS.CHOKEPOINT_LABEL, LAYERS.CHOKEPOINT_SOURCE);
  removeLayerAndSource(LAYERS.CHOKEPOINT_STROKE, LAYERS.CHOKEPOINT_SOURCE);
  removeLayerAndSource(LAYERS.CHOKEPOINT_FILL, LAYERS.CHOKEPOINT_SOURCE);

  const features = CHOKEPOINTS.map((cp) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [cp.lon, cp.lat],
    },
    properties: {
      name: cp.name,
      throughput: cp.throughput,
      significance: cp.significance,
      radius: cp.radius_km * 1000, // meters
    },
  }));

  MapState.map.addSource(LAYERS.CHOKEPOINT_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });

  // Filled area (using circle with low opacity)
  MapState.map.addLayer({
    id: LAYERS.CHOKEPOINT_FILL,
    type: 'circle',
    source: LAYERS.CHOKEPOINT_SOURCE,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 4, 5, 25],
      'circle-color': '#ffcc00',
      'circle-opacity': 0.12,
      'circle-blur': 1,
    },
  });

  // Stroke ring
  MapState.map.addLayer({
    id: LAYERS.CHOKEPOINT_STROKE,
    type: 'circle',
    source: LAYERS.CHOKEPOINT_SOURCE,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 4, 5, 25],
      'circle-color': 'transparent',
      'circle-stroke-color': '#ffcc00',
      'circle-stroke-width': 1.5,
      'circle-stroke-opacity': 0.6,
    },
  });

  // Labels
  MapState.map.addLayer({
    id: LAYERS.CHOKEPOINT_LABEL,
    type: 'symbol',
    source: LAYERS.CHOKEPOINT_SOURCE,
    minzoom: 2.5,
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 10,
      'text-offset': [0, 1.5],
      'text-anchor': 'top',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    },
    paint: {
      'text-color': '#ffcc00',
      'text-halo-color': '#000',
      'text-halo-width': 1,
    },
  });

  // Click handler
  MapState.map.on('click', LAYERS.CHOKEPOINT_STROKE, (e) => {
    const feature = e.features[0];
    const [lon, lat] = feature.geometry.coordinates;
    const props = feature.properties;
    new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
      .setLngLat([lon, lat])
      .setHTML(`
        <div style="font-family: -apple-system, sans-serif;">
          <strong style="color:#ffcc00;">${props.name}</strong><br/>
          <small style="color:#666;">Throughput: ${props.throughput}</small><br/>
          <small style="color:#666; margin-top:4px; display:block;">${props.significance}</small>
        </div>
      `)
      .addTo(MapState.map);
  });

  MapState.map.on('mouseenter', LAYERS.CHOKEPOINT_STROKE, () => {
    MapState.map.getCanvas().style.cursor = 'pointer';
  });
  MapState.map.on('mouseleave', LAYERS.CHOKEPOINT_STROKE, () => {
    MapState.map.getCanvas().style.cursor = '';
  });
}

// ============================================================
// RENDER EVENTS + COMPANIES + CAUSE LINES
// ============================================================
function renderData({ events = [], companies = [] }) {
  if (!MapState.map || !MapState.isReady) {
    console.warn('Map not ready — cannot render data');
    return;
  }

  MapState.currentData = { events, companies };

  // Remove existing layers
  removeLayerAndSource(LAYERS.LINKS_LINE, LAYERS.LINKS_SOURCE);
  removeLayerAndSource(LAYERS.COMPANIES_POINTS, LAYERS.COMPANIES_SOURCE);
  removeLayerAndSource(LAYERS.EVENTS_CORE, LAYERS.EVENTS_SOURCE);
  removeLayerAndSource(LAYERS.EVENTS_PULSE, LAYERS.EVENTS_SOURCE);

  // ---- EVENTS ----
  if (events.length > 0) {
    renderEvents(events);
  }

  // ---- COMPANIES ----
  if (companies.length > 0) {
    renderCompanies(companies);
  }

  // ---- LINKS (cause-effect) ----
  if (events.length > 0 && companies.length > 0) {
    renderLinks(events, companies);
  }
}

function renderEvents(events) {
  const features = events
    .filter((e) => typeof e.latitude === 'number' && typeof e.longitude === 'number')
    .map((e) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [e.longitude, e.latitude] },
      properties: {
        name: e.location_name || 'Unknown location',
        severity: (e.severity || 'medium').toLowerCase(),
        description: e.description || '',
        event_type: e.event_type || '',
        color: severityColor(e.severity),
      },
    }));

  if (features.length === 0) return;

  MapState.map.addSource(LAYERS.EVENTS_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });

  // Pulse (outer)
  MapState.map.addLayer({
    id: LAYERS.EVENTS_PULSE,
    type: 'circle',
    source: LAYERS.EVENTS_SOURCE,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 14, 10, 40],
      'circle-color': ['get', 'color'],
      'circle-opacity': 0.18,
      'circle-blur': 0.8,
    },
  });

  // Core (inner)
  MapState.map.addLayer({
    id: LAYERS.EVENTS_CORE,
    type: 'circle',
    source: LAYERS.EVENTS_SOURCE,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 6, 10, 12],
      'circle-color': ['get', 'color'],
      'circle-opacity': 1,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  });

  // Click → zoom + popup
  MapState.map.on('click', LAYERS.EVENTS_CORE, (e) => {
    const feature = e.features[0];
    const [lon, lat] = feature.geometry.coordinates;
    const props = feature.properties;
    new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
      .setLngLat([lon, lat])
      .setHTML(`
        <div style="font-family: -apple-system, sans-serif;">
          <strong style="color:${props.color};">${props.name}</strong><br/>
          <small style="color:#666;">Severity: ${props.severity.toUpperCase()}</small>
          ${props.event_type ? `<br/><small style="color:#666;">Type: ${props.event_type}</small>` : ''}
          ${props.description ? `<br/><small style="color:#444; margin-top:4px; display:block;">${escapeHtml(props.description)}</small>` : ''}
        </div>
      `)
      .addTo(MapState.map);
    MapState.map.flyTo({ center: [lon, lat], zoom: 5, duration: 1500 });
  });

  MapState.map.on('mouseenter', LAYERS.EVENTS_CORE, () => {
    MapState.map.getCanvas().style.cursor = 'pointer';
  });
  MapState.map.on('mouseleave', LAYERS.EVENTS_CORE, () => {
    MapState.map.getCanvas().style.cursor = '';
  });
}

function renderCompanies(companies) {
  const features = companies
    .filter((c) => c && c.lat && c.lon)
    .map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
      properties: {
        ticker: c.ticker,
        name: c.name || c.ticker,
        direction: c.direction || 'benefited',
        color: c.direction === 'harmed' ? '#ff3b30' : '#34c759',
      },
    }));

  if (features.length === 0) return;

  MapState.map.addSource(LAYERS.COMPANIES_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });

  MapState.map.addLayer({
    id: LAYERS.COMPANIES_POINTS,
    type: 'circle',
    source: LAYERS.COMPANIES_SOURCE,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 4, 10, 8],
      'circle-color': ['get', 'color'],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 1.5,
      'circle-opacity': 0.95,
    },
  });

  MapState.map.on('click', LAYERS.COMPANIES_POINTS, (e) => {
    const feature = e.features[0];
    const [lon, lat] = feature.geometry.coordinates;
    const props = feature.properties;
    new mapboxgl.Popup({ closeButton: true, maxWidth: '260px' })
      .setLngLat([lon, lat])
      .setHTML(`
        <div style="font-family: -apple-system, sans-serif;">
          <strong style="font-family: monospace; color:${props.color};">${props.ticker}</strong><br/>
          <small style="color:#666;">${props.name}</small><br/>
          <small style="color:#888; font-size:10px;">${props.direction === 'harmed' ? '▼ Potentially harmed' : '▲ Potentially benefited'}</small>
        </div>
      `)
      .addTo(MapState.map);
  });

  MapState.map.on('mouseenter', LAYERS.COMPANIES_POINTS, () => {
    MapState.map.getCanvas().style.cursor = 'pointer';
  });
  MapState.map.on('mouseleave', LAYERS.COMPANIES_POINTS, () => {
    MapState.map.getCanvas().style.cursor = '';
  });
}

function renderLinks(events, companies) {
  const validEvents = events.filter((e) => e.latitude && e.longitude);
  const validCompanies = companies.filter((c) => c && c.lat && c.lon);

  const topCompanies = companies
    .sort((a, b) => (b.magnitudeScore || 0) - (a.magnitudeScore || 0))
    .slice(0, 5);

  if (validEvents.length === 0 || validCompanies.length === 0) return;

  const features = [];
  validEvents.forEach((e) => {
    validCompanies.forEach((c) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[e.longitude, e.latitude], [c.lon, c.lat]],
        },
        properties: {
          ticker: c.ticker,
          direction: c.direction || 'benefited',
        },
      });
    });
  });

  MapState.map.addSource(LAYERS.LINKS_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });

  MapState.map.addLayer({
  id: LAYERS.LINKS_LINE,
  type: 'line',
  source: LAYERS.LINKS_SOURCE,
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': [
      'case',
      ['==', ['get', 'direction'], 'harmed'],
      '#ff453a',    // merah lebih terang
      '#5ac8fa',    // biru lebih terang
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      1, 2,      // zoom 1 → lebar 2px
      5, 3,      // zoom 5 → lebar 3px
      10, 4,     // zoom 10 → lebar 4px
    ],
    'line-opacity': 0.85,        // lebih pekat
    'line-dasharray': [3, 2],    // dash lebih panjang, gap lebih rapat
    'line-blur': 0.3,            // sedikit blur agar menyatu
  },
  });
}

// ============================================================
// UTILITIES
// ============================================================
function severityColor(severity) {
  switch ((severity || '').toLowerCase()) {
    case 'critical': return '#ff2d55';
    case 'high': return '#ff3b30';
    case 'medium': return '#ff9500';
    case 'low': return '#34c759';
    default: return '#58a6ff';
  }
}

function removeLayerAndSource(layerId, sourceId) {
  if (!MapState.map) return;
  try {
    if (MapState.map.getLayer(layerId)) MapState.map.removeLayer(layerId);
  } catch (e) { /* ignore */ }
  try {
    if (MapState.map.getSource(sourceId)) MapState.map.removeSource(sourceId);
  } catch (e) { /* ignore */ }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function flyToLocation(lat, lon, zoom = 5) {
  if (!MapState.map || !MapState.isReady) return;
  if (typeof lat !== 'number' || typeof lon !== 'number') return;
  MapState.map.flyTo({ center: [lon, lat], zoom, duration: 1500 });
}

function resetMapView() {
  if (!MapState.map || !MapState.isReady) return;
  MapState.map.flyTo({ center: [0, 20], zoom: 1.8, duration: 1500 });
}

// ============================================================
// LOOKUP HELPER (uses COMPANY_COORDS)
// ============================================================
function lookupCompanyCoords(ticker) {
  if (!ticker) return null;
  const upper = ticker.toUpperCase().trim();
  return COMPANY_COORDS[upper] || null;
}

// Export for app.js
window.MapboxModule = {
  initMap,
  renderData,
  renderChokepoints,
  flyToLocation,
  resetMapView,
  lookupCompanyCoords,
  getMap: () => MapState.map,
  isReady: () => MapState.isReady,
};