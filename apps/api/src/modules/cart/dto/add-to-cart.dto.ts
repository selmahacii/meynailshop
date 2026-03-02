import { IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(999)
  quantity: number;
}
