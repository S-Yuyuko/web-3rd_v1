import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine if the environment is development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Load SSL certificates for HTTPS
const httpsOptions = {
  key: readFileSync(join(__dirname, 'certificates', 'localhost-key.pem')),
  cert: readFileSync(join(__dirname, 'certificates', 'localhost.pem')),
  ca: readFileSync(join('C:/Users/13052/AppData/Local/mkcert', 'rootCA.pem')), // Include the rootCA.pem

};

// Prepare and start the Next.js server
app.prepare().then(() => {
  console.log(`Next.js app is prepared in ${dev ? 'development' : 'production'} mode.`);
  
  // Create HTTPS server with SSL certificates
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Server running at https://localhost:3000');
  });
}).catch((err) => {
  console.error('Error during app preparation:', err);
});
