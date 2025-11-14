import { kv } from '@vercel/kv';

export async function POST(req) {
  const { user = 'default', source, link } = await req.json();
  if (!source || !link) return Response.json({ error: "Missing source or link" }, { status: 400 });

  const seenKey = `seen:${user}:${source}:${link}`;
  await kv.set(seenKey, true);
  return Response.json({ success: true });
}
