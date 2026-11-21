import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsOptional()
  @IsString()
  variantSku?: string;

  @IsOptional()
  @IsString()
  variantImage?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsString()
  deliveryType: 'home' | 'office';

  @IsString()
  paymentMethod: 'cash_on_delivery' | 'ccp' | 'baridimob';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @IsOptional()
  shippingAddress?: any;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}
