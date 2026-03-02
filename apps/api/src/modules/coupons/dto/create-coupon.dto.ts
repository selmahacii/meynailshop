import { IsString, IsNumber, IsDateString, IsEnum, Min, MinLength, IsOptional, IsPositive } from 'class-validator';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export class CreateCouponDto {
  @IsString()
  @MinLength(3)
  code: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  @IsPositive()
  value: number; // Percentage (0-100) or fixed amount (DA)

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minAmount?: number; // Minimum purchase amount to apply

  @IsNumber()
  @IsPositive()
  maxUsageCount: number; // Total times this coupon can be used

  @IsDateString()
  expiresAt: string; // ISO date string

  @IsOptional()
  @IsString()
  description?: string;
}
