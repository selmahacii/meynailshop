import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, Between, DataSource, MoreThan } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Address } from '../../database/entities/address.entity';
import { Product } from '../../database/entities/product.entity';
import { Coupon } from '../../database/entities/coupon.entity';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { generateOrderNumber } from '../../common/utils/order-number.util';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) { }

  async create(
    userId: string | null,
    createOrderDto: CreateOrderDto,
    cartItems: Array<{ productId: string; quantity: number; variantSku?: string; variantImage?: string }>,
  ): Promise<Order> {
    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let shippingAddress: any = null;

    if (createOrderDto.addressId) {
      if (!userId) throw new BadRequestException('UserId required for addressId');
      const address = await this.addressRepository.findOne({
        where: { id: createOrderDto.addressId, userId },
      });

      if (!address) {
        throw new NotFoundException('Address not found');
      }

      shippingAddress = {
        fullName: address.fullName,
        phone: address.phone,
        wilaya: address.wilaya,
        commune: address.commune,
        address: address.address,
        postalCode: address.postalCode,
      };
    } else if (createOrderDto.shippingAddress) {
      shippingAddress = createOrderDto.shippingAddress;
    } else {
      throw new BadRequestException('Shipping address or addressId is required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotal = 0;
      const items: OrderItem[] = [];

      for (const cartItem of cartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: cartItem.productId, isActive: true },
        });

        if (!product) {
          throw new NotFoundException(`Product ${cartItem.productId} not found`);
        }

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        }

        const itemSubtotal = Number(product.price) * cartItem.quantity;
        subtotal += itemSubtotal;

        const orderItem = this.orderItemRepository.create({
          productId: product.id,
          productName: product.name,
          productSku: cartItem.variantSku || product.sku,
          productImage: cartItem.variantImage || product.images?.[0] || '',
          variantSku: cartItem.variantSku,
          variantImage: cartItem.variantImage,
          unitPrice: Number(product.price),
          quantity: cartItem.quantity,
          subtotal: itemSubtotal,
        });

        items.push(orderItem);

        // Update product stock
        product.stock -= cartItem.quantity;
        await queryRunner.manager.save(Product, product);
      }

      let discount = 0;
      if (createOrderDto.couponCode) {
        const coupon = await queryRunner.manager.findOne(Coupon, {
          where: {
            code: createOrderDto.couponCode,
            isActive: true,
            expiresAt: MoreThan(new Date()),
          },
        });

        if (!coupon) {
          throw new BadRequestException('Invalid or expired coupon code');
        }

        if (coupon.usedCount >= coupon.maxUses) {
          throw new BadRequestException('Coupon usage limit reached');
        }

        if (subtotal < Number(coupon.minOrderAmount)) {
          throw new BadRequestException(
            `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
          );
        }

        if (coupon.type === 'percentage') {
          discount = (subtotal * Number(coupon.value)) / 100;
        } else {
          discount = Number(coupon.value);
        }

        coupon.usedCount += 1;
        await queryRunner.manager.save(Coupon, coupon);
      }

      const settings = await queryRunner.manager.findOne(SiteSettings, { where: {} });
      let shippingCost = settings?.shippingCostDefault || 600;
      let returnCost = 0;

      if (shippingAddress && settings?.shippingFees) {
        const wilayaRate = settings.shippingFees.find((f: any) => f.id === shippingAddress.wilaya || f.name === shippingAddress.wilaya);
        if (wilayaRate) {
          shippingCost = createOrderDto.deliveryType === 'home' ? wilayaRate.homeRate : (wilayaRate.deskRate ?? wilayaRate.homeRate);
          returnCost = wilayaRate.returnRate || 0;
        }
      }

      if (subtotal >= Number(settings?.freeShippingThreshold || 10000)) {
        shippingCost = 0;
      }

      const total = subtotal - discount + shippingCost;

      const order = this.orderRepository.create({
        userId,
        orderNumber: generateOrderNumber(),
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: createOrderDto.paymentMethod,
        deliveryType: createOrderDto.deliveryType,
        subtotal,
        shippingCost,
        returnCost,
        discount,
        total,
        shippingAddressSnapshot: shippingAddress,
        notes: createOrderDto.notes,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      for (const item of items) {
        item.orderId = savedOrder.id;
      }

      await queryRunner.manager.save(OrderItem, items);

      await queryRunner.commitTransaction();

      const result = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['user'],
      });
      if (!result) throw new InternalServerErrorException('Order not found after creation');
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    userId: string,
    query: OrdersQueryDto,
    isAdmin: boolean = false,
  ): Promise<PaginatedResult<Order>> {
    const skip = (query.page - 1) * query.limit;
    const where: Record<string, any> = {};

    if (!isAdmin) {
      where.userId = userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    if (query.orderNumber) {
      where.orderNumber = query.orderNumber;
    }

    if (query.dateFrom || query.dateTo) {
      const dateRange: any = {};
      if (query.dateFrom) {
        dateRange.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        const dateTo = new Date(query.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        dateRange.lte = dateTo;
      }
      where.createdAt = Between(
        dateRange.gte || new Date(0),
        dateRange.lte || new Date(),
      );
    }

    const order: any = {};
    if (query.sortBy) {
      order[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
    } else {
      order.createdAt = 'DESC';
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take: query.limit,
      order,
    });

    return {
      items: orders,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      hasNext: skip + query.limit < total,
      hasPrev: query.page > 1,
    };
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized access to this order');
    }

    return order;
  }

  async findOneWithItems(id: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized access to this order');
    }

    const items = await this.orderItemRepository.find({
      where: { orderId: id },
    });

    return { ...order, items } as unknown as Order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Bypass transition validation to allow superadmin to revert statuses regressively
    // e.g., from 'delivered' back to 'shipped' or 'pending'
    
    order.status = updateOrderStatusDto.status;

    if (updateOrderStatusDto.trackingNumber) {
      order.trackingNumber = updateOrderStatusDto.trackingNumber;
    }

    if (updateOrderStatusDto.status === 'shipped') {
      order.shippedAt = new Date();
    } else if (updateOrderStatusDto.status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (updateOrderStatusDto.status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    return await this.orderRepository.save(order);
  }

  async cancel(id: string, userId: string, reason: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized access to this order');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestException(
        'Only pending or confirmed orders can be cancelled',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Restore product stock
      const items = await this.orderItemRepository.find({
        where: { orderId: id },
      });

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (product) {
          product.stock += item.quantity;
          await queryRunner.manager.save(Product, product);
        }
      }

      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancellationReason = reason;

      await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderStats(userId: string, isAdmin: boolean = false) {
    const where = isAdmin ? {} : { userId };

    const totalOrders = await this.orderRepository.count({ where });

    const completedOrders = await this.orderRepository.count({
      where: { ...where, status: 'delivered' },
    });

    const pendingOrders = await this.orderRepository.count({
      where: { ...where, status: 'pending' },
    });

    const cancelledOrders = await this.orderRepository.count({
      where: { ...where, status: 'cancelled' },
    });

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where(isAdmin ? '1=1' : 'order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: 'delivered' })
      .getRawOne();

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue?.total || 0),
    };
  }
}
