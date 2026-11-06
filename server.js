const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');
const crm = require('./js/crm-backend');
const { verifyRecaptcha } = require('./js/recaptcha-verify');

const PORT = process.env.PORT || 3000;

function parseJsonBody(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
    if (body.length > 1e6) {
      req.destroy();
    }
  });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg'
};

const server = http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  if (host.startsWith('www.')) {
    const nonWwwHost = host.replace(/^www\./, '');
    res.writeHead(301, { 'Location': `https://${nonWwwHost}${req.url}` });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const cleanUrl = parsedUrl.pathname || '/';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ==========================================
  // CRM & WhatsApp Automation API Endpoints
  // ==========================================

  // 1. GET /api/leads - Fetch all leads and CRM stats
  if (req.method === 'GET' && cleanUrl === '/api/leads') {
    return sendJson(res, 200, {
      leads: crm.getLeads(),
      stats: crm.getStats(),
      settings: crm.getSettings()
    });
  }

  // 2. POST /api/leads - Create new lead with Google reCAPTCHA v3 & CRM Automation
  if (req.method === 'POST' && cleanUrl === '/api/leads') {
    return parseJsonBody(req, async (err, data) => {
      if (err || !data.name || !data.phone) {
        return sendJson(res, 400, { error: 'Name and Phone are required' });
      }

      // Verify Google reCAPTCHA v3
      const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || '';
      const verification = await verifyRecaptcha(data.recaptchaToken, clientIp);

      data.recaptchaVerified = verification.verified;
      data.recaptchaScore = verification.score;

      const result = crm.createLead(data);
      return sendJson(res, 201, { success: true, recaptcha: verification, ...result });
    });
  }

  // 3. PATCH /api/leads/:id - Update lead status or add note
  if (req.method === 'PATCH' && cleanUrl.startsWith('/api/leads/')) {
    const leadId = cleanUrl.replace('/api/leads/', '');
    return parseJsonBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const updated = crm.updateLead(leadId, data);
      if (!updated) return sendJson(res, 404, { error: 'Lead not found' });
      return sendJson(res, 200, { success: true, lead: updated });
    });
  }

  // 4. DELETE /api/leads/:id - Delete a lead
  if (req.method === 'DELETE' && cleanUrl.startsWith('/api/leads/')) {
    const leadId = cleanUrl.replace('/api/leads/', '');
    const deleted = crm.deleteLead(leadId);
    if (!deleted) return sendJson(res, 404, { error: 'Lead not found' });
    return sendJson(res, 200, { success: true });
  }

  // 5. GET /api/leads/export - Download CSV export
  if (req.method === 'GET' && cleanUrl === '/api/leads/export') {
    const csvData = crm.exportCsv();
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="salowtech-leads.csv"'
    });
    return res.end(csvData);
  }

  // 6. POST /api/crm/settings - Update CRM WhatsApp settings
  if (req.method === 'POST' && cleanUrl === '/api/crm/settings') {
    return parseJsonBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const updated = crm.saveSettings(data);
      return sendJson(res, 200, { success: true, settings: updated });
    });
  }

  // 7. GET /api/webhook/whatsapp - Meta WhatsApp Cloud API verification
  if (req.method === 'GET' && cleanUrl === '/api/webhook/whatsapp') {
    const mode = parsedUrl.query['hub.mode'];
    const token = parsedUrl.query['hub.verify_token'];
    const challenge = parsedUrl.query['hub.challenge'];
    const settings = crm.getSettings();

    if (mode === 'subscribe' && token === settings.webhookVerifyToken) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(challenge);
    }
    res.writeHead(403);
    return res.end('Verification failed');
  }

  // 8. POST /api/webhook/whatsapp - Meta WhatsApp Cloud API Inbound message
  if (req.method === 'POST' && cleanUrl === '/api/webhook/whatsapp') {
    return parseJsonBody(req, (err, payload) => {
      if (!err && payload && payload.entry) {
        try {
          const entry = payload.entry[0];
          const change = entry.changes[0];
          const value = change.value;
          if (value && value.messages && value.messages[0]) {
            const msg = value.messages[0];
            const from = msg.from;
            const text = msg.text ? msg.text.body : 'Inbound WhatsApp interaction';
            crm.createLead({
              name: `WhatsApp Lead (${from})`,
              phone: `+${from}`,
              email: '',
              message: text,
              service: 'WhatsApp Direct Chat',
              sourcePage: 'WhatsApp Cloud Webhook'
            });
          }
        } catch { }
      }
      return sendJson(res, 200, { status: 'EVENT_RECEIVED' });
    });
  }

  // Temporary redirect while testimonials page is hidden
  if (cleanUrl === '/testimonials.html' || cleanUrl === '/testimonials') {
    res.writeHead(302, { 'Location': '/' });
    return res.end();
  }

  // Legacy URL Redirects
  if (cleanUrl === '/erp-solutions.html' || cleanUrl === '/erp-solutions') {
    res.writeHead(301, { 'Location': '/erp-development' });
    return res.end();
  }
  if (cleanUrl === '/seo-digital-growth.html' || cleanUrl === '/seo-digital-growth') {
    res.writeHead(301, { 'Location': '/seo-and-growth' });
    return res.end();
  }
  if (cleanUrl === '/app-development.html' || cleanUrl === '/app-development' ||
      cleanUrl === '/mobile app development.html' || cleanUrl === '/mobile app development' ||
      cleanUrl === '/mobile-app-development.html') {
    res.writeHead(301, { 'Location': '/mobile-app-development' });
    return res.end();
  }
  if (cleanUrl === '/terms' || cleanUrl === '/terms-of-service' || cleanUrl === '/tos' || cleanUrl === '/terms.html') {
    res.writeHead(301, { 'Location': '/terms-and-conditions' });
    return res.end();
  }
  if (cleanUrl === '/privacy' || cleanUrl === '/privacy.html') {
    res.writeHead(301, { 'Location': '/privacy-policy' });
    return res.end();
  }

  const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, '');
  const relativePath = (!safePath || safePath === '/' || safePath === '\\') ? 'index.html' : safePath.replace(/^[\/\\]+/, '');
  const filePath = path.join(__dirname, relativePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const sendHtmlResponse = (statusCode, htmlContent, cacheHeader = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0') => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': cacheHeader,
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    if (acceptEncoding.includes('gzip')) {
      zlib.gzip(htmlContent, (gzErr, gzipped) => {
        if (gzErr) {
          headers['Content-Length'] = Buffer.byteLength(htmlContent);
          res.writeHead(statusCode, headers);
          return res.end(htmlContent);
        }
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = gzipped.length;
        headers['Vary'] = 'Accept-Encoding';
        res.writeHead(statusCode, headers);
        res.end(gzipped);
      });
    } else {
      headers['Content-Length'] = Buffer.byteLength(htmlContent);
      res.writeHead(statusCode, headers);
      res.end(htmlContent);
    }
  };

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Resolve extensionless routes (e.g. /contact-us -> contact-us.html, /404 -> 404.html)
        if (!ext) {
          const htmlPath = filePath + '.html';
          if (fs.existsSync(htmlPath)) {
            fs.readFile(htmlPath, (readErr, content) => {
              if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
              } else {
                sendHtmlResponse(200, content);
              }
            });
            return;
          }
        }

        // Serve 404.html with 404 status for missing html/page routes
        if (!ext || ext === '.html') {
          const notFoundPath = path.join(__dirname, '404.html');
          fs.readFile(notFoundPath, (error, notFoundContent) => {
            if (error) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
            } else {
              sendHtmlResponse(404, notFoundContent);
            }
          });
        } else {
          // Never return HTML for missing media or script assets
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`404 Not Found: ${cleanUrl}`);
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.readFile(indexPath, (dirErr, dirContent) => {
        if (dirErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Directory has no index.html');
        } else {
          sendHtmlResponse(200, dirContent);
        }
      });
      return;
    }

    // Video Streaming with full RFC 7233 HTTP Range support
    if (ext === '.mp4' || ext === '.webm' || ext === '.ogg') {
      const fileSize = stats.size;
      const range = req.headers.range;

      if (req.method === 'HEAD') {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes'
        });
        res.end();
        return;
      }

      if (range) {
        // Parse range header: e.g. "bytes=0-1023", "bytes=1024-", "bytes=-1024"
        const bytesMatch = range.match(/bytes=([0-9]*)-([0-9]*)/);
        if (!bytesMatch) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`,
            'Accept-Ranges': 'bytes'
          });
          res.end();
          return;
        }

        let start;
        let end;

        if (bytesMatch[1] === '' && bytesMatch[2] !== '') {
          // Suffix byte range: e.g. -1024 (last 1024 bytes)
          const suffix = parseInt(bytesMatch[2], 10);
          start = Math.max(0, fileSize - suffix);
          end = fileSize - 1;
        } else if (bytesMatch[1] !== '' && bytesMatch[2] === '') {
          // Open range: e.g. 1000-
          start = parseInt(bytesMatch[1], 10);
          end = fileSize - 1;
        } else if (bytesMatch[1] !== '' && bytesMatch[2] !== '') {
          // Explicit range: e.g. 0-1000
          start = parseInt(bytesMatch[1], 10);
          end = parseInt(bytesMatch[2], 10);
        } else {
          start = 0;
          end = fileSize - 1;
        }

        // Validate range bounds according to RFC 7233
        if (isNaN(start) || isNaN(end) || start >= fileSize || start > end || start < 0) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`,
            'Accept-Ranges': 'bytes'
          });
          res.end();
          return;
        }

        // Clamp end to fileSize - 1
        end = Math.min(end, fileSize - 1);
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });

        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.on('error', (streamErr) => {
          if (!res.headersSent) {
            res.writeHead(500);
          }
          res.end();
        });
        res.on('close', () => {
          fileStream.destroy();
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes'
        });
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', () => {
          if (!res.headersSent) res.writeHead(500);
          res.end();
        });
        res.on('close', () => {
          fileStream.destroy();
        });
        fileStream.pipe(res);
      }
      return;
    }

    const isStaticAsset = ext !== '.html' && ext !== '' && (cleanUrl.startsWith('/assets/') || cleanUrl.startsWith('/css/') || cleanUrl.startsWith('/js/') || ext === '.ico' || ext === '.svg' || ext === '.png' || ext === '.jpg' || ext === '.woff2');
    const cacheHeader = isStaticAsset ? 'public, max-age=31536000, immutable' : 'no-cache';

    if (req.method === 'HEAD') {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
        'Cache-Control': cacheHeader
      });
      return res.end();
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = /^(text\/|application\/(javascript|json)|image\/svg\+xml)/.test(contentType);

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Vary': 'Accept-Encoding',
        'Cache-Control': cacheHeader
      });
      const staticStream = fs.createReadStream(filePath);
      const gzip = zlib.createGzip({ level: 6 });
      staticStream.on('error', () => res.end());
      res.on('close', () => staticStream.destroy());
      staticStream.pipe(gzip).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
        'Cache-Control': cacheHeader
      });
      const staticStream = fs.createReadStream(filePath);
      staticStream.on('error', () => {
        res.end();
      });
      res.on('close', () => {
        staticStream.destroy();
      });
      staticStream.pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Salowtech web server running at http://localhost:${PORT}`);
});
