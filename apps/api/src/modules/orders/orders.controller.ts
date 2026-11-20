import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { OrderItemsService } from './order-items.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private orderItemsService: OrderItemsService,
    private cartService: CartService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    let cartItemsArray: any[] = [];
    
    if (user) {
      const cartItems = await this.cartService.getCartItems(user.id);
      cartItemsArray = cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
    } else {
      cartItemsArray = createOrderDto.items || [];
    }

    const order = await this.ordersService.create(
      user?.id || null,
      createOrderDto,
      cartItemsArray,
    );

    if (user) {
      // Clear the cart after successful order creation
      await this.cartService.clearCart(user.id);
    }

    return {
      statusCode: 201,
      message: 'Order created successfully',
      data: order,
    };
  }

  @Post('landing-page')
  @HttpCode(HttpStatus.CREATED)
  async createFromLandingPage(@Body() body: any) {
    const customerName = (body.customerName || body.name || 'Selma').trim();
    const customerPhone = (body.customerPhone || body.phone || '').trim().replace(/\s+/g, '');
    const wilayaName = body.shippingAddress?.wilayaName || body.wilayaName || body.wilaya || 'Alger';
    const commune = (body.shippingAddress?.commune || body.commune || 'البلدية المركزية').trim();
    const fullAddress = body.shippingAddress?.fullAddress || body.address || `${wilayaName} — ${commune}`;
    const rawDeliveryType = body.shippingAddress?.deliveryType || body.deliveryType || 'home';
    const deliveryType: 'home' | 'office' = (rawDeliveryType === 'desk' || rawDeliveryType === 'office') ? 'office' : 'home';
    const landingPageTitle = body.landingPageTitle || body.title || 'باك متكامل للأظافر';
    const landingPageSlug = body.landingPageSlug || body.slug || 'pack-onglerie';
    const variantName = body.items?.[0]?.variantName || body.variantName || null;
    const price = Number(body.productPrice || body.items?.[0]?.price || body.price || 6500);
    const image = body.items?.[0]?.image || body.image || '';

    const createOrderDto: CreateOrderDto = {
      deliveryType,
      paymentMethod: 'cash_on_delivery',
      source: 'landing_page',
      notes: `[Commande Landing Page: /lp/${landingPageSlug}] - ${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
      shippingAddress: {
        fullName: customerName,
        phone: customerPhone,
        wilaya: wilayaName,
        commune: commune,
        address: fullAddress,
        deliveryType,
      },
    };

    const cartItems = [
      {
        productName: `${landingPageTitle}${variantName ? ` (${variantName})` : ''}`,
        productImage: image,
        unitPrice: price,
        quantity: 1,
        variantSku: `LP-${landingPageSlug.toUpperCase()}`,
      },
    ];

    const order = await this.ordersService.create(null, createOrderDto, cartItems);

    return {
      statusCode: 201,
      success: true,
      message: 'Landing page order created successfully',
      data: order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: any, @Query() query: OrdersQueryDto) {
    const isAdmin = user.role === 'admin';
    const result = await this.ordersService.findAll(user.id, query, isAdmin);

    return {
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    const isAdmin = user.role === 'admin';
    const stats = await this.ordersService.getOrderStats(
      user.id,
      isAdmin,
    );

    return {
      statusCode: 200,
      data: stats,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const isAdmin = user.role === 'admin';
    const order = await this.ordersService.findOneWithItems(
      id,
      !isAdmin ? user.id : undefined,
    );

    return {
      statusCode: 200,
      data: order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/items')
  async getOrderItems(@CurrentUser() user: any, @Param('id') id: string) {
    const isAdmin = user.role === 'admin';

    // Verify user has access to this order
    const order = await this.ordersService.findOne(
      id,
      !isAdmin ? user.id : undefined,
    );

    const items = await this.orderItemsService.findByOrderId(id);
    const stats = await this.orderItemsService.getOrderItemsStats(id);

    return {
      statusCode: 200,
      data: {
        items,
        stats,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
    );

    return {
      statusCode: 200,
      message: 'Order status updated successfully',
      data: order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    const order = await this.ordersService.cancel(id, user.id, body.reason);

    return {
      statusCode: 200,
      message: 'Order cancelled successfully',
      data: order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tracking')
  async getTrackingInfo(@CurrentUser() user: any, @Param('id') id: string) {
    const isAdmin = user.role === 'admin';
    const order = await this.ordersService.findOne(
      id,
      !isAdmin ? user.id : undefined,
    );

    return {
      statusCode: 200,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      },
    };
  }
}
