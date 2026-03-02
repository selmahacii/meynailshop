import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
  status: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
