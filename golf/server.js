'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');
const STATIC_DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/courses') {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      res.end(JSON.stringify(readData()));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        if (!Array.isArray(parsed)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Expected array' }));
          return;
        }
        writeData(parsed);
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }

    res.writeHead(405);
    res.end();
    return;
  }

  let filePath = path.join(STATIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname);

  // Prevent path traversal outside the golf directory
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Golf Booking Reminders running at http://localhost:${PORT}`);
});
