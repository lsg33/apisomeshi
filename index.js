const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Security Headers
app.use(helmet());

// Function to extract the target URL from the request
function getTargetUrl(req) {
  const urlParts = req.url.split('/');
  const targetUrl = urlParts.slice(1).join('/'); // Everything after the first slash
  return targetUrl.startsWith('http') ? targetUrl : `http://${targetUrl}`;
}

// Middleware to dynamically proxy the request
app.use('*', (req, res, next) => {
  const targetUrl = getTargetUrl(req);
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Invalid target URL' });
  }

  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/${targetUrl}`]: '', // Remove the original path prefix when proxying
    },
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  });

  proxy(req, res, next);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
