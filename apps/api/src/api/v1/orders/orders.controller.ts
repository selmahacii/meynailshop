import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('v1/admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('manual')
  async createManual(@Body() data: any) {
    return {
      success: true,
      data: await this.ordersService.createManual(data),
    };
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
  ) {
    return {
      success: true,
      data: await this.ordersService.findAll(
        parseInt(page || '1'),
        parseInt(limit || '10'),
        status,
      ),
    };
  }

  @Get('stats')
  async getStats() {
    return {
      success: true,
      data: await this.ordersService.getStats(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.ordersService.findOne(id),
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() { status }: any) {
    return {
      success: true,
      data: await this.ordersService.updateStatus(id, status),
    };
  }
}
