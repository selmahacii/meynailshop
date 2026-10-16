import { PaginationDto } from '../../../common/pagination/pagination.dto';
export declare class ProductsQueryDto extends PaginationDto {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    badge?: 'top' | 'new' | 'promo';
    sortBy?: 'price' | 'createdAt' | 'popularity' | 'popular' | 'rating' | 'newest';
    order?: 'asc' | 'desc';
    inStock?: 'true' | 'false';
    subCategory?: string;
}
