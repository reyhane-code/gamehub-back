import { ISearchFilterParam } from 'src/interfaces/database.interfaces';

export interface IGamesQuery {
  perPage?: number;
  page?: number;
  order?: string;
  where?: ISearchFilterParam;
}
