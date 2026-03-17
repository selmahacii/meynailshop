console.log('🚀 API Process Starting...');
import 'reflect-metadata';
console.log('✅ reflect-metadata loaded');
import { NestFactory } from '@nestjs/core';
console.log('✅ NestFactory loaded');
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('🏁 Bootstrap function called');
  const app = await NestFactory.create(AppModule);
  console.log('🏗️ Nest app created');

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  const isProd = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: isProd ? [frontendUrl] : [
      frontendUrl, 
      'http://127.0.0.1:3000', 
      'http://localhost:3001',
      'http://localhost:3005',
      'http://127.0.0.1:3005'
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );

  // Global filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter()
  );

  const port = process.env.PORT || process.env.API_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API running on port ${port}`);
  console.log(`📚 Health check: http://localhost:${port}/api/health`);
}

bootstrap().catch((err) => {
  console.error('❌ API startup failed critically:');
  console.error(err);
  process.exit(1);
});
