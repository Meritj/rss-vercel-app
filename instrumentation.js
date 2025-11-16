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

  const exporterUrl = 'https://otlp.datadoghq.com/v1/traces';
  console.log('🔍 [INSTRUMENTATION] URL exporteur:', exporterUrl);

  const exporter = new OTLPTraceExporter({
    url: exporterUrl,
    headers: {
      'dd-api-key': process.env.DD_API_KEY,
      'Content-Type': 'application/x-protobuf'
    },
  });

  // Intercepter les erreurs d'export
  const originalExport = exporter.export.bind(exporter);
  exporter.export = (spans, resultCallback) => {
    console.log('📤 [INSTRUMENTATION] Envoi de', spans.length, 'spans vers Datadog');
    originalExport(spans, (result) => {
      if (result.code === 0) {
        console.log('✅ [INSTRUMENTATION] Spans envoyés avec succès');
      } else {
        console.error('❌ [INSTRUMENTATION] Erreur envoi spans:', result);
      }
      resultCallback(result);
    });
  };

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
  
  console.log('✅ [INSTRUMENTATION] OpenTelemetry configuré');
}