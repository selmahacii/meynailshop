import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return {
      statusCode: 200,
      message: 'API is running',
      data: {
        server: 'healthy',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get()
  getHello() {
    return {
      message: `Bienvenue sur l'API Meynailshop`,
      version: '1.0.0',
      status: 'online',
      storefront: 'http://localhost:3000',
      documentation: '/api/health'
    };
  }
}
