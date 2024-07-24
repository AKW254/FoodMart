const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const logRequest = require('./logger');

const hostname = '127.0.0.1';
const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let filePath = path.join(__dirname, 'frontend', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        filePath = path.join(__dirname, 'frontend', '404.html');
        fs.access(filePath, fs.constants.F_OK, (error) => {
          if (error) {
            filePath = path.join(__dirname, 'frontend', '404.html');
            fs.access(filePath, fs.constants.F_OK, (error) => {
              if (error) {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                logRequest(req, res, 500);
              } else {
                res.writeHead(302, { 'Location': 'frontend/404.html' });
                res.end();
                logRequest(req, res, 302);
              }
            });
          } else {
            fs.readFile(filePath, (error, content) => {
              if (error) {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                logRequest(req, res, 500);
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
                logRequest(req, res, 200);
              }
            });
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
        logRequest(req, res, 500);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      logRequest(req, res, 200);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

