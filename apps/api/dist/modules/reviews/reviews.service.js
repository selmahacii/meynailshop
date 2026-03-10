"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../../database/entities/review.entity");
const product_entity_1 = require("../../database/entities/product.entity");
const order_entity_1 = require("../../database/entities/order.entity");
const order_item_entity_1 = require("../../database/entities/order-item.entity");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, productRepository, orderRepository, orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }
    async create(userId, createReviewDto) {
        const product = await this.productRepository.findOne({
            where: { id: createReviewDto.productId, isActive: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                userId,
                productId: createReviewDto.productId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this product');
        }
        if (createReviewDto.orderId) {
            const order = await this.orderRepository.findOne({
                where: { id: createReviewDto.orderId, userId },
            });
            if (!order) {
                throw new common_1.ForbiddenException('Order not found or does not belong to you');
            }
            const orderItem = await this.orderItemRepository.findOne({
                where: {
                    orderId: createReviewDto.orderId,
                    productId: createReviewDto.productId,
                },
            });
            if (!orderItem) {
                throw new common_1.BadRequestException('This product is not in your order');
            }
            if (order.status !== 'delivered') {
                throw new common_1.BadRequestException('You can only review products from delivered orders');
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
    async findByProduct(productId, query = {}) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const orderObj = {};
        if (query.sortBy) {
            orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
        }
        else {
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
    async findAll(query = {}) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        if (query.productId) {
            where.productId = query.productId;
        }
        const orderObj = {};
        if (query.sortBy) {
            orderObj[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
        }
        else {
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
    async findOne(id) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async update(id, userId, updateReviewDto) {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own reviews');
        }
        if (review.status !== 'pending') {
            throw new common_1.BadRequestException('You can only edit reviews that are pending moderation');
        }
        Object.assign(review, updateReviewDto);
        return await this.reviewRepository.save(review);
    }
    async delete(id, userId, isAdmin = false) {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (!isAdmin && review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.reviewRepository.remove(review);
    }
    async moderate(id, moderateReviewDto) {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.status = moderateReviewDto.status;
        if (moderateReviewDto.adminNote) {
            review.adminNote = moderateReviewDto.adminNote;
        }
        return await this.reviewRepository.save(review);
    }
    async getProductRating(productId) {
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
        const ratingDistribution = {
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
    async getUserReviews(userId, query = {}) {
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
    async getPendingReviewsCount() {
        return this.reviewRepository.count({
            where: { status: 'pending' },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map