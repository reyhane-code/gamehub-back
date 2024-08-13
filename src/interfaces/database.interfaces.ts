import { FilterOperationEnum, SortOperation } from 'src/enums/enums';

export interface IPaginationQueryOptions {
  perPage?: number;
  page?: number;
  order?: string;
  search?: ISearchFilterParam;
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
