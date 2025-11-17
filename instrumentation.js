import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function register() {
  
  const exporter = new OTLPTraceExporter({
    url: 'https://http-intake.logs.datadoghq.com/api/v2/otel/v1/traces',
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
    },
  });

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ OpenTelemetry configuré avec exporteur Datadog');
}