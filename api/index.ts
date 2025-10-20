import { TiktokDL } from '../src/index';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Thiếu tham số ?url=' });
    }

    const result = await TiktokDL(url, { version: "v1" });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi xử lý TikTok' });
  }
}
