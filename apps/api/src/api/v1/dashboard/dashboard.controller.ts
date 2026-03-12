import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('v1/admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics() {
    try {
      console.log('📊 [DashboardController] Fetching metrics...');
      const data = await this.dashboardService.getMetrics();
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
