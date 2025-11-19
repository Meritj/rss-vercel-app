import { kv } from '@vercel/kv';
import { trace } from '@opentelemetry/api'; 

const tracer = trace.getTracer('seen-api-tracer');

export async function POST(req) {
  return await tracer.startActiveSpan('kv.mark_article_seen', async (span) => {
    
    try {
      const body = await req.json();
      const { user = 'default', source, link } = body;

      span.setAttribute('app.user', user);
      
      if (!source || !link) {
        span.setStatus({ code: 2, message: "Missing data" }); 
        span.end();
        return Response.json({ error: "Missing source or link" }, { status: 400 });
      }

      span.setAttribute('app.source', source);
      span.setAttribute('app.link', link);

      const seenKey = `seen:${user}:${source}:${link}`;
      span.setAttribute('kv.key', seenKey);

      await kv.set(seenKey, true);
      
      span.setStatus({ code: 1, message: 'Marked as seen' }); // 1 = OK
      return Response.json({ success: true });

    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message });
      
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
      span.end();
    }
  });
}