import type { VercelRequest, VercelResponse } from '@vercel/node';
import tiktok from '../src/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url, version } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing url parameter' });
    }

    const result = await tiktok.Downloader(url, {
      version: (version as any) || 'v1'
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
