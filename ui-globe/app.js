/* ================================================================
   MAIN APPLICATION LOGIC
   Handles state, Langflow integration, and DOM rendering.
   ================================================================ */

/* global CONFIG, MapboxModule */

// ============================================================
// STATE
// ============================================================
const AppState = {
  isLoading: false,
  lastResult: null,
  events: [],
  companies: [],
  tickers: [],
  refreshTimer: null,
};

// ============================================================
// DOM REFERENCES (cached)
// ============================================================
const DOM = {
  brandName: null,
  eventCount: null,
  refreshBtn: null,
  runBtn: null,
  statusText: null,
  reportArea: null,
  eventList: null,
  tickerList: null,
  metricSignal: null,
  metricEvents: null,
  metricTickers: null,
  footerInfo: null,
  liveBadge: null,
  panelToggle: null,
  sidePanel: null,
  mobilePanelToggle: null,
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  cacheDomRefs();
  applyBranding();
  bindEvents();
  initMap();

  // Auto-refresh (if configured)
  if (CONFIG.REFRESH_INTERVAL > 0) {
    AppState.refreshTimer = setInterval(runAnalysis, CONFIG.REFRESH_INTERVAL);
    setStatus(`Auto-refresh enabled (every ${CONFIG.REFRESH_INTERVAL / 1000}s)`, 'idle');
  }

  setStatus('Ready. Click "Run Analysis" to start.', 'idle');
});

function cacheDomRefs() {
  DOM.brandName = document.getElementById('brand-name');
  DOM.eventCount = document.getElementById('event-count');
  DOM.refreshBtn = document.getElementById('refresh-btn');
  DOM.runBtn = document.getElementById('run-analysis-btn');
  DOM.statusText = document.getElementById('status-text');
  DOM.reportArea = document.getElementById('report-area');
  DOM.eventList = document.getElementById('event-list');
  DOM.tickerList = document.getElementById('ticker-list');
  DOM.metricSignal = document.getElementById('metric-signal');
  DOM.metricEvents = document.getElementById('metric-events');
  DOM.metricTickers = document.getElementById('metric-tickers');
  DOM.footerInfo = document.getElementById('footer-info');
  DOM.liveBadge = document.getElementById('live-badge');
  DOM.panelToggle = document.getElementById('panel-toggle');
  DOM.sidePanel = document.getElementById('side-panel');
  DOM.mobilePanelToggle = document.getElementById('mobile-panel-toggle');
}

function applyBranding() {
  if (DOM.brandName) DOM.brandName.textContent = CONFIG.BRAND_NAME;
  document.title = CONFIG.BRAND_NAME;
  const panelTitle = document.getElementById('panel-title');
  if (panelTitle) panelTitle.textContent = CONFIG.PANEL_TITLE || CONFIG.BRAND_NAME;
}

function bindEvents() {
  // Run analysis button
  if (DOM.runBtn) {
    DOM.runBtn.addEventListener('click', runAnalysis);
  }

  // Refresh button
  if (DOM.refreshBtn) {
    DOM.refreshBtn.addEventListener('click', () => {
      if (!AppState.isLoading) runAnalysis();
    });
  }

  // Tabs
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Panel toggle (desktop)
  if (DOM.panelToggle) {
    DOM.panelToggle.addEventListener('click', () => {
      DOM.sidePanel.classList.toggle('collapsed');
    });
  }

  // Mobile panel toggle
  if (DOM.mobilePanelToggle) {
    DOM.mobilePanelToggle.addEventListener('click', () => {
      DOM.sidePanel.classList.toggle('mobile-open');
    });
  }

  // Keyboard shortcut: Ctrl+Enter = Run analysis
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!AppState.isLoading) runAnalysis();
    }
  });
}

function initMap() {
  if (typeof mapboxgl === 'undefined') {
    console.error('Mapbox GL JS not loaded');
    return;
  }
  MapboxModule.initMap();
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.tab === tabName);
    t.setAttribute('aria-selected', t.dataset.tab === tabName ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-content').forEach((c) => {
    c.classList.toggle('hidden', c.id !== `tab-${tabName}`);
  });
}

