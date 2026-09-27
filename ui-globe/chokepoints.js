/* ================================================================
   STRATEGIC CHOKEPOINTS DATABASE
   Static overlay showing major global maritime/energy chokepoints.
   ================================================================ */

const CHOKEPOINTS = [
  {
    name: 'Strait of Hormuz',
    lat: 26.5667, lon: 56.2500,
    radius_km: 150,
    throughput: '~21 million barrels/day (oil)',
    significance: 'Critical oil transit route; Iran on north, Oman/UAE on south',
  },
  {
    name: 'Strait of Malacca',
    lat: 2.5000, lon: 100.5000,
    radius_km: 200,
    throughput: '~16 million barrels/day (oil)',
    significance: 'Primary trade route between Indian & Pacific Oceans',
  },
  {
    name: 'Suez Canal',
    lat: 30.5000, lon: 32.5500,
    radius_km: 100,
    throughput: '~5 million barrels/day (oil)',
    significance: 'Connects Mediterranean to Red Sea; ~12% of global trade',
  },
  {
    name: 'Bab-el-Mandeb',
    lat: 12.5833, lon: 43.3333,
    radius_km: 100,
    throughput: '~6 million barrels/day (oil)',
    significance: 'Gateway between Red Sea and Gulf of Aden; Houthi activity',
  },
  {
    name: 'Panama Canal',
    lat: 9.0800, lon: -79.6800,
    radius_km: 80,
    throughput: '~1 million barrels/day (oil)',
    significance: 'Connects Atlantic & Pacific; drought-sensitive',
  },
  {
    name: 'Taiwan Strait',
    lat: 24.5000, lon: 119.5000,
    radius_km: 150,
    throughput: '~100+ ships/day (semiconductors)',
    significance: 'Critical semiconductor supply route; PRC-Taiwan tension',
  },
  {
    name: 'Bosphorus Strait',
    lat: 41.1194, lon: 29.0779,
    radius_km: 50,
    throughput: '~3 million barrels/day (oil)',
    significance: 'Russian oil & Black Sea grain export route',
  },
  {
    name: 'Danish Straits',
    lat: 55.5000, lon: 10.0000,
    radius_km: 80,
    throughput: '~4 million barrels/day (oil)',
    significance: 'Russian oil export route to Europe',
  },
  {
    name: 'Cape of Good Hope',
    lat: -34.3568, lon: 18.4740,
    radius_km: 200,
    throughput: 'Alternate route bypass',
    significance: 'Fallback when Suez/Red Sea is blocked',
  },
];

Object.freeze(CHOKEPOINTS);