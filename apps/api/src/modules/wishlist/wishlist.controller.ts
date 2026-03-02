import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getItems(@CurrentUser() user: any) {
    return {
      statusCode: 200,
      data: await this.wishlistService.getItems(user.id),
    };
  }

  @Post(':productId')
  async addItem(@CurrentUser() user: any, @Param('productId') productId: string) {
    return {
      statusCode: 201,
      data: await this.wishlistService.addItem(user.id, productId),
    };
  }

  @Delete(':productId')
  async removeItem(@CurrentUser() user: any, @Param('productId') productId: string) {
    return {
      statusCode: 200,
      data: await this.wishlistService.removeItem(user.id, productId),
    };
  }
}
