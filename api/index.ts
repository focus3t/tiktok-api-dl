import { VercelRequest, VercelResponse } from '@vercel/node';
import TikTokScraper from '../lib/index.js'; // đường dẫn tới code chính sau khi build

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Thiếu tham số ?url=' });
    }

    const result = await TikTokScraper(url);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
