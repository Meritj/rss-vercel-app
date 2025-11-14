import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export function register() {
  const exporter = new OTLPTraceExporter({
    // OK pour Datadog US
    url: 'https://otlp.datadoghq.com/v1/traces', 
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY, 
     
      'Content-Type': 'application/x-protobuf' 
    },
  });

  registerOTel({
    serviceName: 'your-project-name',
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