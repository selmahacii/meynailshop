export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
