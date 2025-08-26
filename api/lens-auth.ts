import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Friendly defaults
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', 'GET,POST,HEAD,OPTIONS');

  // Always OK for connectivity checks
  if (req.method === 'HEAD' || req.method === 'OPTIONS' || req.method === 'GET') {
    return res.status(200).send(JSON.stringify({ status: 'ok' }));
  }

  const expected = process.env.LENS_AUTH_SECRET;

  // Accept secret via header, query, or body
  let provided =
    (req.headers['x-lens-secret'] as string | undefined) ||
    (req.query?.secret as string | undefined);

  if (!provided && req.body) {
    try {
      provided =
        typeof req.body === 'string'
          ? JSON.parse(req.body)?.secret
          : (req.body as any)?.secret;
    } catch {
      /* ignore */
    }
  }

  if (expected && provided !== expected) {
    return res.status(401).send(JSON.stringify({ error: 'Invalid secret' }));
  }

  return res.status(200).send(JSON.stringify({ status: 'ok' }));
}
