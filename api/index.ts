import { VercelRequest, VercelResponse } from '@vercel/node';
import TikTokScraper from '../lib/index.js'; // đường dẫn tới code chính sau khi build

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url || req.query.link || req.body?.url || req.body?.link;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Thiếu liên kết video TikTok' });
  }

  try {
    const result = await tiktok(url);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
