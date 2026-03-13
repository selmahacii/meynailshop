import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
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
  couponCode?: string;

  @IsOptional()
  shippingAddress?: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    wilaya: string;
    commune: string;
  };

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}
