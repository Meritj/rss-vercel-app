import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';


export function register() {
  console.log('🔍 [INSTRUMENTATION] Démarrage...');
  console.log('🔍 [INSTRUMENTATION] DD_API_KEY existe:', !!process.env.DD_API_KEY);
  console.log('🔍 [INSTRUMENTATION] Runtime:', process.env.NEXT_RUNTIME);
  
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

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: [
          'your-service-domain.com',
          'your-database-domain.com',
        ],
        dontPropagateContextUrls: [
          'some-third-party-service-domain.com',
        ],
        ignoreUrls: ['my-internal-private-tool.com'],
      },
    },
  });
}