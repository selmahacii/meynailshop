import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ModerateReviewDto {
  @IsEnum(['approved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
