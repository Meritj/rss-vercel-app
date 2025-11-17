import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'; 
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export function register() {
  
  let exporter;

  if (process.env.NODE_ENV === 'production' && process.env.DD_API_KEY) {
    exporter = new OTLPTraceExporter({
      url: 'https://otlp.datadoghq.com/v1/traces',
      headers: {
        'dd-api-key': process.env.DD_API_KEY,
      },
    });
    console.log('[OTEL] Exportateur Datadog configuré.');

  } else {
    exporter = new ConsoleSpanExporter();
    console.log('📝 [OTEL] Exportateur CONSOLE utilisé (Mode DEBUG ou DD_API_KEY manquante).');

    if (!process.env.DD_API_KEY) {
        console.error('DD_API_KEY manquante. Utilisation de ConsoleSpanExporter.');
    }
  }
  
  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ [INSTRUMENTATION] OpenTelemetry configuré');
}