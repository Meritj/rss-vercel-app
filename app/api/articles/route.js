import Parser from 'rss-parser';
import { kv } from '@vercel/kv';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const user = searchParams.get('user') || 'default';
  if (!url) return Response.json({ error: "Missing URL" }, { status: 400 });

  const parser = new Parser();
  const feed = await parser.parseURL(url);

  const articles = await Promise.all(feed.items.map(async item => {
    const seenKey = `seen:${user}:${url}:${item.link}`;
    const seen = await kv.get(seenKey);
    return {
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      pubDate: item.pubDate,
      seen: !!seen
    };
  }));

  return Response.json(articles);
}
