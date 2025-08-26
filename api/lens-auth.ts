// Pure Vercel Serverless Function (no Next.js required)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.LENS_AUTH_SECRET;

  // Accept secret via header, query, or body (GET/POST)
  let provided = (req.headers['x-lens-secret'] as string | undefined)
    || (req.query?.secret as string | undefined);

  if (!provided && req.body) {
    if (typeof req.body === 'string') {
      try { provided = JSON.parse(req.body)?.secret; } catch { /* ignore */ }
    } else if (typeof req.body === 'object') {
      provided = (req.body as any).secret;
    }
  }

  if (expected && provided !== expected) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  return res.status(200).json({ status: 'ok' });
}
