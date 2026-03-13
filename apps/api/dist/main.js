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
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = process.env.API_PORT || 3001;
    await app.listen(port, '127.0.0.1');
    console.log(`✅ API running on http://localhost:${port}`);
    console.log(`📚 Health check: http://localhost:${port}/api/health`);
}
bootstrap().catch((err) => {
    console.error('❌ API startup failed:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map