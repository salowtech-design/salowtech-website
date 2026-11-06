export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Basic field validation
    if (!data.name || !data.phone) {
      return new Response(JSON.stringify({ error: 'Name and Phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Google reCAPTCHA verification via Cloudflare Edge
    let recaptchaVerified = true;
    let recaptchaScore = 0.9;
    const recaptchaSecret = context.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && data.recaptchaToken) {
      try {
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(data.recaptchaToken)}`
        });
        const verifyJson = await verifyRes.json();
        recaptchaVerified = !!verifyJson.success;
        recaptchaScore = verifyJson.score || 0;
      } catch (_) {}
    }

    return new Response(JSON.stringify({
      success: true,
      recaptcha: { verified: recaptchaVerified, score: recaptchaScore },
      message: 'Lead received successfully at Salowtech Edge'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'Salowtech Cloudflare Edge Function Active',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

