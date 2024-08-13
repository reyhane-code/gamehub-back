import { FilterOperationEnum, SortOperation } from 'src/enums/enums';

export interface IPaginationQueryOptions {
  perPage?: number;
  page?: number;
}

export interface IOrderQueryOptions {
  field?: string;
  opration?: SortOperation;
}

export interface ISearchFilterOptions {
  field: string;

  operation: FilterOperationEnum;

  value: number | string | Date | number[] | string[] | boolean;
}

export interface ISearchFilterParam {
  filter?: ISearchFilterOptions[];
  search?: ISearchFilterOptions[];
}
