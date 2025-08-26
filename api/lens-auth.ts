import type { VercelRequest, VercelResponse } from '@vercel/node';

function setHeaders(res: VercelResponse) {
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET,POST,HEAD,OPTIONS');
  res.setHeader('access-control-allow-headers', 'authorization,content-type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setHeaders(res);

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).send(JSON.stringify({ status: 'ok' }));
  }
  if (req.method === 'GET') {
    // Connectivity check
    return res.status(200).send(JSON.stringify({ status: 'ok' }));
  }

  // POST: validate Bearer token, then return REQUIRED payload
  const expected = process.env.LENS_AUTH_SECRET || '';
  const auth = (req.headers['authorization'] as string | undefined) || '';
  const provided = auth.replace(/^Bearer\s+/i, '');

  if (!expected || provided !== expected) {
    // “Invalid Token” case
    return res.status(401).send(JSON.stringify({ allowed: false, error: 'Invalid token' }));
  }

  // Access Granted (required shape)
  return res.status(200).send(JSON.stringify({ allowed: true, sponsored: true }));
}
