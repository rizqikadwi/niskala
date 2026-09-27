/* ================================================================
   COMPANY COORDINATE DATABASE
   Static mapping of ~150 major US-listed tickers to their HQ coordinates.
   Used to place company markers on the globe.
   ================================================================ */

const COMPANY_COORDS = {
  // ---- TECHNOLOGY ----
  'AAPL':  { name: 'Apple Inc.',           lat: 37.3349, lon: -122.0090, city: 'Cupertino, CA' },
  'MSFT':  { name: 'Microsoft',            lat: 47.6396, lon: -122.1280, city: 'Redmond, WA' },
  'GOOGL': { name: 'Alphabet (Google)',    lat: 37.4220, lon: -122.0841, city: 'Mountain View, CA' },
  'GOOG':  { name: 'Alphabet Class C',     lat: 37.4220, lon: -122.0841, city: 'Mountain View, CA' },
  'AMZN':  { name: 'Amazon',               lat: 47.6062, lon: -122.3321, city: 'Seattle, WA' },
  'META':  { name: 'Meta Platforms',       lat: 37.4848, lon: -122.1484, city: 'Menlo Park, CA' },
  'NVDA':  { name: 'NVIDIA',               lat: 37.3708, lon: -121.9634, city: 'Santa Clara, CA' },
  'TSLA':  { name: 'Tesla',                lat: 30.2672, lon: -97.7431,  city: 'Austin, TX' },
  'AMD':   { name: 'AMD',                  lat: 37.3708, lon: -121.9634, city: 'Santa Clara, CA' },
  'INTC':  { name: 'Intel',                lat: 37.3875, lon: -121.9630, city: 'Santa Clara, CA' },
  'ORCL':  { name: 'Oracle',               lat: 30.3500, lon: -97.7500,  city: 'Austin, TX' },
  'CRM':   { name: 'Salesforce',           lat: 37.7897, lon: -122.3972, city: 'San Francisco, CA' },
  'ADBE':  { name: 'Adobe',                lat: 37.3318, lon: -121.8936, city: 'San Jose, CA' },
  'NFLX':  { name: 'Netflix',              lat: 37.2560, lon: -121.9640, city: 'Los Gatos, CA' },
  'IBM':   { name: 'IBM',                  lat: 41.1007, lon: -73.7200,  city: 'Armonk, NY' },
  'CSCO':  { name: 'Cisco Systems',        lat: 37.4100, lon: -121.9500, city: 'San Jose, CA' },
  'QCOM':  { name: 'Qualcomm',             lat: 32.8950, lon: -117.1950, city: 'San Diego, CA' },
  'TXN':   { name: 'Texas Instruments',    lat: 32.9100, lon: -96.7500,  city: 'Dallas, TX' },
  'AVGO':  { name: 'Broadcom',             lat: 37.4100, lon: -121.9800, city: 'San Jose, CA' },
  'MU':    { name: 'Micron Technology',    lat: 43.6150, lon: -116.2023, city: 'Boise, ID' },
  'PLTR':  { name: 'Palantir',             lat: 39.7392, lon: -104.9903, city: 'Denver, CO' },
  'SNOW':  { name: 'Snowflake',            lat: 37.5600, lon: -122.2900, city: 'Bozeman, MT' },
  'UBER':  { name: 'Uber',                 lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'ABNB':  { name: 'Airbnb',               lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'SHOP':  { name: 'Shopify',              lat: 45.4215, lon: -75.6972,  city: 'Ottawa, ON' },
  'SQ':    { name: 'Block Inc.',           lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'PYPL':  { name: 'PayPal',               lat: 37.3541, lon: -121.9552, city: 'San Jose, CA' },
  'ZS':    { name: 'Zscaler',              lat: 37.3349, lon: -121.8890, city: 'San Jose, CA' },
  'CRWD':  { name: 'CrowdStrike',          lat: 30.2672, lon: -97.7431,  city: 'Austin, TX' },
  'PANW':  { name: 'Palo Alto Networks',   lat: 37.3900, lon: -122.0000, city: 'Santa Clara, CA' },

  // ---- FINANCIALS ----
  'JPM':   { name: 'JPMorgan Chase',       lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'BAC':   { name: 'Bank of America',      lat: 35.2271, lon: -80.8431, city: 'Charlotte, NC' },
  'WFC':   { name: 'Wells Fargo',          lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'GS':    { name: 'Goldman Sachs',        lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'MS':    { name: 'Morgan Stanley',       lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'C':     { name: 'Citigroup',            lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'BLK':   { name: 'BlackRock',            lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'V':     { name: 'Visa',                 lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'MA':    { name: 'Mastercard',           lat: 41.0200, lon: -73.7000, city: 'Purchase, NY' },
  'AXP':   { name: 'American Express',     lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'DB':    { name: 'Deutsche Bank',        lat: 50.1109, lon: 8.6821,  city: 'Frankfurt, DE' },
  'SCHW':  { name: 'Charles Schwab',       lat: 32.7767, lon: -96.7970, city: 'Dallas, TX' },

  // ---- ENERGY ----
  'XOM':   { name: 'Exxon Mobil',          lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'CVX':   { name: 'Chevron',              lat: 37.7749, lon: -121.9600, city: 'San Ramon, CA' },
  'COP':   { name: 'ConocoPhillips',       lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'EOG':   { name: 'EOG Resources',        lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'OXY':   { name: 'Occidental Petroleum', lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'SLB':   { name: 'Schlumberger',         lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'HAL':   { name: 'Halliburton',          lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'PSX':   { name: 'Phillips 66',          lat: 29.7604, lon: -95.3698, city: 'Houston, TX' },
  'VLO':   { name: 'Valero Energy',        lat: 29.4241, lon: -98.4936, city: 'San Antonio, TX' },
  'MPC':   { name: 'Marathon Petroleum',   lat: 41.4993, lon: -81.6944, city: 'Findlay, OH' },
  'SHEL':  { name: 'Shell',                lat: 51.9244, lon: 4.4777,  city: 'The Hague, NL' },
  'BP':    { name: 'BP',                   lat: 51.5074, lon: -0.1278, city: 'London, UK' },
  'TTE':   { name: 'TotalEnergies',        lat: 48.8566, lon: 2.3522,  city: 'Paris, FR' },

  // ---- SHIPPING / TANKERS ----
  'FRO':   { name: 'Frontline',            lat: 59.9139, lon: 10.7522, city: 'Oslo, NO' },
  'STNG':  { name: 'Scorpio Tankers',      lat: 43.7384, lon: 7.4246,  city: 'Monaco' },
  'TNK':   { name: 'Teekay Tankers',       lat: 49.2827, lon: -123.1207, city: 'Vancouver, CA' },
  'ZIM':   { name: 'ZIM Shipping',         lat: 32.7940, lon: 34.9896, city: 'Haifa, IL' },
  'DHT':   { name: 'DHT Holdings',         lat: 43.7384, lon: 7.4246,  city: 'Monaco' },
  'EURN':  { name: 'Euronav',              lat: 51.2194, lon: 4.4025,  city: 'Antwerp, BE' },
  'NMM':   { name: 'Navios Maritime',      lat: 37.9838, lon: 23.7275, city: 'Athens, GR' },
  'SBLK':  { name: 'Star Bulk Carriers',   lat: 37.9838, lon: 23.7275, city: 'Athens, GR' },

  // ---- TRANSPORTATION / LOGISTICS ----
  'FDX':   { name: 'FedEx',                lat: 35.1495, lon: -90.0490, city: 'Memphis, TN' },
  'UPS':   { name: 'UPS',                  lat: 33.7490, lon: -84.3880, city: 'Atlanta, GA' },
  'DAL':   { name: 'Delta Air Lines',      lat: 33.7490, lon: -84.3880, city: 'Atlanta, GA' },
  'UAL':   { name: 'United Airlines',      lat: 41.8781, lon: -87.6298, city: 'Chicago, IL' },
  'AAL':   { name: 'American Airlines',    lat: 32.7767, lon: -96.7970, city: 'Fort Worth, TX' },
  'LUV':   { name: 'Southwest Airlines',   lat: 32.7767, lon: -96.7970, city: 'Dallas, TX' },
  'BA':    { name: 'Boeing',               lat: 47.6062, lon: -122.3321, city: 'Seattle, WA' },

  // ---- DEFENSE / AEROSPACE ----
  'LMT':   { name: 'Lockheed Martin',      lat: 39.0580, lon: -77.1300, city: 'Bethesda, MD' },
  'RTX':   { name: 'RTX (Raytheon)',       lat: 42.3601, lon: -71.0589, city: 'Waltham, MA' },
  'NOC':   { name: 'Northrop Grumman',     lat: 34.2085, lon: -118.4900, city: 'Falls Church, VA' },
  'GD':    { name: 'General Dynamics',     lat: 38.8048, lon: -77.0469, city: 'Reston, VA' },
  'LHX':   { name: 'L3Harris',             lat: 28.0836, lon: -80.6081, city: 'Melbourne, FL' },
  'HII':   { name: 'Huntington Ingalls',   lat: 37.0300, lon: -76.3450, city: 'Newport News, VA' },

  // ---- HEALTHCARE / PHARMA ----
  'JNJ':   { name: 'Johnson & Johnson',    lat: 40.4862, lon: -74.4518, city: 'New Brunswick, NJ' },
  'PFE':   { name: 'Pfizer',               lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'MRK':   { name: 'Merck',                lat: 40.7306, lon: -74.3000, city: 'Kenilworth, NJ' },
  'LLY':   { name: 'Eli Lilly',            lat: 39.7684, lon: -86.1581, city: 'Indianapolis, IN' },
  'ABBV':  { name: 'AbbVie',               lat: 42.1771, lon: -87.8446, city: 'North Chicago, IL' },
  'BMY':   { name: 'Bristol-Myers Squibb', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'UNH':   { name: 'UnitedHealth',         lat: 44.9778, lon: -93.2650, city: 'Minnetonka, MN' },
  'CVS':   { name: 'CVS Health',           lat: 41.8240, lon: -71.4128, city: 'Woonsocket, RI' },

  // ---- CONSUMER ----
  'WMT':   { name: 'Walmart',              lat: 36.3729, lon: -94.2088, city: 'Bentonville, AR' },
  'COST':  { name: 'Costco',               lat: 47.5301, lon: -122.0326, city: 'Issaquah, WA' },
  'TGT':   { name: 'Target',               lat: 44.9778, lon: -93.2650, city: 'Minneapolis, MN' },
  'HD':    { name: 'Home Depot',           lat: 33.7490, lon: -84.3880, city: 'Atlanta, GA' },
  'LOW':   { name: 'Lowes',                lat: 35.5000, lon: -80.8500, city: 'Mooresville, NC' },
  'NKE':   { name: 'Nike',                 lat: 45.5152, lon: -122.6784, city: 'Beaverton, OR' },
  'SBUX':  { name: 'Starbucks',            lat: 47.6062, lon: -122.3321, city: 'Seattle, WA' },
  'MCD':   { name: "McDonald's",           lat: 41.8781, lon: -87.6298, city: 'Chicago, IL' },
  'KO':    { name: 'Coca-Cola',            lat: 33.7490, lon: -84.3880, city: 'Atlanta, GA' },
  'PEP':   { name: 'PepsiCo',              lat: 41.0200, lon: -73.7000, city: 'Purchase, NY' },
  'PG':    { name: 'Procter & Gamble',     lat: 39.1031, lon: -84.5120, city: 'Cincinnati, OH' },
  'TSN':   { name: 'Tyson Foods',          lat: 36.0626, lon: -94.1574, city: 'Springdale, AR' },

  // ---- MEDIA / ENTERTAINMENT ----
  'DIS':   { name: 'Walt Disney',          lat: 34.0522, lon: -118.2437, city: 'Burbank, CA' },
  'WBD':   { name: 'Warner Bros. Discovery', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'PARA':  { name: 'Paramount Global',     lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'NYT':   { name: 'New York Times',       lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'CMCSA': { name: 'Comcast',              lat: 39.9526, lon: -75.1652, city: 'Philadelphia, PA' },

  // ---- CLEAN ENERGY ----
  'ENPH':  { name: 'Enphase Energy',       lat: 38.2900, lon: -122.4600, city: 'Fremont, CA' },
  'FSLR':  { name: 'First Solar',          lat: 33.4484, lon: -112.0740, city: 'Tempe, AZ' },
  'NEE':   { name: 'NextEra Energy',       lat: 26.7153, lon: -80.0534, city: 'Juno Beach, FL' },
  'BEP':   { name: 'Brookfield Renewable', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'PLUG':  { name: 'Plug Power',           lat: 42.7300, lon: -73.6900, city: 'Latham, NY' },

  // ---- MATERIALS / MINING ----
  'FCX':   { name: 'Freeport-McMoRan',     lat: 33.4484, lon: -112.0740, city: 'Phoenix, AZ' },
  'NEM':   { name: 'Newmont',              lat: 39.7392, lon: -104.9903, city: 'Denver, CO' },
  'X':     { name: 'United States Steel',  lat: 40.4406, lon: -79.9959, city: 'Pittsburgh, PA' },
  'CLF':   { name: 'Cleveland-Cliffs',     lat: 41.4993, lon: -81.6944, city: 'Cleveland, OH' },
  'AA':    { name: 'Alcoa',                lat: 40.4406, lon: -79.9959, city: 'Pittsburgh, PA' },

  // ---- ETFs / INDICES ----
  'SPY':   { name: 'SPDR S&P 500 ETF',     lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'QQQ':   { name: 'Invesco QQQ Trust',    lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'DIA':   { name: 'SPDR Dow Jones ETF',   lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'IWM':   { name: 'iShares Russell 2000', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLE':   { name: 'Energy Select SPDR',   lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLF':   { name: 'Financial Select SPDR', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLK':   { name: 'Technology Select SPDR', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLV':   { name: 'Health Care Select SPDR', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLI':   { name: 'Industrial Select SPDR', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'XLU':   { name: 'Utilities Select SPDR', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'GLD':   { name: 'SPDR Gold Shares',     lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'USO':   { name: 'United States Oil Fund', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'UNG':   { name: 'United States Natural Gas', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'TLT':   { name: 'iShares 20+ Treasury', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'HYG':   { name: 'iShares High Yield Corp', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'LQD':   { name: 'iShares Inv Grade Corp', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EEM':   { name: 'iShares MSCI Emerging', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EMB':   { name: 'iShares Emerging Bond', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'PCY':   { name: 'Invesco Emerging Bond', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'VGK':   { name: 'Vanguard FTSE Europe', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWI':   { name: 'iShares MSCI Italy',   lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWU':   { name: 'iShares MSCI UK',      lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWJ':   { name: 'iShares MSCI Japan',   lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'FXI':   { name: 'iShares China Large-Cap', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWZ':   { name: 'iShares MSCI Brazil',  lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWW':   { name: 'iShares MSCI Mexico',  lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWT':   { name: 'iShares MSCI Taiwan',  lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EWY':   { name: 'iShares MSCI South Korea', lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'EIS':   { name: 'iShares MSCI Israel',  lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'TUR':   { name: 'iShares MSCI Turkey',  lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'RSX':   { name: 'VanEck Russia ETF',    lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'KSA':   { name: 'iShares MSCI Saudi',   lat: 40.7549, lon: -73.9780, city: 'New York, NY' },
  'UAE':   { name: 'iShares MSCI UAE',     lat: 40.7549, lon: -73.9780, city: 'New York, NY' },

  // ---- CRYPTO-RELATED EQUITIES ----
  'COIN':  { name: 'Coinbase',             lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA' },
  'MSTR':  { name: 'MicroStrategy',        lat: 38.8951, lon: -77.0364, city: 'Tysons Corner, VA' },
  'MARA':  { name: 'Marathon Digital',     lat: 26.1224, lon: -80.1373, city: 'Fort Lauderdale, FL' },
  'RIOT':  { name: 'Riot Platforms',       lat: 30.2672, lon: -97.7431, city: 'Austin, TX' },
};

// Freeze to prevent accidental mutation
Object.freeze(COMPANY_COORDS);