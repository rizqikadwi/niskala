/* ================================================================
   NISKALA — CONFIGURATION TEMPLATE
   Copy file ini menjadi `config.js` lalu isi nilai-nilainya.
   ================================================================ */

const CONFIG = {
  // ---------------- MAPBOX ----------------
  MAPBOX_TOKEN: 'pk.eyJ1Ijoi...',  // ← Ganti dengan token Anda

  // ---------------- LANGFLOW ----------------
  LANGFLOW_URL: 'http://localhost:7860',
  FLOW_ID: 'paste-flow-id-ui-di-sini',
  FLOW_ID_REPORT: 'paste-flow-id-report-di-sini',
  API_KEY: 'sk-...',  // ← Ganti dengan key Anda

  // ---------------- BRANDING ----------------
  BRAND_NAME: 'Niskala',
  PANEL_TITLE: 'Niskala Market Intelligence',

  // ---------------- BEHAVIOR ----------------
  AUTO_ROTATE: false,
  REFRESH_INTERVAL: 0,
  USE_PROXY: false,
  PROXY_URL: 'http://localhost:3001',

  // ---------------- DISPLAY ----------------
  MAX_EVENTS_DISPLAY: 50,
  MAX_TICKERS_DISPLAY: 60,
  SHOW_LEGEND: true,
  SHOW_CHOKEPOINTS: true,
};