import {
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsOptional,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(3, 255)
  title: string;

  @IsString()
  @Length(10, 5000)
  content: string;
}
