import { Expose } from 'class-transformer';

export class PaginationData {
  @Expose()
  count: number;

  @Expose()
  perPage: number;

  @Expose()
  page: number;
}

export class PaginationDto {
  @Expose()
  pagination: PaginationData;
}
