import { SearchFilterParam } from 'src/interfaces/database.interfaces';

export interface getGamesQuery {
  perPage?: number;
  page?: number;
  genreId?: number;
  platformId?: number;
  order?: string;
  params?: SearchFilterParam;
}
