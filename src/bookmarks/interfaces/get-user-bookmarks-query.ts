import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';

export interface IGetUserBookmarksQuery extends IPaginationQueryOptions {
  expand?: string;
}
