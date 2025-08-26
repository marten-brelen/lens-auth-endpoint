import type { VercelRequest, VercelResponse } from '@vercel/node';

function setHeaders(res: VercelResponse) {
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  // CORS (dashboard may call from browser)
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET,POST,HEAD,OPTIONS');
  res.setHeader('access-control-allow-headers', 'authorization,content-type,x-lens-secret,x-secret,x-api-key');
}

function ok(res: VercelResponse) {
  setHeaders(res);
  return res.status(200).send(JSON.stringify({ status: 'ok' }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'HEAD' || req.method === 'OPTIONS' || req.method === 'GET') {
    return ok(res); // always 200 for connectivity tests
  }

  setHeaders(res);
  const expected = process.env.LENS_AUTH_SECRET;

  // from headers
  const auth = (req.headers['authorization'] as string | undefined)?.replace(/^Bearer\s+/i, '');
  const h1 = req.headers['x-lens-secret'] as string | undefined;
  const h2 = req.headers['x-secret'] as string | undefined;
  const h3 = req.headers['x-api-key'] as string | undefined;

  // from query
  const q1 = (req.query?.secret as string | undefined) || (req.query?.token as string | undefined);

  // from body
  let b1: string | undefined;
  if (req.body) {
    try {
      const obj = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      b1 = obj?.secret || obj?.token;
    } catch { /* ignore */ }
  }

  const provided = auth || h1 || h2 || h3 || q1 || b1 || '';

  if (expected && provided !== expected) {
    // Respond 401 only on POST when a mismatched secret is provided
    return res.status(401).send(JSON.stringify({ error: 'Invalid secret' }));
  }
  return res.status(200).send(JSON.stringify({ status: 'ok' }));
}
