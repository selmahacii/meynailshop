import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustStockDto {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
