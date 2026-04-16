const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

function readCollection() {
  try { return fs.readFileSync(DATA_FILE, 'utf8'); }
  catch { return '[]'; }
}

function writeCollection(body) {
  JSON.parse(body); // validate JSON before writing
  fs.writeFileSync(DATA_FILE, body, 'utf8');
}

const server = http.createServer((req, res) => {
  // API routes
  if (req.url === '/api/collection') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(readCollection());
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          writeCollection(body);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end('{"error":"Invalid JSON"}');
        }
      });
      return;
    }
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Terry's Vinyl running at http://localhost:${PORT}`);
});
