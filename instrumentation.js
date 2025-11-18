import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function register() {
  
  const originalExporter = new OTLPTraceExporter({
    url: 'https://otlp.datadoghq.com/v1/traces',
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
      'Content-Type': 'application/x-protobuf',
    },
  });

  // Custom wrapper to log export results
  const customExporter = {
    export: (spans, resultCallback) => {
      console.log(`[CUSTOM EXPORTER] Début de l'export de ${spans.length} spans.`);
      originalExporter.export(spans, (result) => {
        console.log(`[CUSTOM EXPORTER] Résultat de l'export: ${JSON.stringify(result)}`);
        if (result.error) {
          console.error(`[CUSTOM EXPORTER] Échec de l'export:`, result.error);
        } else {
          console.log(`[CUSTOM EXPORTER] Export réussi avec le code: ${result.code}`);
        }
        resultCallback(result);
      });
    },
    shutdown: () => {
      console.log('[CUSTOM EXPORTER] Arrêt de l\'exporteur.');
      return originalExporter.shutdown();
    },
  };

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: customExporter, // Use the custom wrapped exporter
    resource:{
      'service.name': 'rss-vercel-app',
      'deployment.environment': process.env.VERCEL_ENV || 'production',
    }
  });
  
  console.log('✅ OpenTelemetry configuré avec exporteur Datadog (et wrapper de log).');
}