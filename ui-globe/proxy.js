/* ================================================================
   LANGFLOW PROXY SERVER
   Minimal Node.js proxy that hides the API key from the browser.
   
   Usage:
     LANGFLOW_API_KEY=sk-... LANGFLOW_URL=http://localhost:7860 \
     FLOW_ID=your-flow-id node proxy.js
   
   Then set USE_PROXY=true in config.js.
   ================================================================ */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3001;
const LANGFLOW_URL = process.env.LANGFLOW_URL || 'http://localhost:7860';
const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY || '';
const FLOW_ID = process.env.FLOW_ID || '';

if (!LANGFLOW_API_KEY || !FLOW_ID) {
  console.error('❌ Missing environment variables:');
  console.error('   LANGFLOW_API_KEY=sk-...');
  console.error('   FLOW_ID=your-flow-id');
  console.error('   LANGFLOW_URL=http://localhost:7860  (optional)');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/run-flow') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1024 * 1024) { // 1MB limit
      res.writeHead(413);
      res.end('Payload too large');
      req.destroy();
    }
  });

  req.on('end', () => {
    try {
      const targetUrl = new URL(`${LANGFLOW_URL}/api/v1/run/${FLOW_ID}?stream=false`);
      const transport = targetUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LANGFLOW_API_KEY,
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const proxyReq = transport.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': proxyRes.headers['content-type'] || 'application/json',
        });
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Upstream error: ' + err.message }));
      });

      proxyReq.write(body);
      proxyReq.end();

    } catch (err) {
      console.error('Request error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
  console.log(`   Forwarding to: ${LANGFLOW_URL}/api/v1/run/${FLOW_ID}`);
  console.log(`   API key: ${LANGFLOW_API_KEY.slice(0, 8)}...`);
});