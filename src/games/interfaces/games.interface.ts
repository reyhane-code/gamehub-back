import { ISearchFilterParam } from 'src/interfaces/database.interfaces';

export interface IGamesQuery {
  perPage?: number;
  page?: number;
  genreId?: number;
  platformId?: number;
  order?: string;
  search?: ISearchFilterParam;
}
