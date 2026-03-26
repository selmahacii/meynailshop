"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false,
    }));
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
    const isProd = process.env.NODE_ENV === 'production';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: (origin, callback) => {
            if (!isProd || !origin || origin === frontendUrl || origin.endsWith('.vercel.app')) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    app.setGlobalPrefix('api', {
        exclude: ['/'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: 400,
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(), new http_exception_filter_1.AllExceptionsFilter());
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
    }
    catch (e) {
        console.log('❌ Problème de permissions écriture !');
    }
    const files = fs.readdirSync(uploadPath);
    console.log(`📂 Fichiers présents dans uploads : ${files.length}`);
    console.log('-------------------------------');
    await app.listen(port, '0.0.0.0');
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
        else if (adminExists.role !== 'admin') {
            adminExists.role = 'admin';
            await userRepo.save(adminExists);
            console.log('🆙 Rôle Admin mis à jour pour meeybouabdellah@gmail.com');
        }
        else {
            console.log('✅ Accès Admin vérifié pour meeybouabdellah@gmail.com');
        }
    }
    catch (e) {
        console.log('ℹ️ Verif admin ignoree ou deja existante');
    }
    console.log(`✅ API running on port ${port}`);
    console.log(`📚 Health check: http://localhost:${port}/api/health`);
    console.log(`🔄 [DB] DB_SYNC mode: ${process.env.DB_SYNC === 'true'}`);
    console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
}
bootstrap().catch((err) => {
    console.error('❌ API startup failed critically:');
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map