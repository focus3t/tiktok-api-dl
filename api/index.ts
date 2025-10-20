import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dùng require vì module của bạn xuất kiểu CommonJS
const TikTokAPI = require('../src/index');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url, username, keyword, type, version, cookie, proxy, count, page } = req.query;

    // Nếu có param url => Downloader
    if (url && typeof url === 'string') {
      const result = await TikTokAPI.Downloader(url, { version: (version as string) || 'v1', proxy: proxy as string });
      return res.status(200).json(result);
    }

    // Nếu có param username => StalkUser / GetUserPosts / GetUserLiked / GetUserReposts
    if (username && typeof username === 'string') {
      const action = req.query.action as string;

      switch (action) {
        case 'stalk':
          return res.status(200).json(await TikTokAPI.StalkUser(username, { proxy: proxy as string }));
        case 'posts':
          return res.status(200).json(await TikTokAPI.GetUserPosts(username, { proxy: proxy as string, postLimit: count ? Number(count) : undefined }));
        case 'liked':
          if (!cookie) return res.status(400).json({ error: 'Thiếu cookie cho GetUserLiked' });
          return res.status(200).json(await TikTokAPI.GetUserLiked(username, { cookie, proxy: proxy as string, postLimit: count ? Number(count) : undefined }));
        case 'reposts':
          return res.status(200).json(await TikTokAPI.GetUserReposts(username, { proxy: proxy as string, postLimit: count ? Number(count) : undefined }));
        default:
          return res.status(400).json({ error: 'action không hợp lệ cho username' });
      }
    }

    // Nếu có param keyword => Search
    if (keyword && typeof keyword === 'string') {
      if (!type) return res.status(400).json({ error: 'Thiếu type cho Search (user/live/video)' });
      const searchType = type as 'user' | 'live' | 'video';
      return res.status(200).json(await TikTokAPI.Search(keyword, { type: searchType, cookie, page: page ? Number(page) : undefined, proxy: proxy as string }));
    }

    // Nếu có param playlistId => Playlist
    if (req.query.playlistId && typeof req.query.playlistId === 'string') {
      return res.status(200).json(await TikTokAPI.Playlist(req.query.playlistId as string, { proxy: proxy as string, page: page ? Number(page) : undefined, count: count ? Number(count) : undefined }));
    }

    // Nếu có param collectionId => Collection
    if (req.query.collectionId && typeof req.query.collectionId === 'string') {
      return res.status(200).json(await TikTokAPI.Collection(req.query.collectionId as string, { proxy: proxy as string, page: page ? Number(page) : undefined, count: count ? Number(count) : undefined }));
    }

    // Nếu có param trending => Trending hoặc TrendingCreators
    if (req.query.trending !== undefined) {
      if (req.query.trending === 'creators') {
        return res.status(200).json(await TikTokAPI.TrendingCreators({ proxy: proxy as string }));
      } else {
        return res.status(200).json(await TikTokAPI.Trending({ proxy: proxy as string }));
      }
    }

    // Nếu có param musicId => GetVideosByMusicId
    if (req.query.musicId && typeof req.query.musicId === 'string') {
      return res.status(200).json(await TikTokAPI.GetVideosByMusicId(req.query.musicId as string, { proxy: proxy as string, page: page ? Number(page) : undefined, count: count ? Number(count) : undefined }));
    }

    // Nếu không có param hợp lệ
    res.status(400).json({ error: 'Thiếu tham số hợp lệ. Tham số có thể là url, username, keyword, playlistId, collectionId, trending, musicId' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi xử lý TikTok' });
  }
}
