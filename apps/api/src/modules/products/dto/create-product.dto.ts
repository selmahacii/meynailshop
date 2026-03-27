import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  description: string;

  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  comparePrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockAlert?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  badge?: 'top' | 'new' | 'promo';

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @IsOptional()
  @IsArray()
  variants?: { sku: string; image: string }[];
}
