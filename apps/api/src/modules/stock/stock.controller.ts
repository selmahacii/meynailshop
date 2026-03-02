import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('movements')
  async getMovements(@Param('productId') productId?: string) {
    return {
      statusCode: 200,
      data: await this.stockService.getMovements(productId),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('alerts')
  async getAlerts() {
    return {
      statusCode: 200,
      data: await this.stockService.getAlerts(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('adjust')
  async adjust(@Body() adjustStockDto: AdjustStockDto) {
    return {
      statusCode: 200,
      message: 'Stock adjusted',
      data: await this.stockService.adjustStock(adjustStockDto.productId, adjustStockDto.quantity, adjustStockDto.reason, adjustStockDto.reference),
    };
  }
}