// ============================================================
// RUN ANALYSIS (Main pipeline)
// ============================================================
async function runAnalysis() {
  if (AppState.isLoading) return;

  setLoading(true);
  setStatus('Running Langflow workflow…', 'loading');

  try {
    const url = buildLangflowUrl();
    const body = {
      input_value: 'Run OSINT market analysis',
      output_type: 'chat',
      input_type: 'chat',
    };

    const headers = { 'Content-Type': 'application/json' };
    if (!CONFIG.USE_PROXY && CONFIG.API_KEY) {
      headers['x-api-key'] = CONFIG.API_KEY;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${response.statusText}${errText ? ' — ' + errText.slice(0, 200) : ''}`);
    }

    const data = await response.json();
    handleLangflowResponse(data);

  } catch (error) {
    console.error('[Langflow Error]', error);
    setStatus(`❌ Failed: ${error.message}`, 'error');
    showError(`Analysis failed: ${error.message}`);
    updateLiveBadge(false);
  } finally {
    setLoading(false);
  }
}

function buildLangflowUrl() {
  if (CONFIG.USE_PROXY) {
    return `${CONFIG.PROXY_URL}/api/run-flow`;
  }
  return `${CONFIG.LANGFLOW_URL}/api/v1/run/${CONFIG.FLOW_ID}?stream=false`;
}

// ============================================================
// HANDLE LANGFLOW RESPONSE
// ============================================================
function handleLangflowResponse(data) {
  // Kumpulkan SEMUA teks output dari semua Chat Output nodes
  const allOutputs = [];
  try {
    const outputs = data.outputs || [];
    outputs.forEach((out) => {
      const inner = out.outputs || [];
      inner.forEach((o) => {
        const text = o?.results?.message?.text;
        if (text && typeof text === 'string') {
          allOutputs.push(text);
        }
      });
    });
  } catch (e) {
    console.warn('Failed to extract outputs:', e);
  }

  // DEBUG: log semua output yang diterima (hapus setelah selesai debugging)
  console.log('[DEBUG] Total outputs received:', allOutputs.length);
  allOutputs.forEach((t, i) => {
    console.log(`[DEBUG] Output #${i} (first 200 chars):`, t.slice(0, 200));
  });

  if (allOutputs.length === 0) {
    showReport(JSON.stringify(data, null, 2));
    setStatus('⚠️ No text output found in response.', 'error');
    updateLiveBadge(true);
    return;
  }

  // Cari output yang mengandung data event/sector yang kita butuhkan
  let bestOutput = null;
  let bestStructured = null;

  for (const text of allOutputs) {
    const structured = extractStructuredData(text);
    if (
      structured &&
      (structured.events ||
        structured.sectors_benefited ||
        structured.sectors_harmed)
    ) {
      bestOutput = text;
      bestStructured = structured;
      console.log('[DEBUG] Found structured data in output:', structured);
      break;
    }
  }

  // Fallback: jika tidak ada yang cocok, ambil output terlama
  if (!bestOutput) {
    console.warn('[DEBUG] No structured data found in any output. Falling back to first.');
    bestOutput = allOutputs[0];
    bestStructured = extractStructuredData(bestOutput);
  }

  showReport(bestOutput);

  if (bestStructured) {
    AppState.lastResult = bestStructured;
    processStructuredData(bestStructured);
    setStatus(
      `✅ Analysis complete. ${AppState.events.length} events, ${AppState.companies.length} companies.`,
      'success'
    );
  } else {
    setStatus(
      '⚠️ Analysis returned text but no structured JSON. Check the Report tab.',
      'error'
    );
    clearMarkers();
  }

  updateMetrics(bestStructured);
  updateLiveBadge(true);
}

function extractStructuredData(text) {
  if (!text) return null;

  // 1. Marker-based: ---JSON_START--- ... ---JSON_END---
  let match = text.match(/---\s*JSON_START\s*---\s*([\s\S]*?)\s*---\s*JSON_END\s*---/i);
  if (match) {
    const parsed = tryParseJson(match[1]);
    if (parsed) return parsed;
  }

  // 2. Markdown fence: ```json ... ```
  match = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (match) {
    const parsed = tryParseJson(match[1]);
    if (parsed && (parsed.sectors_benefited || parsed.sectors_harmed || parsed.events)) {
      return parsed;
    }
  }

  // 3. Balanced brace matching — cari objek JSON utuh
  const candidates = findBalancedJsonObjects(text);
  for (const candidate of candidates) {
    const parsed = tryParseJson(candidate);
    if (
      parsed &&
      (parsed.signal_strength !== undefined ||
        parsed.events ||
        parsed.sectors_benefited ||
        parsed.sectors_harmed)
    ) {
      return parsed;
    }
  }

  return null;
}

