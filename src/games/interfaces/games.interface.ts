import { sortOperation } from "src/enums/order.enum";

export interface getGamesQuery {
  perPage?: number;
  page?: number;
  genreId?: number;
  platformId?: number;
  field?: string;
  operation?: sortOperation;
  search?: string;
}
