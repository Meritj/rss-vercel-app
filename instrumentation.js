import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

// Wrapper pour logger les requêtes/réponses
class LoggingOTLPExporter extends OTLPTraceExporter {
  async send(objects, onSuccess, onError) {
    console.log('📤 [EXPORT] Envoi de', objects.length, 'spans vers Datadog');
    console.log('📤 [EXPORT] URL:', this.url);
    console.log('📤 [EXPORT] Headers:', JSON.stringify(this.headers, null, 2));
    
    // Intercepter la réponse
    const originalOnSuccess = onSuccess;
    const originalOnError = onError;
    
    const wrappedOnSuccess = (response) => {
      console.log('✅ [EXPORT] Succès ! Response:', response);
      originalOnSuccess(response);
    };
    
    const wrappedOnError = (error) => {
      console.error('❌ [EXPORT] Erreur lors de l\'envoi:', error);
      console.error('❌ [EXPORT] Error code:', error.code);
      console.error('❌ [EXPORT] Error message:', error.message);
      console.error('❌ [EXPORT] Error data:', error.data);
      originalOnError(error);
    };
    
    return super.send(objects, wrappedOnSuccess, wrappedOnError);
  }
}

export function register() {
  
  const exporter = new LoggingOTLPExporter({
    url: 'https://http-intake.logs.datadoghq.com/api/v2/otel/v1/traces',
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
    },
  });

  registerOTel({
    serviceName: 'rss-vercel-app',
    traceExporter: exporter,
  });
  
  console.log('✅ OpenTelemetry configuré avec logging détaillé');
  console.log('🔑 DD_API_KEY:', process.env.DD_API_KEY ? `${process.env.DD_API_KEY.substring(0, 10)}...` : 'MANQUANTE');
}