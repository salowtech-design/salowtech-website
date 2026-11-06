const https = require('https');

// Google reCAPTCHA v3 Server Secret (Loaded from Environment Variables)
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (_) {}

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';

/**
 * Verify a Google reCAPTCHA v3 token against Google's siteverify API.
 * @param {string} token - The client-generated reCAPTCHA token.
 * @param {string} remoteIp - Optional client IP address.
 * @returns {Promise<{verified: boolean, score: number|null, action?: string, hostname?: string, errorCodes?: string[], reason?: string}>}
 */
function verifyRecaptcha(token, remoteIp) {
  if (!token || typeof token !== 'string') {
    return Promise.resolve({
      verified: false,
      score: null,
      reason: 'token_not_provided'
    });
  }

  return new Promise((resolve) => {
    try {
      const postData = `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}${remoteIp ? `&remoteip=${encodeURIComponent(remoteIp)}` : ''}`;

      const req = https.request({
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 4000
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            const verified = Boolean(data.success);
            const score = typeof data.score === 'number' ? data.score : (verified ? 1.0 : 0.0);
            resolve({
              verified,
              score,
              action: data.action,
              hostname: data.hostname,
              errorCodes: data['error-codes'] || []
            });
          } catch (err) {
            resolve({ verified: false, score: null, reason: 'parse_error', error: err.message });
          }
        });
      });

      req.on('error', (err) => {
        // Network or DNS error (e.g. sandbox or offline)
        resolve({ verified: false, score: null, reason: 'network_error', error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ verified: false, score: null, reason: 'timeout' });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      resolve({ verified: false, score: null, reason: 'invocation_error', error: err.message });
    }
  });
}

module.exports = {
  RECAPTCHA_SECRET,
  verifyRecaptcha
};

