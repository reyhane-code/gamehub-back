import { sortOperation } from "src/enums/order.enum";

export interface paginationQueryOptions {
  perPage?: number;
  page?: number;
}

export interface orderQueryOptions {
  field?: string;
  opration?: sortOperation;
}
