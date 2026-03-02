import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async dashboard() {
    return {
      statusCode: 200,
      data: await this.analyticsService.getDashboard(),
    };
  }

  @Get('sales')
  async sales(@Query('period') period: string = '30') {
    const days = parseInt(period);
    return {
      statusCode: 200,
      data: await this.analyticsService.getSalesByPeriod(days),
    };
  }
}
