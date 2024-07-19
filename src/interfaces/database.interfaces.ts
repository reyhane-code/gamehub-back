import { FilterOperationEnum, sortOperation } from 'src/enums/enums';

export interface paginationQueryOptions {
  perPage?: number;
  page?: number;
}

export interface orderQueryOptions {
  field?: string;
  opration?: sortOperation;
}

export interface SearchFilterOptions {
  field: string;

  operation: FilterOperationEnum;

  value: number | string | Date | number[] | string[] | boolean;
}

export interface SearchFilterParam {
  filter?: SearchFilterOptions[];
  search?: SearchFilterOptions[];
}
