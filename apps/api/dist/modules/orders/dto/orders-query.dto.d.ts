import { PaginationDto } from '../../../common/pagination/pagination.dto';
export declare class OrdersQueryDto extends PaginationDto {
    status?: string;
    paymentStatus?: string;
    paymentMethod?: 'cash_on_delivery' | 'ccp' | 'baridimob';
    orderNumber?: string;
    sortBy?: 'createdAt' | 'total' | 'status';
    order?: 'asc' | 'desc';
    dateFrom?: string;
    dateTo?: string;
}
