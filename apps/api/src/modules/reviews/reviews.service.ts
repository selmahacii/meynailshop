import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
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

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const product = await this.productRepository.findOne({
      where: { id: createReviewDto.productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: {
        userId,
        productId: createReviewDto.productId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // If orderId is provided, verify the user purchased this product
    if (createReviewDto.orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: createReviewDto.orderId, userId },
      });

      if (!order) {
        throw new ForbiddenException('Order not found or does not belong to you');
      }

      // Verify the product is in the order
      const orderItem = await this.orderItemRepository.findOne({
        where: {
          orderId: createReviewDto.orderId,
          productId: createReviewDto.productId,
        },
      });

      if (!orderItem) {
        throw new BadRequestException(
          'This product is not in your order',
        );
      }

      // Only allow reviews for delivered orders
      if (order.status !== 'delivered') {
        throw new BadRequestException(
          'You can only review products from delivered orders',
        );
      }
    }

    const review = this.reviewRepository.create({
      userId,
      productId: createReviewDto.productId,
      orderId: createReviewDto.orderId,
      rating: createReviewDto.rating,
      title: createReviewDto.title,
      content: createReviewDto.content,
      status: 'pending',
    });

    return await this.reviewRepository.save(review);
  }

  async findByProduct(
    productId: string,
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: string;
    } = {},
  ): Promise<PaginatedResult<Review>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const orderObj: any = {};
    if (query.sortBy) {
      orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
    } else {
      orderObj.createdAt = 'DESC';
    }

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: {
        productId,
        status: 'approved',
      },
      relations: ['user'],
      skip,
      take: limit,
      order: orderObj,
    });

    return {
      items: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    };
  }

  async findAll(
    query: ReviewsQueryDto = {},
  ): Promise<PaginatedResult<Review>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Review> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    const orderObj: any = {};
    if (query.sortBy) {
      orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
    } else {
      orderObj.createdAt = 'DESC';
    }

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take: limit,
      order: orderObj,
    });

    return {
      items: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    userId: string,
    updateReviewDto: Partial<CreateReviewDto>,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    if (review.status !== 'pending') {
      throw new BadRequestException(
        'You can only edit reviews that are pending moderation',
      );
    }

    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async delete(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }

  async moderate(id: string, moderateReviewDto: ModerateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.status = moderateReviewDto.status;
    if (moderateReviewDto.adminNote) {
      review.adminNote = moderateReviewDto.adminNote;
    }

    return await this.reviewRepository.save(review);
  }

  async getProductRating(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await this.reviewRepository.find({
      where: {
        productId,
        status: 'approved',
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  async getUserReviews(userId: string, query: { page?: number; limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { userId },
      relations: ['user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    };
  }

  async getPendingReviewsCount(): Promise<number> {
    return this.reviewRepository.count({
      where: { status: 'pending' },
    });
  }
}
