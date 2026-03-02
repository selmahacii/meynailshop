import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class OrdersQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
  status?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: 'cash_on_delivery' | 'ccp' | 'baridimob';

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'total' | 'status';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}
