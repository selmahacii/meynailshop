import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSortBy {
    PRICE_ASC = 'price-asc',
    PRICE_DESC = 'price-desc',
    NEWEST = 'newest',
    RATING = 'rating',
    POPULAR = 'popular',
}

export class ProductFilterDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    inStock?: boolean;

    @IsOptional()
    @IsEnum(ProductSortBy)
    sort?: ProductSortBy;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 12;
}