// Helper: cari semua objek JSON yang brace-nya seimbang
function findBalancedJsonObjects(text) {
  const results = [];

  for (let start = 0; start < text.length; start++) {
    if (text[start] !== '{') continue;

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < text.length; i++) {
      const ch = text[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (ch === '\\') {
        escape = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          results.push(text.slice(start, i + 1));
          break;
        }
      }
    }
  }

  // Urutkan dari yang paling panjang (paling mungkin JSON utuh)
  return results.sort((a, b) => b.length - a.length);
}

// Helper: parse JSON dengan pembersihan
function tryParseJson(str) {
  if (!str) return null;
  try {
    let cleaned = str
      .replace(/```/g, '')
      .replace(/,\s*([\]}])/g, '$1')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// // Helper: safe JSON parse
// function tryParseJson(str) {
//   if (!str) return null;
//   try {
//     // Bersihkan trailing commas
//     const cleaned = str.replace(/,\s*([\]}])/g, '$1').trim();
//     return JSON.parse(cleaned);
//   } catch (e) {
//     console.warn('[JSON Parse Failed]', e.message, '— Input:', str.slice(0, 200));
//     return null;
//   }
// }

// ============================================================
// PROCESS STRUCTURED DATA
// ============================================================
function processStructuredData(data) {
  // 1. Extract events (with lat/lon)
  const events = Array.isArray(data.events) ? data.events : [];

  // 2. Extract companies from sectors
  const companiesMap = new Map(); // ticker → { ticker, name, lat, lon, direction }
  const tickersList = [];

  const processSector = (sector, direction) => {
    const sectorName = sector.sector || 'Unknown sector';
    const mag = sector.impact_magnitude || '';
    const timing = sector.timing || '';
    const tickers = Array.isArray(sector.tickers) ? sector.tickers : [];

    tickers.forEach((ticker) => {
      const upper = String(ticker).toUpperCase().trim();
      if (!upper || upper.length > 6) return;

      tickersList.push({
        ticker: upper,
        sector: sectorName,
        direction,
        magnitude: mag,
        timing,
      });

      // Lookup coordinates
      if (!companiesMap.has(upper)) {
        const coords = MapboxModule.lookupCompanyCoords(upper);
        if (coords) {
          companiesMap.set(upper, {
            ticker: upper,
            name: coords.name,
            lat: coords.lat,
            lon: coords.lon,
            city: coords.city,
            direction,
          });
        }
      }
    });

    // Also process company_locations if provided
    if (Array.isArray(sector.company_locations)) {
      sector.company_locations.forEach((loc) => {
        if (loc.ticker && loc.lat && loc.lon) {
          companiesMap.set(loc.ticker.toUpperCase(), {
            ticker: loc.ticker.toUpperCase(),
            name: loc.name || loc.ticker,
            lat: loc.lat,
            lon: loc.lon,
            city: loc.city || '',
            direction,
          });
        }
      });
    }
  };

  (data.sectors_benefited || []).forEach((s) => processSector(s, 'benefited'));
  (data.sectors_harmed || []).forEach((s) => processSector(s, 'harmed'));

  AppState.events = events.slice(0, CONFIG.MAX_EVENTS_DISPLAY);
  AppState.companies = Array.from(companiesMap.values());
  AppState.tickers = tickersList.slice(0, CONFIG.MAX_TICKERS_DISPLAY);

  // Render on map
  MapboxModule.renderData({
    events: AppState.events,
    companies: AppState.companies,
  });

  // Render lists
  renderEventsList(AppState.events);
  renderTickersList(AppState.tickers);

  // Update event count badge
  if (DOM.eventCount) {
    DOM.eventCount.textContent = `${AppState.events.length} Events`;
  }
}

function clearMarkers() {
  AppState.events = [];
  AppState.companies = [];
  AppState.tickers = [];
  MapboxModule.renderData({ events: [], companies: [] });
  renderEventsList([]);
  renderTickersList([]);
  if (DOM.eventCount) DOM.eventCount.textContent = '0 Events';
}

// ============================================================
// RENDER EVENTS LIST
// ============================================================
function renderEventsList(events) {
  if (!DOM.eventList) return;
  DOM.eventList.innerHTML = '';

  if (events.length === 0) {
    DOM.eventList.innerHTML = '<li class="empty-state">No events detected.</li>';
    return;
  }

  events.forEach((event) => {
    const li = document.createElement('li');
    li.className = 'event-item';

    const severity = (event.severity || 'medium').toLowerCase();
    li.innerHTML = `
      <div class="event-header">
        <span class="event-severity severity-${severity}"></span>
        <span class="event-name">${escapeHtml(event.location_name || 'Unknown location')}</span>
      </div>
      <div class="event-meta">
        ${event.event_type ? `<strong>${escapeHtml(event.event_type)}</strong> · ` : ''}
        ${escapeHtml((event.description || '').slice(0, 120))}
      </div>
    `;

    li.addEventListener('click', () => {
      if (typeof event.latitude === 'number' && typeof event.longitude === 'number') {
        MapboxModule.flyToLocation(event.latitude, event.longitude, 5);
      }
    });

    DOM.eventList.appendChild(li);
  });
}

// ============================================================
// RENDER TICKERS LIST
// ============================================================
function renderTickersList(tickers) {
  if (!DOM.tickerList) return;
  DOM.tickerList.innerHTML = '';

  if (tickers.length === 0) {
    DOM.tickerList.innerHTML = '<li class="empty-state">No tickers detected.</li>';
    return;
  }

  tickers.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'ticker-item';

    const isBull = t.direction === 'benefited';
    const arrow = isBull ? '▲' : '▼';
    const coords = MapboxModule.lookupCompanyCoords(t.ticker);

    li.innerHTML = `
      <div class="ticker-left">
        <span class="ticker-symbol">${escapeHtml(t.ticker)}</span>
        <span class="ticker-name">${escapeHtml(coords?.name || t.sector)}</span>
      </div>
      <div class="ticker-right">
        <span class="ticker-move ${isBull ? 'bullish' : 'bearish'}">${arrow}</span>
        <span class="ticker-sector">${escapeHtml(t.magnitude || '')}</span>
      </div>
    `;

    li.addEventListener('click', () => {
      if (coords) MapboxModule.flyToLocation(coords.lat, coords.lon, 5);
    });

    DOM.tickerList.appendChild(li);
  });
}

// ============================================================
// UPDATE METRICS & STATUS
// ============================================================
function updateMetrics(structured) {
  if (DOM.metricSignal) {
    DOM.metricSignal.textContent = structured?.signal_strength ?? '—';
  }
  if (DOM.metricEvents) {
    DOM.metricEvents.textContent = AppState.events.length;
  }
  if (DOM.metricTickers) {
    DOM.metricTickers.textContent = AppState.tickers.length;
  }
}

function updateLiveBadge(online) {
  if (!DOM.liveBadge) return;
  DOM.liveBadge.classList.toggle('offline', !online);
  DOM.liveBadge.textContent = online ? '● LIVE' : '● OFFLINE';
}

function showReport(text) {
  if (!DOM.reportArea) return;
  DOM.reportArea.textContent = text || 'No content.';
}

function showError(message) {
  if (!DOM.reportArea) return;
  DOM.reportArea.textContent = `⚠️ ${message}`;
}

function setStatus(text, type = 'idle') {
  if (!DOM.statusText) return;
  DOM.statusText.textContent = text;
  DOM.statusText.classList.remove('success', 'error', 'loading');
  if (type === 'success') DOM.statusText.classList.add('success');
  else if (type === 'error') DOM.statusText.classList.add('error');
  else if (type === 'loading') DOM.statusText.classList.add('loading');
}

function setLoading(isLoading) {
  AppState.isLoading = isLoading;

  if (DOM.runBtn) {
    DOM.runBtn.disabled = isLoading;
    const btnText = DOM.runBtn.querySelector('.btn-text');
    const btnIcon = DOM.runBtn.querySelector('.btn-icon');
    if (btnText) btnText.textContent = isLoading ? 'Analyzing…' : 'Run Analysis';
    if (btnIcon) btnIcon.textContent = isLoading ? '⏳' : '▶';
  }

  if (DOM.refreshBtn) {
    DOM.refreshBtn.classList.toggle('spinning', isLoading);
  }
}

function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

// ============================================================
// CLEANUP (called on page unload)
// ============================================================
window.addEventListener('beforeunload', () => {
  if (AppState.refreshTimer) clearInterval(AppState.refreshTimer);
});