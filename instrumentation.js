import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import https from 'https';
import http from 'http';

// Intercepter les requêtes HTTP/HTTPS
const originalHttpsRequest = https.request;
const originalHttpRequest = http.request;

https.request = function(...args) {
  const req = originalHttpsRequest.apply(this, args);
  
  // Vérifier si c'est une requête vers Datadog
  const url = args[0]?.href || args[0]?.host || '';
  if (url.includes('datadoghq')) {
    console.log('🌐 [HTTP] Requête HTTPS vers Datadog détectée');
    console.log('🌐 [HTTP] URL:', url);
    console.log('🌐 [HTTP] Options:', JSON.stringify(args[0], null, 2));
    
    req.on('response', (res) => {
      console.log('📥 [HTTP] Réponse reçue - Status:', res.statusCode);
      console.log('📥 [HTTP] Headers:', JSON.stringify(res.headers, null, 2));
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 [HTTP] Body:', data.substring(0, 500));
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ [HTTP] Erreur requête:', error);
    });
  }
  
  return req;
};

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function register() {
  
  const exporter = new OTLPTraceExporter({
    url: 'https://otlp.datadoghq.com/v1/traces',
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
    },
  });

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ OpenTelemetry configuré avec interception HTTP');
  console.log('🔑 DD_API_KEY:', process.env.DD_API_KEY ? `${process.env.DD_API_KEY.substring(0, 10)}...` : 'MANQUANTE');
}