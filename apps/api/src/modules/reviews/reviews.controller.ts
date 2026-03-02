import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const review = await this.reviewsService.create(user.id, createReviewDto);

    return {
      statusCode: 201,
      message: 'Review created successfully',
      data: review,
    };
  }

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    const result = await this.reviewsService.findByProduct(productId, {
      page,
      limit,
      sortBy,
      order,
    });

    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get('product/:productId/rating')
  async getProductRating(@Param('productId') productId: string) {
    const rating = await this.reviewsService.getProductRating(productId);

    return {
      statusCode: 200,
      data: rating,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  async getMyReviews(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.reviewsService.getUserReviews(user.id, {
      page,
      limit,
    });

    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);

    return {
      statusCode: 200,
      data: review,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('productId') productId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    const result = await this.reviewsService.findAll({
      page,
      limit,
      status,
      productId,
      sortBy,
      order,
    });

    return {
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
  ) {
    const review = await this.reviewsService.update(
      id,
      user.id,
      updateReviewDto,
    );

    return {
      statusCode: 200,
      message: 'Review updated successfully',
      data: review,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/moderate')
  async moderate(
    @Param('id') id: string,
    @Body() moderateReviewDto: ModerateReviewDto,
  ) {
    const review = await this.reviewsService.moderate(id, moderateReviewDto);

    return {
      statusCode: 200,
      message: 'Review moderated successfully',
      data: review,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const isAdmin = user.role === 'admin';
    await this.reviewsService.delete(id, user.id, isAdmin);

    return {
      statusCode: 200,
      message: 'Review deleted successfully',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/pending-count')
  async getPendingCount() {
    const count = await this.reviewsService.getPendingReviewsCount();

    return {
      statusCode: 200,
      data: { pendingCount: count },
    };
  }
}
