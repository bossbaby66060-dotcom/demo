const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  // Decode URL in case of encoded spaces/special characters
  let safeUrl = decodeURIComponent(req.url);

  // Parse URL to remove query parameters
  const urlPath = new URL(safeUrl, `http://localhost:${PORT}`).pathname;

  // Resolve directory or file path
  let filePath = path.join(__dirname, urlPath);
  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(__dirname, 'index.html');
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Not found, check clean URLs (e.g. /shop -> /shop.html)
      const cleanPath = filePath + '.html';
      fs.stat(cleanPath, (err2, stats2) => {
        if (!err2 && stats2.isFile()) {
          serveFile(cleanPath, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      });
      return;
    }

    if (stats.isDirectory()) {
      const indexFilePath = path.join(filePath, 'index.html');
      fs.stat(indexFilePath, (errIndex, statsIndex) => {
        if (!errIndex && statsIndex.isFile()) {
          serveFile(indexFilePath, res);
        } else {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 Forbidden: Directory Listing is Disabled');
        }
      });
    } else {
      serveFile(filePath, res);
    }
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500 Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  AURA WEAR LOCAL DEVELOPMENT SERVER IS RUNNING`);
  console.log(`  Url: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
