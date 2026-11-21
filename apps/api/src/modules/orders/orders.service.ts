import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
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
import { DEFAULT_SHIPPING_FEES } from '../settings/settings.service';
import { NotificationsService } from '../notifications/notifications.service';

export function calculateOrderShippingRate(
  snapshot: any,
  deliveryType: string = 'home',
  fees: any[] = DEFAULT_SHIPPING_FEES,
) {
  if (!snapshot) return null;
  const rawWilaya = (
    snapshot.wilaya ||
    snapshot.wilayaName ||
    snapshot.address?.wilaya ||
    snapshot.address?.wilayaName ||
    (typeof snapshot.address === 'string' ? '' : '') ||
    ''
  ).toString().trim();

  if (!rawWilaya) return null;

  const q = rawWilaya.toLowerCase().trim();
  const wilayaRate = fees.find((f: any) => {
    const fid = (f.id || '').toString().trim();
    const fname = (f.name || '').toLowerCase().trim();
    return (
      fid === q ||
      fid === q.padStart(2, '0') ||
      fname === q ||
      q.includes(fname) ||
      (fname && q.startsWith(fid))
    );
  });

  if (!wilayaRate) return null;

  const isHome = deliveryType === 'home';
  const shippingCost = isHome
    ? Number(wilayaRate.homeRate)
    : Number(wilayaRate.deskRate ?? wilayaRate.homeRate);
  const returnCost = Number(wilayaRate.returnRate || 0);

  return {
    shippingCost,
    returnCost,
    wilayaRate,
  };
}

