import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class ProductsQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

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
  badge?: 'top' | 'new' | 'promo';

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'createdAt' | 'popularity' | 'rating';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  inStock?: 'true' | 'false';

  @IsOptional()
  @IsString()
  subCategory?: string;
}
