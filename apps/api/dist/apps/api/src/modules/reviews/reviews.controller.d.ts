import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: any, createReviewDto: CreateReviewDto): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/review.entity").Review;
    }>;
    getProductReviews(productId: string, page?: number, limit?: number, sortBy?: string, order?: string): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<import("../../database/entities/review.entity").Review>;
    }>;
    getProductRating(productId: string): Promise<{
        statusCode: number;
        data: {
            averageRating: number;
            totalReviews: number;
            ratingDistribution: Record<number, number>;
        };
    }>;
    getMyReviews(user: any, page?: number, limit?: number): Promise<{
        statusCode: number;
        data: {
            items: import("../../database/entities/review.entity").Review[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: number;
        data: import("../../database/entities/review.entity").Review;
    }>;
    findAll(page?: number, limit?: number, status?: string, productId?: string, sortBy?: string, order?: string): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<import("../../database/entities/review.entity").Review>;
    }>;
    update(user: any, id: string, updateReviewDto: Partial<CreateReviewDto>): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/review.entity").Review;
    }>;
    moderate(id: string, moderateReviewDto: ModerateReviewDto): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/review.entity").Review;
    }>;
    delete(user: any, id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    getPendingCount(): Promise<{
        statusCode: number;
        data: {
            pendingCount: number;
        };
    }>;
}
