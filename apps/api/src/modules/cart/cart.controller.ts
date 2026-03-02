import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@CurrentUser() user: any) {
    const summary = await this.cartService.getCartSummary(user.id);

    return {
      statusCode: 200,
      data: summary,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('items')
  async getCartItems(@CurrentUser() user: any) {
    const items = await this.cartService.getCartItems(user.id);

    return {
      statusCode: 200,
      data: {
        items,
        count: items.length,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  async getCartCount(@CurrentUser() user: any) {
    const count = await this.cartService.getCartSize(user.id);

    return {
      statusCode: 200,
      data: { count },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addItem(@CurrentUser() user: any, @Body() addToCartDto: AddToCartDto) {
    const cartItem = await this.cartService.addItem(user.id, addToCartDto);

    return {
      statusCode: 201,
      message: 'Item added to cart',
      data: cartItem,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:productId')
  async updateItem(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const cartItem = await this.cartService.updateItem(
      user.id,
      productId,
      updateCartItemDto,
    );

    return {
      statusCode: 200,
      message: 'Cart item updated',
      data: cartItem,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:productId')
  async removeItem(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    await this.cartService.removeItem(user.id, productId);

    return {
      statusCode: 200,
      message: 'Item removed from cart',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('coupon')
  async applyCoupon(
    @CurrentUser() user: any,
    @Body() body: { couponCode: string },
  ) {
    const cart = await this.cartService.applyCoupon(user.id, body.couponCode);
    const summary = await this.cartService.getCartSummary(user.id);

    return {
      statusCode: 200,
      message: 'Coupon applied successfully',
      data: summary,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('coupon')
  async removeCoupon(@CurrentUser() user: any) {
    await this.cartService.removeCoupon(user.id);
    const summary = await this.cartService.getCartSummary(user.id);

    return {
      statusCode: 200,
      message: 'Coupon removed',
      data: summary,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearCart(@CurrentUser() user: any) {
    await this.cartService.clearCart(user.id);

    return {
      statusCode: 200,
      message: 'Cart cleared',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateCart(@CurrentUser() user: any) {
    const summary = await this.cartService.getCartSummary(user.id);

    if (summary.itemCount === 0) {
      return {
        statusCode: 400,
        message: 'Cart is empty',
        data: { valid: false },
      };
    }

    return {
      statusCode: 200,
      message: 'Cart is valid',
      data: {
        valid: true,
        summary,
      },
    };
  }
}
