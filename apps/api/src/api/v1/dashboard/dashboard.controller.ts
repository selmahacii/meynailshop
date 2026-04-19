import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('v1/admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(@Query('range') range?: string) {
    try {
      console.log(`📊 [DashboardController] Fetching metrics for range: ${range || 'all'}...`);
      const data = await this.dashboardService.getMetrics(range);
      console.log('✅ [DashboardController] Metrics fetched successfully');
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('❌ [DashboardController] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }
}
