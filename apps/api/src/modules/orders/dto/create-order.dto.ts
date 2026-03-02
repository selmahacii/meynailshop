import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;

  @IsString()
  paymentMethod: 'cash_on_delivery' | 'ccp' | 'baridimob';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
