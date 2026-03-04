import { Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { Product } from '../../database/entities/product.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
export interface ReviewsQueryDto {
    page?: number;
    limit?: number;
    status?: string;
    productId?: string;
    sortBy?: string;
    order?: string;
}
export declare class ReviewsService {
    private reviewRepository;
    private productRepository;
    private orderRepository;
    private orderItemRepository;
    constructor(reviewRepository: Repository<Review>, productRepository: Repository<Product>, orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: string, query?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
    }): Promise<PaginatedResult<Review>>;
    findAll(query?: ReviewsQueryDto): Promise<PaginatedResult<Review>>;
    findOne(id: string): Promise<Review>;
    update(id: string, userId: string, updateReviewDto: Partial<CreateReviewDto>): Promise<Review>;
    delete(id: string, userId: string, isAdmin?: boolean): Promise<void>;
    moderate(id: string, moderateReviewDto: ModerateReviewDto): Promise<Review>;
    getProductRating(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: Record<number, number>;
    }>;
    getUserReviews(userId: string, query?: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: Review[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    getPendingReviewsCount(): Promise<number>;
}
