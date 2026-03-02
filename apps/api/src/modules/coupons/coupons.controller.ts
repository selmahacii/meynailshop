import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return {
      statusCode: 200,
      data: await this.couponsService.findAll(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: any) {
    return {
      statusCode: 201,
      data: await this.couponsService.create(dto),
    };
  }

  @Post('validate')
  async validate(@Body() body: { code: string; orderAmount: number }) {
    const result = await this.couponsService.validateCoupon(body.code, body.orderAmount);
    if (!result) return { statusCode: 400, message: 'Invalid coupon' };
    return { statusCode: 200, data: result };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return {
      statusCode: 200,
      data: await this.couponsService.update(id, dto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { statusCode: 200, data: await this.couponsService.remove(id) };
  }
}
