import { Repository, DataSource } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Address } from '../../database/entities/address.entity';
import { Product } from '../../database/entities/product.entity';
import { Coupon } from '../../database/entities/coupon.entity';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private addressRepository;
    private productRepository;
    private couponRepository;
    private dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, addressRepository: Repository<Address>, productRepository: Repository<Product>, couponRepository: Repository<Coupon>, dataSource: DataSource);
    create(userId: string | null, createOrderDto: CreateOrderDto, cartItems: Array<{
        productId: string;
        quantity: number;
        variantSku?: string;
        variantImage?: string;
    }>): Promise<Order>;
    findAll(userId: string, query: OrdersQueryDto, isAdmin?: boolean): Promise<PaginatedResult<Order>>;
    findOne(id: string, userId?: string): Promise<Order>;
    findOneWithItems(id: string, userId?: string): Promise<Order>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
    cancel(id: string, userId: string, reason: string): Promise<Order>;
    getOrderStats(userId: string, isAdmin?: boolean): Promise<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }>;
}
