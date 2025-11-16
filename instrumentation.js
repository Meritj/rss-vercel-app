import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export function register() {
  console.log('🔍 [INSTRUMENTATION] Démarrage...');
  console.log('🔍 [INSTRUMENTATION] DD_API_KEY existe:', !!process.env.DD_API_KEY);
  console.log('🔍 [INSTRUMENTATION] DD_API_KEY premiers chars:', process.env.DD_API_KEY?.substring(0, 8));
  
  if (!process.env.DD_API_KEY) {
    console.error('❌ [INSTRUMENTATION] DD_API_KEY manquante!');
    return;
  }

  const exporter = new OTLPTraceExporter({
    url: 'https://otlp.datadoghq.com/v1/traces',
    headers: {
      'dd-api-key': process.env.DD_API_KEY,
      'Content-Type': 'application/x-protobuf'
    },
  });

  const originalExport = exporter.export.bind(exporter);
  exporter.export = (spans, resultCallback) => {
    console.log('📤 [INSTRUMENTATION] Envoi de', spans.length, 'spans vers Datadog');
    
    if (spans.length > 0) {
      const firstSpan = spans[0];
      console.log('📋 [INSTRUMENTATION] Span info:');
      console.log('  - Name:', firstSpan.name);
      console.log('  - TraceId:', firstSpan.spanContext?.()?.traceId);
      console.log('  - SpanId:', firstSpan.spanContext?.()?.spanId);
      console.log('  - Attributes:', firstSpan.attributes);
    }
    
    originalExport(spans, (result) => {
      console.log('📬 [INSTRUMENTATION] Code de réponse:', result.code);
      console.log('📬 [INSTRUMENTATION] Message:', result.message);
      
      if (result.code === 0) {
        console.log('✅ [INSTRUMENTATION] Spans envoyés avec succès');
      } else {
        console.error('❌ [INSTRUMENTATION] Erreur envoi spans:', JSON.stringify(result));
      }
      resultCallback(result);
    });
  };

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ [INSTRUMENTATION] OpenTelemetry configuré');
}