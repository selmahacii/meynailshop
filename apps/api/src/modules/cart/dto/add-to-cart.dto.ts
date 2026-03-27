import { IsUUID, IsNumber, Min, Max, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export interface CartItem {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productSku: string;
  variantSku?: string;
  variantImage?: string;
  subtotal: number;
}

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(999)
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  variantSku?: string;

  @IsString()
  @IsOptional()
  variantImage?: string;
}
