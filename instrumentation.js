import { registerOTel } from '@vercel/otel';
// Supprimer l'import de OTLPTraceExporter

export function register() {
  console.log('🔍 [INSTRUMENTATION] Démarrage de la configuration OTEL via ENV VARS...');

  // Ici, registerOTel lira automatiquement les variables OTEL_*
  registerOTel({
    serviceName: 'rss-vercel-app',
    // Supprimer traceExporter: exporter
  });
  
  console.log('✅ [INSTRUMENTATION] OpenTelemetry configuré via variables d\'environnement.');
}