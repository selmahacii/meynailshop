import { IsNumber, Min, Max, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(999)
  quantity: number;

  @IsString()
  @IsOptional()
  variantSku?: string;
}
