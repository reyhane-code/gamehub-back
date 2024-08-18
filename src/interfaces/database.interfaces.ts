import { FilterOperationEnum, SortOperation } from 'src/enums/enums';

export interface IPaginationQueryOptions {
  perPage?: number;
  page?: number;
  order?: string;
  filter?: ISearchFilterOptions[];
  search?: ISearchFilterOptions[];
}

export interface ISearchFilterOptions {
  field: string;

  operation: FilterOperationEnum;

  value: number | string | Date | number[] | string[] | boolean;
}
