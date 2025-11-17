import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function register() {
  
  const exporter = new OTLPTraceExporter({
    url: 'https://otlp.datadoghq.com/v1/traces',
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
      'Content-Type': 'application/x-protobuf',
    },
  });

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
    resource:{
      'service.name': 'rss-vercel-app',
      'deployment.environment': process.env.VERCEL_ENV || 'production',
    }
  });
  
  console.log('✅ OpenTelemetry configuré avec exporteur Datadog');
}