@Injectable()
export class OrdersService implements OnModuleInit {
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
    private notificationsService: NotificationsService,
  ) { }

  async onModuleInit() {
    await this.repairOrdersWithDefaultShipping();
  }

  async repairOrdersWithDefaultShipping() {
    try {
      const orders = await this.orderRepository.find();
      for (const order of orders) {
        if (Number(order.shippingCost) === 600 && order.shippingAddressSnapshot) {
          const calculated = calculateOrderShippingRate(order.shippingAddressSnapshot, order.deliveryType);
          if (calculated) {
            order.shippingCost = calculated.shippingCost;
            order.returnCost = calculated.returnCost;
            const subtotal = Number(order.subtotal || 0);
            const discount = Number(order.discount || 0);
            order.total = subtotal + calculated.shippingCost - discount;
            await this.orderRepository.save(order);
            console.log(`[OrdersService] Repaired order ${order.orderNumber}: shippingCost set to ${calculated.shippingCost} DA`);
          }
        }
      }
    } catch (err) {
      console.error('[OrdersService] Error repairing orders with default shipping:', err);
    }
  }

  async create(
    userId: string | null,
    createOrderDto: CreateOrderDto,
    cartItems: any[],
  ): Promise<Order> {
    if (!cartItems || cartItems.length === 0) {
      if (!createOrderDto.notes?.includes('Landing Page')) {
        throw new BadRequestException('Cart is empty');
      }
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

      // Si cartItems est vide mais que c'est une commande landing page
      if (!cartItems || cartItems.length === 0) {
        let fallbackProduct = await queryRunner.manager.findOne(Product, { where: { isActive: true } });
        if (!fallbackProduct) {
          fallbackProduct = await queryRunner.manager.findOne(Product, {});
        }
        const defaultPackName = createOrderDto.notes?.includes('Landing Page')
          ? (createOrderDto.notes.split('] ')[1] || 'Pack Onglerie')
          : 'Commande Boutique';
        cartItems = [{
          productId: fallbackProduct ? fallbackProduct.id : undefined,
          productName: defaultPackName,
          quantity: 1,
          unitPrice: 6500
        }];
      }

      for (const cartItem of cartItems) {
        let product: Product | null = null;
        if (cartItem.productId) {
          try {
            product = await queryRunner.manager.findOne(Product, {
              where: { id: cartItem.productId, isActive: true },
            });
          } catch {
            product = null;
          }
        }

        if (!product) {
          product = await queryRunner.manager.findOne(Product, {
            where: { isActive: true },
          });
        }
        if (!product) {
          product = await queryRunner.manager.findOne(Product, {});
        }

        let activePrice = (cartItem.unitPrice !== undefined && cartItem.unitPrice !== null)
          ? Number(cartItem.unitPrice)
          : (product ? Number(product.price) : 6500);

        let currentStock = product ? product.stock : 999;
        let variantIndex = -1;

        if (product && product.hasVariants && cartItem.variantSku && product.variants) {
          variantIndex = product.variants.findIndex(v => v.sku === cartItem.variantSku);
          if (variantIndex !== -1) {
            const variant = product.variants[variantIndex];
            currentStock = variant.stock;
            if (cartItem.unitPrice === undefined && variant.price !== undefined && variant.price !== null) {
              activePrice = Number(variant.price);
            }
          }
        }

        const itemQuantity = Number(cartItem.quantity) || 1;
        const itemSubtotal = activePrice * itemQuantity;
        subtotal += itemSubtotal;

        const itemName = cartItem.productName || (product ? product.name : 'Pack Onglerie');
        const itemSku = cartItem.variantSku || (product ? product.sku : 'PACK-LP');
        const itemImage = cartItem.productImage || cartItem.variantImage || (product?.images?.[0] || '');

        const orderItem = this.orderItemRepository.create({
          productId: product ? product.id : null,
          productName: itemName,
          productSku: itemSku,
          productImage: itemImage,
          variantSku: cartItem.variantSku,
          variantImage: itemImage,
          unitPrice: activePrice,
          quantity: itemQuantity,
          subtotal: itemSubtotal,
        });

        items.push(orderItem);

        // Décrémenter le stock si produit catalogue réel
        if (product && product.stock > 0 && !cartItem.unitPrice) {
          if (variantIndex !== -1 && product.variants) {
            product.variants[variantIndex].stock = Math.max(0, product.variants[variantIndex].stock - itemQuantity);
            product.stock = Math.max(0, product.stock - itemQuantity);
          } else {
            product.stock = Math.max(0, product.stock - itemQuantity);
          }
          await queryRunner.manager.save(Product, product);
        }
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
      const fees = (settings?.shippingFees && Array.isArray(settings.shippingFees) && settings.shippingFees.length > 0)
        ? settings.shippingFees
        : DEFAULT_SHIPPING_FEES;

      let shippingCost = Number(settings?.shippingCostDefault) || 600;
      let returnCost = 0;

      if (shippingAddress) {
        const calculated = calculateOrderShippingRate(shippingAddress, createOrderDto.deliveryType || 'home', fees);
        if (calculated) {
          shippingCost = calculated.shippingCost;
          returnCost = calculated.returnCost;
        }
      }

      if (subtotal >= Number(settings?.freeShippingThreshold || 10000)) {
        shippingCost = 0;
      }

      const total = subtotal - discount + shippingCost;

      let orderSource = createOrderDto.source || 
        (createOrderDto.notes?.includes('Landing Page') ? 'instagram' : 'website');
      const validSources = ['website', 'instagram', 'whatsapp', 'facebook', 'store', 'other'];
      if (!validSources.includes(orderSource)) {
        orderSource = 'instagram';
      }

      let orderDeliveryType: 'home' | 'office' = 'home';
      if ((createOrderDto.deliveryType as string) === 'office' || (createOrderDto.deliveryType as string) === 'desk') {
        orderDeliveryType = 'office';
      }

      const order = this.orderRepository.create({
        userId,
        orderNumber: generateOrderNumber(),
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: createOrderDto.paymentMethod || 'cash_on_delivery',
        deliveryType: orderDeliveryType,
        source: orderSource,
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

      // Dispatch real-time admin notification (WhatsApp & Telegram) asynchronously
      this.notificationsService.sendAdminOrderNotification(result, items).catch((notifErr) => {
        console.error('[OrdersService] Error dispatching order notification:', notifErr);
      });

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
