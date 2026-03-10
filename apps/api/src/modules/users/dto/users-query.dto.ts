import { PaginationDto } from '../../../common/pagination/pagination.dto';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class UsersQueryDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

