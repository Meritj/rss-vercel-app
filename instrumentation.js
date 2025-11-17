import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export function register() {


  const exporter = new OTLPTraceExporter({
    url: 'https://otlp.datadoghq.com/v1/traces',
    headers: {
      'dd-api-key': process.env.DD_API_KEY,
    },
  });
  
  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ [INSTRUMENTATION] OpenTelemetry configuré');
}