import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  const isProd = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: (origin, callback) => {
      if (!isProd || !origin || origin === frontendUrl || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  
  // Auto-creation de l'admin s'il n'existe pas
  try {
    const { User } = require('./database/entities/user.entity');
    const { getRepositoryToken } = require('@nestjs/typeorm');
    const bcrypt = require('bcrypt');
    const userRepo = app.get(getRepositoryToken(User));
    const adminEmail = 'meeybouabdellah@gmail.com';
    
    const adminExists = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('meey2026', 12);
      const admin = userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Mey',
        lastName: 'Bouabdellah',
        phone: '0775436562',
        role: 'admin',
        isActive: true,
      });
      await userRepo.save(admin);
      console.log('✅ Compte Admin par défaut créé (meeybouabdellah@gmail.com)');
    }
  } catch (e) {
    console.log('ℹ️ Verif admin ignoree ou deja existante');
  }

  console.log(`✅ API running on port ${port}`);
  console.log(`📚 Health check: http://localhost:${port}/api/health`);
}

bootstrap().catch((err) => {
  console.error('❌ API startup failed critically:');
  console.error(err);
  process.exit(1);
});
