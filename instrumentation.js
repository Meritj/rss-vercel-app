import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

let sdk;

export function register() {
  console.log('🔍 [OTEL] Initialisation du SDK...');
  
  if (!process.env.DD_API_KEY) {
    console.error('DD_API_KEY manquante!');
    return;
  }

  if (sdk) {
    console.log('SDK déjà initialisé');
    return;
  }

  sdk = new NodeSDK({
    serviceName: 'rss-vercel-app',
    traceExporter: new OTLPTraceExporter({
      url: 'https://otlp.datadoghq.com/v1/traces',
      headers: {
        'dd-api-key': process.env.DD_API_KEY,
        'Content-Type': 'application/json'
      },
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // Désactiver les instrumentations qui posent problème
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
        '@opentelemetry/instrumentation-winston': {
          enabled: false,
        },
        '@opentelemetry/instrumentation-bunyan': {
          enabled: false,
        },
        '@opentelemetry/instrumentation-pino': {
          enabled: false,
        },
      })
    ],
  });

  sdk.start();
  console.log('[OTEL] SDK démarré avec succès');

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('SDK arrêté'))
      .catch((error) => console.log('Erreur shutdown:', error));
  });
}