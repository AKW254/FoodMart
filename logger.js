const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const logRequest = (req, res, statusCode) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${req.method} request for ${req.url} - ${statusCode} ${res.statusMessage}\n`;
  console.log(logMessage.trim());
  logStream.write(logMessage);
};

module.exports = logRequest;
