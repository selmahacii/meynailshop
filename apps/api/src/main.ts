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

  // Fix CORS et service statique pour les images
  // On utilise express.static directement pour un controle total sur les headers
  const express = require('express');
  const path = require('path');
  const fs = require('fs');
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  }, express.static(uploadDir));

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
  
  console.log('--- 🛡️ DIAGNOSTIC DÉMARRAGE ---');
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`🔗 API_URL (Config): ${process.env.API_URL}`);
  console.log(`🚀 RENDER_URL: ${process.env.RENDER_EXTERNAL_URL}`);
  console.log(`📂 CWD (Home): ${process.cwd()}`);
  console.log(`🏠 __dirname: ${__dirname}`);
  
  const uploadPath = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadPath)) {
    console.log('📂 Dossier uploads absent, création...');
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  try {
    const testFile = path.join(uploadPath, '.write-test');
    fs.writeFileSync(testFile, 'test');
    console.log('✅ Permissions écriture : OK');
    fs.unlinkSync(testFile);
  } catch (e) {
    console.log('❌ Problème de permissions écriture !');
  }

  const files = fs.readdirSync(uploadPath);
  console.log(`📂 Fichiers présents dans uploads : ${files.length}`);
  console.log('-------------------------------');

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
    } else if (adminExists.role !== 'admin') {
      adminExists.role = 'admin';
      await userRepo.save(adminExists);
      console.log('🆙 Rôle Admin mis à jour pour meeybouabdellah@gmail.com');
    } else {
      console.log('✅ Accès Admin vérifié pour meeybouabdellah@gmail.com');
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
